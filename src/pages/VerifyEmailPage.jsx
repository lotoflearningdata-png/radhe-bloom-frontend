import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import SEO from '../components/ui/SEO'

export default function VerifyEmailPage() {
  const { token } = useParams()
  const { user, refreshUser, resendVerification } = useAuth()
  const [status, setStatus]   = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return // avoid double-run in StrictMode consuming the token twice
    ranRef.current = true
    axios.post(`/api/auth/verify-email/${token}`)
      .then(({ data }) => {
        setStatus('success')
        setMessage(data.message)
        if (user) refreshUser().catch(() => {})
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. Please try again.')
      })
  }, [token])

  const handleResend = async () => {
    setResending(true)
    try {
      const data = await resendVerification()
      setMessage(data.message)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not resend email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center px-4 py-16">
      <SEO title="Verify Email" noindex />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-warm text-center">
          {status === 'verifying' && (
            <>
              <Loader size={48} className="mx-auto text-saffron-500 animate-spin mb-4" />
              <h1 className="font-display text-2xl text-devotion-brown mb-2">Verifying your email...</h1>
              <p className="text-cream-500 text-sm">This will only take a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h1 className="font-display text-2xl text-devotion-brown mb-2">Email Verified!</h1>
              <p className="text-cream-500 text-sm mb-6">{message}</p>
              <Link to="/shop" className="btn-primary inline-flex justify-center">
                Start Shopping
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="font-display text-2xl text-devotion-brown mb-2">Verification Failed</h1>
              <p className="text-cream-500 text-sm mb-6">{message}</p>
              {user && !user.emailVerified ? (
                <button onClick={handleResend} disabled={resending}
                  className="btn-primary inline-flex justify-center disabled:opacity-60">
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              ) : (
                <Link to="/login" className="btn-primary inline-flex justify-center">
                  Go to Login
                </Link>
              )}
            </>
          )}
        </div>

        <p className="text-center text-sm text-cream-500 mt-6">
          <Link to="/" className="text-saffron-600 font-bold hover:text-saffron-700">← Back to Home</Link>
        </p>
      </div>
    </div>
  )
}
