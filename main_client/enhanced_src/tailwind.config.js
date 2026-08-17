/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#1a3270',
          600: '#112354',
          700: '#0d1b3e',
          900: '#070e1f',
        },
        gold: {
          50: '#fff8ec',
          100: '#ffefc8',
          300: '#ffd780',
          400: '#ffc55a',
          500: '#f5a623',
          600: '#e0901a',
        },
        emerald: {
          400: '#2ec4b6',
          500: '#20a89b',
        },
        crimson: {
          400: '#f05060',
          500: '#e63946',
          600: '#c1121f',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'gold': '0 4px 14px rgba(245,166,35,0.35)',
        'gold-lg': '0 8px 28px rgba(245,166,35,0.4)',
        'navy': '0 4px 14px rgba(13,27,62,0.3)',
        'card': '0 1px 3px rgba(13,27,62,0.08), 0 1px 2px rgba(13,27,62,0.06)',
        'card-hover': '0 8px 24px rgba(13,27,62,0.12)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0d1b3e 0%, #1a3270 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f5a623 0%, #ffc55a 100%)',
      },
    },
  },
  plugins: [],
};
