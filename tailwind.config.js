/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'emerald-deep': '#006400',
        'gold-luxury': '#ffd700',
      },
    },
  },
  plugins: [],
}
