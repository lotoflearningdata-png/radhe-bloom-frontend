// frontend/src/components/ui/CountrySelector.jsx
import { useContext, useState, useRef, useEffect } from 'react'
import { CountryContext, COUNTRIES } from '../../context/CountryContext'
import { ChevronDown } from 'lucide-react'

export default function CountrySelector() {
  const { country, setCountry, detecting } = useContext(CountryContext)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (detecting) return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cream-100 animate-pulse">
      <span className="text-xs text-cream-400">...</span>
    </div>
  )

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
          bg-cream-100 hover:bg-cream-200 transition-colors cursor-pointer"
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="text-xs font-bold text-devotion-brown hidden sm:inline">
          {country.currency}
        </span>
        <ChevronDown size={11} className={`text-cream-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-warm-lg
          border border-cream-200 py-2 w-56 z-[999] overflow-hidden">

          {/* India */}
          <div>
            <p className="text-xs text-cream-400 font-bold uppercase tracking-wider px-4 pt-2 pb-1">
              India
            </p>
            {COUNTRIES.filter(c => c.tier === 'india').map(c => (
              <button key={c.code} type="button"
                onClick={() => { setCountry(c.code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${country.code === c.code ? 'bg-saffron-50 text-saffron-700 font-bold' : 'text-devotion-brown hover:bg-cream-50'}`}>
                <span className="text-lg">{c.flag}</span>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm leading-none">{c.name}</p>
                  <p className="text-xs text-cream-400 mt-0.5">{c.currency}</p>
                </div>
                {country.code === c.code && <span className="text-saffron-500 text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>

          <hr className="border-cream-200 my-1" />

          {/* US */}
          <div>
            <p className="text-xs text-cream-400 font-bold uppercase tracking-wider px-4 pt-1 pb-1">
              United States
            </p>
            {COUNTRIES.filter(c => c.tier === 'us').map(c => (
              <button key={c.code} type="button"
                onClick={() => { setCountry(c.code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${country.code === c.code ? 'bg-saffron-50 text-saffron-700 font-bold' : 'text-devotion-brown hover:bg-cream-50'}`}>
                <span className="text-lg">{c.flag}</span>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm leading-none">{c.name}</p>
                  <p className="text-xs text-cream-400 mt-0.5">{c.currency}</p>
                </div>
                {country.code === c.code && <span className="text-saffron-500 text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>

          <hr className="border-cream-200 my-1" />

          {/* Other countries */}
          <div>
            <p className="text-xs text-cream-400 font-bold uppercase tracking-wider px-4 pt-1 pb-1">
              Other Countries
            </p>
            {COUNTRIES.filter(c => c.tier === 'other').map(c => (
              <button key={c.code} type="button"
                onClick={() => { setCountry(c.code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${country.code === c.code ? 'bg-saffron-50 text-saffron-700 font-bold' : 'text-devotion-brown hover:bg-cream-50'}`}>
                <span className="text-lg">{c.flag}</span>
                <div className="text-left flex-1">
                  <p className="font-medium text-sm leading-none">{c.name}</p>
                  <p className="text-xs text-cream-400 mt-0.5">{c.currency}</p>
                </div>
                {country.code === c.code && <span className="text-saffron-500 text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}