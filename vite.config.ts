import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'   //react import para sa blobatar ppluggin


export default defineConfig(({ mode }) => {
  // loadEnv also picks up real environment variables (e.g. BASE_PATH set by CI)
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],      //react import para sa blobatar ppluggin
    // GitHub Pages is served from /andrewpanimdim/; Vercel is served from /
    base: env.BASE_PATH || '/',
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  }
})