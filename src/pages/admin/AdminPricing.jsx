// frontend/src/pages/admin/AdminPricing.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Search, Save, Globe, ChevronDown, ChevronUp } from 'lucide-react'

const COUNTRIES = [
  { code: 'IN',    name: 'India',           currency: 'INR', symbol: '₹', flag: '🇮🇳' },
  { code: 'US',    name: 'United States',   currency: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'OTHER', name: 'Other Countries', currency: 'USD', symbol: '$', flag: '🌍' },
]

export default function AdminPricing() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [saving, setSaving]       = useState({})
  const [expanded, setExpanded]   = useState(null)
  const [edits, setEdits]         = useState({}) // { productId: { US: '12.99', GB: '10.99', ... } }
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/pricing/all')
      setProducts(data.products || [])
      // Init edits state with existing prices
      const initEdits = {}
      data.products.forEach(p => {
        initEdits[p._id] = {
          US:    p.prices?.US || '',
          OTHER: p.prices?.OTHER || '',
        }
      })
      setEdits(initEdits)
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const handlePriceChange = (productId, countryCode, value) => {
    setEdits(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [countryCode]: value }
    }))
  }

  const handleSave = async (product) => {
    setSaving(prev => ({ ...prev, [product._id]: true }))
    try {
      const prices = {}
      const edit = edits[product._id] || {}

      // Always include India price from product base price
      prices.IN = product.price

      // Add other country prices if filled
      Object.entries(edit).forEach(([code, val]) => {
        if (val !== '' && !isNaN(Number(val))) {
          prices[code] = Number(val)
        }
      })

      await axios.post(`/api/pricing/product/${product._id}`, { prices })
      toast.success(`Prices saved for ${product.name}`)

      // Update local state
      setProducts(prev => prev.map(p =>
        p._id === product._id ? { ...p, prices } : p
      ))
    } catch { toast.error('Failed to save prices') }
    finally { setSaving(prev => ({ ...prev, [product._id]: false })) }
  }

  const handleSaveAll = async () => {
    const items = products
      .filter(p => {
        const edit = edits[p._id] || {}
        return Object.values(edit).some(v => v !== '')
      })
      .map(p => {
        const edit = edits[p._id] || {}
        const prices = { IN: p.price }
        Object.entries(edit).forEach(([code, val]) => {
          if (val !== '' && !isNaN(Number(val))) prices[code] = Number(val)
        })
        return { productId: p._id, prices }
      })

    if (items.length === 0) return toast.error('No changes to save')

    setSaving({ all: true })
    try {
      await axios.post('/api/pricing/bulk', { items })
      toast.success(`Saved prices for ${items.length} products!`)
      fetchProducts()
    } catch { toast.error('Failed to bulk save') }
    finally { setSaving({}) }
  }

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const hasCountryPrice = (product, code) => !!product.prices?.[code]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-devotion-brown flex items-center gap-2">
            <Globe size={20} className="text-saffron-500" /> Country Pricing
          </h2>
          <p className="text-sm text-cream-500 mt-0.5">
            Set different prices per country for each product. India price is always the base (₹).
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving.all}
          className="btn-primary disabled:opacity-60">
          <Save size={15} />
          {saving.all ? 'Saving All...' : 'Save All Changes'}
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
        <p className="font-bold mb-1">ℹ️ How it works</p>
        <p>Three price tiers: <b>India</b> always uses the base ₹ price. Set a <b>US ($)</b> price for American customers and an <b>Other Countries ($)</b> price for everyone else. Leave blank to auto-convert the ₹ price by live rate. Customers are auto-detected by IP and can manually switch country.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="input-field pl-9 text-sm" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field text-sm w-auto">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
        </select>
      </div>

      {/* Country legend */}
      <div className="flex flex-wrap gap-2">
        {COUNTRIES.filter(c => c.code !== 'IN').map(c => (
          <div key={c.code} className="flex items-center gap-1.5 bg-white border border-cream-200 rounded-full px-3 py-1.5 text-xs font-bold text-devotion-brown">
            <span>{c.flag}</span> {c.name} ({c.symbol})
          </div>
        ))}
      </div>

      {/* Products list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <p className="text-4xl mb-3">🌍</p>
          <p className="font-display text-xl text-devotion-brown">No products found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(product => {
            const isExpanded = expanded === product._id
            const edit = edits[product._id] || {}
            const pricesSet = Object.values(product.prices || {}).filter(Boolean).length

            return (
              <div key={product._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                {/* Product row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Image */}
                  <img
                    src={product.image || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-cream-100 shrink-0"
                  />

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-devotion-brown text-sm truncate">{product.name}</p>
                    <p className="text-xs text-cream-500 capitalize">{product.category?.replace(/-/g, ' ')}</p>
                  </div>

                  {/* India base price */}
                  <div className="text-center shrink-0">
                    <p className="text-xs text-cream-400">🇮🇳 Base</p>
                    <p className="font-bold text-devotion-brown text-sm">₹{product.price}</p>
                  </div>

                  {/* Status badges */}
                  <div className="hidden md:flex gap-1">
                    {COUNTRIES.filter(c => c.code !== 'IN').map(c => (
                      <span key={c.code}
                        className={`text-xs px-2 py-1 rounded-full font-bold ${
                          hasCountryPrice(product, c.code)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-cream-100 text-cream-400'
                        }`}>
                        {c.flag} {hasCountryPrice(product, c.code) ? `${c.symbol}${product.prices[c.code]}` : '—'}
                      </span>
                    ))}
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : product._id)}
                    className="p-2 hover:bg-cream-100 rounded-xl transition-colors shrink-0">
                    {isExpanded ? <ChevronUp size={16} className="text-cream-400" /> : <ChevronDown size={16} className="text-cream-400" />}
                  </button>
                </div>

                {/* Expanded pricing form */}
                {isExpanded && (
                  <div className="border-t border-cream-200 p-4 bg-cream-50">
                    <p className="text-xs font-bold text-cream-500 uppercase tracking-wider mb-4">
                      Set prices in local currency for each country:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {COUNTRIES.filter(c => c.code !== 'IN').map(c => (
                        <div key={c.code}>
                          <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5">
                            {c.flag} {c.name} ({c.symbol})
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-cream-400 font-bold">
                              {c.symbol}
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={edit[c.code] ?? product.prices?.[c.code] ?? ''}
                              onChange={e => handlePriceChange(product._id, c.code, e.target.value)}
                              placeholder={c.code === 'US' ? 'e.g. 12.99' : 'e.g. 14.99'}
                              className="input-field pl-10 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-cream-500">
                        Leave blank → customers see ₹{product.price} (converted by live rate)
                      </p>
                      <button
                        onClick={() => handleSave(product)}
                        disabled={saving[product._id]}
                        className="btn-primary text-sm disabled:opacity-60">
                        <Save size={14} />
                        {saving[product._id] ? 'Saving...' : 'Save Prices'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}