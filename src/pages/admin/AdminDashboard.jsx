import { useState, useEffect } from 'react'
import axios from 'axios'
import { ShoppingBag, Package, Users, TrendingUp, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/orders/all?limit=5'),
      axios.get('/api/products?limit=1'),
    ]).then(([ordersRes, productsRes]) => {
      const allOrders = ordersRes.data.orders || []
      setOrders(allOrders)
      const revenue = allOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
      setStats({
        totalOrders:   ordersRes.data.total || 0,
        totalRevenue:  revenue,
        totalProducts: productsRes.data.total || 0,
        pendingOrders: allOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      })
    }).finally(() => setLoading(false))
  }, [])

  const STATUS_ICON = {
    pending:    <Clock size={14} className="text-yellow-500" />,
    confirmed:  <CheckCircle size={14} className="text-blue-500" />,
    processing: <AlertCircle size={14} className="text-purple-500" />,
    shipped:    <Truck size={14} className="text-indigo-500" />,
    delivered:  <CheckCircle size={14} className="text-green-500" />,
    cancelled:  <AlertCircle size={14} className="text-red-500" />,
  }

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders',   value: stats?.totalOrders,               icon: ShoppingBag,  color: 'bg-blue-50 text-blue-600' },
          { label: 'Revenue',        value: `₹${stats?.totalRevenue?.toFixed(0) || 0}`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
          { label: 'Products',       value: stats?.totalProducts,             icon: Package,      color: 'bg-saffron-50 text-saffron-600' },
          { label: 'Pending Orders', value: stats?.pendingOrders,             icon: Clock,        color: 'bg-yellow-50 text-yellow-600' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="font-display text-2xl font-bold text-devotion-brown">{stat.value}</p>
              <p className="text-xs text-cream-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-cream-200 flex items-center justify-between">
          <h2 className="font-display text-lg text-devotion-brown">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-saffron-600 font-bold hover:underline">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cream-50 text-xs text-cream-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-cream-500">{order._id.slice(-8)}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-bold text-devotion-brown">{order.shippingAddress?.name}</p>
                    <p className="text-xs text-cream-500">{order.shippingAddress?.phone}</p>
                  </td>
                  <td className="px-5 py-3 font-bold text-devotion-brown">₹{order.total}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1 text-xs font-bold capitalize">
                      {STATUS_ICON[order.status]} {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-cream-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}