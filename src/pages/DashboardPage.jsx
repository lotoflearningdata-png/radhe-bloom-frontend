import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { User, Package, Edit, Save, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, login } = useAuth()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', phone: '' })
  const [tab, setTab]         = useState('orders')

  useEffect(() => {
    if (!user) return
    setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
    axios.get('/api/orders/my')
      .then(r => setOrders(r.data.orders || []))
      .finally(() => setLoading(false))
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await axios.put('/api/auth/profile', form)
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <h2 className="font-display text-3xl text-devotion-brown mb-4">Please login first</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  )

  const STATUS_COLORS = {
    pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700',
    processing:'bg-purple-100 text-purple-700', shipped:'bg-indigo-100 text-indigo-700',
    delivered:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-500',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-display text-2xl font-bold">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl text-devotion-brown">{user.name}</h1>
          <p className="text-cream-500">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-cream-100 rounded-2xl p-1.5 mb-8 w-fit">
        {[['orders','My Orders', Package], ['profile','My Profile', User]].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={"flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all " +
              (tab === key ? 'bg-white text-devotion-brown shadow-card' : 'text-cream-500 hover:text-devotion-brown')}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <Package size={48} className="text-cream-300 mx-auto mb-4" />
              <h3 className="font-display text-xl text-devotion-brown mb-2">No orders yet</h3>
              <Link to="/shop" className="btn-primary mt-4">Start Shopping</Link>
            </div>
          ) : orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <p className="font-mono text-xs text-cream-400 mb-1">{order._id}</p>
                  <p className="text-xs text-cream-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={"text-xs font-bold px-3 py-1.5 rounded-full capitalize " + (STATUS_COLORS[order.status] || 'bg-cream-100 text-cream-600')}>
                    {order.status}
                  </span>
                  <span className="font-display text-lg font-bold text-devotion-brown">₹{order.total}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {order.items?.slice(0, 4).map((item, i) => (
                  <img key={i}
                    src={item.product?.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                    alt="" className="w-12 h-12 rounded-lg object-cover bg-cream-100" />
                ))}
              </div>
              {order.awbCode && (
                <p className="text-xs text-devotion-brown mt-3">
                  📦 AWB: <span className="font-bold">{order.awbCode}</span> via {order.courierName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-card max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-devotion-brown">Profile Details</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-saffron-600 font-bold text-sm hover:text-saffron-700">
                <Edit size={14} /> Edit
              </button>
            ) : (
              <button onClick={() => setEditing(false)} className="p-1.5 hover:bg-cream-100 rounded-lg">
                <X size={16} className="text-cream-400" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {[
              { key: 'name',  label: 'Full Name',    type: 'text' },
              { key: 'email', label: 'Email',         type: 'email' },
              { key: 'phone', label: 'Phone Number',  type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">{field.label}</label>
                {editing ? (
                  <input type={field.type} value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="input-field" />
                ) : (
                  <p className="text-devotion-brown font-bold py-2">{user[field.key] || '—'}</p>
                )}
              </div>
            ))}
          </div>

          {editing && (
            <button onClick={handleSave} disabled={saving}
              className="btn-primary mt-6 disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}