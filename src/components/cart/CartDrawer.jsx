import { Link } from 'react-router-dom'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart()

  if (!cartOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-cream-50 z-50 shadow-2xl flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-saffron-500" size={22} />
            <h2 className="font-display text-xl text-devotion-brown">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-saffron-100 text-saffron-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.qty, 0)} items
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-cream-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛕</div>
              <p className="font-display text-xl text-devotion-brown mb-2">Your cart is empty</p>
              <p className="text-sm text-cream-500 mb-6">Add some divine pieces to your collection</p>
              <button onClick={() => setCartOpen(false)} className="btn-primary text-sm">
                Explore Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product._id} className="bg-white rounded-2xl p-3 flex gap-3 shadow-card">
                <img
                  src={item.product.images?.[0] || 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-cream-100"
                  onError={e => { e.target.src = 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png' }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm text-devotion-brown leading-snug line-clamp-2 mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-saffron-600 font-bold text-sm">₹{item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.product._id, item.qty - 1)}
                      className="w-7 h-7 rounded-full bg-cream-100 hover:bg-saffron-100 flex items-center justify-center transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.product._id, item.qty + 1)}
                      className="w-7 h-7 rounded-full bg-cream-100 hover:bg-saffron-100 flex items-center justify-center transition-colors">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.product._id)}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-cream-200 bg-white px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-devotion-brown">Subtotal</span>
              <span className="font-display text-xl text-devotion-brown font-bold">₹{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-cream-500 text-center">Shipping calculated at checkout</p>
            <Link to="/checkout" onClick={() => setCartOpen(false)}
              className="btn-primary w-full justify-center text-base">
              Proceed to Checkout
            </Link>
            <button onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-saffron-600 hover:text-saffron-700 font-bold py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}