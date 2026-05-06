import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Package, ChevronDown, ChevronUp, Globe, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-500',
}

const TIMELINE = [
  { key: 'pending',    label: 'Order Placed',       icon: '📝' },
  { key: 'confirmed',  label: 'Payment Confirmed',   icon: '✅' },
  { key: 'processing', label: 'Being Packed',        icon: '📦' },
  { key: 'shipped',    label: 'Shipped',             icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',           icon: '🏠' },
]

function OrderTimeline({ status }) {
  const currentIdx = TIMELINE.findIndex(t => t.key === status)
  return (
    <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-2">
      {TIMELINE.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={`flex flex-col items-center min-w-[60px] ${i <= currentIdx ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
              i < currentIdx ? 'bg-green-100' : i === currentIdx ? 'bg-saffron-100 ring-2 ring-saffron-400' : 'bg-cream-100'}`}>
              {step.icon}
            </div>
            <p className="text-xs text-center text-devotion-brown leading-tight">{step.label}</p>
          </div>
          {i < TIMELINE.length - 1 && (
            <div className={`h-0.5 w-6 mx-1 mb-4 ${i < currentIdx ? 'bg-green-400' : 'bg-cream-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrdersPage() {
  const { user }  = useAuth()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (user) {
      axios.get('/api/orders/my')
        .then(r => setOrders(r.data.orders || []))
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [user])

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <h2 className="font-display text-3xl text-devotion-brown mb-4">Login to view orders</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="text-cream-300 mx-auto mb-4" />
          <h3 className="font-display text-2xl text-devotion-brown mb-2">No orders yet</h3>
          <Link to="/shop" className="btn-primary mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* Order Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {order.isInternational
                        ? <Globe size={14} className="text-blue-500" />
                        : <MapPin size={14} className="text-saffron-500" />}
                      <p className="text-xs text-cream-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-cream-400">{order._id}</p>
                  </div>
                  <span className={"text-xs font-bold px-3 py-1.5 rounded-full capitalize " + (STATUS_COLORS[order.status] || 'bg-cream-100 text-cream-600')}>
                    {order.status}
                  </span>
                </div>

                {/* Product images */}
                <div className="flex gap-2 mb-3">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <img key={i}
                      src={item.product?.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                      alt="" className="w-12 h-12 rounded-lg object-cover bg-cream-100" />
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-cream-100 flex items-center justify-center text-xs text-cream-500 font-bold">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-devotion-brown">₹{order.total?.toFixed(2)}</span>
                  <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    className="flex items-center gap-1 text-sm text-saffron-600 font-bold hover:text-saffron-700">
                    {expanded === order._id ? <><ChevronUp size={16}/> Less</> : <><ChevronDown size={16}/> Details</>}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === order._id && (
                <div className="border-t border-cream-200 p-5 bg-cream-50 space-y-4">
                  {/* Timeline */}
                  {!order.isInternational && <OrderTimeline status={order.status} />}

                  {/* International status */}
                  {order.isInternational && (
                    <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                      <p className="font-bold">🌍 International Order</p>
                      <p>Payment Method: Payoneer</p>
                      <p>Payment Status: <span className="font-bold capitalize">{order.paymentStatus}</span></p>
                      {order.paymentStatus === 'pending' && (
                        <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                          className="inline-block mt-2 text-green-600 font-bold hover:underline">
                          💬 WhatsApp us to complete payment
                        </a>
                      )}
                    </div>
                  )}

                  {/* Tracking */}
                  {order.awbCode && (
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs font-bold text-devotion-brown/70 uppercase mb-2">Tracking</p>
                      <p className="text-sm"><span className="text-cream-500">AWB:</span> <span className="font-bold">{order.awbCode}</span></p>
                      {order.courierName && <p className="text-sm"><span className="text-cream-500">Courier:</span> {order.courierName}</p>}
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold text-devotion-brown/70 uppercase mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-devotion-brown">{item.product?.name} ×{item.qty}</span>
                          <span className="font-bold">₹{(item.price * item.qty).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <p className="text-xs font-bold text-devotion-brown/70 uppercase mb-2">Shipping To</p>
                    <p className="text-sm text-devotion-brown">
                      {order.shippingAddress?.name}, {order.shippingAddress?.address},<br/>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  <a href={`https://wa.me/919528078217?text=Hi%2C%20my%20order%20ID%20is%20${order._id}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-green-600 font-bold hover:underline">
                    💬 WhatsApp for order help
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}