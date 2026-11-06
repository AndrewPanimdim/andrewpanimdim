
import '../css/topnav.css'

interface NavSection {
  label: string
  target: string
  className: string
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'ABOUT',
    target: 'hello',
    className: 'tn-about',
  },
  {
    label: 'PROJECTS',
    target: 'moreAM',
    className: 'tn-projects',
  },
  {
    label: 'EXPERIENCE',
    target: 'experience',
    className: 'tn-experience',
  },
  {
    label: 'DOCS',
    target: 'docs',
    className: 'tn-docs',
  },
]

export function initTopNav(): () => void {
  const nav = document.createElement('nav')
  nav.id = 'topnav'

  // Intro animation
  const hasVisited = sessionStorage.getItem('topnav-visited')

  if (!hasVisited) {
    document.documentElement.classList.add('topnav-intro')
    sessionStorage.setItem('topnav-visited', 'true')
  } else {
    document.documentElement.classList.add('topnav-no-intro')
  }

  // Generate navigation
  nav.innerHTML = `
    <div class="tn-full">
      <div class="tn-indicator" aria-hidden="true"></div>

      ${NAV_SECTIONS.map(
        ({ label, target, className }) => `
          <a
            class="tn-card ${className}"
            href="#${target}"
            data-section="${target}"
          >
            <span>${label}</span>
          </a>
        `
      ).join('')}
    </div>

    <div class="tn-mini"></div>
  `

  document.body.prepend(nav)

  const full = nav.querySelector<HTMLElement>('.tn-full')
  const indicator = nav.querySelector<HTMLElement>('.tn-indicator')

  const cards = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('.tn-card')
  )

  let activeCard: HTMLAnchorElement | null = null

  let lastY = window.scrollY
  let waiting = false

  // Find sections dynamically
  const getSections = () => {
    return NAV_SECTIONS
      .map((item) => {
        const element = document.getElementById(item.target)

        if (!element) return null

        return {
          ...item,
          element,
          top:
            element.getBoundingClientRect().top +
            window.scrollY,
        }
      })
      .filter(
        (item): item is NavSection & {
          element: HTMLElement
          top: number
        } => item !== null
      )
      .sort((a, b) => a.top - b.top)
  }

  // Position active indicator
  const moveIndicator = (card: HTMLAnchorElement) => {
    if (!indicator) return

    indicator.style.transform =
      `translateX(${card.offsetLeft}px)`

    indicator.style.width =
      `${card.offsetWidth}px`
  }

  // Set active navigation
  const setActive = (target: string) => {
    const card = cards.find(
      (item) => item.dataset.section === target
    )

    if (!card) return

    if (activeCard === card) {
      return
    }

    cards.forEach((item) => {
      item.classList.remove('active')
      item.removeAttribute('aria-current')
    })

    card.classList.add('active')
    card.setAttribute('aria-current', 'location')

    activeCard = card

    requestAnimationFrame(() => {
      moveIndicator(card)
    })
  }

  // Detect currently visible section
  const updateActiveSection = () => {
    const sections = getSections()

    if (!sections.length) return

    const activationPoint = window.innerHeight * 0.35
    const currentPosition = window.scrollY + activationPoint

    let currentSection = sections[0]

    for (const section of sections) {
      if (section.top <= currentPosition) {
        currentSection = section
      } else {
        break
      }
    }

    // Activate the last section at page bottom
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2

    if (atBottom) {
      currentSection = sections[sections.length - 1]
    }

    setActive(currentSection.target)
  }

  // Scroll to target
  const scrollToSection = (target: string) => {
    const section = document.getElementById(target)

    if (!section) {
      console.warn(
        `[TopNav] Target #${target} does not exist.`
      )
      return
    }

    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // Navigation click
  const onNavClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const card = target.closest<HTMLAnchorElement>('.tn-card')

    if (!card) return

    event.preventDefault()

    const sectionId = card.dataset.section

    if (!sectionId) return

    scrollToSection(sectionId)
  }

  full?.addEventListener('click', onNavClick)

  // Scroll and resize
  const onResize = () => {
    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  }

  const update = () => {
    const y = window.scrollY
    const delta = y - lastY

    // Compact navbar
    if (y < 10) {
      nav.classList.remove('compact')
    } else if (delta > 4) {
      nav.classList.add('compact')
    } else if (delta < -4) {
      nav.classList.remove('compact')
    }

    if (Math.abs(delta) > 4) {
      lastY = y
    }

    // Update active navigation
    updateActiveSection()

    waiting = false
  }

  const onScroll = () => {
    if (waiting) return

    waiting = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, {
    passive: true,
  })

  window.addEventListener('resize', onResize)

  // Initial state
  requestAnimationFrame(() => {
    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  })

  // Cleanup
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)

    full?.removeEventListener('click', onNavClick)

    nav.remove()

    document.documentElement.classList.remove(
      'topnav-intro',
      'topnav-no-intro'
    )
  }
}
