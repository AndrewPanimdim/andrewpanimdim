const SVG_NS = 'http://www.w3.org/2000/svg'
let defs: SVGSVGElement | null = null

// One hidden <svg> on the page holds every distortion filter
function getDefs(): SVGSVGElement {
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'svg')
    defs.setAttribute('width', '0')
    defs.setAttribute('height', '0')
    defs.setAttribute('aria-hidden', 'true')
    defs.style.position = 'absolute'
    document.body.appendChild(defs)
  }
  return defs
}

export interface DistortOptions {
  strength?: number // how far pixels get pushed at most (default 40)
  ease?: number // 0 to 1, how quickly it reacts (default 0.12)
  frequency?: number // size of the ripples, lower = bigger waves (default 0.012)
}

/**
 * Distort `target` while the pointer is over `area`.
 * Returns a cleanup function.
 */
export function distortOnHover(
  area: HTMLElement,
  target: HTMLElement,
  options: DistortOptions = {},
): () => void {
  const { strength = 40, ease = 0.12, frequency = 0.012 } = options

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  // Build this element's own filter: noise -> displaces the picture
  const id = `distort-${Math.random().toString(36).slice(2, 8)}`
  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.setAttribute('id', id)
  filter.setAttribute('color-interpolation-filters', 'sRGB')

  const noise = document.createElementNS(SVG_NS, 'feTurbulence')
  noise.setAttribute('type', 'fractalNoise')
  noise.setAttribute('baseFrequency', `${frequency} ${frequency * 2}`)
  noise.setAttribute('numOctaves', '2')
  noise.setAttribute('seed', '3')
  noise.setAttribute('result', 'noise')

  const displace = document.createElementNS(SVG_NS, 'feDisplacementMap')
  displace.setAttribute('in', 'SourceGraphic')
  displace.setAttribute('in2', 'noise')
  displace.setAttribute('scale', '0')
  displace.setAttribute('xChannelSelector', 'R')
  displace.setAttribute('yChannelSelector', 'G')

  filter.append(noise, displace)
  getDefs().appendChild(filter)

  let current = 0
  let goal = 0
  let raf = 0

  const tick = () => {
    current += (goal - current) * ease
    if (Math.abs(goal - current) < 0.2) current = goal
    displace.setAttribute('scale', current.toFixed(2))

    if (current === 0 && goal === 0) {
      target.style.filter = '' // fully settled: switch the effect off
      raf = 0
      return
    }
    raf = requestAnimationFrame(tick)
  }

  const run = () => {
    target.style.filter = `url(#${id})`
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const onMove = (e: PointerEvent) => {
    const box = area.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width // 0 left ... 1 right
    const py = (e.clientY - box.top) / box.height // 0 top ... 1 bottom
    // the ripple pattern shifts with the pointer, so it feels like it follows you
    noise.setAttribute(
      'baseFrequency',
      `${frequency * (0.6 + px)} ${frequency * (1.2 + py)}`,
    )
    goal = strength
    run()
  }

  const onLeave = () => {
    goal = 0
    run()
  }

  area.addEventListener('pointermove', onMove)
  area.addEventListener('pointerleave', onLeave)

  return () => {
    area.removeEventListener('pointermove', onMove)
    area.removeEventListener('pointerleave', onLeave)
    cancelAnimationFrame(raf)
    target.style.filter = ''
    filter.remove()
  }
}