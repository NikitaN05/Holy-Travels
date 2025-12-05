/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ed7519',
          600: '#de5b0f',
          700: '#b8430f',
          800: '#923614',
          900: '#762f14',
          950: '#401508',
        },
        saffron: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc171',
          400: '#ff9d38',
          500: '#ff7f11',
          600: '#f06307',
          700: '#c74908',
          800: '#9e3a0f',
          900: '#803210',
          950: '#451706',
        },
        maroon: {
          50: '#fdf3f3',
          100: '#fce4e4',
          200: '#fbcdcd',
          300: '#f6abab',
          400: '#ef7a7a',
          500: '#e34f4f',
          600: '#cf3131',
          700: '#ad2525',
          800: '#8f2222',
          900: '#771f1f',
          950: '#420d0d',
        },
        temple: {
          gold: '#D4AF37',
          bronze: '#CD7F32',
          copper: '#B87333',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern': "url('/src/assets/patterns/mandala.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'temple-gradient': 'linear-gradient(135deg, #ff7f11 0%, #ed7519 50%, #de5b0f 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

