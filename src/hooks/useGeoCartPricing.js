// frontend/src/hooks/useGeoCartPricing.js
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCountry } from '../context/CountryContext'

// Geo-aware pricing for cart items. Uses the admin-set country price (US/OTHER)
// where available, otherwise converts the INR price by live rate.
// NOTE: payment itself is still processed in INR — this only controls display.
export function useGeoCartPricing(cart) {
  const { country, getPrice } = useCountry()
  const isINR = country.tier === 'india'
  const [priceMap, setPriceMap] = useState({})
  const idsKey = [...new Set(cart.map(i => i.product._id))].sort().join(',')

  useEffect(() => {
    if (isINR || !idsKey) { setPriceMap({}); return }
    let alive = true
    Promise.all(idsKey.split(',').map(id =>
      axios.get(`/api/pricing/product/${id}`)
        .then(r => [id, r.data.pricing?.prices || {}])
        .catch(() => [id, {}])
    )).then(entries => { if (alive) setPriceMap(Object.fromEntries(entries)) })
    return () => { alive = false }
  }, [idsKey, isINR])

  // item.price is a size-variant price — admin country prices only cover the
  // base product, so variant items always convert from INR
  const unitPrice = (item) => {
    const inr = item.price ?? item.product.price
    const cp  = item.price != null ? {} : (priceMap[item.product._id] || {})
    return getPrice(inr, cp).amount
  }

  // Convert an arbitrary INR amount (shipping, coupon discount) for display
  const convert = (inr) => getPrice(inr, {}).amount

  const fmt = (amount) =>
    isINR ? `₹${Number(amount).toLocaleString('en-IN')}` : `$${Number(amount).toFixed(2)}`

  const subtotal = cart.reduce((s, i) => s + unitPrice(i) * i.qty, 0)

  return { isINR, fmt, convert, unitPrice, subtotal }
}
