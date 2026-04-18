/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        leading:   { DEFAULT: '#10b981', light: '#d1fae5', bg: 'rgba(16,185,129,0.08)' },
        weakening: { DEFAULT: '#f59e0b', light: '#fef3c7', bg: 'rgba(245,158,11,0.08)' },
        lagging:   { DEFAULT: '#ef4444', light: '#fee2e2', bg: 'rgba(239,68,68,0.08)'  },
        improving: { DEFAULT: '#3b82f6', light: '#dbeafe', bg: 'rgba(59,130,246,0.08)' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
