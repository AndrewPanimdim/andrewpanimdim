
const GITHUB_USER = 'AndrewPanimdim'

interface Project {
  id: string
  title: string
  description: string
  gif: string
  repo?: string
  stack: string[]
}

interface GitHubRepo {
  description: string | null
  topics?: string[]
  html_url: string
}

interface CachedProjectData {
  t: number
  description: string
  stack: string[]
}

const PROJECTS: Project[] = [
  {
    id: 'project-a',
    title: 'First Year College Practice',
    description: 'A portfolio project developed during my first year of college.',
    gif: 'a.gif',
    repo: 'practiceportfolio',
    stack: ['TypeScript', 'Vite', 'FastAPI'],
  },
  {
    id: 'project-b',
    title: 'Grade 12 Practice',
    description: 'A website project created during my senior high school years.',
    gif: 'b.gif',
    repo: 'portfolio2',
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'project-c',
    title: 'Data Structures and Algorithms Project',
    description: 'A project focused on applying data structures and algorithms.',
    gif: 'nroutes.gif',
    repo: 'nroute',
    stack: ['Python', 'Data Structures', 'Algorithms'],
  },
  {
    id: 'project-d',
    title: 'Project D',
    description: 'Add your project description here.',
    gif: 'a.gif',
    stack: ['Tech 1', 'Tech 2'],
  },
  {
    id: 'project-e',
    title: 'Project E',
    description: 'Add your project description here.',
    gif: 'b.gif',
    stack: ['Tech 1', 'Tech 2'],
  },
]

const MAX_CHIPS = 4
const CACHE_MS = 60 * 60 * 1000
const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '12%'
const RESET_DELAY = 8000

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub answered ${response.status}`)
  }

  return (await response.json()) as T
}

async function fetchProjectData(
  repo: string,
  fallbackDescription: string,
): Promise<CachedProjectData> {
  const cacheKey = `projects-data:${GITHUB_USER}/${repo}`

  try {
    const raw = localStorage.getItem(cacheKey)

    if (raw) {
      const cached = JSON.parse(raw) as CachedProjectData

      if (Date.now() - cached.t < CACHE_MS) {
        return cached
      }
    }
  } catch {
    // Storage unavailable: fetch directly
  }

  const api = `https://api.github.com/repos/${GITHUB_USER}/${repo}`

  const [info, languages] = await Promise.all([
    getJson<GitHubRepo>(api),
    getJson<Record<string, number>>(`${api}/languages`),
  ])

  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name)

  const unique = new Map<string, string>()

  for (const name of [...sortedLanguages, ...(info.topics ?? [])]) {
    const key = name.toLowerCase()

    if (!unique.has(key)) {
      unique.set(key, name)
    }
  }

  const data: CachedProjectData = {
    t: Date.now(),
    description: info.description || fallbackDescription,
    stack: [...unique.values()].slice(0, MAX_CHIPS),
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify(data))
  } catch {
    // Storage unavailable: continue without caching
  }

  return data
}

function renderStack(list: HTMLElement, items: string[]): void {
  list.replaceChildren(
    ...items.slice(0, MAX_CHIPS).map((name) => {
      const chip = document.createElement('li')
      chip.textContent = name
      return chip
    }),
  )
}

function createProjectCard(
  project: Project,
  base: string,
): HTMLElement {
  const card = document.createElement('article')
  card.className = 'project-card'
  card.id = project.id

  // Clickable GIF
  const mediaLink = document.createElement('a')
  mediaLink.className = 'project-media'
  mediaLink.href = project.repo
    ? `https://github.com/${GITHUB_USER}/${project.repo}`
    : '#'
  mediaLink.target = '_blank'
  mediaLink.rel = 'noopener noreferrer'
  mediaLink.setAttribute(
    'aria-label',
    `View ${project.title} on GitHub`,
  )

  if (!project.repo) {
    mediaLink.removeAttribute('target')
    mediaLink.removeAttribute('href')
    mediaLink.setAttribute('aria-disabled', 'true')
  }

  const image = document.createElement('img')
  image.src = `${base}gif/${project.gif}`
  image.alt = `${project.title} preview`
  image.draggable = false

  const openLabel = document.createElement('span')
  openLabel.className = 'project-open'
  openLabel.textContent = 'View project ↗'

  mediaLink.append(image, openLabel)

  // Project information
  const info = document.createElement('div')
  info.className = 'project-info'

  const title = document.createElement('h2')
  title.textContent = project.title

  const description = document.createElement('p')
  description.className = 'project-description'
  description.textContent = project.description

  const stack = document.createElement('ul')
  stack.className = 'project-stack'

  renderStack(stack, project.stack)

  info.append(title, description, stack)
  card.append(mediaLink, info)

  // Replace fallback description and chips with GitHub data
  if (project.repo) {
    fetchProjectData(project.repo, project.description)
      .then((data) => {
        description.textContent = data.description

        if (data.stack.length > 0) {
          renderStack(stack, data.stack)
        }
      })
      .catch((error) => {
        console.warn(
          `Could not fetch GitHub data for ${project.repo}:`,
          error,
        )
        // Keep the fallback description and chips
      })
  }

  return card
}

export function setProjectsSection(): () => void {
  const rootElement =
    document.querySelector<HTMLElement>('#projectShowcase')

  if (!rootElement) {
    throw new Error('Missing #projectShowcase element')
  }

  const root: HTMLElement = rootElement
  const base = import.meta.env.BASE_URL

  const cards = PROJECTS.map((project) =>
    createProjectCard(project, base),
  )

  root.replaceChildren(...cards)

  const observedCards = root.querySelectorAll<HTMLElement>(
    '.project-card',
  )

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

    observedCards.forEach((card) => {
      observer.observe(card)
    })
  }

  observeCards()

  function handleScroll(): void {
    const sectionTop = root.getBoundingClientRect().top
    const scrolledAbove = sectionTop > window.innerHeight

    if (!scrolledAbove) {
      if (resetTimer !== null) {
        clearTimeout(resetTimer)
        resetTimer = null
      }

      return
    }

    if (!hasPlayed || resetTimer !== null) return

    resetTimer = setTimeout(() => {
      const stillAbove =
        root.getBoundingClientRect().top > window.innerHeight

      if (stillAbove) {
        observedCards.forEach((card) => {
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

  return () => {
    observer.disconnect()
    window.removeEventListener('scroll', handleScroll)

    if (resetTimer !== null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }

    root.replaceChildren()
  }
}
