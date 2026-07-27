import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import CouponInput from '../components/checkout/CouponInput'
import { thumbUrl } from '../utils/image'
import { Lock, ArrowRight, Globe, MapPin, Banknote } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi',
]

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user }    = useAuth()
  const { formatPrice, currency } = useCurrency()
  const navigate    = useNavigate()
  const shipping    = cartTotal >= 999 ? 0 : 69
  const total       = cartTotal + shipping

  const [isInternational, setIsInternational] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay') // 'razorpay' | 'cod'
  const [loading, setLoading] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [pincodeCheck, setPincodeCheck] = useState(null) // null | 'checking' | { serviceable, skipped }
  const [form, setForm] = useState({
    name:    user?.name || '',
    email:   user?.email || '',
    phone:   user?.phone || '',
    address: '',
    city:    '',
    state:   '',
    pincode: '',
    country: 'India',
  })

  // Discount + final payable amount
  const discount   = appliedCoupon?.discount || 0
  const finalTotal = Math.max(0, total - discount)

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <h2 className="font-display text-3xl text-devotion-brown mb-4">Your cart is empty</h2>
      <Link to="/shop" className="btn-primary">Go Shopping</Link>
    </div>
  )

  // Unverified email accounts can browse but not place orders
  if (user && user.authProvider === 'local' && !user.emailVerified) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <h2 className="font-display text-3xl text-devotion-brown mb-4">Verify your email to checkout</h2>
      <p className="text-cream-500 mb-6">
        We've sent a verification link to <strong>{user.email}</strong>.
        Please click it to unlock checkout. Didn't get it? Use the resend link in the banner above.
      </p>
      <Link to="/shop" className="btn-primary">Continue Browsing</Link>
    </div>
  )

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'pincode') setPincodeCheck(null)
  }

  const checkPincode = async () => {
    if (isInternational || form.pincode.length !== 6) return
    setPincodeCheck('checking')
    try {
      const { data } = await axios.get('/api/orders/check-pincode', { params: { pincode: form.pincode } })
      setPincodeCheck(data)
    } catch {
      setPincodeCheck(null)
    }
  }

  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all required fields')
      return false
    }
    if (!isInternational && !form.state) {
      toast.error('Please select your state')
      return false
    }
    return true
  }

  // ── Razorpay (Indian) ──────────────────────────────────────────
  const loadRazorpay = () => new Promise(resolve => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handleRazorpay = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { toast.error('Payment service unavailable'); setLoading(false); return }

      // IMPORTANT: charge finalTotal (after coupon discount), always in INR
      const { data } = await axios.post('/api/orders/create-razorpay', { amount: finalTotal })

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Radhe Bloom',
        description: 'Divine Creations',
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#C9960A' },
        handler: async (response) => {
          try {
            const { data: order } = await axios.post('/api/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: { ...form, country: 'India' },
              items: cart.map(i => ({ product: i.product._id, qty: i.qty, price: i.price ?? i.product.price, color: i.color, size: i.size })),
              total: finalTotal,
              couponCode: appliedCoupon?.code || null,
              discount: appliedCoupon?.discount || 0,
            })
            clearCart()
            if (user && !user.phone && form.phone) {
              try {
                await axios.put('/api/auth/profile', { name: user.name, phone: form.phone })
              } catch { }
            }
            navigate(`/order-success/${order._id}`)
          } catch { toast.error('Payment verification failed') }
        },
        modal: { ondismiss: () => { setLoading(false); toast('Payment cancelled') } },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        setLoading(false)
        toast.error(response.error?.description || 'Payment failed. Please try again.')
      })
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed')
      setLoading(false)
    }
  }

  // ── Cash on Delivery (Domestic) ─────────────────────────────────
  const handleCOD = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const { data: order } = await axios.post('/api/orders/create-cod', {
        shippingAddress: { ...form, country: 'India' },
        items: cart.map(i => ({ product: i.product._id, qty: i.qty, price: i.price ?? i.product.price, color: i.color, size: i.size })),
        total: finalTotal,
        couponCode: appliedCoupon?.code || null,
        discount: appliedCoupon?.discount || 0,
      })
      clearCart()
      if (user && !user.phone && form.phone) {
        try {
          await axios.put('/api/auth/profile', { name: user.name, phone: form.phone })
        } catch { }
      }
      navigate(`/order-success/${order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Payoneer (International) ───────────────────────────────────
  const handleInternational = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const { data: order } = await axios.post('/api/orders/create-international', {
        shippingAddress: form,
        items: cart.map(i => ({ product: i.product._id, qty: i.qty, price: i.price ?? i.product.price, color: i.color, size: i.size })),
        total: finalTotal,
        couponCode: appliedCoupon?.code || null,
        discount: appliedCoupon?.discount || 0,
      })
      clearCart()
      navigate(`/order-success/${order._id}?international=true`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Location Toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-display text-lg text-devotion-brown mb-4">Where are you ordering from?</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsInternational(false)}
                className={"flex items-center gap-3 p-4 rounded-xl border-2 transition-all " +
                  (!isInternational ? 'border-saffron-400 bg-saffron-50' : 'border-cream-200 hover:border-saffron-200')}>
                <MapPin className={!isInternational ? 'text-saffron-500' : 'text-cream-400'} size={20} />
                <div className="text-left">
                  <p className={"font-bold text-sm " + (!isInternational ? 'text-saffron-700' : 'text-devotion-brown')}>India</p>
                  <p className="text-xs text-cream-500">UPI, GPay, Cards</p>
                </div>
                {!isInternational && <span className="ml-auto text-saffron-500 text-lg">✓</span>}
              </button>
              <button onClick={() => setIsInternational(true)}
                className={"flex items-center gap-3 p-4 rounded-xl border-2 transition-all " +
                  (isInternational ? 'border-saffron-400 bg-saffron-50' : 'border-cream-200 hover:border-saffron-200')}>
                <Globe className={isInternational ? 'text-saffron-500' : 'text-cream-400'} size={20} />
                <div className="text-left">
                  <p className={"font-bold text-sm " + (isInternational ? 'text-saffron-700' : 'text-devotion-brown')}>International</p>
                  <p className="text-xs text-cream-500">Payoneer, Wire</p>
                </div>
                {isInternational && <span className="ml-auto text-saffron-500 text-lg">✓</span>}
              </button>
            </div>
          </div>

          {/* International Info Banner — WhatsApp removed, points to Contact page */}
          {isInternational && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="font-bold text-blue-700 text-sm mb-1">🌍 International Order Process</p>
              <p className="text-blue-600 text-sm">
                Place your order below. Our team will contact you within 24 hours via email
                with Payoneer payment details. Order will be dispatched after payment confirmation.
              </p>
              <Link to="/contact"
                className="inline-flex items-center gap-1 text-saffron-600 font-bold text-sm mt-2 hover:underline">
                Contact us first →
              </Link>
            </div>
          )}

          {/* Shipping Form */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="font-display text-xl text-devotion-brown mb-5">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'name',    label: 'Full Name *',    type: 'text',  span: 1 },
                { name: 'email',   label: 'Email *',        type: 'email', span: 1 },
                { name: 'phone',   label: 'Phone Number *', type: 'tel',   span: 1 },
                { name: 'pincode', label: isInternational ? 'Postal Code *' : 'PIN Code *', type: 'text', span: 1 },
                { name: 'address', label: 'Street Address *', type: 'text', span: 2 },
                { name: 'city',    label: 'City *',         type: 'text',  span: 1 },
              ].map(field => (
                <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <input type={field.type} name={field.name} value={form[field.name]}
                    onChange={handleChange}
                    onBlur={field.name === 'pincode' ? checkPincode : undefined}
                    required className="input-field" />
                  {field.name === 'pincode' && pincodeCheck === 'checking' && (
                    <p className="text-xs text-cream-500 mt-1">Checking delivery availability…</p>
                  )}
                  {field.name === 'pincode' && pincodeCheck && pincodeCheck !== 'checking' && !pincodeCheck.skipped && !pincodeCheck.serviceable && (
                    <p className="text-xs text-red-500 mt-1">⚠️ We may not be able to deliver to this pincode. Double-check it, or contact us before ordering.</p>
                  )}
                  {field.name === 'pincode' && pincodeCheck && pincodeCheck !== 'checking' && !pincodeCheck.skipped && pincodeCheck.serviceable && (
                    <p className="text-xs text-green-600 mt-1">✓ Deliverable to this pincode</p>
                  )}
                </div>
              ))}

              {/* State - dropdown for India, text for international */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  {isInternational ? 'State / Province *' : 'State *'}
                </label>
                {isInternational ? (
                  <input type="text" name="state" value={form.state} onChange={handleChange}
                    required className="input-field" />
                ) : (
                  <select name="state" value={form.state} onChange={handleChange} required className="input-field">
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>

              {/* Country - only for international */}
              {isInternational && (
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                    Country *
                  </label>
                  <input type="text" name="country" value={form.country} onChange={handleChange}
                    required className="input-field" />
                </div>
              )}
            </div>
          </div>

          {/* Payment Method — domestic only (international always goes via Payoneer) */}
          {!isInternational && (
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-display text-lg text-devotion-brown mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod('razorpay')}
                  className={"flex items-center gap-3 p-4 rounded-xl border-2 transition-all " +
                    (paymentMethod === 'razorpay' ? 'border-saffron-400 bg-saffron-50' : 'border-cream-200 hover:border-saffron-200')}>
                  <Lock className={paymentMethod === 'razorpay' ? 'text-saffron-500' : 'text-cream-400'} size={20} />
                  <div className="text-left">
                    <p className={"font-bold text-sm " + (paymentMethod === 'razorpay' ? 'text-saffron-700' : 'text-devotion-brown')}>Pay Online</p>
                    <p className="text-xs text-cream-500">UPI, GPay, Cards</p>
                  </div>
                  {paymentMethod === 'razorpay' && <span className="ml-auto text-saffron-500 text-lg">✓</span>}
                </button>
                <button onClick={() => setPaymentMethod('cod')}
                  className={"flex items-center gap-3 p-4 rounded-xl border-2 transition-all " +
                    (paymentMethod === 'cod' ? 'border-saffron-400 bg-saffron-50' : 'border-cream-200 hover:border-saffron-200')}>
                  <Banknote className={paymentMethod === 'cod' ? 'text-saffron-500' : 'text-cream-400'} size={20} />
                  <div className="text-left">
                    <p className={"font-bold text-sm " + (paymentMethod === 'cod' ? 'text-saffron-700' : 'text-devotion-brown')}>Cash on Delivery</p>
                    <p className="text-xs text-cream-500">Pay when it arrives</p>
                  </div>
                  {paymentMethod === 'cod' && <span className="ml-auto text-saffron-500 text-lg">✓</span>}
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-4 text-sm">
              💡 <Link to="/login" className="font-bold underline hover:text-saffron-700">Login</Link> to track your orders easily
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-card sticky top-28">
            <h3 className="font-display text-lg text-devotion-brown mb-4">Order Summary</h3>

            <div className="space-y-3 mb-5 max-h-56 overflow-y-auto">
              {cart.map(item => (
                <div key={item.product._id + (item.color || '') + (item.size || '')} className="flex gap-3 items-center">
                  <img src={thumbUrl(item.product.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png', 200)}
                    alt="" className="w-12 h-12 rounded-lg object-cover bg-cream-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-devotion-brown line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-cream-500">{[item.color, item.size].filter(Boolean).join(', ')}{(item.color || item.size) ? ' · ' : ''}×{item.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-devotion-brown">{formatPrice((item.price ?? item.product.price) * item.qty)}</span>
                </div>
              ))}
            </div>

            <hr className="border-cream-200 mb-4" />

            {/* Coupon Input */}
            <div className="mb-4">
              <CouponInput
                orderTotal={total}
                appliedCoupon={appliedCoupon}
                onApply={(data) => setAppliedCoupon(data)}
                onRemove={() => setAppliedCoupon(null)}
              />
            </div>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-devotion-brown/70">
                <span>Subtotal</span><span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-devotion-brown/70">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}

              {isInternational && (
                <div className="flex justify-between text-blue-600 text-xs">
                  <span>International shipping</span><span>Calculated separately</span>
                </div>
              )}
              <hr className="border-cream-200" />
              <div className="flex justify-between font-bold text-devotion-brown">
                <span>Total</span>
                <span className="font-display text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Payment Button */}
            {!isInternational ? (
              paymentMethod === 'cod' ? (
                <button onClick={handleCOD} disabled={loading}
                  className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  <Banknote size={16} />
                  {loading ? 'Placing Order...' : `Place Order — Pay ${formatPrice(finalTotal)} on Delivery`}
                </button>
              ) : (
                <button onClick={handleRazorpay} disabled={loading}
                  className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  <Lock size={16} />
                  {loading ? 'Processing...' : `Pay ${formatPrice(finalTotal)} via Razorpay`}
                </button>
              )
            ) : (
              <button onClick={handleInternational} disabled={loading}
                className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                <Globe size={16} />
                {loading ? 'Placing Order...' : 'Place International Order'}
              </button>
            )}

            {!isInternational && paymentMethod === 'razorpay' && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {['GPay', 'PhonePe', 'Paytm', 'UPI', 'Cards'].map(m => (
                  <span key={m} className="text-xs bg-cream-100 text-cream-500 px-2 py-1 rounded-full">{m}</span>
                ))}
              </div>
            )}

            {/* Currency disclaimer — only shows if USD selected */}
            {currency === 'USD' && paymentMethod === 'razorpay' && !isInternational && (
              <p className="text-xs text-center text-cream-500 mt-2">
                * Prices shown in USD for reference. You will be charged in INR (₹{finalTotal.toFixed(2)}) via Razorpay.
              </p>
            )}

            <p className="text-xs text-center text-cream-500 mt-3 flex items-center justify-center gap-1">
              <Lock size={10} />{' '}
              {isInternational
                ? 'Secure order • Payoneer payment via email'
                : paymentMethod === 'cod'
                  ? 'Pay in cash to the delivery agent'
                  : 'Secured by Razorpay'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}