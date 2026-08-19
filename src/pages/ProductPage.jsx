import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ShoppingBag, ArrowLeft, Star, Package, Ruler, Palette, ChevronLeft, ChevronRight, Heart, ZoomIn, X, Play } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import SEO from '../components/ui/SEO'
import ProductCard from '../components/ui/ProductCard-geo'
import { useCountry } from '../context/CountryContext'
import { thumbUrl, detailUrl } from '../utils/image'

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [qty, setQty] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [lightbox, setLightbox] = useState({ open: false, zoomed: false, x: 50, y: 50 })
  const { formatPrice, country } = useCountry()
  const [countryPrices, setCountryPrices] = useState(null)

  // Fetch admin-set country prices for non-India visitors
  useEffect(() => {
    if (!product || country.code === 'IN') return
    axios.get(`/api/pricing/product/${product._id}`)
      .then(r => setCountryPrices(r.data.pricing?.prices || {}))
      .catch(() => setCountryPrices({}))
  }, [product?._id, country.code])

  useEffect(() => {
    if (!lightbox.open) return
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(l => ({ ...l, open: false, zoomed: false }))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox.open])

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    axios.get(`/api/products/${id}`)
      .then(r => {
        setProduct(r.data.product)
        setSelectedColor(null)
        setSelectedSize(null)
        setShowVideo(false)
        setImgIdx(0)
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
  const hasSizes = product.sizeVariants?.length > 0
  const selectedVariant = hasSizes ? product.sizeVariants.find(v => v.label === selectedSize) : null
  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const discount = !hasSizes && product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SEO
        title={product.name}
        description={product.description ? product.description.slice(0, 160) : `Buy ${product.name} online from Radhe Bloom — handcrafted devotional décor, delivered across India.`}
        image={images[0]}
        url={`https://www.radhebloom.com/product/${product._id}`}
        type="product"
        product={product}
      />
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
          {showVideo && product.videoUrl ? (
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-square">
              <video
                src={product.videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div
              className="relative bg-cream-100 rounded-3xl overflow-hidden aspect-square cursor-zoom-in"
              onClick={() => setLightbox({ open: true, zoomed: false, x: 50, y: 50 })}
            >
              <img
                src={detailUrl(images[imgIdx])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 right-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow pointer-events-none">
                <ZoomIn size={18} className="text-devotion-brown" />
              </span>
              {discount && (
                <span className="absolute top-4 left-4 bg-saffron-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          )}
          {(images.length > 1 || product.videoUrl) && (
            <div className="flex gap-3">
              {product.videoUrl && (
                <button onClick={() => setShowVideo(true)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-devotion-dark flex items-center justify-center ${showVideo ? 'border-saffron-400 shadow-warm' : 'border-cream-200 hover:border-saffron-200'}`}>
                  <Play size={20} className="text-saffron-400 fill-saffron-400" />
                </button>
              )}
              {images.map((img, i) => (
                <button key={i} onClick={() => { setImgIdx(i); setShowVideo(false) }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${!showVideo && i === imgIdx ? 'border-saffron-400 shadow-warm' : 'border-cream-200 hover:border-saffron-200'}`}>
                  <img src={thumbUrl(img, 200)} alt={`${product.name} thumbnail ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
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
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16}
                    className={i < Math.round(product.rating) ? 'text-saffron-400 fill-saffron-400' : 'text-cream-300 fill-cream-300'} />
                ))}
              </div>
              <span className="text-sm text-cream-500">({product.reviewCount || 0} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl text-devotion-brown font-bold">
                {hasSizes && !selectedVariant
                  ? `From ${formatPrice(Math.min(...product.sizeVariants.map(v => v.price)), {})}`
                  : formatPrice(displayPrice, selectedVariant ? {} : countryPrices)}
              </span>
              {!hasSizes && product.originalPrice && country.code === 'IN' && (
                <>
                  <span className="text-cream-400 line-through text-xl mb-1">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-saffron-100 text-saffron-700 text-sm font-bold px-3 py-1 rounded-full mb-1">Save {discount}%</span>
                </>
              )}
            </div>

            {/* USD disclaimer */}
            {country.code !== 'IN' && (
              <p className="text-xs text-cream-500 mt-1">
                * Displayed in USD for reference. Payment processed in INR via Razorpay.
              </p>
            )}
          </div>

          <p className="text-devotion-brown/80 leading-relaxed mb-8 text-sm">{product.description}</p>

          {/* Specs */}
          <div className="bg-cream-50 rounded-2xl p-5 mb-8 grid grid-cols-2 gap-3">
            {[
              { icon: <Palette size={14} />, label: 'Colour', value: product.colour },
              { icon: <Package size={14} />, label: 'Material', value: product.material },
              { icon: <Ruler size={14} />, label: 'Dimensions', value: product.dimensions },
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
              {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
            </p>
          )}

          {/* Colour variants */}
          {product.colorVariants?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-devotion-brown/70 uppercase tracking-wider mb-2">
                Colour{selectedColor ? <span className="text-saffron-600 normal-case"> — {selectedColor}</span> : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colorVariants.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={"px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all " + (
                      selectedColor === c
                        ? 'bg-saffron-500 border-saffron-500 text-white shadow-warm'
                        : 'border-cream-200 text-devotion-brown hover:border-saffron-300'
                    )}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size variants */}
          {product.sizeVariants?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-devotion-brown/70 uppercase tracking-wider mb-2">
                Size{selectedSize ? <span className="text-saffron-600 normal-case"> — {selectedSize}</span> : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizeVariants.map(s => (
                  <button key={s.label} onClick={() => setSelectedSize(s.label)}
                    className={"px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all " + (
                      selectedSize === s.label
                        ? 'bg-saffron-500 border-saffron-500 text-white shadow-warm'
                        : 'border-cream-200 text-devotion-brown hover:border-saffron-300'
                    )}>
                    {s.label} <span className={selectedSize === s.label ? 'text-white/80' : 'text-cream-500'}>· {formatPrice(s.price, {})}</span>
                  </button>
                ))}
              </div>
            </div>
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
              onClick={() => {
                if (product.colorVariants?.length > 0 && !selectedColor) {
                  return toast.error('Please select a colour first')
                }
                if (product.sizeVariants?.length > 0 && !selectedSize) {
                  return toast.error('Please select a size first')
                }
                addToCart(product, qty, selectedColor, selectedSize, selectedVariant ? selectedVariant.price : null)
              }}
              disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              className={"w-11 h-11 shrink-0 rounded-full border-2 flex items-center justify-center transition-all " + (
                isWishlisted(product._id)
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'border-cream-200 text-devotion-brown hover:border-red-200 hover:text-red-500'
              )}
            >
              <Heart size={19} className={isWishlisted(product._id) ? 'fill-current' : ''} />
            </button>
          </div>
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

      {/* Image Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(l => ({ ...l, open: false, zoomed: false }))}
        >
          <button
            aria-label="Close"
            onClick={() => setLightbox(l => ({ ...l, open: false, zoomed: false }))}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <div className="overflow-hidden max-w-[92vw] max-h-[88vh]" onClick={e => e.stopPropagation()}>
            <img
              src={detailUrl(images[imgIdx], 1600)}
              alt={product.name}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                setLightbox(l => ({
                  ...l,
                  zoomed: !l.zoomed,
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                }))
              }}
              className={`max-w-[92vw] max-h-[88vh] object-contain transition-transform duration-200 ${lightbox.zoomed ? 'scale-[2.5] cursor-zoom-out' : 'cursor-zoom-in'}`}
              style={lightbox.zoomed ? { transformOrigin: `${lightbox.x}% ${lightbox.y}%` } : undefined}
            />
          </div>
          {images.length > 1 && (
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {imgIdx + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
