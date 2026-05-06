import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Search, Filter, Globe, MapPin, ChevronDown } from 'lucide-react'

const STATUSES = ['all','pending','confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLORS = {
  pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700',
  processing:'bg-purple-100 text-purple-700', shipped:'bg-indigo-100 text-indigo-700',
  delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-500',
}

export default function AdminOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [statusFilter, setStatus] = useState('all')
  const [search, setSearch]       = useState('')
  const [expanded, setExpanded]   = useState(null)
  const [updating, setUpdating]   = useState(null)

  useEffect(() => { fetchOrders() }, [statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const { data } = await axios.get('/api/orders/all', { params })
      setOrders(data.orders || [])
    } finally { setLoading(false) }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated!')
    } catch { toast.error('Failed to update status') }
    finally { setUpdating(null) }
  }

  const confirmPayoneer = async (orderId) => {
    const ref = prompt('Enter Payoneer reference/transaction ID:')
    if (!ref) return
    try {
      await axios.put(`/api/orders/${orderId}/confirm-payoneer`, { reference: ref })
      toast.success('Payment confirmed! Shiprocket order created.')
      fetchOrders()
    } catch { toast.error('Failed to confirm payment') }
  }

  const filtered = orders.filter(o =>
    !search || o._id.includes(search) ||
    o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.phone?.includes(search)
  )

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone, order ID..."
            className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={"px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize " +
                (statusFilter === s ? 'bg-saffron-500 text-white' : 'bg-cream-100 text-devotion-brown hover:bg-cream-200')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-display text-xl text-devotion-brown">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 flex flex-wrap items-center gap-4">
                {/* Customer */}
                <div className="flex items-center gap-2 min-w-40">
                  {order.isInternational ? <Globe size={14} className="text-blue-500 shrink-0" /> : <MapPin size={14} className="text-saffron-500 shrink-0" />}
                  <div>
                    <p className="font-bold text-sm text-devotion-brown">{order.shippingAddress?.name}</p>
                    <p className="text-xs text-cream-500">{order.shippingAddress?.phone}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="min-w-20">
                  <p className="font-bold text-devotion-brown">₹{order.total}</p>
                  <p className="text-xs text-cream-500">{order.items?.length} items</p>
                </div>

                {/* Payment */}
                <div className="min-w-24">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="relative min-w-36">
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className={`appearance-none w-full text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border-0 outline-none ${STATUS_COLORS[order.status]}`}>
                    {STATUSES.filter(s => s !== 'all').map(s => <option key={s} value={s} className="bg-white text-gray-800">{s}</option>)}
                  </select>
                </div>

                {/* Date */}
                <p className="text-xs text-cream-500 ml-auto">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                {/* Expand */}
                <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors">
                  <ChevronDown size={16} className={`text-cream-400 transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expanded */}
              {expanded === order._id && (
                <div className="border-t border-cream-200 p-4 bg-cream-50 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold text-cream-500 uppercase mb-2">Items</p>
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-devotion-brown">{item.product?.name} ×{item.qty} — ₹{item.price * item.qty}</p>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div>
                    <p className="text-xs font-bold text-cream-500 uppercase mb-2">Ship To</p>
                    <p className="text-devotion-brown leading-relaxed">
                      {order.shippingAddress?.address}<br/>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br/>
                      {order.isInternational && order.shippingAddress?.country}
                    </p>
                  </div>

                  {/* Tracking / Actions */}
                  <div>
                    <p className="text-xs font-bold text-cream-500 uppercase mb-2">Tracking & Actions</p>
                    {order.awbCode ? (
                      <div>
                        <p className="text-devotion-brown">AWB: <span className="font-bold">{order.awbCode}</span></p>
                        <p className="text-devotion-brown">Courier: {order.courierName}</p>
                      </div>
                    ) : order.isInternational && order.paymentStatus !== 'paid' ? (
                      <button onClick={() => confirmPayoneer(order._id)}
                        className="btn-primary text-xs px-4 py-2">
                        ✅ Confirm Payoneer Payment
                      </button>
                    ) : (
                      <p className="text-cream-500 text-xs">Awaiting Shiprocket assignment</p>
                    )}
                    <p className="text-xs text-cream-400 mt-2">Order ID: {order._id}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}