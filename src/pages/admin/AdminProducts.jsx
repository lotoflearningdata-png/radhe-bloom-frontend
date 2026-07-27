import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Edit, Trash2, X, Search, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'

const EMPTY = { name:'', description:'', price:'', originalPrice:'', category:'divine-idols', category2:'', colour:'', material:'', dimensions:'', weight:0.25, packageLength:10, packageBreadth:5, packageHeight:4, stock:50, featured:false, hidden:false, hsnCode:'', gstRate:18, images:[''], colorVariants:[], sizeVariants:[], videoUrl:'' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)
  const [variantInput, setVariantInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [sizePriceInput, setSizePriceInput] = useState('')
  const [cats, setCats] = useState([])

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/products?limit=100&includeHidden=true'),
        axios.get('/api/categories?includeHidden=true'),
      ])
      setProducts(prodRes.data.products || [])
      setCats(catRes.data.categories || [])
    } finally { setLoading(false) }
  }

  const openAdd  = () => { setForm(EMPTY); setVariantInput(''); setSizeInput(''); setSizePriceInput(''); setModal('add') }
  const openEdit = (p) => {
    setForm({
      ...p,
      images: p.images?.length ? p.images : [''],
      colorVariants: p.colorVariants || [],
      sizeVariants: p.sizeVariants || [],
      category2: (p.categories || []).find(c => c !== p.category) || '',
    })
    setVariantInput('')
    setSizeInput('')
    setSizePriceInput('')
    setModal('edit')
  }

  const addVariant = () => {
    const v = variantInput.trim()
    if (!v) return
    if (form.colorVariants?.includes(v)) return toast.error('This colour is already added')
    setForm(f => ({ ...f, colorVariants: [...(f.colorVariants || []), v] }))
    setVariantInput('')
  }

  const addSize = () => {
    const label = sizeInput.trim()
    const price = Number(sizePriceInput)
    if (!label) return toast.error('Enter a size label')
    if (!sizePriceInput || !Number.isFinite(price) || price <= 0) return toast.error('Enter a valid price for this size')
    if (form.sizeVariants?.some(v => v.label === label)) return toast.error('This size is already added')
    setForm(f => ({ ...f, sizeVariants: [...(f.sizeVariants || []), { label, price }] }))
    setSizeInput('')
    setSizePriceInput('')
  }

  const moveImage = (i, dir) => setForm(f => {
    const imgs = [...(f.images || [])]
    const j = i + dir
    if (j < 0 || j >= imgs.length) return f
    ;[imgs[i], imgs[j]] = [imgs[j], imgs[i]]
    return { ...f, images: imgs }
  })

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return toast.error('Name, price and category are required')
    setSaving(true)
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, stock: Number(form.stock), gstRate: form.gstRate === '' ? 18 : Number(form.gstRate), weight: form.weight === '' ? 0.25 : Number(form.weight), packageLength: form.packageLength === '' ? 10 : Number(form.packageLength), packageBreadth: form.packageBreadth === '' ? 5 : Number(form.packageBreadth), packageHeight: form.packageHeight === '' ? 4 : Number(form.packageHeight), images: form.images.filter(Boolean), categories: form.category2 && form.category2 !== form.category ? [form.category2] : [] }
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

  const toggleHidden = async (p) => {
    try {
      const { data } = await axios.put(`/api/products/${p._id}`, { hidden: !p.hidden })
      setProducts(prev => prev.map(x => x._id === p._id ? data.product : x))
      toast.success(data.product.hidden ? 'Product hidden from store' : 'Product visible in store')
    } catch { toast.error('Failed to update visibility') }
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
                  alt={p.name} className={`w-full h-full object-cover ${p.hidden ? 'opacity-40 grayscale' : ''}`} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(p)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-saffron-50 transition-colors">
                    <Edit size={14} className="text-saffron-600" />
                  </button>
                  <button onClick={() => toggleHidden(p)} title={p.hidden ? 'Show in store' : 'Hide from store'}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors">
                    {p.hidden ? <Eye size={14} className="text-green-600" /> : <EyeOff size={14} className="text-devotion-brown" />}
                  </button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                    className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                {p.featured && <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>}
                {p.videoUrl && <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">▶ Video</span>}
                {p.hidden && <span className="absolute top-2 right-2 bg-gray-800/90 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff size={10} /> Hidden</span>}
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
                  { key: 'hsnCode',      label: 'HSN Code',       type: 'text' },
                  { key: 'gstRate',      label: 'GST Rate (%)',   type: 'number' },
                  { key: 'weight',         label: 'Shipping Weight (kg)',   type: 'number' },
                  { key: 'packageLength',  label: 'Package Length (cm)',    type: 'number' },
                  { key: 'packageBreadth', label: 'Package Breadth (cm)',   type: 'number' },
                  { key: 'packageHeight',  label: 'Package Height (cm)',    type: 'number' },
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
                    {cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                {/* Second Category */}
                <div>
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Second Category (optional)</label>
                  <select value={form.category2 || ''} onChange={e => setForm(f => ({ ...f, category2: e.target.value }))} className="input-field">
                    <option value="">None</option>
                    {cats.filter(c => c.slug !== form.category).map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                {/* Featured + Hidden */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="featured" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 accent-saffron-500" />
                    <label htmlFor="featured" className="text-sm font-bold text-devotion-brown">Featured Product</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="hidden" checked={form.hidden || false}
                      onChange={e => setForm(f => ({ ...f, hidden: e.target.checked }))}
                      className="w-4 h-4 accent-saffron-500" />
                    <label htmlFor="hidden" className="text-sm font-bold text-devotion-brown">Hidden from store</label>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={form.description || ''} rows={3}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="input-field resize-none" />
                </div>

                {/* Colour Variants */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Colour Variants (optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={variantInput}
                      onChange={e => setVariantInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant() } }}
                      placeholder="e.g. Red, Royal Blue, Green"
                      className="input-field text-sm flex-1" />
                    <button onClick={addVariant}
                      className="px-4 py-2 bg-saffron-100 text-saffron-600 rounded-xl text-sm font-bold hover:bg-saffron-200">Add</button>
                  </div>
                  {form.colorVariants?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.colorVariants.map(c => (
                        <span key={c} className="flex items-center gap-1.5 bg-cream-100 text-devotion-brown text-sm font-bold px-3 py-1 rounded-full">
                          {c}
                          <button onClick={() => setForm(f => ({ ...f, colorVariants: f.colorVariants.filter(v => v !== c) }))}
                            className="text-red-400 hover:text-red-600"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-cream-500 mt-1.5">If added, customers must pick a colour before adding this product to cart.</p>
                </div>

                {/* Size Variants */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Size Variants (optional) — each size can have its own price</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={sizeInput}
                      onChange={e => setSizeInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSize() } }}
                      placeholder="e.g. Small"
                      className="input-field text-sm flex-1" />
                    <input type="number" value={sizePriceInput}
                      onChange={e => setSizePriceInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSize() } }}
                      placeholder="Price (₹)"
                      className="input-field text-sm w-32" />
                    <button onClick={addSize}
                      className="px-4 py-2 bg-saffron-100 text-saffron-600 rounded-xl text-sm font-bold hover:bg-saffron-200">Add</button>
                  </div>
                  {form.sizeVariants?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.sizeVariants.map(s => (
                        <span key={s.label} className="flex items-center gap-1.5 bg-cream-100 text-devotion-brown text-sm font-bold px-3 py-1 rounded-full">
                          {s.label} — ₹{s.price}
                          <button onClick={() => setForm(f => ({ ...f, sizeVariants: f.sizeVariants.filter(v => v.label !== s.label) }))}
                            className="text-red-400 hover:text-red-600"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-cream-500 mt-1.5">If added, customers must pick a size before adding this product to cart, and the size's price is charged instead of the base price above.</p>
                </div>

                {/* Images */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Image URLs (Cloudinary) — first image is the main one</label>
                  {(form.images || ['']).map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      {img ? (
                        <img src={img} alt="" className="w-10 h-10 rounded-lg object-cover bg-cream-100 border border-cream-200 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-cream-100 border border-dashed border-cream-300 shrink-0" />
                      )}
                      <input type="url" value={img}
                        onChange={e => {
                          const imgs = [...(form.images || [''])]
                          imgs[i] = e.target.value
                          setForm(f => ({ ...f, images: imgs }))
                        }}
                        placeholder="https://res.cloudinary.com/..."
                        className="input-field text-sm flex-1" />
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveImage(i, -1)} disabled={i === 0}
                          className="p-0.5 rounded bg-cream-100 text-devotion-brown hover:bg-saffron-100 disabled:opacity-30">
                          <ChevronUp size={13} />
                        </button>
                        <button onClick={() => moveImage(i, 1)} disabled={i === (form.images?.length || 1) - 1}
                          className="p-0.5 rounded bg-cream-100 text-devotion-brown hover:bg-saffron-100 disabled:opacity-30">
                          <ChevronDown size={13} />
                        </button>
                      </div>
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

                {/* Demo Video */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Demo Video URL (Cloudinary, optional)</label>
                  <input type="url" value={form.videoUrl || ''}
                    onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                    placeholder="https://res.cloudinary.com/.../video/upload/..."
                    className="input-field text-sm" />
                  <p className="text-xs text-cream-500 mt-1.5">If added, this product appears in the homepage "Shorts" reel and shows the video on its product page.</p>
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