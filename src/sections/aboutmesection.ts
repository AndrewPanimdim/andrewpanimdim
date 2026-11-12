
interface AboutCard {
  id: string
  title: string
  description: string
  detail: string
}

const ABOUT_CARDS: AboutCard[] = [
  {
    id: 'about-background',
    title: 'BACKGROUND',
    description: 'A Computer Science student exploring the world of technology.',
    detail:
      'Currently learning software development, programming fundamentals, and how different technologies work together.',
  },
  {
    id: 'about-development',
    title: 'DEVELOPMENT',
    description: 'Building projects to turn ideas into working applications.',
    detail:
      'Interested in web development, APIs, backend systems, and creating practical software solutions.',
  },
  {
    id: 'about-interests',
    title: 'INTERESTS',
    description: 'Technology, problem-solving, basketball, and music.',
    detail:
      'Outside programming, I enjoy playing basketball, practicing bass, and exploring new things in technology.',
  },
  {
    id: 'about-goals',
    title: 'FUTURE GOALS',
    description: 'Continuously improving as a developer.',
    detail:
      'Working toward becoming a software engineer, with particular interest in artificial intelligence and cybersecurity.',
  },
]

const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '12%'
const RESET_DELAY = 8000

export function setAboutMeSection(): () => void {
  // =========================
  // SECTION INITIALIZATION
  // =========================

  const rootElement = document.getElementById('aboutMeSection')
  const moreAMElement = document.getElementById('moreAM')

  if (!(rootElement instanceof HTMLElement)) {
    console.error('About Me section element not found.')
    return () => {}
  }

  if (!(moreAMElement instanceof HTMLElement)) {
    console.error('MoreAM section element not found.')
    return () => {}
  }

  // Explicitly typed as HTMLElement for nested functions.
  const root: HTMLElement = rootElement
  const moreAM: HTMLElement = moreAMElement

  // Maintain the correct section order.
  moreAM.before(root)

  // =========================
  // SECTION CONTENT
  // =========================

  root.innerHTML = `
    <header class="aboutme-heading">
      <span class="aboutme-eyebrow">GET TO KNOW ME</span>

      <h1 id="aboutmeheading">ABOUT ME</h1>

      <p>
        A little background about who I am and what I do.
      </p>
    </header>

    <div class="aboutme-grid">
      ${ABOUT_CARDS.map(
        (card) => `
          <article class="aboutme-card" id="${card.id}">
            <span class="aboutme-card-number">
              ${card.id.replace('about-', '').toUpperCase()}
            </span>

            <h2>${card.title}</h2>

            <p class="aboutme-description">
              ${card.description}
            </p>

            <p class="aboutme-detail">
              ${card.detail}
            </p>
          </article>
        `,
      ).join('')}
    </div>
  `

  // =========================
  // ANIMATION ELEMENTS
  // =========================

  const cards = root.querySelectorAll<HTMLElement>('.aboutme-card')
  const heading = root.querySelector<HTMLElement>('.aboutme-heading')

  const animatedElements = [
    ...(heading ? [heading] : []),
    ...Array.from(cards),
  ]

  // =========================
  // INTERSECTION OBSERVER
  // =========================

  let resetTimer: ReturnType<typeof setTimeout> | null = null
  let hasPlayed = false
  let observer: IntersectionObserver

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

    animatedElements.forEach((element) => {
      observer.observe(element)
    })
  }

  observeCards()

  // =========================
  // SCROLL RESET LOGIC
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
        animatedElements.forEach((element) => {
          element.classList.remove('visible')
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
    observer.disconnect()

    window.removeEventListener('scroll', handleScroll)

    if (resetTimer !== null) {
      clearTimeout(resetTimer)
      resetTimer = null
    }

    // Keep the section container in the DOM.
    root.replaceChildren()
  }
}
