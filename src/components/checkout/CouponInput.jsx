// frontend/src/components/checkout/CouponInput.jsx
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Tag, X, CheckCircle, Loader } from 'lucide-react'
import { useCurrency } from '../../context/CurrencyContext'

export default function CouponInput({ orderTotal, onApply, onRemove, appliedCoupon }) {
  const { formatPrice } = useCurrency()
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleApply = async (e) => {
    e.preventDefault()
    if (!code.trim()) return toast.error('Enter a coupon code')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/coupons/validate', {
        code: code.trim(),
        orderTotal,
      })
      onApply(data)
      toast.success(`Coupon applied! You saved ${formatPrice(data.discount)}`)
      setCode('')
      setShowInput(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    onRemove()
    toast('Coupon removed', { icon: '🗑️' })
  }

  // Already applied state
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <div>
            <p className="text-sm font-bold text-green-700">{appliedCoupon.code} applied</p>
            <p className="text-xs text-green-600">You saved {formatPrice(appliedCoupon.discount)}</p>
          </div>
        </div>
        <button onClick={handleRemove} className="text-green-600 hover:text-red-500 transition-colors">
          <X size={16} />
        </button>
      </div>
    )
  }

  // Collapsed state — just a link
  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1.5 text-sm text-saffron-600 font-bold hover:text-saffron-700"
      >
        <Tag size={14} /> Have a coupon code?
      </button>
    )
  }

  // Input form
  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        placeholder="Enter coupon code"
        className="input-field text-sm flex-1 uppercase"
        autoFocus
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-saffron-500 text-white px-5 rounded-xl text-sm font-bold hover:bg-saffron-600 disabled:opacity-60 transition-colors shrink-0"
      >
        {loading ? <Loader size={14} className="animate-spin" /> : 'Apply'}
      </button>
      <button
        type="button"
        onClick={() => setShowInput(false)}
        className="text-cream-400 hover:text-cream-600 px-2"
      >
        <X size={16} />
      </button>
    </form>
  )
}