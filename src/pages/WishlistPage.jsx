import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ui/ProductCard-currency'

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="text-7xl mb-6">💛</div>
      <h1 className="font-display text-3xl text-devotion-brown mb-3">Your wishlist is empty</h1>
      <p className="text-cream-500 mb-8">Tap the heart on any product to save it here for later.</p>
      <Link to="/shop" className="btn-primary">Explore Products</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}
      </div>
    </div>
  )
}
