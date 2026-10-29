import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // loadEnv also picks up real environment variables (e.g. BASE_PATH set by CI)
  const env = loadEnv(mode, '.', '')

  return {
    // GitHub Pages is served from /andrewpanimdim/; Vercel is served from /
    base: env.BASE_PATH || '/',

    build: {
      rollupOptions: {
        // every HTML page of the site is listed here
        input: {
          main: 'index.html',
          projects: 'projects.html',
          docs: 'docs.html',
        },
      },
    },

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