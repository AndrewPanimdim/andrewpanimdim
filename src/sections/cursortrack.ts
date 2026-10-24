import { cursertrack } from 'andrewpanimdim'

export function initCurserTrack() {
  const dot = document.createElement('div')
  dot.id = 'cursertrack'
  document.body.appendChild(dot)
  cursertrack(dot, { maxScale: 5})
}