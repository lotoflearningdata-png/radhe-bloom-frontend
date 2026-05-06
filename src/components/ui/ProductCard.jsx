import { Link } from 'react-router-dom'
import { ShoppingBag, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'

const FALLBACK = 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null
  const imgSrc = product.images && product.images.length > 0 && product.images[0]
    ? product.images[0] : FALLBACK

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card-product group cursor-pointer"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden bg-cream-100 aspect-square">
          <motion.img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            onError={e => { e.target.onerror = null; e.target.src = FALLBACK }}
          />
          {discount && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute top-3 left-3 bg-saffron-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% OFF
            </motion.span>
          )}
          <motion.div className="absolute inset-0 bg-black/10"
            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-saffron-500 uppercase tracking-wider font-bold mb-1">{product.category}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display text-devotion-brown text-sm leading-snug mb-2 hover:text-saffron-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              className={i < Math.round(product.rating || 4) ? 'text-saffron-400 fill-saffron-400' : 'text-cream-300 fill-cream-300'} />
          ))}
          {product.reviewCount > 0 && <span className="text-xs text-cream-500 ml-1">({product.reviewCount})</span>}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-lg text-devotion-brown font-bold">₹{product.price}</span>
            {product.originalPrice && <span className="text-xs text-cream-400 line-through ml-2">₹{product.originalPrice}</span>}
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product)}
            className="w-9 h-9 rounded-full bg-saffron-50 hover:bg-saffron-500 text-saffron-600 hover:text-white flex items-center justify-center shadow-sm hover:shadow-warm transition-colors">
            <ShoppingBag size={15} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}