// Put your GIFs in the "public/gif" folder and list their file names here
const CARDS = [
  { id: 'am-a', title: 'Content A', text: 'Write the first block of content here.', gif: 'a.gif' },
  { id: 'am-b', title: 'Content B', text: 'Write the second block of content here.', gif: 'b.gif' },
  { id: 'am-c', title: 'Content c', text: 'Write the third block of content here.', gif: 'b.gif' },
  { id: 'am-d', title: 'Content d', text: 'Write the fourth block of content here.', gif: 'a.gif' },
]

// How much of a card must be on screen before it appears (0.2 = 20%)
const SHOW_WHEN_VISIBLE = 0.2
// Ignore the bottom part of the screen, so a card appears once it is
// comfortably in view and not the instant its top edge peeks in
const BOTTOM_MARGIN = '12%'

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

  // Show each card only when ITS OWN spot is in the scroll view (and keep it shown)
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    },
    {
      threshold: SHOW_WHEN_VISIBLE,
      rootMargin: `0px 0px -${BOTTOM_MARGIN} 0px`,
    },
  )

  cards.forEach((card) => {
    observer.observe(card)
  })

  // Cleanup, same pattern as the other sections
  return () => {
    observer.disconnect()
    root.innerHTML = ''
  }
}