/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
        // Dark mode palette — warm & romantic
        dark: {
          bg:      '#1B1212',
          surface: '#241818',
          card:    '#2E1E1E',
          border:  '#4A2828',
          text:    '#F0E4D4',
          muted:   '#B89080',
          accent:  '#C0555A',
        },
      },
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        lato: ['Lato', 'sans-serif'],
      },
      animation: {
        'float-up':       'floatUp 6s ease-in infinite',
        'pulse-heart':    'pulseHeart 1.5s ease-in-out infinite',
        'fade-in':        'fadeIn 1s ease-out forwards',
        'slide-up':       'slideUp 0.8s ease-out forwards',
        'slide-left':     'slideLeft 0.7s ease-out forwards',
        'slide-right':    'slideRight 0.7s ease-out forwards',
        'sway':           'sway 3s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'skeleton':       'skeleton 1.5s ease-in-out infinite',
        'envelope-flap':  'envelopeFlap 0.6s ease-in-out forwards',
        'letter-slide':   'letterSlide 0.5s ease-out forwards',
        'confetti-fall':  'confettiFall 3s ease-in forwards',
        'typewriter':     'typewriter 2s steps(40) forwards',
        'eq-bar1':        'eqBar1 0.8s ease-in-out infinite',
        'eq-bar2':        'eqBar2 0.6s ease-in-out infinite',
        'eq-bar3':        'eqBar3 1s ease-in-out infinite',
        'bounce-in':      'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
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
        slideLeft: {
          '0%':   { transform: 'translateX(-60px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        slideRight: {
          '0%':   { transform: 'translateX(60px)',  opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':       { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        skeleton: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        envelopeFlap: {
          '0%':   { transform: 'rotateX(0deg)', transformOrigin: 'top' },
          '100%': { transform: 'rotateX(-180deg)', transformOrigin: 'top' },
        },
        letterSlide: {
          '0%':   { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        confettiFall: {
          '0%':   { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        typewriter: {
          '0%':   { width: '0' },
          '100%': { width: '100%' },
        },
        eqBar1: {
          '0%, 100%': { height: '4px' },
          '50%':       { height: '14px' },
        },
        eqBar2: {
          '0%, 100%': { height: '10px' },
          '50%':       { height: '4px' },
        },
        eqBar3: {
          '0%, 100%': { height: '6px' },
          '50%':       { height: '12px' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '60%':  { transform: 'scale(1.05)' },
          '80%':  { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23F5EDD8'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23EFE0C0' opacity='0.3'/%3E%3C/svg%3E\")",
        'skeleton-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'romantic':         '0 4px 20px rgba(139, 26, 26, 0.15), 0 2px 8px rgba(139, 26, 26, 0.1)',
        'card':             '0 8px 32px rgba(139, 26, 26, 0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'photo':            '4px 4px 16px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.5)',
        'inset-romantic':   'inset 0 2px 8px rgba(139,26,26,0.1)',
        'photo-hover':      '8px 8px 28px rgba(0,0,0,0.35), -3px -3px 10px rgba(255,255,255,0.5)',
        'dark-card':        '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
      },
      transitionDelay: {
        '0':   '0ms',
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}
