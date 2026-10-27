// ---------- PURE CORE (no DOM, easy to test) ----------

/** How far through the scroll range we are: 0 before `start`, 1 after `end`. */
export const scrollProgress = (y: number, start: number, end: number): number => {
  if (end === start) return y >= end ? 1 : 0
  return Math.min(Math.max((y - start) / (end - start), 0), 1)
}

/** Blend from a to b. t = 0 gives a, t = 1 gives b. */
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t

// ---------- THIN SHELL (scroll + rAF) ----------

export interface ScrollTiltOptions {
  start?: number // scrollY (px) where the effect begins (default 0)
  end?: number // scrollY (px) where it finishes (default 1000)
  rotate?: number // flat rotation in degrees at `end` (default 12)
  rotateX?: number // 3D tilt forward/back in degrees at `end` (default 0)
  rotateY?: number // 3D tilt left/right in degrees at `end` (default 0)
  scale?: number // size at `end`, 1 = unchanged (default 1)
  translateY?: number // extra vertical shift in px at `end` (default 0)
  smooth?: number // 0 to 1; lower = floatier, 1 = instant (default 0.12)
}

export function scrolltilt(el: HTMLElement, options: ScrollTiltOptions = {}): { destroy: () => void } {
  const {
    start = 0,
    end = 1000,
    rotate = 12,
    rotateX = 0,
    rotateY = 0,
    scale = 1,
    translateY = 0,
    smooth = 0.12,
  } = options
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  const previousTransform = el.style.transform
  let current = scrollProgress(window.scrollY, start, end)
  let target = current
  let raf = 0

  const apply = (p: number) => {
    el.style.transform =
      `perspective(900px) translateY(${mix(0, translateY, p)}px) ` +
      `rotateX(${mix(0, rotateX, p)}deg) rotateY(${mix(0, rotateY, p)}deg) ` +
      `rotate(${mix(0, rotate, p)}deg) scale(${mix(1, scale, p)})`
  }

  const tick = () => {
    current += (target - current) * smooth
    if (Math.abs(target - current) < 0.0005) current = target
    apply(current)
    raf = current === target ? 0 : requestAnimationFrame(tick) // stop when settled
  }

  const onScroll = () => {
    target = scrollProgress(window.scrollY, start, end)
    if (reduce || smooth >= 1) {
      current = target
      apply(current)
    } else if (!raf) {
      raf = requestAnimationFrame(tick)
    }
  }

  apply(current)
  window.addEventListener('scroll', onScroll, { passive: true })

  return {
    destroy() {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      el.style.transform = previousTransform
    },
  }
}
