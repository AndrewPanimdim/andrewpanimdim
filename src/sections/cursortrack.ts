import { cursertrack } from 'andrewpanimdim'

export function initCurserTrack() {
  const dot = document.createElement('div')
  dot.id = 'cursertrack'
  document.body.appendChild(dot)
  cursertrack(dot, { maxScale: 5 })

  // Hide the dot whenever the pointer isn't over the page
  dot.style.transition = 'opacity 0.2s ease'
  dot.style.opacity = '0'

  const show = () => (dot.style.opacity = '1')
  const hide = () => (dot.style.opacity = '0')

  // last known position on the window border = pointer is leaving
  window.addEventListener('pointermove', (e) => {
    const edge = 2
    const onEdge =
      e.clientX <= edge ||
      e.clientY <= edge ||
      e.clientX >= window.innerWidth - 1 - edge ||
      e.clientY >= window.innerHeight - 1 - edge
    if (onEdge) hide()
    else show()
  })

  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) hide() // pointer left the page
  })
  document.documentElement.addEventListener('mouseleave', hide)
  window.addEventListener('blur', hide)
}