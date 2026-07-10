// frontend/src/components/ui/CurrencyToggle.jsx
import { useContext } from 'react'
import { CurrencyContext } from '../../context/CurrencyContext'

export default function CurrencyToggle() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) return null

  const { currency, toggleCurrency, rate } = ctx
  const isUSD = currency === 'USD'

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Toggle clicked! Current:', currency)
    toggleCurrency()
  }

  return (
    <div
      className="flex items-center gap-1.5 shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      {/* INR label */}
      <span
        onClick={handleToggle}
        className={`text-xs font-bold cursor-pointer select-none transition-colors
          ${!isUSD ? 'text-saffron-600' : 'text-cream-400'}`}
      >
        ₹
      </span>

      {/* Toggle track — using div instead of button to avoid form/nav issues */}
      <div
        role="switch"
        aria-checked={isUSD}
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle(e)}
        className={`relative inline-flex shrink-0 w-11 h-6 rounded-full cursor-pointer
          transition-colors duration-200 ease-in-out select-none
          ${isUSD ? 'bg-saffron-500' : 'bg-gray-300'}`}
      >
        {/* Sliding dot */}
        <span
          className={`pointer-events-none inline-block w-4 h-4 mt-1 bg-white rounded-full shadow
            transform transition-transform duration-200 ease-in-out
            ${isUSD ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </div>

      {/* USD label */}
      <span
        onClick={handleToggle}
        className={`text-xs font-bold cursor-pointer select-none transition-colors
          ${isUSD ? 'text-saffron-600' : 'text-cream-400'}`}
      >
        $
      </span>

      {/* Live rate */}
      {rate && (
        <span className="hidden lg:inline text-xs text-cream-400 bg-cream-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          1₹ = ${rate.toFixed(4)}
        </span>
      )}
    </div>
  )
}