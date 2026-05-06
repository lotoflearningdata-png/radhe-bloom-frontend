/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  '#fff8f0',
          100: '#ffefd6',
          200: '#ffdba3',
          300: '#ffc266',
          400: '#ffa030',
          500: '#f97f0a',
          600: '#e06200',
          700: '#b84d00',
          800: '#923d07',
          900: '#78340b',
        },
        cream: {
          50:  '#fdfaf5',
          100: '#f9f3e7',
          200: '#f3e5cc',
          300: '#ead0a4',
          400: '#ddb474',
          500: '#d09650',
        },
        devotion: {
          brown: '#3d1f0a',
          dark:  '#1a0a00',
          gold:  '#c9860a',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lato"', 'sans-serif'],
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #f97f0a 0%, #e06200 100%)',
        'cream-gradient':   'linear-gradient(180deg, #fdfaf5 0%, #f9f3e7 100%)',
      },
      boxShadow: {
        'warm':    '0 4px 24px rgba(249,127,10,0.15)',
        'warm-lg': '0 8px 48px rgba(249,127,10,0.25)',
        'card':    '0 2px 16px rgba(61,31,10,0.08)',
      }
    },
  },
  plugins: [],
}
