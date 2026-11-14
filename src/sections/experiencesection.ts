interface ExperienceCard {
  id: string
  category: string
  title: string
  description: string
  detail: string
  period: string
  InTransition: string
}

const MY_EXPERIENCES: ExperienceCard[] = [
  {
    id: 'exp-01',
    category: 'DEVELOPMENT',
    title: 'ASIA PACIFIC COLLEGE - NAMFRELL BARMM FIRST PARLIAMENTARY ELECTION 2026',
    description:
      'Web Development & UI/UX Team ',
    detail:
      'I was responsible for creating the header and footer of the official website, and designing the whole UI of the App apk used in the election. ',
    period: 'FINISHED',
    InTransition: 'opacity: 0; transform: translateX(150px);',
  },
  {
    id: 'exp-02',
    category: 'PROGRAMMING',
    title: 'Programming Projects',
    description: 'Applying programming concepts to practical projects.',
    detail:
      'Developing problem-solving skills through programming exercises, experimenting with different technologies, and learning software development practices.',
    period: 'ONGOING',
    InTransition: 'opacity: 0; transform: translateY(150px);',
  },
]

const EXPERIENCE_THRESHOLD = 0.2
const EXPERIENCE_BOTTOM_MARGIN = '12%'
const EXPERIENCE_RESET_DELAY = 8000

export function setExperienceSection(): () => void {
  // =========================
  // SECTION INITIALIZATION
  // =========================

  const rootElement = document.getElementById('experiencesection')
  const moreAMElement = document.getElementById('moreAM')

  if (!(rootElement instanceof HTMLElement)) {
    console.error('Experience section element not found.')
    return () => {}
  }

  if (!(moreAMElement instanceof HTMLElement)) {
    console.error('MoreAM section element not found.')
    return () => {}
  }

  const root: HTMLElement = rootElement
  const moreAM: HTMLElement = moreAMElement

  // Maintain About Me -> Experience -> MoreAM.
  moreAM.before(root)

  // =========================
  // SECTION CONTENT
  // =========================

  root.innerHTML = `
    <header class="experience-heading">
      <span class="experience-eyebrow">
        WHAT I'VE BEEN WORKING ON
      </span>

      <h1 id="experienceheading">EXPERIENCE</h1>

      <p>
        A look into my development journey and the projects I've worked on.
      </p>
    </header>

    <div class="experience-grid">
      ${MY_EXPERIENCES.map(
        (card) => `
          <article class="experience-card" id="${card.id}" style="${card.InTransition}">
            <div class="experience-card-top">
              <span class="experience-category">
                ${card.category}
              </span>

              <span class="experience-period">
                ${card.period}
              </span>
            </div>

            <h2>${card.title}</h2>

            <p class="experience-description">
              ${card.description}
            </p>

            <p class="experience-detail">
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

  const heading = root.querySelector<HTMLElement>(
    '.experience-heading',
  )

  const cards = root.querySelectorAll<HTMLElement>(
    '.experience-card',
  )

  const animatedElements = [
    ...(heading ? [heading] : []),
    ...Array.from(cards),
  ]

  // =========================
  // INTERSECTION OBSERVER
  // =========================

  let observer: IntersectionObserver
  let hasPlayed = false

  let resetTimer: ReturnType<typeof setTimeout> | null = null

  function observeElements(): void {
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
        threshold: EXPERIENCE_THRESHOLD,
        rootMargin: `0px 0px -${EXPERIENCE_BOTTOM_MARGIN} 0px`,
      },
    )

    animatedElements.forEach((element) => {
      observer.observe(element)
    })
  }

  observeElements()

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
        observeElements()
      }

      resetTimer = null
    }, EXPERIENCE_RESET_DELAY)
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

    root.replaceChildren()
  }
}