
interface AboutCard {
  id: string
  title: string
  description: string
  detail: string
  InTransition: string
  transition: string
}

const ABOUT_CARDS: AboutCard[] = [
  {
    id: 'about-background',
    title: 'BACKGROUND',
    description: 'a second year BSCS Cyber Forensics student at NU-APC',
    detail:
      'Currently learning software development, cybersecurity, and a little hardware.',
    InTransition: 'opacity: 0; transform: translateX(140px);',
    
    transition: 'transition: transform 1.9s cubic-bezier(0.2, 0.8, 0.2, 1),'

  },
  {
    id: 'about-development',
    title: 'DEVELOPMENT',
    description: 'Building projects through curiosity and experimentation.',
    detail:
      'Interested in web development, machine learning, and creating softwares.',
      
    InTransition: 'opacity: 0; transform: translateY(150px);',
    
    transition: 'transition: transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1),'
  },
  {
    id: 'about-interests',
    title: 'INTERESTS',
    description: 'Technology, problem-solving, basketball, and music.',
    detail:
      'Outside software development and cybersecurity, I enjoy playing basketball, coffee, music, and spending time with friends .',
      
    InTransition: 'opacity: 0; transform: translateX(-150px);',

    transition: 'transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1),'
  },
  {
    id: 'about-goals',
    title: 'FUTURE GOALS',
    description: 'Continuously improving as a developer.',
    detail:
      'Working toward becoming a software engineer, with particular interest in artificial intelligence and cybersecurity.',

    InTransition: 'opacity: 0; transform: translate(100px);',
    
    transition: 'transition: transform 2s cubic-bezier(0.2, 0.8, 0.2, 1),'

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
          <article class="aboutme-card" id="${card.id}" style="${card.InTransition}">
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
