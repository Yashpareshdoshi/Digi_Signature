/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          darker: '#06080d',
          card: '#111726',
          border: '#1e293b',
          accent: '#06b6d4',
          accentGlow: 'rgba(6, 182, 212, 0.15)',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
