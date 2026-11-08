/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E8C766',
          dark: '#A37D2C',
          50: '#FBF8F0',
          100: '#F5EED9',
          200: '#EBDCB4',
          300: '#DEC68A',
          400: '#D4B466',
          500: '#C9A24B',
          600: '#A88335',
          700: '#846424',
          800: '#5F4619',
          900: '#3A290E',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          bg: '#0A0A0A',
          surface: '#121212',
          card: '#181818',
          cardHover: '#202020',
          border: '#282828',
          muted: '#8E8E93',
        },
        light: {
          DEFAULT: '#FFFFFF',
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          card: '#F4F4F6',
          border: '#E5E5EA',
          muted: '#636366',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A24B 0%, #E8C766 50%, #C9A24B 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C9A24B 0%, #FFF3B0 50%, #C9A24B 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 0%, #1f1a10 0%, #0A0A0A 70%)',
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(201, 162, 75, 0.15)',
        'gold-md': '0 4px 20px rgba(201, 162, 75, 0.25)',
        'gold-lg': '0 10px 30px rgba(201, 162, 75, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

