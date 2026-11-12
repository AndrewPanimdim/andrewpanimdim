// Each card shows a GIF, a title, and a row of tech-stack chips.
//
// title: Name displayed under the GIF.
// gif: File name inside public/gif.
// repo: GitHub repository name under GITHUB_USER.
// stack: Fallback technology chips.

const GITHUB_USER = 'AndrewPanimdim'

interface Card {
  id: string
  projectId: string
  title: string
  gif: string
  repo?: string
  stack: string[]
}

const CARDS: Card[] = [
  {
    id: 'am-a',
    projectId: 'project-a',
    title: 'first year college practice',
    gif: 'a.gif',
    repo: 'practiceportfolio',
    stack: ['TypeScript', 'Vite', 'FastAPI'],
  },
  {
    id: 'am-b',
    projectId: 'project-b',
    title: 'grade 12 practice',
    gif: 'b.gif',
    repo: 'portfolio2',
    stack: ['Tech 1', 'Tech 2'],
  },
  {
    id: 'am-c',
    projectId: 'project-c',
    title: 'Data Structures and Algorithms Project',
    gif: 'nroutes.gif',
    repo: 'nroute',
    stack: ['Tech 1', 'Tech 2'],
  },
  {
    id: 'am-d',
    projectId: 'project-d',
    title: 'Project D',
    gif: 'a.gif',
    stack: ['Tech 1', 'Tech 2'],
  },
  {
    id: 'am-e',
    projectId: 'project-e',
    title: 'Project E',
    gif: 'b.gif',
    stack: ['Tech 1', 'Tech 2'],
  },
]

const MAX_CHIPS = 4
const CACHE_MS = 60 * 60 * 1000

const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '12%'
const RESET_DELAY = 8000

// =========================
// GITHUB API
// =========================

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!res.ok) {
    throw new Error(`GitHub answered ${res.status}`)
  }

  return (await res.json()) as T
}

// =========================
// FETCH TECH STACK
// =========================

async function fetchStack(repo: string): Promise<string[]> {
  const key = `am-stack:${GITHUB_USER}/${repo}`

  try {
    const raw = localStorage.getItem(key)

    if (raw) {
      const cached = JSON.parse(raw) as {
        t: number
        stack: string[]
      }

      if (Date.now() - cached.t < CACHE_MS) {
        return cached.stack
      }
    }
  } catch {
    // Storage blocked or unreadable.
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
    const key = name.toLowerCase()

    if (!unique.has(key)) {
      unique.set(key, name)
    }
  }

  const stack = [...unique.values()].slice(0, MAX_CHIPS)

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        t: Date.now(),
        stack,
      }),
    )
  } catch {
    // Storage blocked. Continue without caching.
  }

  return stack
}

// =========================
// RENDER TECH STACK
// =========================

function renderStack(list: HTMLElement, items: string[]): void {
  list.replaceChildren(
    ...items.slice(0, MAX_CHIPS).map((name) => {
      const li = document.createElement('li')

      li.textContent = name

      return li
    }),
  )
}

// =========================
// MORE ABOUT ME SECTION
// =========================

export function setmoreaboutme(): () => void {
  const rootElement = document.querySelector<HTMLElement>('#moreAM')

  if (!rootElement) {
    throw new Error('Missing #moreAM element')
  }

  const root = rootElement
  const base = import.meta.env.BASE_URL

  // =========================
  // CARD MARKUP
  // =========================

  const cardsHtml = CARDS.map(
    (card) => `
      <a
        class="am-card am-project-link"
        id="${card.id}"
        href="${base}projects.html#${card.projectId}"
        aria-label="View ${card.title} project"
      >
        <div class="am-media">
          <img
            src="${base}gif/${card.gif}"
            alt="${card.title}"
            loading="lazy"
          />

          <span class="am-view-project">
            View project

            <span class="am-view-arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        </div>

        <div class="am-info">
          <h2>${card.title}</h2>

          <ul class="am-stack"></ul>
        </div>
      </a>
    `,
  ).join('')

  const seeMoreHtml = `
    <a
      class="am-card am-more"
      id="am-more"
      href="${base}projects.html"
    >
      <span>See more</span>

      <span class="am-more-arrow" aria-hidden="true">
        →
      </span>
    </a>
  `

  root.innerHTML = cardsHtml + seeMoreHtml

  // =========================
  // GITHUB TECH STACK
  // =========================

  let stopped = false

  for (const card of CARDS) {
    const list = root.querySelector<HTMLElement>(
      `#${card.id} .am-stack`,
    )

    if (!list) continue

    // Display fallback chips immediately.
    renderStack(list, card.stack)

    if (!card.repo) continue

    fetchStack(card.repo)
      .then((stack) => {
        if (!stopped && stack.length > 0) {
          renderStack(list, stack)
        }
      })
      .catch(() => {
        // Offline or rate-limited.
        // Keep the fallback chips.
      })
  }

  // =========================
  // ANIMATION AND SCROLL LOGIC
  // =========================

  const cards = root.querySelectorAll<HTMLElement>('.am-card')

  let resetTimer: ReturnType<typeof setTimeout> | null = null

  let observer: IntersectionObserver

  let hasPlayed = false

  function observeCards(): void {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          entry.target.classList.add('visible')

          observer.unobserve(entry.target)

          hasPlayed = true
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
  }

  observeCards()

  // =========================
  // SCROLL RESET
  // =========================

  function handleScroll(): void {
    const sectionTop = root.getBoundingClientRect().top

    const scrolledWayBackUp = sectionTop > window.innerHeight

    if (!scrolledWayBackUp) {
      if (resetTimer !== null) {
        clearTimeout(resetTimer)
        resetTimer = null
      }

      return
    }

    if (!hasPlayed || resetTimer !== null) return

    resetTimer = setTimeout(() => {
      const stillAboveSection =
        root.getBoundingClientRect().top > window.innerHeight

      if (stillAboveSection) {
        cards.forEach((card) => {
          card.classList.remove('visible')
        })

        hasPlayed = false

        observer.disconnect()

        observeCards()
      }

      resetTimer = null
    }, RESET_DELAY)
  }

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })

  // =========================
  // CLEANUP
  // =========================

  return () => {
    stopped = true

    observer.disconnect()

    window.removeEventListener('scroll', handleScroll)

    if (resetTimer !== null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }

    root.replaceChildren()
  }
}