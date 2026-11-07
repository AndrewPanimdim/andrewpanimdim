
import '../css/returnnav.css'

export function initReturnNav(): void {
  const navElement = document.querySelector<HTMLElement>('#returnnav')

  if (!navElement) {
    console.error('Return navigation container not found')
    return
  }

  // TypeScript now knows nav is an HTMLElement.
  const nav: HTMLElement = navElement

  const base = import.meta.env.BASE_URL

  nav.innerHTML = `
    <a href="${base}" aria-label="Return to home">
      RETURN
    </a>
  `

  let lastY = window.scrollY
  let directionTravel = 0
  let waiting = false

  const HIDE_DISTANCE = 14
  const SHOW_DISTANCE = 18
  const TOP_THRESHOLD = 10

  function updateNav(): void {
    const currentY = Math.max(0, window.scrollY)
    const delta = currentY - lastY

    if (currentY <= TOP_THRESHOLD) {
      nav.classList.remove('compact')
      directionTravel = 0
    } else {
      directionTravel += delta

      if (directionTravel >= HIDE_DISTANCE) {
        nav.classList.add('compact')
        directionTravel = 0
      } else if (directionTravel <= -SHOW_DISTANCE) {
        nav.classList.remove('compact')
        directionTravel = 0
      }
    }

    lastY = currentY
    waiting = false
  }

  function onScroll(): void {
    if (waiting) return

    waiting = true
    requestAnimationFrame(updateNav)
  }

  window.addEventListener('scroll', onScroll, {
    passive: true,
  })
}
