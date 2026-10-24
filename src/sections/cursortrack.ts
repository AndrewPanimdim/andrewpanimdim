import { cursertrack } from '../lib/andrewpanimdim-textfx/cursortrack'

export function initCurserTrack() {
  const dot = document.createElement('div')
  dot.id = 'cursertrack'
  document.body.appendChild(dot)
  cursertrack(dot, { maxScale: 3 })
}