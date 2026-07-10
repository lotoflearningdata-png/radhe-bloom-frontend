import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate   = useNavigate()
  const [checking, setChecking] = useState(true)
  const [validToken, setValidToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [show, setShow]       = useState(false)
  const [form, setForm]       = useState({ password: '', confirm: '' })

  useEffect(() => {
    axios.get(`/api/auth/reset-password/${token}/validate`)
      .then(r => setValidToken(r.data.valid))
      .catch(() => setValidToken(false))
      .finally(() => setChecking(false))
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')

    setLoading(true)
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password: form.password })
      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
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
          <h1 className="font-display text-3xl text-devotion-brown mt-4 mb-1">Reset Password</h1>
          <p className="text-cream-500 text-sm">Create a new password for your account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-warm">

          {checking ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-saffron-200 border-t-saffron-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-cream-500 text-sm mt-3">Verifying reset link...</p>
            </div>
          ) : !validToken ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-500" size={28} />
              </div>
              <h2 className="font-display text-xl text-devotion-brown mb-2">Link Expired</h2>
              <p className="text-cream-500 text-sm mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password" className="btn-primary inline-flex">Request New Link</Link>
            </div>
          ) : success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={28} />
              </div>
              <h2 className="font-display text-xl text-devotion-brown mb-2">Password Reset!</h2>
              <p className="text-cream-500 text-sm">Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required minLength={6} placeholder="Min. 6 characters"
                    className="input-field pr-10"
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-saffron-500">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type={show ? 'text' : 'password'} value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  required minLength={6} placeholder="Re-enter password"
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center text-base mt-2 disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}