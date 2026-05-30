/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d4a6f',
          dark: '#0f1d2f'
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f0e6d2',
          dark: '#9e8025'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Lato', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
};
