/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#202520',
        paper: '#f6f5f0',
        moss: '#46624b',
        ochre: '#bd7b2f',
      },
      boxShadow: {
        card: '0 12px 35px rgba(38, 48, 38, 0.08)',
      },
    },
  },
  plugins: [],
}
