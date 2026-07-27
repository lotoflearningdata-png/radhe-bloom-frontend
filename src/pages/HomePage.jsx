import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard-currency'
import SEO from '../components/ui/SEO'
import CategorySection from '../components/ui/CategorySection' // Imported new component
import ShortsSection from '../components/ui/ShortsSection'
import { bestProductImage } from '../utils/bestImage'
import { thumbUrl } from '../utils/image'

const FEATURES = [
  { icon: '🚚', title: 'Free Shipping',     desc: 'On all orders above ₹999', color: 'bg-orange-50 text-orange-500' },
  { icon: '🔄', title: '24–48 Hr Returns',  desc: 'Easy hassle-free returns',  color: 'bg-blue-50 text-blue-500' },
  { icon: '🤝', title: 'Wholesale Welcome', desc: 'Bulk orders at best rates', color: 'bg-green-50 text-green-500' },
  { icon: '✅', title: '100% Authentic',    desc: 'Handcrafted with love',     color: 'bg-purple-50 text-purple-500' },
]

const SLIDES = [
  { tag: 'New Arrivals',        title: 'Bring the Divine', sub: 'Home',   desc: 'Handcrafted Krishna idols & MDF décor', cta: 'Explore Collection', to: '/shop/divine-idols' },
  { tag: 'Wholesale Available', title: 'Retail & Bulk',    sub: 'Orders', desc: 'Whether one or a hundred, we serve you with equal devotion and care', cta: 'Shop Now', to: '/shop' },
]

const FESTIVALS = [
  { name: 'Janmashtami', icon: '🎉', desc: 'Makhan Chor sets, Dahi Handi décor, Bal Krishna idols & Ashta Sakhi figurines.', from: 'from-yellow-900', to: 'to-devotion-dark', accent: 'text-yellow-300', badge: 'Most Popular', slug: 'janmashtami' },
  { name: 'Navratri',    icon: '🌺', desc: 'Nav Durga sets, colourful décor & festive accessories for nine divine nights.',   from: 'from-red-900',    to: 'to-devotion-dark', accent: 'text-red-300',    badge: 'New Collection',slug: 'festive-sets' },
  { name: 'Diwali',      icon: '🪔', desc: 'Ganesh-Laxmi idols, scented candles, rangoli mats & premium gift hampers.',       from: 'from-orange-900', to: 'to-devotion-dark', accent: 'text-orange-300', badge: 'Best Gifting',  slug: 'gift-sets' },
]

const GIFT_SETS = [
  { icon: '🌼', name: 'Kamal Cow Set',   desc: 'Divine cow with lotus — perfect for home mandir gifting', price: '₹499', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
  { icon: '🎋', name: 'Krishna Kamal',   desc: 'Krishna with lotus — a blessed gifting choice',                    price: '₹549', color: 'bg-green-50 border-green-200 hover:border-green-400' },
  { icon: '🥘', name: 'Rasoi Leela Set', desc: "Lord Krishna's kitchen leela in wood",                             price: '₹599', color: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
  { icon: '💒', name: 'Vivha Khel Set',  desc: 'Beautiful wedding décor wooden set',                              price: '₹649', color: 'bg-pink-50 border-pink-200 hover:border-pink-400' },
]

const CANDLES = [
  { icon: '🌻', name: 'Sunflower Candle', desc: 'Cheerful sunflower shaped scented candle',   color: 'bg-yellow-500/10 border-yellow-500/20' },
  { icon: '🍬', name: 'Ladoo Candle',      desc: 'Playful ladoo shaped — perfect gifting',      color: 'bg-pink-500/10 border-pink-500/20' },
  { icon: '🕯️', name: 'Pillar Candle',   desc: 'Classic pillar with divine fragrance',         color: 'bg-amber-500/10 border-amber-500/20' },
  { icon: '🌹', name: 'Rose Attar',       desc: 'Car bottle attar in rose fragrance',           color: 'bg-red-500/10 border-red-500/20' },
]

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const FALLBACK_IMG = 'https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png'

function getImageScore(product) {
  const img = product.images?.[0]
  if (!img) return 0
  if (img.includes('res.cloudinary.com') &&
      !img.includes('Radhe_Image_Logo') &&
      !img.includes('Radhe_Bloom') &&
      !img.includes('placehold') &&
      !img.includes('placeholder')) return 3
  if (img.includes('res.cloudinary.com')) return 2
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
  const [janmashtamiImg, setJanmashtamiImg] = useState(null)

  const janmashtamiRef = useRef(null)
  const { scrollYProgress: janmashtamiScroll } = useScroll({
    target: janmashtamiRef,
    offset: ['start end', 'end start'],
  })
  const janmashtamiTextY   = useTransform(janmashtamiScroll, [0, 1], [100, -100])
  const janmashtamiImgY    = useTransform(janmashtamiScroll, [0, 1], [140, -140])
  const janmashtamiPetalsY = useTransform(janmashtamiScroll, [0, 1], [-80, 180])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 10000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=8')
      .then(r => setFeatured(sortProductsByImage(r.data.products || [])))
      .catch(() => {})
    axios.get('/api/products?sort=newest&limit=8')
      .then(r => { setNewArr(sortProductsByImage(r.data.products || [])); setLoading(false) })
      .catch(() => setLoading(false))
    axios.get('/api/settings')
      .then(r => {
        const pinned = r.data.settings?.janmashtamiHeroImage
        if (pinned) {
          setJanmashtamiImg(pinned)
        } else {
          axios.get('/api/products?category=janmashtami&limit=8')
            .then(r2 => setJanmashtamiImg(bestProductImage(r2.data.products || [])))
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const s    = SLIDES[slide]
  const list = tab === 'featured' ? featured : newArr

  return (
    <div>
      <SEO />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-devotion-dark">
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
        <motion.div
          key={`overlay-${slide}`}
          className="absolute inset-0"
          style={{ backgroundColor: ['rgba(0,0,0,0.45)', 'rgba(10,5,0,0.50)', 'rgba(5,0,10,0.48)'][slide] }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #e0d28f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <motion.button key={i} onClick={() => setSlide(i)}
              animate={{ width: i === slide ? 32 : 8, backgroundColor: i === slide ? '#e0d28f' : 'rgba(255,255,255,0.4)' }}
              transition={{ duration: 0.3 }} className="h-2 rounded-full" />
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ──
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
      </motion.section> */}

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

      {/* ── JANMASHTAMI HERO ── */}
      <section ref={janmashtamiRef} className="relative min-h-[65vh] flex items-center overflow-hidden bg-devotion-dark">
        {/* Rich festive gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-devotion-dark via-[#4a2f12] to-devotion-dark" />
        {/* Dot texture, consistent with the main hero */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #e0d28f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Soft glow blobs for depth */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />

        {/* Drifting festive petals — parallax layer, moves fastest on scroll */}
        <motion.div style={{ y: janmashtamiPetalsY }} className="absolute inset-0 pointer-events-none">
          {['🌼','🪔','✨','🌸'].map((p, i) => (
            <motion.span key={i}
              className="absolute text-2xl opacity-30 select-none"
              style={{ left: `${12 + i * 24}%`, top: '-5%' }}
              animate={{ y: ['0vh', '75vh'], rotate: [0, 180], opacity: [0, 0.35, 0] }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 2.2 }}>
              {p}
            </motion.span>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 w-full py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-14">

            {/* Text — subtle parallax on scroll */}
            <motion.div className="max-w-xl text-center md:text-left"
              style={{ y: janmashtamiTextY }}
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-saffron-400/10 text-saffron-400 text-xs font-bold uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-5 border border-saffron-400/20">
                ✨ Season Special
              </span>

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}>
                <h2 className="font-display text-5xl md:text-6xl text-white leading-none mb-1 flex flex-wrap gap-x-3 justify-center md:justify-start">
                  {['The', 'Janmashtami'].map((word) => (
                    <motion.span key={word} className="inline-block"
                      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}>
                      {word}
                    </motion.span>
                  ))}
                </h2>
                <h2 className="font-display text-5xl md:text-6xl text-saffron-400 leading-none italic mb-6 flex justify-center md:justify-start">
                  <motion.span className="inline-block"
                    variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}>
                    Collection
                  </motion.span>
                </h2>
              </motion.div>

              <p className="text-cream-200 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                From the swaying Radha Krishna Jhula to mischievous Makhan Chor Leela sets, dreamy Dahi Handi mataki décor and the beloved Ashta Sakhi idols — each piece is hand-picked to bring Krishna's playful leela home this Janmashtami.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Link to="/shop/janmashtami" className="btn-primary text-base px-8 py-4 relative overflow-hidden">
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Explore Collection <ArrowRight size={18} />
                  </span>
                  <motion.span
                    className="absolute inset-y-0 w-1/3 bg-white/30 pointer-events-none"
                    style={{ transform: 'skewX(-20deg)' }}
                    animate={{ left: ['-40%', '140%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Animated product medallion — moves faster than text on scroll for depth */}
            <motion.div className="relative shrink-0"
              style={{ y: janmashtamiImgY }}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <motion.div className="relative w-56 h-56 md:w-64 md:h-64"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                {/* Soft glowing halo */}
                <motion.span className="absolute -inset-3 rounded-full bg-saffron-400/30 blur-xl"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />

                {/* Spinning festive gradient ring */}
                <motion.div className="absolute inset-0 rounded-full shadow-2xl"
                  style={{ background: 'conic-gradient(from 0deg, #F4C430, #C9960A, #7B2D26, #C9960A, #F4C430)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />

                {/* Twinkling sparkles around the ring */}
                {[
                  { top: '-6%', left: '50%', delay: 0 },
                  { top: '50%', left: '104%', delay: 0.7 },
                  { top: '104%', left: '20%', delay: 1.4 },
                  { top: '20%', left: '-8%', delay: 2.1 },
                ].map((s, i) => (
                  <motion.span key={i}
                    className="absolute text-lg -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                    style={{ top: s.top, left: s.left }}
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}>
                    ✨
                  </motion.span>
                ))}

                <div className="absolute inset-[5px] rounded-full overflow-hidden shadow-inner bg-[#F5ECD9]">
                  {janmashtamiImg ? (
                    <motion.img
                      key={janmashtamiImg}
                      src={thumbUrl(janmashtamiImg, 500)}
                      alt="Janmashtami Collection"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="skeleton w-full h-full rounded-full" />
                  )}
                </div>
                <motion.span className="absolute -bottom-2 -right-2 text-4xl drop-shadow-lg"
                  animate={{ rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                  🎉
                </motion.span>
                <motion.div className="absolute -top-3 -left-3 bg-white rounded-full px-3 py-1.5 shadow-lg"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                  <span className="text-xs font-bold text-devotion-brown whitespace-nowrap">Most Loved</span>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CATEGORIES (Replaced completely with the new scrolling layout component) ── */}
      <CategorySection />

      {/* ── PRODUCT SHORTS (Instagram-Reels-style demo videos) ── */}
      <ShortsSection />

      {/* ── GIFTING + CANDLES ── */}
      {/* <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gift Sets }
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="section-subtitle mb-3">✦ Perfect Presents ✦</p>
            <h2 className="section-title mb-4">Gift Sets & Hampers</h2>
            <p className="text-devotion-brown/70 leading-relaxed mb-7 text-sm">
              Curated divine gifts for weddings, housewarming, festivals & corporate gifting — beautifully packaged with love.
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

          {/* Candles }
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
      </section> */}

{/* ── WHY US (Contrasted Parchment Background) ── */}
      <section className="py-16 bg-[#FDFAF4] border-t border-[#F5ECD9]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#C9960A] text-xs uppercase tracking-widest font-bold mb-2">✦ Our Promise ✦</p>
            <h2 className="font-display text-3xl text-[#3D2B1F] font-semibold">Why Choose Radhe Bloom?</h2>
          </motion.div>
          
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { title: 'Handcrafted Art',    desc: 'Made by skilled local artisans', border: 'border-orange-500/20' },
              { title: 'Vibrant UV Colors',   desc: 'Fade-resistant premium printing', border: 'border-yellow-500/20' },
              { title: 'Wholesale Pricing',  desc: 'Best rates for bulk orders',     border: 'border-green-500/20' },
              { title: 'Vastu Compliant',    desc: 'Designed for positive energy',   border: 'border-purple-500/20' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                whileHover={{ y: -5, backgroundColor: '#F5ECD9/40' }}
                className={`bg-[#F5ECD9]/30 border ${item.border} rounded-2xl p-6 min-h-[130px] flex flex-col justify-center text-center transition-all cursor-default`}>
                <h4 className="font-display text-[#3D2B1F] text-base font-semibold mb-1.5">{item.title}</h4>
                <p className="text-[#3D2B1F]/70 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}