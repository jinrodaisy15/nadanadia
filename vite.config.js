import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path bisa dioverride lewat env BASE_PATH (mis. GitHub Pages: /<nama-repo>/).
  // Vercel -> '/', selain itu default '/nadanadia/'.
  base:
    process.env.BASE_PATH ||
    (process.env.VERCEL ? '/' : '/nadanadia/'),
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

