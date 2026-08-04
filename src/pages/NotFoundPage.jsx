import { Link } from 'react-router-dom'
import SEO from '../components/ui/SEO'
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <SEO title="Page Not Found" noindex />
      <div>
        <div className="text-8xl mb-6">🕉️</div>
        <h1 className="font-display text-5xl text-devotion-brown mb-3">404</h1>
        <p className="text-cream-500 mb-8">This path leads nowhere. Let's guide you back.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  )
}
