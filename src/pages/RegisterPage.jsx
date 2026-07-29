import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { register, setUserFromGoogle } = useAuth()
  const navigate   = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [loading, setLoading] = useState(false)
  const [show, setShow]       = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const googleBtnRef = useRef(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // ── Email + Password Register ───────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created! Check your inbox to verify your email', { duration: 6000 })
      navigate(redirectTo)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Google Sign-In ───────────────────────────────────────────────
  const handleGoogleResponse = async (response) => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/google', { credential: response.credential })
      setUserFromGoogle(data.token, data.user)
      toast.success(`Welcome, ${data.user.name}!`)
      navigate(redirectTo)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!window.google || !googleBtnRef.current) return
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    })
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'outline',
      size: 'large',
      width: '100%',
      text: 'signup_with',
      shape: 'pill',
    })
  }, [])

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-cream-50 border-2 border-cream-200 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1783316490/WhatsApp_Image_2026-07-04_at_17.09.47_qbsied.jpg"
                alt="Radhe Bloom"
                className="w-18 h-18 object-contain"
              />
            </div>
            <span className="font-display text-2xl text-devotion-brown">Radhe Bloom</span>
          </Link>
          <h1 className="font-display text-3xl text-devotion-brown mt-4 mb-1">Create Account</h1>
          <p className="text-cream-500 text-sm">Join our community of devotees</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-warm">

          {/* Google Sign-Up Button */}
          <div ref={googleBtnRef} className="mb-5 flex justify-center"></div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-cream-200"></div>
            <span className="text-xs text-cream-400 font-bold uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-cream-200"></div>
          </div>

          {/* Register Form — name, email, password only */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} required placeholder="Your name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required minLength={6} placeholder="Min. 6 characters"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-saffron-500">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Click-wrap */}
            <p className="text-xs text-center text-cream-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-saffron-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-cream-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-saffron-600 font-bold hover:text-saffron-700">Login</Link>
        </p>
      </div>
    </div>
  )
}