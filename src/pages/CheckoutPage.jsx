import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Lock, ArrowRight, Globe, MapPin } from 'lucide-react'

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
  const navigate    = useNavigate()
  const shipping    = cartTotal >= 499 ? 0 : 49
  const total       = cartTotal + shipping

  const [isInternational, setIsInternational] = useState(false)
  const [loading, setLoading] = useState(false)
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

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <h2 className="font-display text-3xl text-devotion-brown mb-4">Your cart is empty</h2>
      <Link to="/shop" className="btn-primary">Go Shopping</Link>
    </div>
  )

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

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

      const { data } = await axios.post('/api/orders/create-razorpay', { amount: total })

      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    'INR',
        name:        'Radhe Bloom',
        description: 'Divine Creations',
        image:       'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png',
        order_id:    data.orderId,
        prefill:     { name: form.name, email: form.email, contact: form.phone },
        theme:       { color: '#f97f0a' },
        handler: async (response) => {
          try {
            const { data: order } = await axios.post('/api/orders/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              shippingAddress: { ...form, country: 'India' },
              items: cart.map(i => ({ product: i.product._id, qty: i.qty, price: i.product.price })),
              total,
            })
            clearCart()
            navigate(`/order-success/${order._id}`)
          } catch { toast.error('Payment verification failed') }
        },
        modal: { ondismiss: () => { setLoading(false); toast('Payment cancelled') } },
      }
      new window.Razorpay(options).open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed')
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
        items: cart.map(i => ({ product: i.product._id, qty: i.qty, price: i.product.price })),
        total,
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

          {/* International Info Banner */}
          {isInternational && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="font-bold text-blue-700 text-sm mb-1">🌍 International Order Process</p>
              <p className="text-blue-600 text-sm">
                Place your order below. Our team will contact you within 24 hours via WhatsApp/Email
                with Payoneer payment details. Order will be dispatched after payment confirmation.
              </p>
              <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-green-600 font-bold text-sm mt-2 hover:underline">
                💬 Chat with us first
              </a>
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
                    onChange={handleChange} required className="input-field" />
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
                <div key={item.product._id} className="flex gap-3 items-center">
                  <img src={item.product.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                    alt="" className="w-12 h-12 rounded-lg object-cover bg-cream-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-devotion-brown line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-cream-500">×{item.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-devotion-brown">₹{(item.product.price * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <hr className="border-cream-200 mb-4" />
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between text-devotion-brown/70">
                <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-devotion-brown/70">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {isInternational && (
                <div className="flex justify-between text-blue-600 text-xs">
                  <span>International shipping</span><span>Calculated separately</span>
                </div>
              )}
              <hr className="border-cream-200" />
              <div className="flex justify-between font-bold text-devotion-brown">
                <span>Total</span>
                <span className="font-display text-xl">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Button */}
            {!isInternational ? (
              <button onClick={handleRazorpay} disabled={loading}
                className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                <Lock size={16} />
                {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)} via Razorpay`}
              </button>
            ) : (
              <button onClick={handleInternational} disabled={loading}
                className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                <Globe size={16} />
                {loading ? 'Placing Order...' : 'Place International Order'}
              </button>
            )}

            {!isInternational && (
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {['GPay', 'PhonePe', 'Paytm', 'UPI', 'Cards'].map(m => (
                  <span key={m} className="text-xs bg-cream-100 text-cream-500 px-2 py-1 rounded-full">{m}</span>
                ))}
              </div>
            )}

            <p className="text-xs text-center text-cream-500 mt-3 flex items-center justify-center gap-1">
              <Lock size={10} /> {isInternational ? 'Secure order • Payoneer payment via WhatsApp' : 'Secured by Razorpay'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}