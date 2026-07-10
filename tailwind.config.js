/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        saffron: {
          50:  '#FDFAF4',
          100: '#F5ECD9',
          200: '#E8D5B0',
          300: '#D4A853',
          400: '#C9960A',
          500: '#C9960A',   // primary gold — all buttons, links, accents
          600: '#a87c08',
          700: '#856207',
          800: '#6a4e06',
          900: '#3D2B1F',
        },
        cream: {
          50:  '#FDFAF4',
          100: '#F5ECD9',
          200: '#E8D5B0',
          300: '#D4C09A',
          400: '#B8935a',
          500: '#9a7640',
          600: '#7a5c2e',
        },
        'devotion-dark':  '#3D2B1F',
        'devotion-brown': '#5C3D25',
      },
      boxShadow: {
        'warm':    '0 4px 20px rgba(201, 150, 10, 0.15)',
        'warm-lg': '0 8px 40px rgba(201, 150, 10, 0.25)',
        'card':    '0 2px 12px rgba(61, 43, 31, 0.08)',
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #FDFAF4 0%, #F5ECD9 100%)',
      },
    },
  },
  plugins: [],
}