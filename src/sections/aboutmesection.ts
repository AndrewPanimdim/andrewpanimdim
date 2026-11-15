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
    title: "Hello, I'm Andrew Panimdim",
    description: 'Bachelor of Science in Computer Science Major in Cyber Security and Forensics Student',
    detail:
      'I am currently studying at National University - Asia Pacific College in Magallanes Makati.  ',
    InTransition: 'opacity: 0; transform: translateX(140px);',
    transition: 'transition: transform 1.9s cubic-bezier(0.2, 0.8, 0.2, 1),',
  },
  {
    id: 'about-interests',
    title: 'My Hobbies',
    description: 'Technology, problem-solving, basketball, and music.',
    detail:
      'outside of being a tech student, i am a coffee and music enthusiast, i like math and being physically active, though my math skills are not impressive, but i do find learning math fun and interesting. in my free time i play basketball, spendtime with friends, and try to work on projects that genuinely interests me',
    InTransition: 'opacity: 0; transform: translateX(-150px);',
    transition: 'transition: transform 1s cubic-bezier(0.2, 0.8, 0.2, 1),',
  },
  {
    id: 'about-goals',
    title: 'FUTURE',
    description: '',
    detail:
      'i am aiming to be a future software dev, cyberscurity, and ai engineer',
    InTransition: 'opacity: 0; transform: translate(100px);',
    transition: 'transition: transform 2s cubic-bezier(0.2, 0.8, 0.2, 1),',
  },
]

const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '12%'

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

  const root: HTMLElement = rootElement
  const moreAM: HTMLElement = moreAMElement

  // Maintain the correct section order.
  moreAM.before(root)

  // =========================
  // SECTION CONTENT
  // =========================

  root.innerHTML = `
    <header class="aboutme-heading">
      
      <h1 id="aboutmeheading">ABOUT ME</h1>

      <p>
        A little background about who I am
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

  let observer: IntersectionObserver

  function initObserver(): void {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible when entering the viewport
            entry.target.classList.add('visible')
          } else {
            // Remove visible immediately when leaving the viewport (above or below)
            entry.target.classList.remove('visible')
          }
        })
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