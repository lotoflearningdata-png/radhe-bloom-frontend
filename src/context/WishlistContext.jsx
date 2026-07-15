import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    if (user) fetchWishlist()
    else {
      const local = JSON.parse(localStorage.getItem('rb_wishlist') || '[]')
      setWishlist(local)
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist')
      setWishlist(data.products || [])
    } catch {}
  }

  const isWishlisted = (productId) => wishlist.some(p => p._id === productId)

  const toggleWishlist = async (product) => {
    const wasIn = isWishlisted(product._id)
    if (user) {
      try {
        const { data } = await axios.post('/api/wishlist/toggle', { productId: product._id })
        setWishlist(data.products)
      } catch (e) {
        toast.error(e.response?.data?.message || 'Could not update wishlist')
        return
      }
    } else {
      const updated = wasIn
        ? wishlist.filter(p => p._id !== product._id)
        : [...wishlist, product]
      setWishlist(updated)
      localStorage.setItem('rb_wishlist', JSON.stringify(updated))
    }
    toast.success(wasIn ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
