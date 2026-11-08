/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#051b2c',
        },
        accent: {
          teal: '#06b6d4',
          cyan: '#22d3ee',
          amber: '#f59e0b',
          emerald: '#10b981',
          coral: '#f97316',
        },
        navy: {
          800: '#0e1726',
          900: '#080d1a',
          950: '#030712',
        }
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        alexandria: ['Alexandria', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-card': '0 10px 30px -10px rgba(2, 132, 199, 0.15)',
      }
    },
  },
  plugins: [],
}
