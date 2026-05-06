import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const [step, setStep]           = useState('details') // 'details' | 'otp'
  const [loading, setLoading]     = useState(false)
  const [show, setShow]           = useState(false)
  const [otpSent, setOtpSent]     = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [otp, setOtp]             = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: ''
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Send OTP
  const handleSendOTP = async () => {
    if (!form.phone || form.phone.length < 10) {
      return toast.error('Enter a valid 10-digit phone number')
    }
    setLoading(true)
    try {
      await axios.post('/api/auth/send-otp', { phone: form.phone })
      setOtpSent(true)
      setStep('otp')
      toast.success('OTP sent to +91' + form.phone)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP')
    setLoading(true)
    try {
      await axios.post('/api/auth/verify-otp', { phone: form.phone, otp })
      setPhoneVerified(true)
      setStep('details')
      toast.success('Phone verified! ✅')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // Register
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!phoneVerified) return toast.error('Please verify your phone first')
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Account created! Welcome to Radhe Bloom 🌸')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-cream-50 border-2 border-cream-200 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
                alt="Radhe Bloom"
                className="w-18 h-18 object-contain"
              />
            </div>
            <span className="font-display text-2xl text-devotion-brown">Radhe Bloom</span>
          </Link>
          <h1 className="font-display text-3xl text-devotion-brown mt-4 mb-1">Create Account</h1>
          <p className="text-cream-500 text-sm">Join our community of devotees</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { label: 'Phone',      done: otpSent },
            { label: 'Verify OTP', done: phoneVerified },
            { label: 'Your Info',  done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                s.done
                  ? 'bg-green-100 text-green-700'
                  : (i === 1 && step === 'otp') || (i === 0 && step === 'details' && !otpSent) || (i === 2 && step === 'details' && otpSent)
                    ? 'bg-saffron-500 text-white'
                    : 'bg-cream-200 text-cream-500'
              }`}>
                {s.done && <CheckCircle size={10} />}
                {s.label}
              </div>
              {i < 2 && <div className="w-4 h-px bg-cream-300" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-warm">

          {/* ── OTP Step ── */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="text-saffron-500" size={24} />
                </div>
                <p className="font-display text-xl text-devotion-brown mb-1">Enter OTP</p>
                <p className="text-sm text-cream-500">
                  Sent to <span className="font-bold text-devotion-brown">+91 {form.phone}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="input-field text-center text-2xl tracking-[1rem] font-bold"
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full justify-center text-base disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify OTP ✅'}
              </button>

              <div className="text-center flex justify-center gap-4">
                <button
                  onClick={() => { setStep('details'); setOtp('') }}
                  className="text-sm text-cream-500 hover:text-saffron-600"
                >
                  ← Change Number
                </button>
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm text-saffron-600 font-bold hover:text-saffron-700"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* ── Details Step ── */}
          {step === 'details' && (
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Phone with OTP */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-cream-100 border border-cream-300 rounded-xl px-3 text-sm font-bold text-devotion-brown shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    disabled={phoneVerified}
                    className={"input-field flex-1 " + (phoneVerified ? 'bg-green-50 border-green-300 text-green-700' : '')}
                  />
                  {phoneVerified ? (
                    <div className="flex items-center gap-1 bg-green-100 text-green-600 px-3 rounded-xl shrink-0 text-sm font-bold">
                      <CheckCircle size={14} /> Verified
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || form.phone.length < 10}
                      className="bg-saffron-500 text-white px-4 rounded-xl text-sm font-bold hover:bg-saffron-600 disabled:opacity-50 shrink-0 transition-colors"
                    >
                      {loading ? '...' : 'Send OTP'}
                    </button>
                  )}
                </div>
                {!phoneVerified && (
                  <p className="text-xs text-cream-500 mt-1">OTP will be sent to verify your number</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Min. 6 characters"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-saffron-500"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !phoneVerified}
                className="btn-primary w-full justify-center text-base mt-2 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : !phoneVerified ? 'Verify Phone First' : 'Create Account 🌸'}
              </button>

              {/* ── CLICK-WRAP ── */}
              <p className="text-xs text-center text-cream-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-saffron-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>.
              </p>

              {!phoneVerified && (
                <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-xl p-2">
                  ⚠️ Please verify your phone number to continue
                </p>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-sm text-cream-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-saffron-600 font-bold hover:text-saffron-700">Login</Link>
        </p>
      </div>
    </div>
  )
}