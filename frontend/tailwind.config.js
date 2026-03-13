/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxe-dark': '#1A120B',
        'luxe-brown': '#3C2A21',
        'luxe-gold': '#D5CEA3',
        'luxe-cream': '#E5E5CB',
      }
    },
  },
  plugins: [],
}