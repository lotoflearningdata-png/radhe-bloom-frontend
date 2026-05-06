import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, LogOut, Package, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const CATEGORIES = [
  { label: 'Divine Idols', to: '/shop/divine-idols' },
  { label: 'Festive Sets', to: '/shop/festive-sets' },
  { label: 'Home Décor', to: '/shop/home-decor' },
  { label: 'Candles & Fragrance', to: '/shop/candles' },
  { label: 'Gift Sets', to: '/shop/gift-sets' },
  { label: 'Summer Collection', to: '/shop/summer' },
  { label: 'Kids & Toys', to: '/shop/kids-toys' },
  { label: 'Rangoli & Decor', to: '/shop/rangoli' },
]

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'All Products', to: '/shop' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount, setCartOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false); setCatOpen(false) }, [location])

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate('/shop?q=' + encodeURIComponent(search.trim()))
      setSearch('')
      setSearchOpen(false)
    }
  }

  return (
    <>
      <div className="bg-saffron-500 text-white text-center text-xs py-2 px-4 tracking-wide">
        🌸 Free shipping on orders above ₹499 &nbsp;|&nbsp; Retail & Wholesale Welcome &nbsp;|&nbsp; WhatsApp: +91-9528078217
      </div>

      <nav className={"sticky top-0 z-50 transition-all duration-300 " + (scrolled ? 'bg-white shadow-warm py-1' : 'bg-cream-50 py-2')}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">

          {/* Logo */}
<Link to="/" className="flex items-center gap-3 shrink-0">
  <div className="w-14 h-14 rounded-full border-2 border-cream-200 bg-cream-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
    <img
      src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
      alt="Radhe Bloom Logo"
      className="w-13 h-13 object-contain"
    />
  </div>
  <div className="hidden sm:block">
    <span className="font-display text-xl text-devotion-brown leading-none block">Radhe Bloom</span>
    <span className="text-xs text-saffron-500 tracking-widest uppercase">Divine Creations</span>
  </div>
</Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}
                className={"px-3 py-2 rounded-full text-sm transition-all duration-150 " + (
                  location.pathname === l.to
                    ? 'bg-saffron-100 text-saffron-700 font-bold'
                    : 'text-devotion-brown hover:bg-cream-100 hover:text-saffron-600'
                )}>
                {l.label}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div ref={catRef} className="relative">
              <button onClick={() => setCatOpen(!catOpen)}
                className={"flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all duration-150 " + (
                  catOpen ? 'bg-saffron-100 text-saffron-700 font-bold' : 'text-devotion-brown hover:bg-cream-100 hover:text-saffron-600'
                )}>
                Shop <ChevronDown size={14} className={"transition-transform " + (catOpen ? 'rotate-180' : '')} />
              </button>

              {catOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-warm-lg border border-cream-200 py-2 w-52 z-50">
                  <p className="text-xs font-bold text-cream-400 uppercase tracking-wider px-4 py-1.5">Categories</p>
                  {CATEGORIES.map(cat => (
                    <Link key={cat.to} to={cat.to}
                      className="block px-4 py-2 text-sm text-devotion-brown hover:bg-saffron-50 hover:text-saffron-700 transition-colors">
                      {cat.label}
                    </Link>
                  ))}
                  <hr className="border-cream-200 my-1" />
                  <Link to="/shop"
                    className="block px-4 py-2 text-sm font-bold text-saffron-600 hover:bg-saffron-50 transition-colors">
                    View All Products →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-cream-100 text-devotion-brown transition-colors">
              <Search size={20} />
            </button>

            <button onClick={() => setCartOpen(true)}
              className="p-2 rounded-full hover:bg-cream-100 text-devotion-brown transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-saffron-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-saffron-100 text-saffron-700 hover:bg-saffron-200 transition-colors text-sm font-bold">
                  <User size={15} /> {user.name.split(' ')[0]}
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block z-50 pt-2">
                  <div className="bg-white rounded-2xl shadow-warm-lg border border-cream-200 py-2 w-48">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream-50 text-devotion-brown">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream-50 text-devotion-brown">
                      <Package size={14} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream-50 text-saffron-600 font-bold">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <hr className="border-cream-200 my-1" />
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-cream-50 text-red-500 w-full">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-full bg-saffron-500 text-white text-sm font-bold hover:bg-saffron-600 transition-colors shadow-warm">
                <User size={15} /> Login
              </Link>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-full hover:bg-cream-100 text-devotion-brown">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-cream-200 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search idols, toys, decor..." className="input-field text-sm" />
              <button type="submit" className="btn-primary text-sm px-5 py-2">Search</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-cream-200 bg-white px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="block px-4 py-2.5 rounded-xl text-devotion-brown hover:bg-cream-50 hover:text-saffron-600 font-medium">
                {l.label}
              </Link>
            ))}
            <p className="text-xs font-bold text-cream-400 uppercase tracking-wider px-4 pt-3 pb-1">Categories</p>
            {CATEGORIES.map(cat => (
              <Link key={cat.to} to={cat.to} className="block px-4 py-2 rounded-xl text-devotion-brown hover:bg-cream-50 hover:text-saffron-600 text-sm">
                {cat.label}
              </Link>
            ))}
            <hr className="border-cream-200 my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl text-devotion-brown hover:bg-cream-50">Dashboard</Link>
                <Link to="/orders" className="block px-4 py-2.5 rounded-xl text-devotion-brown hover:bg-cream-50">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 rounded-xl text-saffron-600 font-bold hover:bg-saffron-50">⚙️ Admin Panel</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2.5 rounded-xl text-saffron-600 font-bold">Login / Register</Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}