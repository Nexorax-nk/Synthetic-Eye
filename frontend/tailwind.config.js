/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sre-bg': '#0B0E14',
        'sre-card': '#161B22',
        'sre-border': '#30363D',
        'sre-green': '#238636',
        'sre-red': '#F85149',
        'sre-blue': '#58A6FF',
      }
    }
  },
  plugins: [],
}

