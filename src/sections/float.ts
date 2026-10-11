import { createDraggable } from 'animejs'

export function setupFloat(): void {
  const box = document.querySelector<HTMLDivElement>('#float')
  if (!box) throw new Error('Missing #float element')

  createDraggable(box, {
    container: 'main',
    containerPadding: 10,
    releaseStiffness: 40,
    releaseEase: 'out(3)',
    onGrab: () => box.classList.add('grabbed'),
    onRelease: () => box.classList.remove('grabbed'),
  })
}