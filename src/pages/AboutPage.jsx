import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, Sparkles } from 'lucide-react'
import SEO from '../components/ui/SEO'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const VALUES = [
  { title: 'Rooted in Devotion', desc: 'Every piece is thoughtfully designed to bring peace, positivity, and spiritual energy into your sacred spaces.' },
  { title: 'Artisan Craftsmanship', desc: 'Our creators utilize traditional handcrafting techniques combined with premium materials for lasting quality.' },
  { title: 'Vibrant UV Printing', desc: 'We feature advanced fade-resistant UV colors across our signature MDF collections and cutout sets.' },
  { title: 'Vastu Compliant Design', desc: 'Every divine idol and home accent is structured explicitly following traditional Vastu design guidelines.' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#FDFAF4]">
      <SEO title="About Us" description="Discover the story behind Radhe Bloom — handcrafted Krishna idols, MDF cutouts and devotional décor blending spiritual heritage with modern craftsmanship." />
      {/* ── HERO ── */}
      <section className="relative bg-[#3D2B1F] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #C9960A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.p className="text-[#C9960A] text-xs uppercase tracking-[4px] font-bold mb-3"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            ✦ Our Story ✦
          </motion.p>
          <motion.h1 className="font-display text-4xl md:text-5xl text-white mb-4 leading-tight font-semibold"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Born from Devotion,<br />
            <span className="text-[#C9960A] italic font-normal">Built with Luxury Craft</span>
          </motion.h1>
          <motion.p className="text-[#FDFAF4]/80 text-base max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Radhe Bloom curates premium, handcrafted divine art and decor. We blend spiritual heritage with elegant, modern craftsmanship to elevate your home.
          </motion.p>
        </div>
      </section>

      {/* ── OUR STORY (Sleek Horizontal Split) ── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Side: Dynamic Image Shell */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative">
            <div className="bg-[#F5ECD9] border border-[#D4A853]/20 rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-6 shadow-sm">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1783316490/WhatsApp_Image_2026-07-04_at_17.09.47_qbsied.jpg"
                alt="Radhe Bloom Brand Statement"
                className="w-4/5 h-4/5 object-contain"
              />
            </div>
          </motion.div>

          {/* Right Side: Compressed Crisp Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div>
              <p className="text-[#C9960A] text-xs uppercase tracking-wider font-bold mb-1">✦ Who We Are ✦</p>
              <h2 className="font-display text-3xl text-[#3D2B1F] font-semibold">Devotion in Every Single Detail</h2>
            </div>
            
            <div className="space-y-3 text-[#3D2B1F]/80 text-sm leading-relaxed">
              <p className="font-medium text-base text-[#3D2B1F]">
                Welcome to Radhe Bloom. Born from a shared passion for spiritual elegance, we introduce bespoke devotional art into modern living spaces.
              </p>
              <p>
                What started as an intentional creative framework has grown into an premium brand trusted by thousands of devotees, aesthetic decorators, and wholesale partners across India. 
              </p>
              <p>
                Our curated collections focus cleanly on handcrafted MDF cutouts, timeless Krishna devotional idols, seasonal festival celebration sets, and exquisite gift hampers—ensuring premium fidelity.
              </p>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link to="/shop" className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm" style={{ backgroundColor: '#C9960A' }}>
                Explore Collection <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR VALUES (Structured 2x2 Grid Layout) ── */}
      <section className="py-16 bg-[#F5ECD9] border-y border-[#D4A853]/20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#C9960A] text-xs uppercase tracking-widest font-bold mb-1">✦ Essential Guidelines ✦</p>
            <h2 className="font-display text-3xl text-[#3D2B1F] font-semibold">Our Core Values</h2>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {VALUES.map((v, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                whileHover={{ y: -4, backgroundColor: '#FDFAF4' }}
                className="bg-[#FDFAF4]/60 border border-[#D4A853]/10 rounded-2xl p-6 transition-all shadow-sm flex gap-4 items-start">
                <span className="text-2xl mt-0.5 shrink-0">✨</span>
                <div>
                  <h3 className="font-display text-base font-semibold text-[#3D2B1F] mb-1">{v.title}</h3>
                  <p className="text-[#3D2B1F]/70 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHOLESALE PARTNERSHIP ── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="border border-[#D4A853]/30 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm bg-[#F5ECD9]/40 relative overflow-hidden">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block bg-[#C9960A]/10 text-[#C9960A] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              💼 B2B & Distribution
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-[#3D2B1F] mb-2 font-semibold">Retail & Wholesale Partner</h2>
            <p className="text-[#3D2B1F]/70 text-sm leading-relaxed">
              Whether you are shopping for one piece or a thousand, we serve you with equal devotion. Enjoy streamlined bulk pricing matrices, responsive custom orders, and specialized priority handling across India.
            </p>
          </div>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="shrink-0 w-full md:w-auto">
            <a href="https://wa.me/message/XNZVRD2CYFWPG1?text=Hi%20Radhe%20Bloom%2C%20I'm%20interested%20in%20wholesale%20orders"
              target="_blank" rel="noreferrer"
              className="w-full md:w-auto justify-center inline-flex items-center gap-2 bg-[#3D2B1F] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-sm">
              💬 Enquire for Wholesale
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}