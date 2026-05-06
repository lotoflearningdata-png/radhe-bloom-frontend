import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const LAST_UPDATED = 'April 14, 2026'

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-devotion-dark rounded-3xl p-10 mb-10 text-center">
        <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">📋 Legal</p>
        <h1 className="font-display text-4xl text-white mb-3">Terms & Conditions</h1>
        <p className="text-cream-300 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card space-y-8 text-devotion-brown/80 leading-relaxed">

        <div>
          <p>
            Welcome to <strong className="text-devotion-brown">Radhe Bloom</strong>. By accessing or using our website
            radhebloom.in and purchasing our products, you agree to be bound by these Terms & Conditions.
            Please read them carefully before making a purchase.
          </p>
          <p className="mt-3">
            These terms are governed by the laws of India, including the Consumer Protection Act 2019,
            Consumer Protection (E-Commerce) Rules 2020, and the Information Technology Act 2000.
          </p>
        </div>

        <Section title="1. About Us">
          <p>
            Radhe Bloom is a handcrafted devotional products business based in Mathura, Uttar Pradesh, India.
            We sell Krishna idols, MDF cutouts, festive sets, home décor, candles, toys and gift sets —
            all handcrafted by skilled artisans.
          </p>
          <div className="bg-cream-50 rounded-xl p-4 mt-3 text-sm">
            <p><strong>Business Name:</strong> Radhe Bloom</p>
            <p><strong>Location:</strong> Mathura, Uttar Pradesh, India</p>
            <p><strong>Contact:</strong> hello@radhebloom.in | +91-9528078217</p>
          </div>
        </Section>

        <Section title="2. Handcrafted Products — Important Notice">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
            <p className="font-bold text-amber-800 mb-2">⚠️ Please Read Before Ordering</p>
            <p className="text-amber-800">
              All Radhe Bloom products are <strong>handcrafted by artisans</strong>. This means:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-amber-800">
              <li>Slight variations in colour, size, finish and pattern from product photos are <strong>natural and expected</strong> — this is not a defect.</li>
              <li>Wood grain patterns, paint texture and minor asymmetries are characteristics of handmade art, not flaws.</li>
              <li>Colours may appear slightly different on screen vs. actual product due to monitor settings and natural dyes.</li>
              <li>Each piece is unique — you may receive a slightly different version of what is shown in the photo.</li>
              <li>Product dimensions listed are approximate and may vary by ±5-10%.</li>
            </ul>
            <p className="mt-3 text-amber-800 font-bold">
              By placing an order, you acknowledge and accept these natural variations as part of the handcrafted nature of our products.
            </p>
          </div>
        </Section>

        <Section title="3. Pricing & Payments">
          <ul className="list-disc pl-6 space-y-2">
            <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes.</li>
            <li>International orders are priced in INR; currency conversion is handled by your bank or payment provider.</li>
            <li>We accept payments via Razorpay (UPI, Cards, Net Banking, Wallets) for Indian customers and Payoneer for international customers.</li>
            <li>Payment must be completed before order processing begins.</li>
            <li>Prices may change without prior notice. The price at the time of order placement is final.</li>
            <li>Free shipping applies on orders above ₹499 within India. International shipping is charged separately.</li>
          </ul>
        </Section>

        <Section title="4. Order Processing">
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are processed within 1-2 business days after payment confirmation.</li>
            <li>You will receive an email confirmation with your order details and invoice.</li>
            <li>During festivals and peak seasons, processing may take up to 3-4 business days.</li>
            <li>We reserve the right to cancel any order due to stock unavailability, pricing errors or suspected fraud. A full refund will be issued in such cases.</li>
            <li>By clicking "Pay Now" and completing payment, you are entering into a legally binding purchase contract with Radhe Bloom.</li>
          </ul>
        </Section>

        <Section title="5. Shipping">
          <p>
            Please refer to our <Link to="/shipping" className="text-saffron-600 font-bold hover:underline">Shipping & Returns Policy</Link> for
            complete details on delivery timelines, shipping partners and return procedures.
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Domestic deliveries (India): 3-7 business days</li>
            <li>International deliveries: 10-21 business days</li>
            <li>We are not responsible for delays caused by the shipping carrier, customs or natural events.</li>
          </ul>
        </Section>

        <Section title="6. Returns & Refunds">
          <p>
            Please refer to our <Link to="/shipping" className="text-saffron-600 font-bold hover:underline">Shipping & Returns Policy</Link> for
            complete details. Key points:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Returns accepted within 7 days of delivery for damaged or defective items only.</li>
            <li>Natural variations in handcrafted products are not eligible for return.</li>
            <li>Refunds are processed within 5-7 business days to the original payment method.</li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All content on radhebloom.in — including product photos, descriptions, logo, designs and website code —
            is the exclusive property of Radhe Bloom. You may not copy, reproduce, distribute or use
            our content without prior written permission.
          </p>
        </Section>

        <Section title="8. User Accounts">
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 18 years old to create an account and make purchases.</li>
            <li>You agree to provide accurate and complete information during registration.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </Section>

        <Section title="9. Product Reviews">
          <ul className="list-disc pl-6 space-y-2">
            <li>Reviews can only be submitted by verified purchasers who have received their order.</li>
            <li>Reviews must be honest, respectful and relevant to the product.</li>
            <li>We reserve the right to remove reviews that contain offensive language, false claims or spam.</li>
          </ul>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted by Indian law, Radhe Bloom shall not be liable for any
            indirect, incidental or consequential damages arising from the use of our products or website.
            Our total liability shall not exceed the amount paid for the specific order in question.
          </p>
        </Section>

        <Section title="11. Governing Law & Disputes">
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of the courts in Mathura, Uttar Pradesh, India. We encourage customers to
            first contact our Grievance Officer to resolve any issues amicably before pursuing legal action.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. Updated terms will be posted on this
            page. Continued use of our website after changes constitutes acceptance of the new terms.
          </p>
        </Section>

        {/* Grievance Officer — Required by Indian Law */}
        <div className="bg-saffron-50 border-2 border-saffron-300 rounded-2xl p-6">
          <h2 className="font-display text-xl text-devotion-brown mb-4">
            ⚖️ Grievance Officer
            <span className="text-xs font-body text-cream-500 ml-2 font-normal">(As required under Consumer Protection Rules 2020)</span>
          </h2>
          <p className="text-sm text-devotion-brown/70 mb-4">
            In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information
            Technology Act, 2000, the details of our Grievance Officer are published below.
            Any complaint or concern regarding our website, products or services may be directed to:
          </p>
          <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
            <p><strong>Grievance Officer:</strong> Radhe Bloom Management</p>
            <p><strong>Designation:</strong> Proprietor / Customer Relations Head</p>
            <p><strong>Email:</strong> <a href="mailto:hello@radhebloom.in" className="text-saffron-600 hover:underline">hello@radhebloom.in</a></p>
            <p><strong>Phone:</strong> <a href="tel:+919528078217" className="text-saffron-600 hover:underline">+91-9528078217</a></p>
            <p><strong>Address:</strong> Mathura, Uttar Pradesh, India</p>
            <p><strong>Working Hours:</strong> Monday to Saturday, 9:00 AM – 7:00 PM IST</p>
            <p><strong>Response Time:</strong> We will acknowledge your complaint within 48 hours and resolve it within 30 days.</p>
          </div>
        </div>

      </div>

      <div className="text-center mt-8 text-sm text-cream-500">
        <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
        {' · '}
        <Link to="/privacy" className="text-saffron-600 hover:underline">Privacy Policy</Link>
        {' · '}
        <Link to="/shipping" className="text-saffron-600 hover:underline">Shipping & Returns</Link>
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