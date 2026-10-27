export function initScrollDelay() {
  let current = window.scrollY
  let target = window.scrollY
  let raf = 0

  // Adjust these values to customize scrolling
  const ease = 0.08
  const scrollMultiplier = 0.6

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

  const clamp = (value: number) => Math.max(0, Math.min(value, maxScroll()))

  const tick = () => {
    target = clamp(target) // page height can change, so re-check the limit
    current += (target - current) * ease

    // Finish cleanly when close to the target
    if (Math.abs(target - current) < 0.5) current = target

    window.scrollTo(0, current)

    // Stop the loop once settled, so we never fight other kinds of scrolling
    raf = current === target ? 0 : requestAnimationFrame(tick)
  }

  const start = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const onWheel = (event: WheelEvent) => {
    // Preserve browser zoom and modified scrolling gestures
    if (event.ctrlKey || event.metaKey || event.shiftKey) return

    event.preventDefault()
    target = clamp(target + event.deltaY * scrollMultiplier)
    start()
  }

  // Scrolled some other way (keyboard, scrollbar, touch, anchor link)?
  // Follow it instead of dragging the page back to the old position.
  const onScroll = () => {
    if (Math.abs(window.scrollY - current) > 2) {
      current = target = window.scrollY
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })

  return function destroyScrollDelay() {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
  }
}