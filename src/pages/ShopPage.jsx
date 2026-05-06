import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import SEO from '../components/ui/SEO'

const CATEGORIES = [
  { label: 'All',          value: '' },
  { label: 'Divine Idols', value: 'divine-idols' },
  { label: 'Festive Sets', value: 'festive-sets' },
  { label: 'Home Décor',   value: 'home-decor' },
  { label: 'Kids & Toys',  value: 'kids-toys' },
]

const SORT_OPTIONS = [
  { label: 'Newest',            value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Most Popular',      value: 'popular' },
]

function sortProductsByImage(products) {
  const hasRealImage = p => {
    const img = p.images?.[0]
    return img && !img.includes('placehold.co') && !img.includes('placeholder.com')
  }
  return [...products].sort((a, b) => {
    if (hasRealImage(a) && !hasRealImage(b)) return -1
    if (!hasRealImage(a) && hasRealImage(b)) return 1
    return 0
  })
}

export default function ShopPage() {
  const { category: paramCat } = useParams()
  const [searchParams] = useSearchParams()
  const queryStr = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [filters, setFilters]   = useState({
    category: paramCat || '',
    sort:     'newest',
    minPrice: '',
    maxPrice: '',
    search:   queryStr,
  })
  const [showFilters, setShowFilters] = useState(false)
  const LIMIT = 12

  useEffect(() => {
    setFilters(f => ({ ...f, category: paramCat || '', search: queryStr }))
    setPage(1)
  }, [paramCat, queryStr])

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { page, limit: LIMIT, ...filters }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const { data } = await axios.get('/api/products', { params })
      setProducts(sortProductsByImage(data.products || []))
      setTotal(data.total || 0)
    } catch(err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const currentCat = CATEGORIES.find(c => c.value === filters.category)

  return (
    <>
      <SEO
        title="Shop All Products"
        description="Browse our complete collection of handcrafted Krishna idols, MDF cutouts, festive sets, home décor and kids toys from Radhe Bloom, Mathura."
      />
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="section-subtitle mb-2">✦ Our Store ✦</p>
        <h1 className="section-title">
          {currentCat?.value ? currentCat.label : filters.search ? "Results for \"" + filters.search + "\"" : 'All Products'}
        </h1>
        {total > 0 && <p className="text-cream-500 text-sm mt-1">{total} products found</p>}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => updateFilter('category', cat.value)}
            className={"px-4 py-2 rounded-full text-sm font-bold transition-all " + (
              filters.category === cat.value
                ? 'bg-saffron-500 text-white shadow-warm'
                : 'bg-white border border-cream-200 text-devotion-brown hover:border-saffron-300 hover:text-saffron-600'
            )}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-8 bg-white rounded-2xl px-4 py-3 shadow-card">
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-bold text-devotion-brown hover:text-saffron-600 transition-colors">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-cream-500 hidden sm:block">Sort:</span>
          <div className="relative">
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
              className="appearance-none bg-cream-50 border border-cream-200 rounded-xl px-4 py-2 pr-8 text-sm text-devotion-brown focus:outline-none focus:ring-2 focus:ring-saffron-300">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-cream-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-card border border-cream-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-devotion-brown">Filter by Price (₹)</h3>
            <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', '') }}
              className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          </div>
          <div className="flex gap-3">
            <input type="number" placeholder="Min ₹" value={filters.minPrice}
              onChange={e => updateFilter('minPrice', e.target.value)} className="input-field text-sm" />
            <input type="number" placeholder="Max ₹" value={filters.maxPrice}
              onChange={e => updateFilter('maxPrice', e.target.value)} className="input-field text-sm" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(LIMIT)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="bg-white p-4 space-y-2">
                <div className="skeleton h-3 rounded w-1/2" />
                <div className="skeleton h-4 rounded w-3/4" />
                <div className="skeleton h-4 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-2xl text-devotion-brown mb-2">No products found</h3>
          <p className="text-cream-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {total > LIMIT && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(Math.ceil(total / LIMIT))].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={"w-10 h-10 rounded-full font-bold text-sm transition-all " + (
                    page === i + 1
                      ? 'bg-saffron-500 text-white shadow-warm'
                      : 'bg-white border border-cream-200 text-devotion-brown hover:border-saffron-300'
                  )}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </>
  )
}
