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
    maxScale?: number // biggest size (default 3)
    grow?: number // how fast it grows (default 0.02)
    shrink?: number // how fast it returns to normal (default 0.004, slower = smoother)
    follow?: boolean // move the element to the pointer too (default true)
  }
  
  export function cursertrack(el: HTMLElement, options: CurserTrackOptions = {}): { destroy: () => void } {
    const { threshold = 1.2, maxSpeed = 5, maxScale = 5, grow = 0.01, shrink = 0.004, follow = true } = options
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  
    let x = 0, y = 0
    let lastX = 0, lastY = 0, lastT = 0
    let speed = 0 // smoothed pointer speed, px/ms
    let scale = 5
    let raf = 0, lastFrame = 0
  
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (lastT) {
        const dt = Math.max(now - lastT, 1)
        const inst = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt
        speed = speed * 0.6 + inst * 0.4 // smooth out jittery samples
      }
      lastX = x = e.clientX; lastY = y = e.clientY; lastT = now
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
    raf = requestAnimationFrame(tick)
  
    return {
      destroy() {
        window.removeEventListener('pointermove', onMove)
        cancelAnimationFrame(raf)
        el.style.transform = ''
      },
    }
  }