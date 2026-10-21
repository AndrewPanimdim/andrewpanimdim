import { draggable } from '../lib/andrewpanimdim-textfx/index.ts'

export function setupFloat(): void {
  const box = document.querySelector<HTMLDivElement>('#float')
  if (!box) throw new Error('Missing #float element')

  draggable(box, {
    container: 'main',
    containerPadding: 10,
    friction: 6,
    onGrab: () => box.classList.add('grabbed'),
    onRelease: () => box.classList.remove('grabbed'),
  })
}
