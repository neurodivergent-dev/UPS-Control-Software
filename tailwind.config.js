/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--color-accent)",
        background: "#000000",
        neon: "#00FF00",
        alert: "#FF8000",
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow-neon': '0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.2)',
        'glow-alert': '0 0 10px rgba(255, 128, 0, 0.5), 0 0 20px rgba(255, 128, 0, 0.2)',
      },
      screens: {
        'xs': '475px',
      }
    },
  },
  plugins: [],
}
