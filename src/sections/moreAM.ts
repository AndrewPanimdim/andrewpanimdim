import { distortOnHover } from './distort.ts'

// Put your GIFs in the "public/gifs" folder and list their file names here
const CARDS = [
  { id: 'am-a', title: 'Content A', text: 'Write the first block of content here.', gif: 'a.gif' },
  { id: 'am-b', title: 'Content B', text: 'Write the second block of content here.', gif: 'b.gif' },
]

export function setmoreaboutme(): () => void {
  const root = document.querySelector<HTMLElement>('#moreAM')
  if (!root) throw new Error('Missing #moreAM element')

  // BASE_URL keeps the paths working on GitHub Pages (/andrewpanimdim/) and Vercel (/)
  const base = import.meta.env.BASE_URL

  root.innerHTML = CARDS.map(
    (card) => `
    <div class="am-card" id="${card.id}">
      <div class="am-media">
        <img src="${base}gifs/${card.gif}" alt="${card.title}" draggable="false" />
      </div>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
    </div>`,
  ).join('')

  const cards = root.querySelectorAll<HTMLElement>('.am-card')

  // Show each card when it scrolls into view (and keep it shown)
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.15 },
  )

  // Distort each GIF while the pointer is over its frame
  const cleanups: Array<() => void> = []

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 150}ms` // B appears just after A
    observer.observe(card)

    const media = card.querySelector<HTMLElement>('.am-media')
    const img = card.querySelector<HTMLImageElement>('img')
    if (media && img) cleanups.push(distortOnHover(media, img, { strength: 40 }))
  })

  return () => {
    observer.disconnect()
    cleanups.forEach((fn) => fn())
    root.innerHTML = ''
  }
}