import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ShoppingBag, ArrowLeft, Star, Package, Ruler, Weight, Palette, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import SEO from '../components/ui/SEO'
import ProductCard from '../components/ui/ProductCard'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [imgIdx, setImgIdx]     = useState(0)
  const [qty, setQty]           = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    axios.get(`/api/products/${id}`)
      .then(r => {
        setProduct(r.data.product)
        return axios.get(`/api/products?category=${r.data.product.category}&limit=4&exclude=${id}`)
      })
      .then(r => setRelated(r.data.products || []))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-6 rounded w-full" style={{ width: `${60 + i * 8}%` }} />)}
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-32">
      <p className="text-2xl text-devotion-brown font-display">Product not found</p>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to Shop</Link>
    </div>
  )

  const images = product.images?.length ? product.images : ['https://via.placeholder.com/400']
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-cream-500 mb-8">
        <Link to="/" className="hover:text-saffron-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-saffron-600 transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/shop/${product.category}`} className="hover:text-saffron-600 transition-colors capitalize">
          {product.category?.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-devotion-brown line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative bg-cream-100 rounded-3xl overflow-hidden aspect-square">
            <img
              src={images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-saffron-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-saffron-400 shadow-warm' : 'border-cream-200 hover:border-saffron-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="section-subtitle mb-2">{product.category?.replace(/-/g, ' ')}</p>
          <h1 className="font-display text-3xl md:text-4xl text-devotion-brown mb-4 leading-snug">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16}
                  className={i < Math.round(product.rating || 4) ? 'text-saffron-400 fill-saffron-400' : 'text-cream-300 fill-cream-300'} />
              ))}
            </div>
            <span className="text-sm text-cream-500">({product.reviewCount || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="font-display text-4xl text-devotion-brown font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-cream-400 line-through text-xl mb-1">₹{product.originalPrice}</span>
                <span className="bg-saffron-100 text-saffron-700 text-sm font-bold px-3 py-1 rounded-full mb-1">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="text-devotion-brown/80 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Specs */}
          <div className="bg-cream-50 rounded-2xl p-5 mb-8 grid grid-cols-2 gap-3">
            {[
              { icon: <Palette size={14} />, label: 'Colour',     value: product.colour },
              { icon: <Package size={14} />, label: 'Material',   value: product.material },
              { icon: <Ruler size={14} />,   label: 'Dimensions', value: product.dimensions },
              { icon: <Weight size={14} />,  label: 'Weight',     value: product.weight },
            ].filter(s => s.value).map((spec, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-saffron-500">{spec.icon}</span>
                <div>
                  <p className="text-xs text-cream-500">{spec.label}</p>
                  <p className="text-sm font-bold text-devotion-brown">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stock */}
          {product.stock !== undefined && (
            <p className={`text-sm font-bold mb-5 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </p>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-cream-100 rounded-full px-4 py-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-saffron-50 transition-colors font-bold">−</button>
              <span className="w-8 text-center font-bold text-devotion-brown">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-saffron-50 transition-colors font-bold">+</button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/919528078217?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
            target="_blank" rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-green-400 text-green-600 font-bold hover:bg-green-50 transition-colors text-sm">
            💬 Enquire on WhatsApp
          </a>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">You May Also Like</h2>
            <Link to={`/shop/${product.category}`} className="text-saffron-600 font-bold text-sm hover:text-saffron-700 flex items-center gap-1">
              View All <ArrowLeft size={14} className="rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
