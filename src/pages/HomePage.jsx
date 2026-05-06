import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import SEO from '../components/ui/SEO'

const CATEGORIES = [
  { label: 'Divine Idols',        slug: 'divine-idols', emoji: '🕉️', desc: 'Krishna, Radha, Ganesh & more',      from: 'from-amber-50',  to: 'to-orange-100',  border: 'border-orange-200', hover: 'hover:border-orange-400 hover:shadow-orange-100', text: 'text-orange-800' },
  { label: 'Festive Sets',        slug: 'festive-sets', emoji: '🎊',  desc: 'Leela sets for every occasion',      from: 'from-red-50',    to: 'to-pink-100',    border: 'border-red-200',    hover: 'hover:border-red-400 hover:shadow-red-100',     text: 'text-red-800' },
  { label: 'Home Décor',          slug: 'home-decor',   emoji: '🦚',  desc: 'Peacocks, elephants & wall art',     from: 'from-teal-50',   to: 'to-emerald-100', border: 'border-teal-200',   hover: 'hover:border-teal-400 hover:shadow-teal-100',   text: 'text-teal-800' },
  { label: 'Candles & Fragrance', slug: 'candles',      emoji: '🕯️', desc: 'Scented candles, attar & diffusers', from: 'from-purple-50', to: 'to-violet-100',  border: 'border-purple-200', hover: 'hover:border-purple-400 hover:shadow-purple-100',text: 'text-purple-800' },
  { label: 'Gift Sets',           slug: 'gift-sets',    emoji: '🎁',  desc: 'Curated hampers & special sets',     from: 'from-pink-50',   to: 'to-rose-100',    border: 'border-pink-200',   hover: 'hover:border-pink-400 hover:shadow-pink-100',   text: 'text-pink-800' },
  { label: 'Summer Collection',   slug: 'summer',       emoji: '☀️',  desc: 'Kash, lotus fountain & more',        from: 'from-yellow-50', to: 'to-amber-100',   border: 'border-yellow-200', hover: 'hover:border-yellow-400 hover:shadow-yellow-100',text: 'text-yellow-800' },
  { label: 'Kids & Toys',         slug: 'kids-toys',    emoji: '🪀',  desc: 'Wooden toys & rattles',              from: 'from-blue-50',   to: 'to-sky-100',     border: 'border-blue-200',   hover: 'hover:border-blue-400 hover:shadow-blue-100',   text: 'text-blue-800' },
  { label: 'Rangoli & Decor',     slug: 'rangoli',      emoji: '🎨',  desc: 'Rangoli mats & wall stickers',       from: 'from-lime-50',   to: 'to-green-100',   border: 'border-lime-200',   hover: 'hover:border-lime-400 hover:shadow-lime-100',   text: 'text-lime-800' },
]

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping',     desc: 'On all orders above ₹499', color: 'bg-orange-50 text-orange-500' },
  { icon: '🔄', title: '7-Day Returns',     desc: 'Easy hassle-free returns',  color: 'bg-blue-50 text-blue-500' },
  { icon: '🤝', title: 'Wholesale Welcome', desc: 'Bulk orders at best rates', color: 'bg-green-50 text-green-500' },
  { icon: '✅', title: '100% Authentic',    desc: 'Handcrafted with love',     color: 'bg-purple-50 text-purple-500' },
]

const SLIDES = [
  { tag: 'New Arrivals',        title: 'Bring the Divine', sub: 'Home',   desc: 'Handcrafted Krishna idols & MDF décor from the heart of Mathura', cta: 'Explore Collection', to: '/shop/divine-idols' },
  { tag: 'Summer Collection',   title: 'Fresh & Divine',   sub: 'Summer', desc: 'New Kash Bangla, Lotus Fountain & Phool Petika — perfect for the season', cta: 'Shop Summer', to: '/shop/summer' },
  { tag: 'Wholesale Available', title: 'Retail & Bulk',    sub: 'Orders', desc: 'Whether one or a hundred, we serve you with equal devotion and care', cta: 'Shop Now', to: '/shop' },
]

const FESTIVALS = [
  { name: 'Janmashtami', icon: '🎉', desc: 'Makhan Chor sets, Dahi Handi décor, Bal Krishna idols & Ashta Sakhi figurines.', from: 'from-yellow-900', to: 'to-devotion-dark', accent: 'text-yellow-300', badge: 'Most Popular', slug: 'festive-sets' },
  { name: 'Navratri',    icon: '🌺', desc: 'Nav Durga sets, colourful décor & festive accessories for nine divine nights.',   from: 'from-red-900',    to: 'to-devotion-dark', accent: 'text-red-300',    badge: 'New Collection',slug: 'festive-sets' },
  { name: 'Diwali',      icon: '🪔', desc: 'Ganesh-Laxmi idols, scented candles, rangoli mats & premium gift hampers.',      from: 'from-orange-900', to: 'to-devotion-dark', accent: 'text-orange-300', badge: 'Best Gifting',  slug: 'gift-sets' },
]

const SUMMER_ITEMS = [
  {
    icon: '🌾', name: 'Kash Bangla',    material: 'KASH',
    desc: 'Natural kash grass décor — fresh summer vibes',
    from: 'from-yellow-50', to: 'to-amber-100', border: 'border-yellow-200',
    iconBg: 'bg-yellow-100', badge: 'bg-yellow-100 text-yellow-700',
  },
  {
    icon: '💧', name: 'Lotus Fountain', material: 'PLASTIC',
    desc: 'Beautiful lotus fountain for home & garden',
    from: 'from-blue-50', to: 'to-cyan-100', border: 'border-blue-200',
    iconBg: 'bg-blue-100', badge: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '🌸', name: 'Phool Petika',   material: 'WOOD',
    desc: 'Wooden flower basket — elegant summer décor',
    from: 'from-pink-50', to: 'to-rose-100', border: 'border-pink-200',
    iconBg: 'bg-pink-100', badge: 'bg-pink-100 text-pink-700',
  },
]

const GIFT_SETS = [
  { icon: '🌼', name: 'Kamal Cow Set',   desc: 'Divine cow with lotus — perfect for home mandir gifting', price: '₹499', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
  { icon: '🎋', name: 'Krishna Kamal',   desc: 'Krishna with lotus — a blessed gifting choice',           price: '₹549', color: 'bg-green-50 border-green-200 hover:border-green-400' },
  { icon: '🥘', name: 'Rasoi Leela Set', desc: "Lord Krishna's kitchen leela in wood",                    price: '₹599', color: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
  { icon: '💒', name: 'Vivha Khel Set',  desc: 'Beautiful wedding décor wooden set',                      price: '₹649', color: 'bg-pink-50 border-pink-200 hover:border-pink-400' },
]

const CANDLES = [
  { icon: '🌻', name: 'Sunflower Candle', desc: 'Cheerful sunflower shaped scented candle',   color: 'bg-yellow-500/10 border-yellow-500/20' },
  { icon: '🍬', name: 'Ladoo Candle',     desc: 'Playful ladoo shaped — perfect gifting',      color: 'bg-pink-500/10 border-pink-500/20' },
  { icon: '🕯️', name: 'Pillar Candle',   desc: 'Classic pillar with divine fragrance',         color: 'bg-amber-500/10 border-amber-500/20' },
  { icon: '🌹', name: 'Rose Attar',       desc: 'Car bottle attar in rose fragrance',           color: 'bg-red-500/10 border-red-500/20' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const FALLBACK_IMG = 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'
const LOGO_IMG = FALLBACK_IMG

function getImageScore(product) {
  const img = product.images?.[0]
  if (!img) return 0
  // Highest priority: real product photos (not logo, not placeholder)
  if (img.includes('res.cloudinary.com') &&
      !img.includes('Radhe_Image_Logo') &&
      !img.includes('Radhe_Bloom') &&
      !img.includes('placehold') &&
      !img.includes('placeholder')) return 3
  // Medium: has cloudinary logo (better than nothing)
  if (img.includes('res.cloudinary.com')) return 2
  // Low: placeholder text image
  if (img.includes('placehold') || img.includes('placeholder')) return 1
  return 0
}

function sortProductsByImage(products) {
  return [...products].sort((a, b) => getImageScore(b) - getImageScore(a))
}

export default function HomePage() {
  const [slide, setSlide]       = useState(0)
  const [featured, setFeatured] = useState([])
  const [newArr, setNewArr]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('featured')

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=8')
      .then(r => setFeatured(sortProductsByImage(r.data.products || [])))
      .catch(() => {})
    axios.get('/api/products?sort=newest&limit=8')
      .then(r => { setNewArr(sortProductsByImage(r.data.products || [])); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const s    = SLIDES[slide]
  const list = tab === 'featured' ? featured : newArr

  return (
    <div>
      <SEO />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-devotion-dark">
        {/* Video — outside AnimatePresence so it keeps playing across slides */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://res.cloudinary.com/dayndbxgi/image/upload/v1774607749/Screenshot_from_2026-03-27_16-03-42_aleru2.png"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://res.cloudinary.com/dayndbxgi/video/upload/q_auto/f_auto/v1774610918/Radhe_Krishna_Abhishek_iwleuj.mp4" type="video/mp4" />
        </video>
        {/* Overlay changes subtly per slide */}
        <motion.div
          key={`overlay-${slide}`}
          className="absolute inset-0"
          style={{ backgroundColor: ['rgba(0,0,0,0.45)', 'rgba(10,5,0,0.50)', 'rgba(5,0,10,0.48)'][slide] }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #f97f0a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 w-full py-16 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={slide} className="max-w-2xl"
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <motion.span className="text-saffron-400 text-xs uppercase tracking-[4px] font-bold flex items-center gap-2 mb-5"
                initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Sparkles size={12} /> {s.tag}
              </motion.span>
              <motion.h1 className="font-display text-6xl md:text-7xl text-white leading-none mb-2"
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                {s.title}
              </motion.h1>
              <motion.h1 className="font-display text-6xl md:text-7xl text-saffron-400 leading-none mb-6 italic"
                initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                {s.sub}
              </motion.h1>
              <motion.p className="text-cream-200 text-lg mb-8 max-w-lg"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                {s.desc}
              </motion.p>
              <motion.div className="flex gap-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                  <Link to={s.to} className="btn-primary text-base px-8 py-4">{s.cta} <ArrowRight size={18} /></Link>
                </motion.div>
                <motion.a whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                  href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-colors text-base font-bold">
                  💬 WhatsApp Us
                </motion.a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <motion.button key={i} onClick={() => setSlide(i)}
              animate={{ width: i === slide ? 32 : 8, backgroundColor: i === slide ? '#ffa030' : 'rgba(255,255,255,0.4)' }}
              transition={{ duration: 0.3 }} className="h-2 rounded-full" />
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <motion.section className="bg-white border-y border-cream-200"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="flex items-center gap-3 px-6 py-5 border-r border-cream-200 last:border-0">
                <motion.div className={`w-10 h-10 rounded-full ${f.color} flex items-center justify-center text-xl shrink-0`}
                  whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring', stiffness: 300 }}>
                  {f.icon}
                </motion.div>
                <div>
                  <p className="font-bold text-devotion-brown text-sm">{f.title}</p>
                  <p className="text-xs text-cream-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="section-subtitle mb-3">✦ Our Collections ✦</p>
          <h2 className="section-title">Shop by Category</h2>
        </motion.div>
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} variants={fadeUp} custom={i}
              whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
              <Link to={'/shop/' + cat.slug}
                className={`group bg-gradient-to-br ${cat.from} ${cat.to} border-2 ${cat.border} ${cat.hover} rounded-3xl p-5 transition-all duration-300 block h-full hover:shadow-lg`}>
                <motion.div className="text-4xl mb-3"
                  whileHover={{ scale: 1.25, rotate: [-8, 8, -4, 0] }} transition={{ duration: 0.5 }}>
                  {cat.emoji}
                </motion.div>
                <h3 className={`font-display text-base ${cat.text} mb-1 leading-snug font-bold`}>{cat.label}</h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <ArrowRight size={14} className={`${cat.text} mt-3 opacity-70`} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── SUMMER COLLECTION ── */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">☀️ New This Season</span>
            <h2 className="section-title">Summer Collection 2026</h2>
            <p className="text-devotion-brown/70 mt-3 max-w-xl mx-auto text-sm">Fresh, breezy & divine — nature-inspired décor for your sacred spaces.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {SUMMER_ITEMS.map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${item.from} ${item.to} rounded-3xl p-7 border-2 ${item.border} hover:shadow-lg transition-all`}>
                <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center text-4xl mb-4`}>
                  <motion.span
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
                    {item.icon}
                  </motion.span>
                </div>
                <span className={`inline-block ${item.badge} text-xs px-3 py-1 rounded-full mb-3 font-bold uppercase`}>
                  {item.material}
                </span>
                <h3 className="font-display text-xl text-devotion-brown mb-2">{item.name}</h3>
                <p className="text-devotion-brown/70 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/shop/summer" className="btn-primary px-10 py-4 text-base">
                Shop Summer Collection <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FESTIVAL COLLECTIONS ── */}
      <section className="py-20 bg-devotion-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #f97f0a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">✦ Seasonal Specials ✦</p>
            <h2 className="font-display text-4xl text-white">Festival Collections</h2>
            <p className="text-cream-300 mt-3 max-w-xl mx-auto text-sm">Celebrate every divine occasion with our specially curated festival collections.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {FESTIVALS.map((fest, i) => (
              <motion.div key={fest.name} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.3 }}>
                <Link to={`/shop/${fest.slug}`}
                  className={`group relative bg-gradient-to-br ${fest.from} ${fest.to} rounded-3xl p-8 overflow-hidden block`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">{fest.badge}</span>
                  <div className="text-6xl mb-4">{fest.icon}</div>
                  <h3 className={`font-display text-3xl mb-3 ${fest.accent}`}>{fest.name}</h3>
                  <p className="text-cream-200 text-sm leading-relaxed mb-6">{fest.desc}</p>
                  <motion.div className="flex items-center gap-2 text-white font-bold text-sm"
                    whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                    Shop Collection <ArrowRight size={16} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-subtitle mb-2">✦ Hand-picked ✦</p>
              <h2 className="section-title">Our Products</h2>
            </motion.div>
            <motion.div className="flex gap-2 bg-white rounded-full p-1 shadow-card"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {[['featured','Best Sellers'],['new','New Arrivals']].map(([k,l]) => (
                <motion.button key={k} onClick={() => setTab(k)} whileTap={{ scale: 0.93 }}
                  className={"px-5 py-2 rounded-full text-sm font-bold transition-all " +
                    (tab === k ? 'bg-saffron-500 text-white shadow-warm' : 'text-devotion-brown hover:bg-cream-100')}>
                  {l}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="bg-white p-4 space-y-2">
                    <div className="skeleton h-3 rounded w-1/2" />
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-4 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🌸</p>
              <p className="text-devotion-brown font-display text-xl">No products found</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={tab}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {list.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </motion.div>
            </AnimatePresence>
          )}

          <motion.div className="text-center mt-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/shop" className="btn-outline">View All Products <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── GIFTING + CANDLES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gift Sets */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="section-subtitle mb-3">✦ Perfect Presents ✦</p>
            <h2 className="section-title mb-4">Gift Sets & Hampers</h2>
            <p className="text-devotion-brown/70 leading-relaxed mb-7 text-sm">
              Curated divine gifts for weddings, housewarming, festivals & corporate gifting — beautifully packaged with love from Mathura.
            </p>
            <div className="space-y-3 mb-8">
              {GIFT_SETS.map((g, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 border-2 ${g.color} rounded-2xl p-4 transition-all cursor-pointer`}>
                  <motion.span className="text-3xl" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: 'spring' }}>{g.icon}</motion.span>
                  <div className="flex-1">
                    <p className="font-bold text-devotion-brown text-sm">{g.name}</p>
                    <p className="text-xs text-cream-500">{g.desc}</p>
                  </div>
                  <span className="font-display text-saffron-600 font-bold text-sm shrink-0">{g.price}</span>
                </motion.div>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/shop/gift-sets" className="btn-primary">Explore Gift Sets <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>

          {/* Candles */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-gradient-to-br from-purple-900 via-violet-900 to-devotion-dark rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-purple-500/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-saffron-500/10 translate-y-1/2 -translate-x-1/4" />
              <p className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3 relative z-10">✦ New Category ✦</p>
              <h3 className="font-display text-3xl text-white mb-2 relative z-10">Candles & Fragrance</h3>
              <p className="text-purple-200 text-sm mb-7 relative z-10">Fill your home with divine aromas — scented candles, natural attar & premium diffusers.</p>
              <motion.div className="grid grid-cols-2 gap-3 mb-8 relative z-10"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                {CANDLES.map((c, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i}
                    whileHover={{ scale: 1.05 }}
                    className={`${c.color} border rounded-2xl p-4 transition-all`}>
                    <motion.span className="text-3xl block mb-2"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}>
                      {c.icon}
                    </motion.span>
                    <p className="text-white font-bold text-xs">{c.name}</p>
                    <p className="text-purple-300 text-xs mt-1">{c.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="relative z-10 inline-block">
                <Link to="/shop/candles" className="flex items-center gap-2 bg-saffron-500 text-white font-bold px-6 py-3 rounded-full hover:bg-saffron-600 transition-colors text-sm">
                  Shop Candles & Fragrance <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ── */}
      <section className="py-20 bg-gradient-to-br from-cream-100 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div className="relative"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-white rounded-3xl overflow-hidden aspect-square shadow-warm">
                <img src={FALLBACK_IMG} alt="About Radhe Bloom" className="w-full h-full object-contain p-10" />
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -right-5 bg-saffron-500 text-white rounded-2xl px-5 py-4 shadow-warm-lg">
                <p className="font-display text-3xl font-bold">5000+</p>
                <p className="text-saffron-100 text-xs">Happy Customers</p>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-5 bg-devotion-dark text-white rounded-2xl px-5 py-4 shadow-warm-lg">
                <p className="font-display text-3xl font-bold text-saffron-400">15+</p>
                <p className="text-cream-300 text-xs">Years of Craft</p>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="section-subtitle mb-3">✦ Our Story ✦</p>
              <h2 className="section-title mb-6">Born in Mathura,<br /><span className="text-saffron-500 italic">Loved Across India</span></h2>
              <p className="text-devotion-brown/80 leading-relaxed mb-5">
                Radhe Bloom was founded in the sacred city of Mathura with one dream — to bring the divine beauty of handcrafted devotional art into every home.
              </p>
              <p className="text-devotion-brown/80 leading-relaxed mb-8">
                From MDF idols to scented candles, summer décor to gifting sets — every piece carries the spirit of Mathura and the hands of our artisans.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value:'500+', label:'Products',    color:'bg-orange-50 border-orange-200 text-orange-600' },
                  { value:'15+',  label:'Years',       color:'bg-purple-50 border-purple-200 text-purple-600' },
                  { value:'100%', label:'Handcrafted', color:'bg-green-50 border-green-200 text-green-600' },
                ].map((stat, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.06 }}
                    className={`${stat.color} border-2 rounded-2xl p-4 text-center transition-all`}>
                    <p className="font-display text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs mt-1 opacity-70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link to="/about" className="btn-primary">Read Our Full Story <ArrowRight size={16} /></Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 bg-devotion-dark">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">✦ Our Promise ✦</p>
            <h2 className="font-display text-4xl text-white">Why Choose Radhe Bloom?</h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { no:'01', title:'Authentic Craftsmanship', desc:'Every piece handcrafted by skilled artisans.',       border:'border-orange-500/40 hover:border-orange-400' },
              { no:'02', title:'Vibrant UV Printing',     desc:'Fade-resistant colours on all MDF products.',        border:'border-yellow-500/40 hover:border-yellow-400' },
              { no:'03', title:'Retail & Wholesale',      desc:'One piece or a thousand — same love and pricing.',   border:'border-green-500/40 hover:border-green-400' },
              { no:'04', title:'Vastu Compliant',         desc:'Idols following Vastu principles for positivity.',   border:'border-purple-500/40 hover:border-purple-400' },
            ].map((item, i) => (
              <motion.div key={item.no} variants={fadeUp} custom={i}
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.10)' }}
                className={`bg-white/5 border-2 ${item.border} rounded-3xl p-6 transition-all cursor-default`}>
                <span className="font-display text-4xl text-saffron-500/30 font-bold block mb-3">{item.no}</span>
                <h4 className="font-display text-white text-lg mb-2">{item.title}</h4>
                <p className="text-cream-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section className="py-16 bg-saffron-500 relative overflow-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h2 className="font-display text-4xl text-white mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Looking for Bulk Orders?
          </motion.h2>
          <motion.p className="text-saffron-100 text-lg mb-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Special rates for wholesale buyers. Contact us for a custom quote.
          </motion.p>
          <motion.a href="https://wa.me/919528078217?text=Hi%20Radhe%20Bloom%2C%20I'm%20interested%20in%20wholesale%20orders"
            target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.07, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-white text-saffron-600 font-bold px-10 py-4 rounded-full text-base">
            💬 WhatsApp for Wholesale
          </motion.a>
        </div>
      </motion.section>
    </div>
  )
}