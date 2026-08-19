// frontend/src/context/CountryContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

export const COUNTRIES = [
  { code: 'IN', name: 'India',         currency: 'INR', symbol: '₹',  flag: '🇮🇳', tier: 'india' },
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$',  flag: '🇺🇸', tier: 'us'    },
  { code: 'GB', name: 'United Kingdom',currency: 'GBP', symbol: '£',  flag: '🇬🇧', tier: 'other' },
  { code: 'AE', name: 'UAE',           currency: 'AED', symbol: 'AED',flag: '🇦🇪', tier: 'other' },
  { code: 'AU', name: 'Australia',     currency: 'AUD', symbol: 'A$', flag: '🇦🇺', tier: 'other' },
  { code: 'CA', name: 'Canada',        currency: 'CAD', symbol: 'C$', flag: '🇨🇦', tier: 'other' },
  { code: 'SG', name: 'Singapore',     currency: 'SGD', symbol: 'S$', flag: '🇸🇬', tier: 'other' },
  { code: 'NZ', name: 'New Zealand',   currency: 'NZD', symbol: 'NZ$',flag: '🇳🇿', tier: 'other' },
  { code: 'ZZ', name: 'Other Country', currency: 'USD', symbol: '$',  flag: '🌍', tier: 'other' },
]

// Pricing tiers:
// india → product.price (INR)
// us    → product.usPrice (USD)
// other → product.otherPrice (USD or whatever admin sets)

export const CountryContext = createContext({
  country:     COUNTRIES[0],
  setCountry:  () => {},
  detecting:   true,
  getPrice:    (product) => ({ amount: 0, symbol: '₹', currency: 'INR' }),
  formatPrice: (product) => '₹0',
})

// Try multiple IP-geolocation APIs in order; return a valid 2-letter code or null.
// ipapi.co returns { error: true } (no country_code) when rate-limited, which
// previously made every visitor fall through to "Other Country" → USD.
async function detectCountryCode() {
  const attempts = [
    async () => (await (await fetch('https://ipapi.co/json/')).json())?.country_code,
    async () => (await (await fetch('https://ipwho.is/')).json())?.country_code,
    async () => (await (await fetch('https://api.country.is/')).json())?.country,
  ]
  for (const attempt of attempts) {
    try {
      const code = String((await attempt()) || '').toUpperCase()
      if (/^[A-Z]{2}$/.test(code)) return code
    } catch {}
  }
  return null
}

// Exchange rate cache (for converting INR → local currency for "other" countries)
async function getUSDRate() {
  const cached   = localStorage.getItem('rb_usd_rate')
  const cachedAt = localStorage.getItem('rb_usd_rate_time')
  if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
    return Number(cached)
  }
  try {
    const res  = await fetch('https://api.frankfurter.dev/v2/rate/INR/USD')
    const data = await res.json()
    if (data?.rate) {
      localStorage.setItem('rb_usd_rate', String(data.rate))
      localStorage.setItem('rb_usd_rate_time', String(Date.now()))
      return data.rate
    }
  } catch {}
  return 0.012 // fallback
}

export function CountryProvider({ children }) {
  const [country, setCountryState] = useState(COUNTRIES[0])
  const [detecting, setDetecting]  = useState(true)
  const [usdRate, setUsdRate]      = useState(0.012)

  useEffect(() => {
    // Get live USD rate
    getUSDRate().then(rate => setUsdRate(rate))

    // Restore country ONLY if the user picked it manually.
    // (Auto-detected values are re-detected each visit so a bad/stale
    //  detection never gets stuck in localStorage.)
    const saved  = localStorage.getItem('rb_country')
    const manual = localStorage.getItem('rb_country_manual') === '1'
    if (saved && manual) {
      const found = COUNTRIES.find(c => c.code === saved)
      if (found) { setCountryState(found); setDetecting(false); return }
    }

    // Auto-detect from IP; default to India if detection fails
    detectCountryCode()
      .then(code => {
        if (!code) {
          setCountryState(COUNTRIES[0])
          console.warn('⚠️ Country detection failed — defaulting to India')
          return
        }
        const found = COUNTRIES.find(c => c.code === code)
        // Detected a country not in our list → 'ZZ' (Other)
        const selected = found || COUNTRIES.find(c => c.code === 'ZZ')
        setCountryState(selected)
        console.log('✅ Country detected:', selected.name)
      })
      .catch(() => setCountryState(COUNTRIES[0]))
      .finally(() => setDetecting(false))
  }, [])

  const setCountry = (code) => {
    const found = COUNTRIES.find(c => c.code === code)
    if (found) {
      setCountryState(found)
      localStorage.setItem('rb_country', found.code)
      localStorage.setItem('rb_country_manual', '1')
    }
  }

  // Get price info for a product based on current country tier
  // product = { price (INR), countryPrices: { usPrice, otherPrice } }
  const getPrice = (inrPrice, countryPrices) => {
    const tier = country.tier

    if (tier === 'india') {
      return { amount: inrPrice, symbol: '₹', currency: 'INR', isINR: true }
    }

    if (tier === 'us') {
      const usPrice = countryPrices?.US
      if (usPrice) return { amount: usPrice, symbol: '$', currency: 'USD', isINR: false }
      // Fallback: convert INR to USD using live rate
      return { amount: Number((inrPrice * usdRate).toFixed(2)), symbol: '$', currency: 'USD', isINR: false }
    }

    if (tier === 'other') {
      const otherPrice = countryPrices?.OTHER
      if (otherPrice) {
        // Show in USD for all "other" countries
        return { amount: otherPrice, symbol: '$', currency: 'USD', isINR: false }
      }
      // Fallback: convert INR to USD
      return { amount: Number((inrPrice * usdRate).toFixed(2)), symbol: '$', currency: 'USD', isINR: false }
    }

    return { amount: inrPrice, symbol: '₹', currency: 'INR', isINR: true }
  }

  // Format price as string
  const formatPrice = (inrPrice, countryPrices) => {
    const { amount, symbol, isINR } = getPrice(inrPrice, countryPrices)
    if (isINR) return `₹${Number(amount).toLocaleString('en-IN')}`
    return `${symbol}${Number(amount).toFixed(2)}`
  }

  return (
    <CountryContext.Provider value={{
      country, setCountry, detecting,
      getPrice, formatPrice,
      countries: COUNTRIES,
      usdRate,
    }}>
      {children}
    </CountryContext.Provider>
  )
}

export const useCountry = () => useContext(CountryContext)