import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, MessageCircle, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/ui/SEO'

export default function OrderSuccessPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isInternational = searchParams.get('international') === 'true'
  const { user } = useAuth()

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <SEO title="Order Confirmed" noindex />
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-green-500" size={40} />
      </div>
      <h1 className="font-display text-4xl text-devotion-brown mb-3">
        {isInternational ? 'Order Placed! 🌍' : 'Order Confirmed! 🙏'}
      </h1>
      <p className="text-cream-500 mb-2">
        Your divine order has been confirmed and is being processed.
      </p>
      <div className="bg-cream-100 rounded-2xl px-6 py-4 inline-block mb-4">
        <p className="text-xs text-cream-500 mb-1">Order ID</p>
        <p className="font-bold text-devotion-brown font-mono text-sm">{id}</p>
      </div>

      {isInternational && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-700">
          <p className="font-bold mb-1">🌍 International Order</p>
          <p className="text-left">
            Your payment was processed securely via Razorpay. We'll dispatch your order
            shortly and share tracking details via email.
          </p>
        </div>
      )}

      <p className="text-sm text-cream-500 mb-8">
        A confirmation email has been sent to your email address.
      </p>

      {!user && (
        <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-5 mb-6 text-center">
          <p className="font-bold text-devotion-brown mb-1">Want to track this order?</p>
          <p className="text-sm text-cream-600 mb-4">
            Please login or create an account to track this and all your future orders in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/login?redirect=/orders`} className="btn-primary">
              <User size={16} /> Login
            </Link>
            <Link to={`/register?redirect=/orders`} className="btn-outline">Create Account</Link>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {user && (
          <Link to="/orders" className="btn-primary">
            <Package size={16} /> Track Order
          </Link>
        )}
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}