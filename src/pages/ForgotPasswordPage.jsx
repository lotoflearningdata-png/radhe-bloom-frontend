import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Enter your email')
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="w-20 h-20 rounded-full bg-cream-50 border-2 border-cream-200 flex items-center justify-center overflow-hidden shadow-sm mx-auto">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
                alt="Radhe Bloom"
                className="w-18 h-18 object-contain"
              />
            </div>
          </Link>
          <h1 className="font-display text-3xl text-devotion-brown mt-4 mb-1">Forgot Password?</h1>
          <p className="text-cream-500 text-sm">No worries, we'll send you reset instructions</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-warm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={28} />
              </div>
              <h2 className="font-display text-xl text-devotion-brown mb-2">Check Your Email</h2>
              <p className="text-cream-500 text-sm mb-6">
                If an account exists for <strong className="text-devotion-brown">{email}</strong>,
                we've sent a password reset link. It expires in 30 minutes.
              </p>
              <button onClick={() => setSent(false)} className="text-sm text-saffron-600 font-bold hover:underline">
                Didn't get it? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com"
                    className="input-field pl-9"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center text-base disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-cream-500 mt-6">
          <Link to="/login" className="text-saffron-600 font-bold hover:text-saffron-700 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}