import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages is served from /andrewpanimdim/; Vercel is served from /
  base: process.env.BASE_PATH ?? '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
