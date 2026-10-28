export function initTopNav(): () => void {
  // Create the navbar
  const nav = document.createElement('nav')
  nav.id = 'topnav'

  nav.innerHTML = `
    <div class="tn-full">
      <!-- Your nav content goes here. The GitHub link now lives in githubbadge.ts -->
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