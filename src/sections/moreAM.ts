// Each card shows a GIF, a small title and a row of tech-stack chips.
//
// - title: the name shown under the GIF
// - gif:   file name inside "public/gif"
// - repo:  the GitHub repository name under GITHUB_USER. When set, the chips
//          are filled from GitHub (languages + topics). Leave it out to use
//          only the "stack" list below.
// - stack: chips shown first, and kept if GitHub can't be reached
const GITHUB_USER = 'AndrewPanimdim'

interface Card {
  id: string
  title: string
  gif: string
  repo?: string
  stack: string[]
}

const CARDS: Card[] = [
  { id: 'am-a', title: 'first year college practice', gif: 'a.gif', repo: 'practiceportfolio', stack: ['TypeScript', 'Vite', 'FastAPI'] },
  { id: 'am-b', title: 'grade 12 practice', gif: 'b.gif', repo: 'portfolio2',stack: ['Tech 1', 'Tech 2'] },
  { id: 'am-c', title: 'Project C', gif: 'b.gif', stack: ['Tech 1', 'Tech 2'] },
  { id: 'am-d', title: 'Project D', gif: 'a.gif', stack: ['Tech 1', 'Tech 2'] },
  { id: 'am-e', title: 'Project E', gif: 'b.gif', stack: ['Tech 1', 'Tech 2'] },
]

// Most chips shown per card
const MAX_CHIPS = 4
// GitHub allows 60 requests per hour per visitor without a token,
// so answers are remembered in the browser for this long
const CACHE_MS = 60 * 60 * 1000

// How much of a card must be on screen before it appears (0.2 = 20%)
const SHOW_WHEN_VISIBLE = 0.2
// Ignore the bottom part of the screen, so a card appears once it is
// comfortably in view and not the instant its top edge peeks in
const BOTTOM_MARGIN = '12%'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`)
  return (await res.json()) as T
}

// Languages (biggest first) plus the repo's topics, without duplicates
async function fetchStack(repo: string): Promise<string[]> {
  const key = `am-stack:${GITHUB_USER}/${repo}`

  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const cached = JSON.parse(raw) as { t: number; stack: string[] }
      if (Date.now() - cached.t < CACHE_MS) return cached.stack
    }
  } catch {
    // storage blocked or unreadable: just fetch
  }

  const api = `https://api.github.com/repos/${GITHUB_USER}/${repo}`
  const [info, langs] = await Promise.all([
    getJson<{ topics?: string[] }>(api),
    getJson<Record<string, number>>(`${api}/languages`),
  ])

  const languages = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  const unique = new Map<string, string>()
  for (const name of [...languages, ...(info.topics ?? [])]) {
    const k = name.toLowerCase()
    if (!unique.has(k)) unique.set(k, name)
  }
  const stack = [...unique.values()].slice(0, MAX_CHIPS)

  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), stack }))
  } catch {
    // storage blocked: fine, it just won't be remembered
  }
  return stack
}

// textContent (not innerHTML) so nothing coming from GitHub is treated as HTML
function renderStack(list: HTMLElement, items: string[]): void {
  list.replaceChildren(
    ...items.slice(0, MAX_CHIPS).map((name) => {
      const li = document.createElement('li')
      li.textContent = name
      return li
    }),
  )
}

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
      <div class="am-info">
        <h2>${card.title}</h2>
        <ul class="am-stack"></ul>
      </div>
    </div>`,
  ).join('')

  // The "see more" block goes after the cards and links to the projects page
  const seeMoreHtml = `
    <a class="am-card am-more" id="am-more" href="${base}projects.html">
      <span>See more</span>
      <span class="am-more-arrow" aria-hidden="true">→</span>
    </a>`

  root.innerHTML = cardsHtml + seeMoreHtml

  // Fill the chips: your own list first, then GitHub's answer replaces it
  let stopped = false
  for (const card of CARDS) {
    const list = root.querySelector<HTMLElement>(`#${card.id} .am-stack`)
    if (!list) continue
    renderStack(list, card.stack)

    if (!card.repo) continue
    fetchStack(card.repo)
      .then((stack) => {
        if (!stopped && stack.length > 0) renderStack(list, stack)
      })
      .catch(() => {
        // offline or rate-limited: keep the fallback chips
      })
  }

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
    stopped = true
    observer.disconnect()
    root.innerHTML = ''
  }
}