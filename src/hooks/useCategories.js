import { useState, useEffect } from 'react'
import axios from 'axios'

// Shown instantly while the API loads (and if it fails) so menus never flash empty
const DEFAULTS = [
  { name: 'Janmashtami',         slug: 'janmashtami' },
  { name: 'Divine Idols',        slug: 'divine-idols' },
  { name: 'Wooden MDF Idols',    slug: 'wooden-mdf-idols' },
  { name: 'Festive Sets',        slug: 'festive-sets' },
  { name: 'Home Décor',          slug: 'home-decor' },
  { name: 'Candles & Fragrance', slug: 'candles' },
  { name: 'Gift Sets',           slug: 'gift-sets' },
  { name: 'Kids & Toys',         slug: 'kids-toys' },
  { name: 'Rangoli & Decor',     slug: 'rangoli' },
]

let cache = null
let pending = null

export default function useCategories() {
  const [categories, setCategories] = useState(cache || DEFAULTS)

  useEffect(() => {
    if (cache) return
    pending = pending || axios.get('/api/categories')
      .then(r => { cache = r.data.categories || []; return cache })
      .catch(() => null)
    let alive = true
    pending.then(c => { if (alive && c?.length) setCategories(c) })
    return () => { alive = false }
  }, [])

  return categories
}
