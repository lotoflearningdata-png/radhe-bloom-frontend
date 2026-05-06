import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, CheckCircle } from 'lucide-react'
import SEO from '../components/ui/SEO'

const SUBJECTS = [
  'Product Enquiry',
  'Order Issue',
  'Wholesale / Bulk Order',
  'Return / Refund',
  'Delivery Query',
  'Custom Order',
  'Other',
]

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function ContactPage() {
  const [form, setForm]         = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields')
    setLoading(true)
    try {
      await axios.post('/api/contact', form)
      setSubmitted(true)
      toast.success('Message sent! We\'ll reply within 24 hours 🙏')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please WhatsApp us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SEO title="Contact Us" description="Get in touch with Radhe Bloom for product enquiries, wholesale orders, and support." />

      {/* Hero */}
      <section className="bg-devotion-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #f97f0a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.p className="text-saffron-400 text-xs uppercase tracking-[4px] font-bold mb-4"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            ✦ We're Here to Help ✦
          </motion.p>
          <motion.h1 className="font-display text-4xl md:text-5xl text-white mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Get in Touch
          </motion.h1>
          <motion.p className="text-cream-300 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Have a question, need help with an order, or want to place a bulk order? We'd love to hear from you!
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left - Contact Info */}
          <div className="space-y-5">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <h2 className="font-display text-2xl text-devotion-brown mb-6">Contact Details</h2>
            </motion.div>

            {[
              { icon: Phone,     label: 'Call / WhatsApp', value: '+91-9528078217',     href: 'tel:+919528078217',          color: 'bg-green-50 text-green-600 border-green-200' },
              { icon: Mail,      label: 'Email Us',         value: 'hello@radhebloom.in', href: 'mailto:hello@radhebloom.in', color: 'bg-blue-50 text-blue-600 border-blue-200' },
              { icon: MapPin,    label: 'Visit Us',         value: 'Mathura, Uttar Pradesh, India', href: '#',             color: 'bg-orange-50 text-orange-600 border-orange-200' },
              { icon: Clock,     label: 'Business Hours',   value: 'Mon–Sat: 9am – 7pm', href: '#',                        color: 'bg-purple-50 text-purple-600 border-purple-200' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.a key={i} href={item.href}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${item.color} transition-all block`}>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">{item.label}</p>
                    <p className="font-bold text-sm mt-0.5">{item.value}</p>
                  </div>
                </motion.a>
              )
            })}

            {/* WhatsApp Quick Button */}
            <motion.a
              href="https://wa.me/919528078217?text=Hi%20Radhe%20Bloom%2C%20I%20have%20a%20query"
              target="_blank" rel="noreferrer"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-4 rounded-2xl transition-colors text-base shadow-lg">
              <MessageCircle size={20} />
              Chat on WhatsApp
            </motion.a>

            {/* Quick response note */}
            <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-4 text-sm text-saffron-800">
              <p className="font-bold mb-1">⚡ Fastest Response</p>
              <p>WhatsApp us for instant replies! We typically respond within 30 minutes during business hours.</p>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 shadow-card text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
                <h3 className="font-display text-3xl text-devotion-brown mb-3">Message Sent! 🙏</h3>
                <p className="text-cream-500 mb-2">Thank you for reaching out to Radhe Bloom.</p>
                <p className="text-cream-500 mb-8">We'll get back to you within 24 hours.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }) }}
                    className="btn-outline text-sm">Send Another Message</button>
                  <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
                    className="btn-primary text-sm">💬 WhatsApp Us</a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-card">
                <h2 className="font-display text-2xl text-devotion-brown mb-2">Send Us a Message</h2>
                <p className="text-cream-500 text-sm mb-8">Fill the form below and we'll get back to you shortly.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        required placeholder="Your name" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        required placeholder="you@example.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                        <option value="">Select a subject...</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      required rows={5} placeholder="Tell us how we can help you..."
                      className="input-field resize-none" />
                  </div>

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    <Send size={16} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>

                  <p className="text-xs text-center text-cream-500">
                    We respect your privacy. Your information will never be shared with third parties.
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}