import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Jika Vercel, gunakan root '/'. Jika bukan (misal GitHub Pages), gunakan '/nadanadia/'
  base: process.env.VERCEL ? '/' : '/nadanadia/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
        },
      },
    },
    assetsInlineLimit: 4096,
  },
})

