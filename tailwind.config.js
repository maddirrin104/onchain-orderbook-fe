export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}