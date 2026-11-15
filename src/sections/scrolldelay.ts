
export function initScrollDelay(): () => void {
  let current = window.scrollY
  let target = window.scrollY
  let raf = 0

  // Scrolling configuration
  const ease = 0.08
  const scrollMultiplier = 0.6

  const maxScroll = () =>
    Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )

  const clamp = (value: number) =>
    Math.max(0, Math.min(value, maxScroll()))

  const start = () => {
    if (!raf) {
      raf = requestAnimationFrame(tick)
    }
  }

  const tick = () => {
    target = clamp(target)

    current += (target - current) * ease

    // Finish the animation when close enough
    if (Math.abs(target - current) < 0.5) {
      current = target
    }

    window.scrollTo(0, current)

    // Stop when scrolling has settled
    raf = current === target
      ? 0
      : requestAnimationFrame(tick)
  }

  // Handle normal mouse-wheel scrolling
  const onWheel = (event: WheelEvent) => {
    // Preserve browser zoom and modified scrolling gestures
    if (event.ctrlKey || event.metaKey || event.shiftKey) return

    event.preventDefault()

    target = clamp(target + event.deltaY * scrollMultiplier)
    start()
  }

  // Handle navigation requests from the topnav
  const onNavigate = (event: Event) => {
    const customEvent = event as CustomEvent<number>
    const destination = customEvent.detail

    if (typeof destination !== 'number' || !Number.isFinite(destination)) {
      return
    }

    target = clamp(destination)
    start()
  }

  // Synchronize when scrolling through other methods
  const onScroll = () => {
    if (Math.abs(window.scrollY - current) > 2) {
      current = window.scrollY
      target = window.scrollY
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('portfolio:scroll-to', onNavigate)

  // Cleanup
  return function destroyScrollDelay() {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('portfolio:scroll-to', onNavigate)

    cancelAnimationFrame(raf)
    raf = 0
  }
}
