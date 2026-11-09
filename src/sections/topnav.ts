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
  // Prevent duplicate navigation instances.
  document.getElementById('topnav')?.remove()

  const nav = document.createElement('nav')
  nav.id = 'topnav'

  // Intro animation: plays on every page load
  document.documentElement.classList.remove('topnav-no-intro')
  document.documentElement.classList.add('topnav-intro')

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
        `,
      ).join('')}
    </div>

    <div class="tn-mini" role="button" tabindex="0" aria-label="Show navigation"></div>
  `

  document.body.prepend(nav)

  const full = nav.querySelector<HTMLElement>('.tn-full')
  const indicator = nav.querySelector<HTMLElement>('.tn-indicator')
  const mini = nav.querySelector<HTMLElement>('.tn-mini')

  const cards = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('.tn-card'),
  )

  let activeCard: HTMLAnchorElement | null = null

  let lastY = window.scrollY
  let directionTravel = 0
  let waiting = false
  let destroyed = false
  let miniTimer: number | undefined

  // Find sections dynamically.
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
        } => item !== null,
      )
      .sort((a, b) => a.top - b.top)
  }

  // Position active indicator.
  const moveIndicator = (card: HTMLAnchorElement) => {
    if (!indicator || nav.classList.contains('compact')) return

    indicator.style.width = `${card.offsetWidth}px`

    indicator.style.transform =
      `translateX(${card.offsetLeft}px)`
  }

  // Update active navigation.
  const setActive = (target: string) => {
    const card = cards.find(
      (item) => item.dataset.section === target,
    )

    if (!card || activeCard === card) return

    cards.forEach((item) => {
      item.classList.remove('active')
      item.removeAttribute('aria-current')
    })

    card.classList.add('active')
    card.setAttribute('aria-current', 'location')

    activeCard = card

    // Smoothly update mini label.
    if (mini) {
      window.clearTimeout(miniTimer)

      mini.classList.add('is-changing')

      miniTimer = window.setTimeout(() => {
        if (destroyed) return

        mini.textContent =
          card.querySelector('span')?.textContent?.trim() ?? ''

        requestAnimationFrame(() => {
          if (!destroyed) {
            mini.classList.remove('is-changing')
          }
        })
      }, 120)
    }

    // Update indicator.
    requestAnimationFrame(() => {
      if (!destroyed) {
        moveIndicator(card)
      }
    })
  }

  // Detect currently visible section.
  const updateActiveSection = () => {
    const sections = getSections()

    if (!sections.length) return

    const activationPoint = window.innerHeight * 0.35

    const currentPosition =
      window.scrollY + activationPoint

    let currentSection = sections[0]

    for (const section of sections) {
      if (section.top <= currentPosition) {
        currentSection = section
      } else {
        break
      }
    }

    // Activate the last section at page bottom.
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2

    if (atBottom) {
      currentSection = sections[sections.length - 1]
    }

    setActive(currentSection.target)
  }

  // Scroll to target.
  const scrollToSection = (target: string) => {
    const section = document.getElementById(target)

    if (!section) {
      console.warn(
        `[TopNav] Target #${target} does not exist.`,
      )
      return
    }

    section.scrollIntoView({
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  // Navigation click.
  const onNavClick = (event: MouseEvent) => {
    const target = event.target

    if (!(target instanceof Element)) return

    const card = target.closest<HTMLAnchorElement>('.tn-card')

    if (!card) return

    event.preventDefault()

    const sectionId = card.dataset.section

    if (!sectionId) return

    scrollToSection(sectionId)
  }

  full?.addEventListener('click', onNavClick)

  // Clicking anywhere on the compact nav makes it tn-full again.
  const expandNav = () => {
    nav.classList.remove('compact')
    directionTravel = 0
  }

  const onCompactClick = (event: MouseEvent) => {
    if (!nav.classList.contains('compact')) return

    event.stopPropagation() // expand only, do not also trigger a link
    expandNav()
  }

  const onMiniKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    expandNav()
  }

  nav.addEventListener('click', onCompactClick, true)
  mini?.addEventListener('keydown', onMiniKey)

  // Reposition indicator after navbar width transition.
  const onNavTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== nav) return
    if (event.propertyName !== 'width') return
    if (!activeCard) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (activeCard && !destroyed) {
          moveIndicator(activeCard)
        }
      })
    })
  }

  nav.addEventListener(
    'transitionend',
    onNavTransitionEnd,
  )

  // Scroll and resize.
  const onResize = () => {
    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  }

  // Handle navbar direction and active section.
  const update = () => {
    const y = window.scrollY
    const delta = y - lastY

    if (y < 10) {
      nav.classList.remove('compact')
      directionTravel = 0
    } else {
      directionTravel += delta

      // Collapse after consistent downward movement.
      if (directionTravel > 14) {
        nav.classList.add('compact')
        directionTravel = 0
      }

      // Expand after consistent upward movement.
      else if (directionTravel < -18) {
        nav.classList.remove('compact')
        directionTravel = 0
      }
    }

    lastY = y

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

  // Initial state.
  requestAnimationFrame(() => {
    if (destroyed) return

    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  })

  // Cleanup.
  return () => {
    destroyed = true

    window.clearTimeout(miniTimer)

    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)

    full?.removeEventListener('click', onNavClick)
    nav.removeEventListener('click', onCompactClick, true)
    mini?.removeEventListener('keydown', onMiniKey)

    nav.removeEventListener(
      'transitionend',
      onNavTransitionEnd,
    )

    nav.remove()

    document.documentElement.classList.remove(
      'topnav-intro',
      'topnav-no-intro',
    )
  }
}