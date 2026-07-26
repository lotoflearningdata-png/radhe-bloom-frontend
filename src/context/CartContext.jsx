import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (user) fetchCart()
    else {
      const local = JSON.parse(localStorage.getItem('rb_cart') || '[]')
      setCart(local)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart')
      setCart(data.items || [])
    } catch {}
  }

  const sameItem = (i, productId, color, size) =>
    i.product._id === productId && (i.color || '') === (color || '') && (i.size || '') === (size || '')

  const addToCart = async (product, qty = 1, color = null, size = null, price = null) => {
    if (user) {
      try {
        const { data } = await axios.post('/api/cart/add', { productId: product._id, qty, color, size, price })
        setCart(data.items)
        toast.success('Added to cart 🛕')
      } catch (e) {
        toast.error(e.response?.data?.message || 'Error adding to cart')
      }
    } else {
      const existing = cart.find(i => sameItem(i, product._id, color, size))
      let updated
      if (existing) {
        updated = cart.map(i => sameItem(i, product._id, color, size) ? { ...i, qty: i.qty + qty } : i)
      } else {
        updated = [...cart, { product, qty, color: color || undefined, size: size || undefined, price: price ?? undefined }]
      }
      setCart(updated)
      localStorage.setItem('rb_cart', JSON.stringify(updated))
      toast.success('Added to cart 🛕')
    }
    setCartOpen(true)
  }

  const removeFromCart = async (productId, color = null, size = null) => {
    if (user) {
      const { data } = await axios.delete(`/api/cart/remove/${productId}?color=${encodeURIComponent(color || '')}&size=${encodeURIComponent(size || '')}`)
      setCart(data.items)
    } else {
      const updated = cart.filter(i => !sameItem(i, productId, color, size))
      setCart(updated)
      localStorage.setItem('rb_cart', JSON.stringify(updated))
    }
  }

  const updateQty = async (productId, qty, color = null, size = null) => {
    if (qty < 1) return removeFromCart(productId, color, size)
    if (user) {
      const { data } = await axios.put('/api/cart/update', { productId, qty, color, size })
      setCart(data.items)
    } else {
      const updated = cart.map(i => sameItem(i, productId, color, size) ? { ...i, qty } : i)
      setCart(updated)
      localStorage.setItem('rb_cart', JSON.stringify(updated))
    }
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('rb_cart')
  }

  const cartTotal = cart.reduce((sum, i) => sum + (i.price ?? i.product.price) * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
