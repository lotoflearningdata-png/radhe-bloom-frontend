import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home',           to: '/' },
  { label: 'All Products',   to: '/shop' },
  { label: 'About Us',       to: '/about' },
  { label: 'Contact Us',     to: '/contact' },
]

const CATEGORIES = [
  { label: 'Divine Idols',        to: '/shop/divine-idols' },
  { label: 'Festive Sets',        to: '/shop/festive-sets' },
  { label: 'Gift Sets',           to: '/shop/gift-sets' },
  { label: 'Summer Collection',   to: '/shop/summer' },
  { label: 'Candles & Fragrance', to: '/shop/candles' },
  { label: 'Kids & Toys',         to: '/shop/kids-toys' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',   to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Shipping & Returns', to: '/shipping' },
]

export default function Footer() {
  return (
    <footer className="bg-devotion-dark text-cream-300">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-cream-50 border-2 border-cream-200/30 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
                  alt="Radhe Bloom"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <p className="font-display text-white text-lg leading-none">Radhe Bloom</p>
                <p className="text-saffron-400 text-xs tracking-widest uppercase">Divine Creations</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-cream-400 mb-5">
              Handcrafted devotional products from the sacred city of Mathura.
              Bringing divine art into every home since 2009.
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+919528078217" className="flex items-center gap-2 text-cream-400 hover:text-saffron-400 transition-colors">
                <Phone size={14} /> +91-9528078217
              </a>
              <a href="mailto:hello@radhebloom.in" className="flex items-center gap-2 text-cream-400 hover:text-saffron-400 transition-colors">
                <Mail size={14} /> hello@radhebloom.in
              </a>
              <div className="flex items-center gap-2 text-cream-400">
                <MapPin size={14} /> Mathura, Uttar Pradesh
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com/radhebloom" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-saffron-500 flex items-center justify-center transition-colors">
                <Instagram size={14} className="text-white" />
              </a>
              <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-green-500 flex items-center justify-center transition-colors">
                <span className="text-white text-xs font-bold">W</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white text-lg mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-cream-400 hover:text-saffron-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-white text-lg mb-5">Shop</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map(cat => (
                <li key={cat.to}>
                  <Link to={cat.to} className="text-sm text-cream-400 hover:text-saffron-400 transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wholesale CTA */}
          <div>
            <h3 className="font-display text-white text-lg mb-5">Wholesale</h3>
            <p className="text-sm text-cream-400 leading-relaxed mb-5">
              Bulk orders at special rates. Serving retailers, decorators and corporate buyers across India.
            </p>
            <a href="https://wa.me/919528078217?text=Hi%20Radhe%20Bloom%2C%20I'm%20interested%20in%20wholesale"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
              💬 WhatsApp for Wholesale
            </a>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              {['🔒 Secure Payments via Razorpay', '📦 Pan India Shipping', '✅ 100% Handcrafted'].map((badge, i) => (
                <p key={i} className="text-xs text-cream-500">{badge}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-xs text-cream-500 text-center sm:text-left">
              © {new Date().getFullYear()} Radhe Bloom. All rights reserved. | Mathura, Uttar Pradesh, India
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {LEGAL_LINKS.map((link, i) => (
                <span key={link.to} className="flex items-center gap-4">
                  <Link to={link.to} className="text-xs text-cream-500 hover:text-saffron-400 transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && <span className="text-white/20">|</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Grievance Officer one-liner */}
          <p className="text-xs text-cream-600 text-center mt-3">
            Grievance Officer: hello@radhebloom.in | +91-9528078217 | Response within 48 hours
            {' · '}
            <Link to="/terms#grievance" className="hover:text-saffron-400 transition-colors">View Details</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}