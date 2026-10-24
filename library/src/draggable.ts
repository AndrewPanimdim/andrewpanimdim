export interface DraggableOptions {
  /** Keep the element inside this container (element or CSS selector). */
  container?: HTMLElement | string
  /** Space in pixels to keep between the element and the container edge. */
  containerPadding?: number
  /** How quickly a thrown element slows down. Higher = stops sooner. Default 6. */
  friction?: number
  /** Called when the pointer grabs the element. */
  onGrab?: (el: HTMLElement) => void
  /** Called when the pointer lets go. */
  onRelease?: (el: HTMLElement) => void
}

export interface DraggableHandle {
  /** Remove all listeners and put the element back where it started. */
  destroy: () => void
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

/** Make an element draggable with mouse, touch or pen. */
export function draggable(
  el: HTMLElement,
  options: DraggableOptions = {},
): DraggableHandle {
  const { containerPadding = 0, friction = 6, onGrab, onRelease } = options

  let x = 0 // current translation (the only thing we change)
  let y = 0
  let bounds: Bounds | null = null
  let startPointerX = 0
  let startPointerY = 0
  let startX = 0
  let startY = 0
  let vx = 0 // velocity in px per ms
  let vy = 0
  let lastTime = 0
  let rafId = 0
  let dragging = false

  const previousTouchAction = el.style.touchAction
  el.style.touchAction = 'none' // stop the browser scrolling while dragging

  const apply = () => {
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const resolveContainer = (): HTMLElement | null => {
    const c = options.container
    if (!c) return null
    return typeof c === 'string' ? document.querySelector<HTMLElement>(c) : c
  }

  /** Work out how far the element may travel, based on where it sits "at rest". */
  const measureBounds = (): Bounds | null => {
    const container = resolveContainer()
    if (!container) return null
    const box = container.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const restLeft = rect.left - x // position if translation were 0
    const restTop = rect.top - y
    return {
      minX: box.left + containerPadding - restLeft,
      maxX: box.right - containerPadding - rect.width - restLeft,
      minY: box.top + containerPadding - restTop,
      maxY: box.bottom - containerPadding - rect.height - restTop,
    }
  }

  const place = (nextX: number, nextY: number) => {
    x = bounds ? clamp(nextX, bounds.minX, bounds.maxX) : nextX
    y = bounds ? clamp(nextY, bounds.minY, bounds.maxY) : nextY
    apply()
  }

  const glide = (now: number) => {
    const dt = Math.min(now - lastTime, 50)
    lastTime = now
    const decay = Math.exp((-friction * dt) / 1000)
    vx *= decay
    vy *= decay
    const beforeX = x
    const beforeY = y
    place(x + vx * dt, y + vy * dt)
    if (x === beforeX) vx = 0 // hit a wall: stop pushing into it
    if (y === beforeY) vy = 0
    if (Math.hypot(vx, vy) > 0.02) rafId = requestAnimationFrame(glide)
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    cancelAnimationFrame(rafId)
    dragging = true
    el.setPointerCapture(event.pointerId)
    bounds = measureBounds()
    startPointerX = event.clientX
    startPointerY = event.clientY
    startX = x
    startY = y
    vx = 0
    vy = 0
    lastTime = event.timeStamp
    onGrab?.(el)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return
    const dt = event.timeStamp - lastTime
    const beforeX = x
    const beforeY = y
    place(
      startX + event.clientX - startPointerX,
      startY + event.clientY - startPointerY,
    )
    if (dt > 0) {
      // smooth the velocity a little so one jittery event can't fling it
      vx = 0.5 * vx + (0.5 * (x - beforeX)) / dt
      vy = 0.5 * vy + (0.5 * (y - beforeY)) / dt
    }
    lastTime = event.timeStamp
  }

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging) return
    dragging = false
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
    onRelease?.(el)
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced && Math.hypot(vx, vy) > 0.02) {
      lastTime = performance.now()
      rafId = requestAnimationFrame(glide)
    }
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointercancel', onPointerUp)

  return {
    destroy() {
      cancelAnimationFrame(rafId)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.style.touchAction = previousTouchAction
      el.style.transform = ''
    },
  }
}
