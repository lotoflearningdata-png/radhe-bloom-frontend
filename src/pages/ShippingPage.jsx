import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const LAST_UPDATED = 'April 14, 2026'

export default function ShippingPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-devotion-dark rounded-3xl p-10 mb-10 text-center">
        <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">🚚 Legal</p>
        <h1 className="font-display text-4xl text-white mb-3">Shipping & Returns</h1>
        <p className="text-cream-300 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card space-y-8 text-devotion-brown/80 leading-relaxed">

        <div>
          <p>
            At <strong className="text-devotion-brown">Radhe Bloom</strong>, we take great care in packaging
            and shipping your divine products safely. Please read our shipping and returns policy carefully
            before placing an order.
          </p>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🇮🇳', title: 'Domestic Shipping', value: '3–7 business days', sub: 'Free above ₹499' },
            { icon: '🌍', title: 'International', value: '10–21 business days', sub: 'Charges apply' },
            { icon: '🔄', title: 'Returns', value: '7 days window', sub: 'Damaged items only' },
          ].map((card, i) => (
            <div key={i} className="bg-cream-50 border border-cream-200 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="font-bold text-devotion-brown text-sm">{card.title}</p>
              <p className="text-saffron-600 font-display text-base mt-1">{card.value}</p>
              <p className="text-cream-500 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <Section title="1. Order Processing Time">
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are processed within <strong>1–2 business days</strong> after payment confirmation.</li>
            <li>During festivals (Janmashtami, Navratri, Diwali) and peak seasons, processing may take <strong>3–4 business days</strong>.</li>
            <li>You will receive a confirmation email with your order details once processed.</li>
            <li>Orders placed after 6 PM IST are processed the next business day.</li>
            <li>Business days are Monday to Saturday (excluding public holidays).</li>
          </ul>
        </Section>

        <Section title="2. Domestic Shipping (Within India)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-saffron-50">
                  <th className="text-left p-3 border border-cream-200 text-saffron-700">Order Value</th>
                  <th className="text-left p-3 border border-cream-200 text-saffron-700">Shipping Charge</th>
                  <th className="text-left p-3 border border-cream-200 text-saffron-700">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-cream-200">Below ₹499</td>
                  <td className="p-3 border border-cream-200 text-devotion-brown font-bold">₹49</td>
                  <td className="p-3 border border-cream-200">3–7 business days</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="p-3 border border-cream-200">₹499 and above</td>
                  <td className="p-3 border border-cream-200 text-green-600 font-bold">FREE</td>
                  <td className="p-3 border border-cream-200">3–7 business days</td>
                </tr>
                <tr>
                  <td className="p-3 border border-cream-200">Remote/Hilly Areas</td>
                  <td className="p-3 border border-cream-200">May vary</td>
                  <td className="p-3 border border-cream-200">5–10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>We ship Pan India via <strong>Shiprocket</strong> using courier partners like Delhivery, BlueDart, XpressBees and DTDC.</li>
            <li>You will receive an AWB (tracking) number via email once your order is shipped.</li>
            <li>Delivery to remote PIN codes may take additional 2–3 days.</li>
          </ul>
        </Section>

        <Section title="3. International Shipping">
          <ul className="list-disc pl-6 space-y-2">
            <li>We ship internationally via <strong>Payoneer payment flow</strong>. After placing your order, our team will contact you with shipping cost and payment details within 24 hours.</li>
            <li>International delivery typically takes <strong>10–21 business days</strong> depending on destination country.</li>
            <li>Customs duties, import taxes and local fees in the destination country are the <strong>buyer's responsibility</strong>.</li>
            <li>We are not responsible for delays caused by customs clearance.</li>
            <li>WhatsApp us at +91-9528078217 for international shipping quotes before ordering.</li>
          </ul>
        </Section>

        <Section title="4. Packaging">
          <p>
            All Radhe Bloom products are carefully bubble-wrapped and packed in sturdy boxes to ensure
            they arrive safely. Fragile items like idols and glass diffusers receive extra protective packaging.
            We take full responsibility for safe packaging — any damage during transit will be covered under our returns policy.
          </p>
        </Section>

        <Section title="5. Returns Policy">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
            <p className="font-bold text-blue-700 mb-2">📦 7-Day Return Window</p>
            <p className="text-blue-700 text-sm">
              You may request a return within <strong>7 days of delivery</strong> for eligible items.
            </p>
          </div>

          <p className="font-bold text-devotion-brown mb-2">✅ Returns Accepted For:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Products damaged during shipping (with photo evidence)</li>
            <li>Wrong product delivered (different from what was ordered)</li>
            <li>Product with a manufacturing defect (broken, cracked, major paint issues)</li>
          </ul>

          <p className="font-bold text-devotion-brown mb-2">❌ Returns NOT Accepted For:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Natural variations in colour, texture or size (as described in our Terms — this is a feature of handcrafted products)</li>
            <li>Change of mind or personal preference</li>
            <li>Damage caused by the customer after delivery</li>
            <li>Products without original packaging</li>
            <li>International orders (contact us for case-by-case resolution)</li>
            <li>Candles, incense sticks and attars (hygiene products, non-returnable once opened)</li>
          </ul>
        </Section>

        <Section title="6. How to Initiate a Return">
          <div className="space-y-4">
            {[
              { step: '01', title: 'Contact Us Within 7 Days', desc: 'WhatsApp us at +91-9528078217 or email hello@radhebloom.in with your Order ID and photos/videos of the damaged product.' },
              { step: '02', title: 'Return Approval', desc: 'Our team will review your request within 48 hours and confirm if the return is approved.' },
              { step: '03', title: 'Ship the Product Back', desc: 'Once approved, we will arrange a pickup or guide you to ship the product back. For damage claims, we cover return shipping costs.' },
              { step: '04', title: 'Refund Processed', desc: 'After receiving and inspecting the returned product, your refund will be processed within 5–7 business days.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start bg-cream-50 rounded-2xl p-4">
                <span className="font-display text-2xl text-saffron-400 font-bold shrink-0">{item.step}</span>
                <div>
                  <p className="font-bold text-devotion-brown text-sm">{item.title}</p>
                  <p className="text-sm text-devotion-brown/70 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="7. Refunds">
          <ul className="list-disc pl-6 space-y-2">
            <li>Approved refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned product.</li>
            <li>Refunds are made to the <strong>original payment method</strong> (Razorpay → original card/UPI/wallet).</li>
            <li>Shipping charges (₹49) are non-refundable unless the return is due to our error.</li>
            <li>For Razorpay payments, the refund reflects in 3–5 additional working days depending on your bank.</li>
          </ul>
        </Section>

        <Section title="8. Who Pays Return Shipping?">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-saffron-50">
                  <th className="text-left p-3 border border-cream-200 text-saffron-700">Return Reason</th>
                  <th className="text-left p-3 border border-cream-200 text-saffron-700">Who Pays?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-cream-200">Damaged / Wrong product</td>
                  <td className="p-3 border border-cream-200 text-green-600 font-bold">Radhe Bloom pays</td>
                </tr>
                <tr>
                  <td className="p-3 border border-cream-200">Change of mind (if approved)</td>
                  <td className="p-3 border border-cream-200 text-devotion-brown font-bold">Customer pays</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="9. Lost or Delayed Shipments">
          <p>
            If your order has not arrived within the expected delivery window, please contact us:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>WhatsApp: +91-9528078217</li>
            <li>Email: hello@radhebloom.in with your Order ID and AWB number</li>
          </ul>
          <p className="mt-3">
            We will investigate with the courier partner and resolve the issue within 5 business days.
            If the shipment is confirmed lost, we will reship your order or issue a full refund.
          </p>
        </Section>

        {/* Contact */}
        <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-5">
          <p className="font-bold text-devotion-brown mb-3">📞 Need Help with Your Order?</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/919528078217" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-green-600 transition-colors">
              💬 WhatsApp Us
            </a>
            <a href="mailto:hello@radhebloom.in"
              className="flex items-center gap-2 bg-saffron-500 text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-saffron-600 transition-colors">
              📧 Email Us
            </a>
          </div>
        </div>

      </div>

      <div className="text-center mt-8 text-sm text-cream-500">
        <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
        {' · '}
        <Link to="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>
        {' · '}
        <Link to="/terms" className="text-saffron-600 hover:underline">Terms & Conditions</Link>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-xl text-devotion-brown mb-3 pb-2 border-b border-cream-200">{title}</h2>
      {children}
    </div>
  )
}