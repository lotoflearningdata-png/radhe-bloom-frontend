// frontend/src/components/ui/CategorySection.jsx
// Replace the entire categories section in HomePage.jsx with this component

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import useCategories from '../../hooks/useCategories'

const FEATURED_CATEGORIES = [
  {
    label:    'Divine Idols',
    slug:     'divine-idols',
    emoji:    '🕉️',
    desc:     'Krishna, Radha, Ganesh & more',
    count:    '25+ products',
  },
  {
    label:    'Festive Sets',
    slug:     'festive-sets',
    emoji:    '🎊',
    desc:     'Leela sets for every occasion',
    count:    '20+ products',
  },
  {
    label:    'Home Décor',
    slug:     'home-decor',
    emoji:    '🦚',
    desc:     'Peacocks, elephants & wall art',
    count:    '18+ products',
  },
  {
    label:    'Gift Sets',
    slug:     'gift-sets',
    emoji:    '🎁',
    desc:     'Curated hampers & special sets',
    count:    '10+ products',
  },
]

export default function CategorySection() {
  const scrollRef = useRef(null)
  // All categories for pills row
  const ALL_CATEGORIES = useCategories().map(c => ({ label: c.name, slug: c.slug }))

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">

      {/* Section header */}
      <motion.div
        className="flex items-end justify-between mb-10"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <div>
          <p className="section-subtitle mb-2">✦ Collections ✦</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <Link to="/shop"
          className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-saffron-500 hover:text-saffron-600 transition-colors">
          View All <ArrowRight size={14} />
        </Link>
      </motion.div>

      {/* ── 4 Featured Category Cards ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
        {FEATURED_CATEGORIES.map((cat, i) => (
          <motion.div key={cat.slug}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}>
            <Link to={`/shop/${cat.slug}`}
              className="group flex flex-col bg-cream-50 border border-cream-200 hover:border-saffron-400 rounded-2xl p-6 transition-all duration-300 hover:shadow-warm h-full">
              {/* Emoji */}
              <motion.span
                className="text-3xl mb-4 block"
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                {cat.emoji}
              </motion.span>
              {/* Text */}
              <h3 className="font-display text-base font-semibold text-devotion-brown mb-1">
                {cat.label}
              </h3>
              <p className="text-xs text-cream-500 mb-3 flex-1">{cat.desc}</p>
              {/* Count + arrow */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-saffron-500 font-bold">{cat.count}</span>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
                  <ArrowRight size={14} className="text-saffron-400 group-hover:text-saffron-600 transition-colors" />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Horizontal Scrolling Pills — all categories ── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.3 }}>

        {/* Label */}
        <p className="text-xs text-cream-500 font-bold uppercase tracking-widest mb-3">
          Browse all categories
        </p>

        <div className="relative">
          {/* Left scroll button */}
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
              w-7 h-7 bg-white border border-cream-200 rounded-full shadow-card
              flex items-center justify-center hover:border-saffron-400 transition-colors
              hidden sm:flex">
            <ChevronLeft size={14} className="text-devotion-brown" />
          </button>

          {/* Scrollable pills row */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="flex-none px-5 py-2.5 rounded-full border border-cream-200
                  text-sm font-medium text-devotion-brown bg-white
                  hover:border-saffron-400 hover:text-saffron-600 hover:bg-saffron-50
                  transition-all duration-200 whitespace-nowrap">
                {cat.label}
              </Link>
            ))}
            {/* View all pill */}
            <Link
              to="/shop"
              className="flex-none px-5 py-2.5 rounded-full
                text-sm font-bold text-white whitespace-nowrap
                transition-all duration-200"
              style={{ background: '#C9960A' }}>
              View All →
            </Link>
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
              w-7 h-7 bg-white border border-cream-200 rounded-full shadow-card
              flex items-center justify-center hover:border-saffron-400 transition-colors
              hidden sm:flex">
            <ChevronRight size={14} className="text-devotion-brown" />
          </button>
        </div>
      </motion.div>

    </section>
  )
}