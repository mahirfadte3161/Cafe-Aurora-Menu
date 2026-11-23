/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF7',
          100: '#FBF8EF',
          200: '#F5EFE0',
          300: '#EADFC8',
          card: '#FFFDFA',
        },
        terracotta: {
          50: '#FBF2ED',
          100: '#F6E0D6',
          200: '#ECC3B0',
          300: '#E09F82',
          400: '#D27854',
          500: '#C05621', // Primary brand accent
          600: '#A94420',
          700: '#893418',
          800: '#6E2A15',
          900: '#522011',
        },
        mutedgreen: {
          50: '#F2F6F3',
          100: '#E1ECE3',
          200: '#C4DAC9',
          300: '#9EBFAB',
          400: '#759F87',
          500: '#4A7C59', // Secondary accent
          600: '#3B6447',
          700: '#2F4F38',
          800: '#243C2B',
        },
        darkbrown: {
          900: '#2A180E',
          800: '#382314', // Primary typography
          700: '#4D3421',
          600: '#684931',
          500: '#8B6446',
          400: '#A88364',
          300: '#C8AA90',
        },
        gold: {
          accent: '#D4A359',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-card': '0 2px 10px rgba(56, 35, 20, 0.05), 0 1px 3px rgba(56, 35, 20, 0.03)',
        'soft-hover': '0 6px 18px rgba(56, 35, 20, 0.09), 0 2px 6px rgba(56, 35, 20, 0.05)',
        'elevated': '0 10px 25px -3px rgba(56, 35, 20, 0.1), 0 4px 6px -2px rgba(56, 35, 20, 0.05)',
      }
    },
  },
  plugins: [],
}
