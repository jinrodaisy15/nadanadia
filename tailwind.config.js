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
        cream: {
          50:  '#fdf9f0',
          100: '#F8F0DC',
          200: '#F5EDD8',
          300: '#EFE0C0',
          400: '#E0C898',
        },
        maroon: {
          50:  '#fdf2f2',
          100: '#f8d4d4',
          200: '#f0a0a0',
          300: '#e06060',
          400: '#C0392B',
          500: '#8B1A1A',
          600: '#6B1010',
          700: '#4A0A0A',
          800: '#2E0505',
        },
        gold: {
          300: '#E8B04A',
          400: '#D4960A',
          500: '#C8860A',
          600: '#A06808',
        },
        brown: {
          800: '#3B1C1C',
          900: '#2A1010',
        },
        dark: {
          bg: '#1B1B1B',
          card: '#2A2A2A',
          rose: '#D87093',
          gold: '#E6C687',
          text: '#F5EDD8',
          subtext: '#D1C4B0',
          border: '#3A3A3A',
        }
      },
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        lato: ['Lato', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp 6s ease-in infinite',
        'pulse-heart': 'pulseHeart 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'sway': 'sway 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        floatUp: {
          '0%':   { transform: 'translateY(100vh) rotate(0deg)', opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) rotate(360deg)', opacity: '0' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':       { transform: 'scale(1.15)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':       { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23F5EDD8'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23EFE0C0' opacity='0.3'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'romantic': '0 4px 20px rgba(139, 26, 26, 0.15), 0 2px 8px rgba(139, 26, 26, 0.1)',
        'card': '0 8px 32px rgba(139, 26, 26, 0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'dark-card': '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0,0,0,0.3)',
        'photo': '4px 4px 16px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.5)',
        'inset-romantic': 'inset 0 2px 8px rgba(139,26,26,0.1)',
      },
    },
  },
  plugins: [],
}
