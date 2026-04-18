import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-plotly.js', 'plotly.js'],
  },
  server: {
    port: 3000,
    proxy: {
      '/rrg': 'http://localhost:8000',
    },
  },
})
