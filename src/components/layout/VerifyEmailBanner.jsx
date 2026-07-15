import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { MailWarning } from 'lucide-react'

export default function VerifyEmailBanner() {
  const { user, resendVerification } = useAuth()
  const [sending, setSending] = useState(false)

  // Only local (email+password) accounts need verification
  if (!user || user.authProvider !== 'local' || user.emailVerified) return null

  const handleResend = async () => {
    setSending(true)
    try {
      const data = await resendVerification()
      toast.success(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send email. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-saffron-50 border-b border-saffron-200 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-devotion-brown">
        <MailWarning size={16} className="text-saffron-600 shrink-0" />
        <span>
          Please verify your email (<strong>{user.email}</strong>) to place orders.
        </span>
        <button onClick={handleResend} disabled={sending}
          className="text-saffron-600 font-bold hover:text-saffron-700 underline disabled:opacity-60">
          {sending ? 'Sending...' : 'Resend verification email'}
        </button>
      </div>
    </div>
  )
}
