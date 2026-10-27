// Put your GIFs in the "public/gif" folder and list their file names here
const CARDS = [
  { id: 'am-a', title: 'Content A', text: 'Write the first block of content here.', gif: 'a.gif' },
  { id: 'am-b', title: 'Content B', text: 'Write the second block of content here.', gif: 'b.gif' },
  { id: 'am-c', title: 'Content c', text: 'Write the third block of content here.', gif: 'b.gif' },
]

export function setmoreaboutme(): () => void {
  const root = document.querySelector<HTMLElement>('#moreAM')
  if (!root) throw new Error('Missing #moreAM element')

  // BASE_URL keeps the paths working on GitHub Pages (/andrewpanimdim/) and Vercel (/)
  const base = import.meta.env.BASE_URL

  const cardsHtml = CARDS.map(
    (card) => `
    <div class="am-card" id="${card.id}">
      <div class="am-media">
        <img src="${base}gif/${card.gif}" alt="${card.title}" draggable="false" />
      </div>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
    </div>`,
  ).join('')

  // The "see more" block goes after the cards and links to the projects page
  const seeMoreHtml = `
    <a class="am-card am-more" id="am-more" href="${base}projects.html">
      <span>See more</span>
      <span class="am-more-arrow" aria-hidden="true">→</span>
    </a>`

  root.innerHTML = cardsHtml + seeMoreHtml

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

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 150}ms` // each card follows the one before
    observer.observe(card)
  })

  // Cleanup, same pattern as the other sections
  return () => {
    observer.disconnect()
    root.innerHTML = ''
  }
}