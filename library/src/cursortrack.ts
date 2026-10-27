// ---------- PURE CORE (no DOM, easy to test) ----------

/** Pointer speed (px per ms) -> target scale. Slow = 1, fast = up to maxScale. */
export const speedToScale = (speed: number, threshold: number, maxSpeed: number, maxScale: number): number => {
  if (speed <= threshold) return 1
  const t = Math.min((speed - threshold) / (maxSpeed - threshold), 1)
  return 1 + (maxScale - 1) * t
}

/** Move `current` toward `target`, frame-rate independent. Higher rate = faster. */
export const approach = (current: number, target: number, rate: number, dt: number): number =>
  current + (target - current) * (1 - Math.exp(-rate * dt))

// ---------- THIN SHELL (events + rAF) ----------

export interface CurserTrackOptions {
  threshold?: number // px/ms; below this the cursor is "moving normally" (default 1.2)
  maxSpeed?: number // px/ms at which it reaches maxScale (default 5)
  maxScale?: number // biggest size (default 5)
  grow?: number // how fast it grows (default 0.01)
  shrink?: number // how fast it returns to normal (default 0.004, slower = smoother)
  follow?: boolean // move the element to the pointer too (default true)
  hideOutside?: boolean // fade out when the pointer leaves the page or window (default true)
  edge?: number // px from the window edge that counts as "leaving" (default 2)
}

export function cursertrack(el: HTMLElement, options: CurserTrackOptions = {}): { destroy: () => void } {
  const {
    threshold = 1.2,
    maxSpeed = 5,
    maxScale = 5,
    grow = 0.01,
    shrink = 0.004,
    follow = true,
    hideOutside = true,
    edge = 2,
  } = options
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  let x = 0, y = 0
  let lastX = 0, lastY = 0, lastT = 0
  let speed = 0 // smoothed pointer speed, px/ms
  let scale = 5
  let raf = 0, lastFrame = 0

  // Remember what we change, so destroy() can put it back
  const prevOpacity = el.style.opacity
  const prevTransition = el.style.transition

  const setVisible = (visible: boolean) => {
    if (hideOutside) el.style.opacity = visible ? '1' : '0'
  }
  if (hideOutside) {
    el.style.transition = 'opacity 0.2s ease'
    el.style.opacity = '0' // hidden until the pointer is actually seen
  }

  // true when the pointer sits on (or past) the window border
  const atEdge = (px: number, py: number) =>
    px <= edge || py <= edge || px >= window.innerWidth - 1 - edge || py >= window.innerHeight - 1 - edge

  const onMove = (e: PointerEvent) => {
    setVisible(!atEdge(e.clientX, e.clientY))
    const now = performance.now()
    if (lastT) {
      const dt = Math.max(now - lastT, 1)
      const inst = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt
      speed = speed * 0.6 + inst * 0.4 // smooth out jittery samples
    }
    lastX = x = e.clientX; lastY = y = e.clientY; lastT = now
  }

  // Several signals, because browsers differ. Any one of them hides the dot.
  const onOut = (e: MouseEvent) => {
    if (!e.relatedTarget) setVisible(false) // pointer left the page
  }
  const onLeave = () => setVisible(false) // pointer left the document
  const onBlur = () => setVisible(false) // window lost focus
  const onVisibility = () => {
    if (document.hidden) setVisible(false)
  }

  const tick = (now: number) => {
    const dt = lastFrame ? now - lastFrame : 16
    lastFrame = now
    if (now - lastT > 60) speed = 0 // no pointermove events = not moving
    const target = reduce ? 1 : speedToScale(speed, threshold, maxSpeed, maxScale)
    scale = approach(scale, target, target > scale ? grow : shrink, dt)
    const pos = follow ? `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) ` : ''
    el.style.transform = `${pos}scale(${scale})`
    raf = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onMove)
  document.addEventListener('mouseout', onOut)
  document.documentElement.addEventListener('mouseleave', onLeave)
  window.addEventListener('blur', onBlur)
  document.addEventListener('visibilitychange', onVisibility)
  raf = requestAnimationFrame(tick)

  return {
    destroy() {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      el.style.transform = ''
      el.style.opacity = prevOpacity
      el.style.transition = prevTransition
    },
  }
}