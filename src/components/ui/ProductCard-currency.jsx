// frontend/src/components/ui/ProductCard.jsx
// Replace your existing ProductCard with this version
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useCurrency } from '../../context/CurrencyContext'
import { thumbUrl } from '../../utils/image'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart }   = useCart()
  const { formatPrice } = useCurrency()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [adding, setAdding] = useState(false)
  const wished = isWishlisted(product._id)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = async (e) => {
    if (product.colorVariants?.length > 0 || product.sizeVariants?.length > 0) {
      // let the card's Link navigate to the product page so a colour/size can be chosen
      const what = product.colorVariants?.length > 0 && product.sizeVariants?.length > 0
        ? 'a colour and size'
        : product.colorVariants?.length > 0 ? 'a colour' : 'a size'
      toast(`Choose ${what} on the product page`, { icon: '🎨' })
      return
    }
    e.preventDefault()
    setAdding(true)
    try {
      await addToCart(product, 1)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add')
    } finally {
      setAdding(false)
    }
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
            src={thumbUrl(product.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png')}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-saffron-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          {/* Wishlist + badge */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            <motion.button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
              whileTap={{ scale: 0.85 }}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className={"w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors " + (
                wished ? 'bg-red-500 text-white' : 'bg-white/90 text-devotion-brown hover:text-red-500'
              )}
            >
              <Heart size={15} className={wished ? 'fill-current' : ''} />
            </motion.button>
            {product.badge && (
              <span className="bg-devotion-dark text-saffron-400 text-xs font-bold px-2 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
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

          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Main price — uses currency context */}
              <span className="font-display text-base font-bold text-devotion-brown">
                {formatPrice(product.price)}
              </span>
              {/* Original price */}
              {product.originalPrice && (
                <span className="text-xs text-cream-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Add to cart */}
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