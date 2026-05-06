import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Award, Users, Package, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
}

const STATS = [
  { value: '500+',  label: 'Products',          icon: Package },
  { value: '5000+', label: 'Happy Customers',   icon: Users },
  { value: '15+',   label: 'Years of Devotion', icon: Heart },
  { value: '100%',  label: 'Handcrafted',       icon: Award },
]

const VALUES = [
  {
    emoji: '🙏',
    title: 'Rooted in Devotion',
    desc:  'Every piece we create is infused with love and spiritual energy. We believe that art and devotion go hand in hand, and that belief reflects in every idol, cutout, and décor item we craft.',
  },
  {
    emoji: '🎨',
    title: 'Artisan Craftsmanship',
    desc:  'Our skilled artisans use traditional techniques passed down through generations. From hand-painted MDF cutouts to intricately carved wooden idols, every detail is crafted with precision.',
  },
  {
    emoji: '🌱',
    title: 'Sustainable Materials',
    desc:  'We use high-quality, eco-conscious materials including FSC-certified MDF wood, non-toxic UV paints, and natural fibres — because we care for both your home and the planet.',
  },
  {
    emoji: '🤝',
    title: 'Serving Everyone',
    desc:  'Whether you need a single idol for your home mandir or a thousand pieces for wholesale, we serve every customer with the same warmth, quality and competitive pricing.',
  },
]

const TEAM = [
  {
    name:  'Founder',
    role:  'Creative Director & Founder',
    desc:  'A devotee of Lord Krishna with a passion for preserving traditional Indian artforms through modern craftsmanship.',
    emoji: '🌸',
  },
  {
    name:  'Lead Artisan',
    role:  'Master Craftsman',
    desc:  'With 20+ years of experience in MDF wood art and UV printing, our lead artisan brings every design to life.',
    emoji: '🎨',
  },
  {
    name:  'Operations',
    role:  'Wholesale & Logistics Head',
    desc:  'Ensuring every order — retail or bulk — reaches you on time and in perfect condition, anywhere in India.',
    emoji: '📦',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-devotion-dark py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #f97f0a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-saffron-500/10 -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.p className="text-saffron-400 text-xs uppercase tracking-[4px] font-bold mb-4"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            ✦ Our Story ✦
          </motion.p>
          <motion.h1 className="font-display text-5xl md:text-6xl text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Born from Devotion,<br />
            <span className="text-saffron-400 italic">Built with Love</span>
          </motion.h1>
          <motion.p className="text-cream-300 text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Radhe Bloom started as a small workshop in the sacred city of Mathura with one simple mission —
            to bring the divine beauty of handcrafted Krishna idols and MDF artforms into every home across India and the world.
          </motion.p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-cream-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex flex-col items-center py-10 px-4 border-r border-cream-200 last:border-0">
                  <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron-500 flex items-center justify-center mb-3">
                    <Icon size={22} />
                  </div>
                  <p className="font-display text-4xl text-devotion-brown font-bold mb-1">{stat.value}</p>
                  <p className="text-cream-500 text-sm text-center">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative">
            <div className="bg-cream-100 rounded-3xl overflow-hidden aspect-square">
              <img
                src="https://res.cloudinary.com/dayndbxgi/image/upload/v1774605700/Radhe_Image_Logo_v9wqgn.png"
                alt="Radhe Bloom Story"
                className="w-full h-full object-contain p-8"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-saffron-500 text-white rounded-2xl p-5 shadow-warm-lg">
              <p className="font-display text-3xl font-bold">15+</p>
              <p className="text-saffron-100 text-sm">Years crafting<br />divine art</p>
            </div>
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="section-subtitle mb-3">✦ Who We Are ✦</p>
            <h2 className="section-title mb-6">From Mathura's Heart<br />to Your Home</h2>
            <div className="space-y-4 text-devotion-brown/80 leading-relaxed">
              <p>
                Radhe Bloom was founded in the sacred land of Mathura — the birthplace of Lord Krishna —
                with a dream to preserve and share the rich heritage of Indian devotional art with the world.
              </p>
              <p>
                What started as a small family workshop has grown into a beloved brand trusted by thousands
                of devotees, interior decorators, and gifting businesses across India and beyond.
                We serve both retail customers and wholesale buyers with equal care and passion.
              </p>
              <p>
                Our collection spans handcrafted MDF cutouts, Krishna devotional idols, festive decoration sets,
                premium home décor, children's wooden toys, and beautifully curated gift hampers — all made
                with the finest materials and traditional artisanship.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                Explore Our Collection <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                className="btn-outline">
                💬 Talk to Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="section-subtitle mb-3">✦ What Drives Us ✦</p>
            <h2 className="section-title">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-7 shadow-card">
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="font-display text-xl text-devotion-brown mb-3">{v.title}</h3>
                <p className="text-devotion-brown/70 leading-relaxed text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MATHURA ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="section-subtitle mb-3">✦ Our Origin ✦</p>
            <h2 className="section-title mb-6">Why Mathura?</h2>
            <div className="space-y-4 text-devotion-brown/80 leading-relaxed">
              <p>
                Mathura is not just a city — it is the birthplace of Lord Krishna and one of the holiest
                cities in India. For centuries, it has been the centre of Krishna devotion, art, and culture.
              </p>
              <p>
                Being based in Mathura gives us a unique connection to the spiritual traditions, artforms,
                and craftsmanship that make our products truly authentic. Our artisans have grown up in
                this sacred environment, and that energy flows into everything they create.
              </p>
              <p>
                When you receive a Radhe Bloom product, you're not just getting a decorative item —
                you're bringing a piece of Mathura's divine heritage into your home.
              </p>
            </div>
          </motion.div>

          {/* Decorative Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4">
            {[
              { emoji: '🕉️', title: 'Birthplace of Krishna',  desc: 'Rooted in the most sacred city of India' },
              { emoji: '🎨', title: 'Ancient Art Traditions', desc: 'Centuries-old craftsmanship techniques' },
              { emoji: '🏛️', title: 'Temple City Heritage',  desc: 'Inspired by thousands of temples' },
              { emoji: '🌸', title: 'Divine Energy',          desc: 'Every product blessed with spiritual intent' },
            ].map((item, i) => (
              <motion.div key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-cream-50 border border-cream-200 rounded-2xl p-5 hover:border-saffron-300 hover:shadow-warm transition-all">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h4 className="font-display text-devotion-brown text-sm font-bold mb-1">{item.title}</h4>
                <p className="text-cream-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-devotion-dark">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">✦ The People ✦</p>
            <h2 className="font-display text-4xl text-white">Meet Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center hover:bg-white/10 transition-colors">
                <div className="w-20 h-20 rounded-full bg-saffron-500/20 flex items-center justify-center text-4xl mx-auto mb-5">
                  {member.emoji}
                </div>
                <h3 className="font-display text-white text-xl mb-1">{member.name}</h3>
                <p className="text-saffron-400 text-xs uppercase tracking-wider font-bold mb-4">{member.role}</p>
                <p className="text-cream-300 text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHOLESALE SECTION ── */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-cream-100 to-cream-200 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-saffron-400/10 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-saffron-400/10 translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <p className="section-subtitle mb-3">✦ For Businesses ✦</p>
            <h2 className="section-title mb-4">Retail & Wholesale Partner</h2>
            <p className="text-devotion-brown/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you're shopping for one or a hundred, we serve both retail and wholesale customers
              with equal love. Get special bulk pricing, custom branding, and dedicated support for your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              {[
                { title: 'MOQ', value: '50 pieces', desc: 'Minimum wholesale order' },
                { title: 'Discount', value: 'Up to 40%', desc: 'On bulk orders' },
                { title: 'Delivery', value: 'Pan India', desc: 'Shipping across India' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
                  <p className="text-xs text-saffron-500 uppercase font-bold mb-1">{item.title}</p>
                  <p className="font-display text-xl text-devotion-brown font-bold">{item.value}</p>
                  <p className="text-xs text-cream-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <a href="https://wa.me/919528078217?text=Hi%20Radhe%20Bloom%2C%20I'm%20interested%20in%20wholesale%20orders"
              target="_blank" rel="noreferrer"
              className="btn-primary text-base px-10 py-4">
              💬 Enquire for Wholesale
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="section-subtitle mb-3">✦ Reach Us ✦</p>
          <h2 className="section-title mb-10">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: 'Call / WhatsApp', value: '+91-9528078217', href: 'tel:+919528078217', color: 'bg-green-50 text-green-600' },
              { icon: Mail,  label: 'Email Us',        value: 'hello@radhebloom.in', href: 'mailto:hello@radhebloom.in', color: 'bg-blue-50 text-blue-600' },
              { icon: MapPin,label: 'Visit Us',        value: 'Mathura, Uttar Pradesh', href: 'https://maps.google.com/?q=Mathura,UP', color: 'bg-saffron-50 text-saffron-600' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a key={i} href={item.href} target={i === 2 ? '_blank' : undefined} rel="noreferrer"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-card flex flex-col items-center gap-3 hover:shadow-warm transition-all">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-xs text-cream-500 uppercase font-bold tracking-wider">{item.label}</p>
                  <p className="font-bold text-devotion-brown">{item.value}</p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}