import { Link } from 'react-router-dom'
import { Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart()

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="text-7xl mb-6">🛕</div>
      <h2 className="font-display text-3xl text-devotion-brown mb-3">Your cart is empty</h2>
      <p className="text-cream-500 mb-8">Add some divine pieces to your collection</p>
      <Link to="/shop" className="btn-primary">Browse Products <ArrowRight size={16} /></Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product._id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-card">
              <img src={item.product.images?.[0] || 'https://via.placeholder.com/400'}
                alt={item.product.name} className="w-24 h-24 rounded-xl object-cover bg-cream-100" />
              <div className="flex-1">
                <Link to={`/product/${item.product._id}`}
                  className="font-display text-devotion-brown hover:text-saffron-700 transition-colors leading-snug block mb-1">
                  {item.product.name}
                </Link>
                <p className="text-xs text-saffron-500 uppercase tracking-wider mb-3">{item.product.category}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-cream-50 rounded-full px-3 py-1">
                    <button onClick={() => updateQty(item.product._id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-saffron-50 transition-colors text-sm">−</button>
                    <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.product._id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-saffron-50 transition-colors text-sm">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-lg font-bold text-devotion-brown">₹{(item.product.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.product._id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-card h-fit sticky top-28">
          <h3 className="font-display text-xl text-devotion-brown mb-5">Order Summary</h3>
          <div className="space-y-3 mb-5 text-sm">
            <div className="flex justify-between text-devotion-brown/70"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-devotion-brown/70">
              <span>Shipping</span><span className="text-green-600 font-bold">{cartTotal >= 499 ? 'FREE' : '₹49'}</span>
            </div>
            {cartTotal < 499 && (
              <p className="text-xs text-saffron-500 bg-saffron-50 rounded-xl p-2 text-center">
                Add ₹{(499 - cartTotal).toFixed(0)} more for free shipping!
              </p>
            )}
            <hr className="border-cream-200" />
            <div className="flex justify-between font-bold text-base text-devotion-brown">
              <span>Total</span>
              <span className="font-display text-xl">₹{(cartTotal + (cartTotal >= 499 ? 0 : 49)).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full justify-center text-base">Checkout <ArrowRight size={16} /></Link>
          <Link to="/shop" className="block text-center text-sm text-saffron-600 font-bold mt-3 hover:text-saffron-700">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
