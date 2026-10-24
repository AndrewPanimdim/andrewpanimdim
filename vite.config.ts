import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // loadEnv also picks up real environment variables (e.g. BASE_PATH set by CI)
  const env = loadEnv(mode, '.', '')

  return {
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













export function initTopNav() {
  const nav = document.createElement('nav')
  nav.id = 'topnav'
  nav.innerHTML = `
    <div class="tn-full">

      <a class="tn-icon" onclick="window.open('https://github.com/AndrewPanimdim')" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
          <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
      </a>
          
    </div>
    <div class="tn-mini">AP</div>
  `
  document.body.prepend(nav)

  let lastY = window.scrollY
  let waiting = false

  const update = () => {
    const y = window.scrollY
    const delta = y - lastY

    if (y < 10) nav.classList.remove('compact')          // at the top: wide
    else if (delta > 4) nav.classList.add('compact')     // scrolling down: compressed
    else if (delta < -4) nav.classList.remove('compact') // scrolling up: wide

    if (Math.abs(delta) > 4) lastY = y
    waiting = false
  }

  window.addEventListener(
    'scroll',
    () => {
      if (waiting) return
      waiting = true
      requestAnimationFrame(update) // run at most once per frame
    },
    { passive: true },
  )
}