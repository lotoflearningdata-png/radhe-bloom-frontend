import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const LAST_UPDATED = 'April 14, 2026'

export default function PrivacyPolicyPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-devotion-dark rounded-3xl p-10 mb-10 text-center">
        <p className="text-saffron-400 text-xs uppercase tracking-widest font-bold mb-3">🔒 Legal</p>
        <h1 className="font-display text-4xl text-white mb-3">Privacy Policy</h1>
        <p className="text-cream-300 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card space-y-8 text-devotion-brown/80 leading-relaxed">

        {/* Intro */}
        <div>
          <p>
            At <strong className="text-devotion-brown">Radhe Bloom</strong> ("we", "us", or "our"), operated from
            Mathura, Uttar Pradesh, India, we are committed to protecting your personal information and your
            right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information
            when you visit our website radhebloom.in and make purchases from us.
          </p>
          <p className="mt-3">
            By using our website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Personal Identification:</strong> Name, email address, phone number when you register or place an order.</li>
            <li><strong>Shipping Information:</strong> Delivery address, city, state, PIN code.</li>
            <li><strong>Payment Information:</strong> We do not store your card details. Payments are processed securely via Razorpay (for Indian customers) and Payoneer (for international customers).</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, browser type — collected anonymously to improve our website.</li>
            <li><strong>Communications:</strong> Messages sent via our contact form or WhatsApp.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations, invoices and shipping updates via email</li>
            <li>To respond to your queries and provide customer support</li>
            <li>To send promotional offers (only if you opt in)</li>
            <li>To improve our website and product offerings</li>
            <li>To comply with legal obligations under Indian law</li>
          </ul>
        </Section>

        <Section title="3. We Will NEVER Sell Your Data">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="font-bold text-green-700 mb-2">✅ Our Promise to You</p>
            <p className="text-green-700">
              We will <strong>never sell, rent, or share your personal information</strong> — including your
              phone number and email address — with any third party for marketing purposes.
              Your data belongs to you.
            </p>
          </div>
        </Section>

        <Section title="4. Information Sharing">
          <p>We only share your information with trusted third parties who are essential to our operations:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Shiprocket:</strong> Your name and delivery address are shared with our shipping partner to deliver your order.</li>
            <li><strong>Razorpay / Payoneer:</strong> Payment processing. They have their own privacy policies and are RBI-compliant.</li>
            <li><strong>Cloudinary:</strong> For secure media storage.</li>
            <li><strong>Legal Authorities:</strong> If required by Indian law, court order, or government regulation.</li>
          </ul>
          <p className="mt-3">We do not share your data with any advertising networks or social media platforms.</p>
        </Section>

        <Section title="5. Data Storage & Security">
          <ul className="list-disc pl-6 space-y-2">
            <li>Your data is stored securely on MongoDB Atlas servers (Mumbai region, India).</li>
            <li>Passwords are encrypted using bcrypt — we cannot read your password.</li>
            <li>All data transmission is encrypted via HTTPS/SSL.</li>
            <li>We retain your order data for 7 years as required by Indian tax laws (GST compliance).</li>
            <li>You may request deletion of your account data by emailing us at hello@radhebloom.in.</li>
          </ul>
        </Section>

        <Section title="6. Cookies">
          <p>
            We use minimal cookies to keep you logged in and remember your cart. We do not use
            advertising or tracking cookies. You can disable cookies in your browser settings,
            though this may affect website functionality.
          </p>
        </Section>

        <Section title="7. Your Rights (Indian IT Act 2000 & DPDP Act 2023)">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your personal data (subject to legal retention requirements)</li>
            <li>Withdraw consent for marketing communications at any time</li>
            <li>Lodge a complaint with our Grievance Officer (see below)</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <strong>hello@radhebloom.in</strong></p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Our website is not directed at children under 13 years of age. We do not knowingly collect
            personal information from children. If you believe a child has provided us with personal data,
            please contact us immediately.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            by posting the new policy on this page with an updated date. Continued use of our website after
            changes constitutes acceptance of the new policy.
          </p>
        </Section>

        <Section title="10. Contact & Grievance Officer">
          <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-5">
            <p className="font-bold text-devotion-brown mb-3">For any privacy concerns, contact our Grievance Officer:</p>
            <div className="space-y-1 text-sm">
              <p><strong>Grievance Officer:</strong> Radhe Bloom Management</p>
              <p><strong>Email:</strong> hello@radhebloom.in</p>
              <p><strong>Phone:</strong> +91-9528078217</p>
              <p><strong>Address:</strong> Mathura, Uttar Pradesh, India</p>
              <p><strong>Response Time:</strong> Within 48 hours of receiving your complaint</p>
            </div>
          </div>
        </Section>

      </div>

      <div className="text-center mt-8 text-sm text-cream-500">
        <Link to="/" className="text-saffron-600 hover:underline">← Back to Home</Link>
        {' · '}
        <Link to="/terms" className="text-saffron-600 hover:underline">Terms & Conditions</Link>
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