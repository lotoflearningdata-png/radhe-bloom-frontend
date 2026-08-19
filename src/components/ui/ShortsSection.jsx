// frontend/src/components/ui/ShortsSection.jsx
// Instagram-Reels-style row of vertical (9:16) product demo videos for the homepage
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X, ShoppingBag } from 'lucide-react'
import { useGeoCartPricing } from '../../hooks/useGeoCartPricing'

function ReelCard({ product, index, onOpen, priceLabel }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.button
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative flex-none w-40 sm:w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-devotion-dark shadow-card hover:shadow-warm transition-shadow text-left"
    >
      <video
        ref={videoRef}
        src={product.videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-xs font-bold line-clamp-2 mb-1">{product.name}</p>
        <p className="text-saffron-400 text-xs font-display font-bold">{priceLabel}</p>
      </div>
    </motion.button>
  )
}

export default function ShortsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeIdx, setActiveIdx] = useState(null)
  const [muted, setMuted] = useState(false)
  const scrollRef = useRef(null)
  const modalVideoRef = useRef(null)
  const { fmt, unitPrice } = useGeoCartPricing(products.map(p => ({ product: p, qty: 1 })))
  const priceLabel = (p) => fmt(unitPrice({ product: p }))

  useEffect(() => {
    axios.get('/api/products?hasVideo=true&limit=12')
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  const closeModal = useCallback(() => setActiveIdx(null), [])

  const step = useCallback((dir) => {
    setActiveIdx(i => {
      if (i === null) return i
      return (i + dir + products.length) % products.length
    })
  }, [products.length])

  useEffect(() => {
    if (activeIdx === null) return
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowUp') step(-1)
      if (e.key === 'ArrowDown') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [activeIdx, closeModal, step])

  useEffect(() => {
    if (activeIdx === null || !modalVideoRef.current) return
    modalVideoRef.current.currentTime = 0
    modalVideoRef.current.play().catch(() => {})
  }, [activeIdx])

  if (!loading && products.length === 0) return null

  const active = activeIdx !== null ? products[activeIdx] : null

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <motion.div
        className="flex items-end justify-between mb-8"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <div>
          <p className="section-subtitle mb-2">✦ Watch & Shop ✦</p>
          <h2 className="section-title">Product Demos</h2>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton flex-none w-40 sm:w-48 aspect-[9/16] rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
              w-8 h-8 bg-white border border-cream-200 rounded-full shadow-card
              items-center justify-center hover:border-saffron-400 transition-colors
              hidden sm:flex">
            <ChevronLeft size={16} className="text-devotion-brown" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {products.map((p, i) => (
              <div key={p._id} className="snap-start">
                <ReelCard product={p} index={i} onOpen={setActiveIdx} priceLabel={priceLabel(p)} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
              w-8 h-8 bg-white border border-cream-200 rounded-full shadow-card
              items-center justify-center hover:border-saffron-400 transition-colors
              hidden sm:flex">
            <ChevronRight size={16} className="text-devotion-brown" />
          </button>
        </div>
      )}

      {/* Fullscreen reel viewer */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeModal}
        >
          <button
            aria-label="Close"
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>

          <button
            onClick={e => { e.stopPropagation(); step(-1) }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); step(1) }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <ChevronRight size={20} />
          </button>

          <div
            className="relative h-[85vh] aspect-[9/16] max-w-[92vw] rounded-2xl overflow-hidden bg-black"
            onClick={e => e.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              key={active._id}
              src={active.videoUrl}
              muted={muted}
              loop
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setMuted(m => !m)}
              className="absolute top-4 left-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
              <p className="text-white font-bold text-sm mb-1 line-clamp-2">{active.name}</p>
              <p className="text-saffron-400 font-display font-bold text-lg mb-3">{priceLabel(active)}</p>
              <Link
                to={`/product/${active._id}`}
                onClick={closeModal}
                className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                <ShoppingBag size={15} /> Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
