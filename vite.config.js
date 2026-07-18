import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'nada-nadia' to your GitHub repository name!
// Example: if repo is github.com/username/my-love-story → base: '/my-love-story/'
const GITHUB_REPO_NAME = 'nadanadia'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${GITHUB_REPO_NAME}/` : '/',
})
