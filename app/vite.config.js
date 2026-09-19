import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    emptyOutDir: false,
  },
  server: {
    port: 5173,
    proxy: {
      '/data':  'http://localhost:8081',
      '/api':   'http://localhost:8081',
      '/ping':  'http://localhost:8081',
      '/music': 'http://localhost:8081',
    },
  },
})
