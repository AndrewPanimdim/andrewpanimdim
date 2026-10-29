import './topnav-docs.css'

export function initTopNav(): () => void {
  // BASE_URL keeps the link working on GitHub Pages (/andrewpanimdim/) and Vercel (/)
  const docsUrl = `${import.meta.env.BASE_URL}docs.html`

  // Create the navbar
  const nav = document.createElement('nav')
  nav.id = 'topnav'

  nav.innerHTML = `
    <div class="tn-full">
      <!-- Docs button, left most side -->
      <a class="tn-docs" href="${docsUrl}" aria-label="Open the documentation">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M1 2.75A.75.75 0 0 1 1.75 2h3.5c.97 0 1.85.37 2.5 1 .65-.63 1.53-1 2.5-1h3.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75h-3.5c-.55 0-1.06.22-1.43.57a.75.75 0 0 1-1.04 0A2.02 2.02 0 0 0 5.25 13h-3.5a.75.75 0 0 1-.75-.75v-9.5ZM7.25 4.9A1.5 1.5 0 0 0 5.25 3.5h-2.75v8h2.75c.9 0 1.7.3 2 .78V4.9Zm1.5 7.38c.3-.48 1.1-.78 2-.78h2.75v-8h-2.75a1.5 1.5 0 0 0-2 1.4v7.38Z"/>
        </svg>
        <span>Docs</span>
      </a>

      <!-- More nav content can go here -->
    </div>

    <!-- Compact navbar label -->
    <div class="tn-mini">AP</div>
  `

  document.body.prepend(nav)

  // Compact navbar when scrolling down
  let lastY = window.scrollY
  let waiting = false

  const update = () => {
    const y = window.scrollY
    const delta = y - lastY

    if (y < 10) {
      nav.classList.remove('compact')
    } else if (delta > 4) {
      nav.classList.add('compact')
    } else if (delta < -4) {
      nav.classList.remove('compact')
    }

    if (Math.abs(delta) > 4) {
      lastY = y
    }

    waiting = false
  }

  const onScroll = () => {
    if (waiting) return

    waiting = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, {
    passive: true,
  })

  // Cleanup if the navbar is removed or reinitialized
  return () => {
    window.removeEventListener('scroll', onScroll)
    nav.remove()
  }
}