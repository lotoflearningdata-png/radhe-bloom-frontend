import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X, Search } from 'lucide-react'

const CATEGORIES = ['divine-idols','festive-sets','home-decor','kids-toys']
const EMPTY = { name:'', description:'', price:'', originalPrice:'', category:'divine-idols', colour:'', material:'', dimensions:'', weight:'', stock:50, featured:false, images:[''] }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/products?limit=100')
      setProducts(data.products || [])
    } finally { setLoading(false) }
  }

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = (p) => {
    setForm({ ...p, images: p.images?.length ? p.images : [''] })
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Name, price and category are required')
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, stock: Number(form.stock), images: form.images.filter(Boolean) }
      if (modal === 'add') {
        const { data } = await axios.post('/api/products', payload)
        setProducts(prev => [data.product, ...prev])
        toast.success('Product added!')
      } else {
        const { data } = await axios.put(`/api/products/${form._id}`, payload)
        setProducts(prev => prev.map(p => p._id === form._id ? data.product : p))
        toast.success('Product updated!')
      }
      setModal(null)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await axios.delete(`/api/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(null) }
  }

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="input-field pl-9 text-sm" />
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
              <div className="aspect-square bg-cream-100 relative overflow-hidden">
                <img src={p.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                  alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(p)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-saffron-50 transition-colors">
                    <Edit size={14} className="text-saffron-600" />
                  </button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                {p.featured && <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-saffron-500 uppercase mb-1">{p.category}</p>
                <p className="font-bold text-devotion-brown text-sm line-clamp-2 mb-1">{p.name}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-devotion-brown">₹{p.price}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <h2 className="font-display text-xl text-devotion-brown">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-cream-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name',         label: 'Product Name *', type: 'text', span: 2 },
                  { key: 'price',        label: 'Price (₹) *',    type: 'number' },
                  { key: 'originalPrice',label: 'Original Price', type: 'number' },
                  { key: 'stock',        label: 'Stock',          type: 'number' },
                  { key: 'colour',       label: 'Colour',         type: 'text' },
                  { key: 'material',     label: 'Material',       type: 'text' },
                  { key: 'dimensions',   label: 'Dimensions',     type: 'text' },
                  { key: 'weight',       label: 'Weight',         type: 'text' },
                ].map(field => (
                  <div key={field.key} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">{field.label}</label>
                    <input type={field.type} value={form[field.key] || ''}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="input-field" />
                  </div>
                ))}

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3 mt-5">
                  <input type="checkbox" id="featured" checked={form.featured}
                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-saffron-500" />
                  <label htmlFor="featured" className="text-sm font-bold text-devotion-brown">Featured Product</label>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={form.description || ''} rows={3}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="input-field resize-none" />
                </div>

                {/* Images */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Image URLs (Cloudinary)</label>
                  {(form.images || ['']).map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="url" value={img}
                        onChange={e => {
                          const imgs = [...(form.images || [''])]
                          imgs[i] = e.target.value
                          setForm(f => ({ ...f, images: imgs }))
                        }}
                        placeholder="https://res.cloudinary.com/..."
                        className="input-field text-sm flex-1" />
                      {i === (form.images?.length || 1) - 1 ? (
                        <button onClick={() => setForm(f => ({ ...f, images: [...(f.images || ['']), ''] }))}
                          className="px-3 py-2 bg-saffron-100 text-saffron-600 rounded-xl text-sm font-bold hover:bg-saffron-200">+</button>
                      ) : (
                        <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          className="px-3 py-2 bg-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-200">−</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-cream-200 flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="btn-outline">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : modal === 'add' ? 'Add Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}