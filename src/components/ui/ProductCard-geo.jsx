// frontend/src/components/ui/ProductCard.jsx
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { CountryContext } from '../../context/CountryContext'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart }                    = useCart()
  const { formatPrice, country }         = useContext(CountryContext)
  const [adding, setAdding]              = useState(false)
  const [countryPrices, setCountryPrices] = useState(product.countryPrices || null)

  // Fetch country prices when country changes (skip for India)
  useEffect(() => {
    if (country.code === 'IN') return
    axios.get(`/api/pricing/product/${product._id}`)
      .then(r => setCountryPrices(r.data.pricing?.prices || {}))
      .catch(() => {})
  }, [product._id, country.code])

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await addToCart(product, 1)
      toast.success('Added to cart!')
    } catch { toast.error('Failed to add') }
    finally { setAdding(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-warm transition-all duration-300"
    >
      <Link to={`/product/${product._id}`}>
        {/* Image */}
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && country.code === 'IN' && (
            <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          {product.badge && (
            <span className="absolute top-2 right-2 bg-devotion-dark text-saffron-400 text-xs font-bold px-2 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-saffron-500 uppercase font-bold tracking-wider mb-1">
            {product.category?.replace(/-/g, ' ')}
          </p>
          <h3 className="font-bold text-devotion-brown text-sm leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Stars */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11}
                  className={i < Math.round(product.rating)
                    ? 'text-saffron-400 fill-saffron-400'
                    : 'text-cream-300 fill-cream-300'} />
              ))}
              {product.reviewCount > 0 && (
                <span className="text-xs text-cream-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-display text-base font-bold text-devotion-brown">
                {formatPrice(product.price, countryPrices)}
              </span>
              {/* Show original crossed price only for India */}
              {country.code === 'IN' && product.originalPrice && (
                <span className="text-xs text-cream-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <motion.button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-saffron-50 hover:bg-saffron-500 text-saffron-500 hover:text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50"
            >
              <ShoppingCart size={14} />
            </motion.button>
          </div>

          {product.stock === 0 && (
            <p className="text-xs text-red-500 font-bold mt-1">Out of Stock</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}