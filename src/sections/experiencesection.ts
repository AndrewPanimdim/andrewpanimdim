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
    category: 'DEVELOPMENT & DESIGNING',
    title: 'ASIA PACIFIC COLLEGE - NAMFRELL BARMM FIRST PARLIAMENTARY ELECTION 2026',
    description:
      'Web Development & UI/UX Team ',
    detail:
      'I was responsible for designing the whole UI of the App apk used in the election, and creating the header and footer of the official NAMFRELL-APC website. ',
    period: 'FINISHED',
    InTransition: 'opacity: 0; transform: translateX(150px);',
  },
  {
    id: 'exp-02',
    category: '',
    title: 'Google Developer',
    description: '',
    detail:
      'kunware hahaha',
    period: 'ONGOING',
    InTransition: 'opacity: 0; transform: translateY(50px);',
  },
]

const EXPERIENCE_THRESHOLD = 0.2
const EXPERIENCE_BOTTOM_MARGIN = '12%'

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
      <h1 id="experienceheading">EXPERIENCE</h1>

      <p>
        my journey and projects I've worked on.
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

  function initObserver(): void {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
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

  initObserver()

  // =========================
  // CLEANUP
  // =========================

  return () => {
    if (observer) {
      observer.disconnect()
    }
    root.replaceChildren()
  }
}