/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8ee',
          100: '#f9eccc',
          200: '#f3d68b',
          300: '#ecbc4a',
          400: '#e5a524',
          500: '#c98a10',
          600: '#a46c0c',
          700: '#7d500e',
          800: '#664014',
          900: '#573614',
          950: '#321a07',
        },
        charcoal: {
          50: '#f6f5f4',
          100: '#e8e5e2',
          200: '#d2ccc7',
          300: '#b4aba3',
          400: '#93877d',
          500: '#7a6c62',
          600: '#665a51',
          700: '#534844',
          800: '#463e3b',
          900: '#3d3634',
          950: '#211e1c',
        },
        cream: {
          50: '#fdfaf5',
          100: '#f8f0e0',
          200: '#f0ddb8',
          300: '#e6c58a',
          400: '#daa85c',
          500: '#d29040',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
