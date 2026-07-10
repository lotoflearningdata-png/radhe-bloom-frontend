// frontend/src/context/CurrencyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

export const CurrencyContext = createContext({
  currency: 'INR',
  rate: null,
  loading: true,
  toggleCurrency: () => {},
  formatPrice: (p) => `₹${Number(p).toLocaleString('en-IN')}`,
  convertPrice: (p) => p,
  symbol: '₹',
})

const FRANKFURTER = 'https://api.frankfurter.dev/v2/rate/INR/USD'
const FAWAZ = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.json'

async function fetchLiveRate() {
  // Try Frankfurter first — new v2 endpoint
  try {
    const res  = await fetch(FRANKFURTER)
    const data = await res.json()
    if (data?.rate) {
      console.log('✅ Rate from Frankfurter:', data.rate)
      return data.rate
    }
  } catch (e) {
    console.warn('Frankfurter failed, trying fallback...', e.message)
  }

  // Try fawazahmed0 as fallback
  try {
    const res  = await fetch(FAWAZ)
    const data = await res.json()
    const rate = data?.inr?.usd
    if (rate) {
      console.log('✅ Rate from fawazahmed0:', rate)
      return rate
    }
  } catch (e) {
    console.warn('fawazahmed0 failed too:', e.message)
  }

  // Final fallback
  console.warn('Both APIs failed, using fallback rate')
  return 0.012
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR')
  const [rate, setRate]         = useState(null)
  const [loading, setLoading]   = useState(true)

  // Restore saved preference
  useEffect(() => {
    const saved = localStorage.getItem('rb_currency')
    if (saved === 'USD' || saved === 'INR') setCurrency(saved)
  }, [])

  // Fetch live rate with caching
  useEffect(() => {
    const cached      = localStorage.getItem('rb_usd_rate')
    const cachedAt    = localStorage.getItem('rb_usd_rate_time')
    const ONE_HOUR    = 60 * 60 * 1000

    // Use cached if less than 1 hour old
    if (cached && cachedAt && Date.now() - Number(cachedAt) < ONE_HOUR) {
      console.log('✅ Using cached rate:', cached)
      setRate(Number(cached))
      setLoading(false)
      return
    }

    // Fetch fresh rate
    fetchLiveRate().then(rate => {
      setRate(rate)
      localStorage.setItem('rb_usd_rate', String(rate))
      localStorage.setItem('rb_usd_rate_time', String(Date.now()))
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const toggleCurrency = () => {
    const next = currency === 'INR' ? 'USD' : 'INR'
    setCurrency(next)
    localStorage.setItem('rb_currency', next)
  }

  const formatPrice = (inrPrice) => {
    if (inrPrice === null || inrPrice === undefined) return ''
    const num = Number(inrPrice)
    if (currency === 'USD' && rate) {
      return `$${(num * rate).toFixed(2)}`
    }
    return `₹${num.toLocaleString('en-IN')}`
  }

  const convertPrice = (inrPrice) => {
    if (currency === 'USD' && rate) return Number((inrPrice * rate).toFixed(2))
    return inrPrice
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      rate,
      loading,
      toggleCurrency,
      formatPrice,
      convertPrice,
      symbol: currency === 'INR' ? '₹' : '$',
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used inside CurrencyProvider')
  }
  return context
}