import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',  to: '/admin',          icon: LayoutDashboard },
  { label: 'Orders',     to: '/admin/orders',   icon: ShoppingBag },
  { label: 'Products',   to: '/admin/products', icon: Package },
  { label: 'Customers',  to: '/admin/customers',icon: Users },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="font-display text-2xl text-devotion-brown mb-4">Admin Access Only</h2>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300
  ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed lg:flex`}
  style={{ backgroundColor: '#2d1200' }}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-cream-200/30 bg-cream-50 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
                alt="Logo"
                className="w-11 h-11 object-contain"
              />
            </div>
            <div>
              <p className="font-display text-white text-lg leading-none">Radhe Bloom</p>
              <p className="text-saffron-400 text-xs">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active ? 'bg-saffron-500 text-white' : 'text-cream-300 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={18} />
                <span className="font-body">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-saffron-500 flex items-center justify-center text-white font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{user.name}</p>
              <p className="text-cream-400 text-xs">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-cream-400 hover:text-red-400 transition-colors text-sm w-full">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sideOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-cream-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSideOpen(true)} className="lg:hidden p-2 hover:bg-cream-100 rounded-xl">
            <Menu size={20} />
          </button>
          <h1 className="font-display text-lg text-devotion-brown">
            {NAV.find(n => n.to === location.pathname)?.label || 'Admin'}
          </h1>
          <Link to="/" className="ml-auto text-xs text-saffron-600 hover:underline">← View Store</Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}