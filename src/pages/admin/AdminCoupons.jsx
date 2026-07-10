import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, X } from 'lucide-react'

const EMPTY = {
  code: '', discountType: 'percentage', discountValue: '',
  minOrderValue: '', maxDiscount: '', usageLimit: '', perUserLimit: 1,
  validUntil: '', description: '',
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)

  useEffect(() => { fetchCoupons() }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/coupons')
      setCoupons(data.coupons || [])
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.code || !form.discountValue) {
      return toast.error('Code and discount value are required')
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        maxDiscount:   form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit:    form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit:  Number(form.perUserLimit) || 1,
        validUntil:    form.validUntil || undefined,
      }
      const { data } = await axios.post('/api/coupons', payload)
      setCoupons(prev => [data.coupon, ...prev])
      toast.success('Coupon created!')
      setModal(false)
      setForm(EMPTY)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (coupon) => {
    try {
      const { data } = await axios.put(`/api/coupons/${coupon._id}`, { isActive: !coupon.isActive })
      setCoupons(prev => prev.map(c => c._id === coupon._id ? data.coupon : c))
      toast.success(data.coupon.isActive ? 'Coupon activated' : 'Coupon deactivated')
    } catch {
      toast.error('Failed to update coupon')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await axios.delete(`/api/coupons/${id}`)
      setCoupons(prev => prev.filter(c => c._id !== id))
      toast.success('Coupon deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-devotion-brown">Coupon Codes</h2>
          <p className="text-sm text-cream-500">Manage discount codes for your store</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Tag size={40} className="text-cream-300 mx-auto mb-3" />
          <p className="font-display text-xl text-devotion-brown mb-1">No coupons yet</p>
          <p className="text-cream-500 text-sm mb-4">Create your first coupon code for launch offers</p>
          <button onClick={() => setModal(true)} className="btn-primary">Create Coupon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map(coupon => (
            <div key={coupon._id} className={`bg-white rounded-2xl p-5 shadow-card border-2 ${coupon.isActive ? 'border-green-200' : 'border-cream-200 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-lg text-devotion-brown bg-saffron-50 px-3 py-1 rounded-lg inline-block">
                    {coupon.code}
                  </p>
                  {coupon.description && <p className="text-xs text-cream-500 mt-1">{coupon.description}</p>}
                </div>
                <button onClick={() => toggleActive(coupon)} title={coupon.isActive ? 'Deactivate' : 'Activate'}>
                  {coupon.isActive
                    ? <ToggleRight size={28} className="text-green-500" />
                    : <ToggleLeft size={28} className="text-cream-400" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="bg-cream-50 rounded-lg p-2">
                  <p className="text-xs text-cream-500">Discount</p>
                  <p className="font-bold text-devotion-brown">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </p>
                </div>
                <div className="bg-cream-50 rounded-lg p-2">
                  <p className="text-xs text-cream-500">Min Order</p>
                  <p className="font-bold text-devotion-brown">{coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : 'None'}</p>
                </div>
                <div className="bg-cream-50 rounded-lg p-2">
                  <p className="text-xs text-cream-500">Usage</p>
                  <p className="font-bold text-devotion-brown">
                    {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : '(unlimited)'}
                  </p>
                </div>
                <div className="bg-cream-50 rounded-lg p-2">
                  <p className="text-xs text-cream-500">Per User</p>
                  <p className="font-bold text-devotion-brown">{coupon.perUserLimit}x</p>
                </div>
              </div>

              {coupon.validUntil && (
                <p className="text-xs text-cream-500 mb-3">
                  Expires: {new Date(coupon.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}

              <button onClick={() => handleDelete(coupon._id)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-bold">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-display text-xl text-devotion-brown">Create Coupon</h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-cream-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Coupon Code *</label>
                <input type="text" value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="LAUNCH20" className="input-field uppercase font-mono" />
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Discount Type *</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="input-field">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                    {form.discountType === 'percentage' ? 'Percentage *' : 'Amount (₹) *'}
                  </label>
                  <input type="number" value={form.discountValue}
                    onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? '20' : '100'} className="input-field" />
                </div>
              </div>

              {/* Max discount cap - only for percentage */}
              {form.discountType === 'percentage' && (
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Max Discount Cap (₹) — Optional</label>
                  <input type="number" value={form.maxDiscount}
                    onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))}
                    placeholder="e.g. 500 (max ₹500 off even if % is more)" className="input-field" />
                </div>
              )}

              {/* Min order value */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Minimum Order Value (₹)</label>
                <input type="number" value={form.minOrderValue}
                  onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))}
                  placeholder="0 = no minimum" className="input-field" />
              </div>

              {/* Usage limit + per user limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Total Usage Limit</label>
                  <input type="number" value={form.usageLimit}
                    onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                    placeholder="Blank = unlimited" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Per User Limit</label>
                  <input type="number" value={form.perUserLimit}
                    onChange={e => setForm(f => ({ ...f, perUserLimit: e.target.value }))}
                    placeholder="1" className="input-field" />
                </div>
              </div>

              {/* Valid until */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Valid Until — Optional</label>
                <input type="date" value={form.validUntil}
                  onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
                  className="input-field" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Description — Optional</label>
                <input type="text" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Launch offer for new customers" className="input-field" />
              </div>
            </div>

            <div className="p-6 border-t border-cream-200 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}