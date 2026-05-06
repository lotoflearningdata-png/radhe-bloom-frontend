import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/ui/SEO'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 🙏')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[#E0C097] bg-white p-3 shadow-lg">         {/* <div className="w-16 h-16 rounded-full bg-saffron-gradient flex items-center justify-center text-white text-3xl shadow-warm-lg">🌸</div> */}
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774627131/Radhe_Image_Logo_v9wqgn.png"
                alt="Radhe Bloom Logo"
                className="block h-full w-auto object-contain"
              />
            </div>
            <span className="font-display text-2xl text-devotion-brown">Radhe Bloom</span>
          </Link>
          <h1 className="font-display text-3xl text-devotion-brown mt-4 mb-2">Welcome Back</h1>
          <p className="text-cream-500 text-sm">Login to your account</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-warm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-saffron-500">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base mt-2 disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* ← ADD THIS RIGHT HERE */}
            <p className="text-xs text-center text-cream-400 mt-3 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-saffron-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>.
            </p>
          </form>
          <p className="text-center text-sm text-cream-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron-600 font-bold hover:text-saffron-700">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
