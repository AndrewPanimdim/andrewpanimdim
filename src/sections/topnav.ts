
import '../css/topnav.css'

interface NavSection {
  label: string
  target: string
  className: string
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'ABOUT',
    target: 'aboutMeSection',
    className: 'tn-about',
  },
  {
    label: 'EXPERIENCE',
    target: 'experiencesection',
    className: 'tn-experience',
  },
  {
    label: 'PROJECTS',
    target: 'moreAM',
    className: 'tn-projects',
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

  // Intro animation.
  document.documentElement.classList.remove('topnav-no-intro')
  document.documentElement.classList.add('topnav-intro')

  // Generate navigation.
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

    <div
      class="tn-mini"
      role="button"
      tabindex="0"
      aria-label="Show navigation"
    ></div>
  `

  document.body.prepend(nav)

  const full = nav.querySelector<HTMLElement>('.tn-full')
  const indicator = nav.querySelector<HTMLElement>('.tn-indicator')
  const mini = nav.querySelector<HTMLElement>('.tn-mini')

  const cards = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('.tn-card'),
  )

  let activeCard: HTMLAnchorElement | null = null

  // Scroll tracking.
  let lastY = Math.max(0, window.scrollY)
  let lastDirection: 'up' | 'down' | null = null
  let directionTravel = 0
  let scrollFrame = 0

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
    indicator.style.transform = `translateX(${card.offsetLeft}px)`
  }

  // Clear all highlights.
  const clearActive = () => {
    cards.forEach((item) => {
      item.classList.remove('active')
      item.removeAttribute('aria-current')
    })

    activeCard = null

    if (indicator) {
      indicator.style.opacity = '0'
    }

    if (mini && !nav.classList.contains('compact')) {
      mini.textContent = ''
    }
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

    if (indicator) {
      indicator.style.opacity = '1'
    }

    // Update mini navigation label.
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
    const currentPosition = window.scrollY + activationPoint

    let currentSection: (typeof sections)[number] | null = null

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

    if (currentSection) {
      setActive(currentSection.target)
    } else {
      clearActive()
    }
  }

  // Navigate to target using the shared scroll controller.
  const scrollToSection = (target: string) => {
    const section = document.getElementById(target)

    if (!section) {
      console.warn(
        `[TopNav] Target #${target} does not exist.`,
      )
      return
    }

    const destination =
      section.getBoundingClientRect().top + window.scrollY

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
    ) {
      window.scrollTo({
        top: destination,
        behavior: 'auto',
      })
      return
    }

    window.dispatchEvent(
      new CustomEvent<number>('portfolio:scroll-to', {
        detail: destination,
      }),
    )
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

  // Indicator hover effects.
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (destroyed || nav.classList.contains('compact')) return

      moveIndicator(card)

      if (indicator) {
        indicator.style.opacity = '1'
      }
    })
  })

  full?.addEventListener('mouseleave', () => {
    if (destroyed || nav.classList.contains('compact')) return

    if (activeCard) {
      moveIndicator(activeCard)

      if (indicator) {
        indicator.style.opacity = '1'
      }
    } else if (indicator) {
      indicator.style.opacity = '0'
    }
  })

  // Expand compact navigation.
  const expandNav = () => {
    nav.classList.remove('compact')
    directionTravel = 0
    lastDirection = null
  }

  const onCompactClick = (event: MouseEvent) => {
    if (!nav.classList.contains('compact')) return

    event.stopPropagation()
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

  nav.addEventListener('transitionend', onNavTransitionEnd)

  // Resize handling.
  const onResize = () => {
    lastY = Math.max(0, window.scrollY)
    directionTravel = 0
    lastDirection = null

    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  }

  // Detect scroll direction and update navbar state.
  const update = () => {
    scrollFrame = 0

    if (destroyed) return

    const y = Math.max(0, window.scrollY)
    const delta = y - lastY

    // Always show full navigation near the top.
    if (y <= 10) {
      nav.classList.remove('compact')
      directionTravel = 0
      lastDirection = null
    } else if (Math.abs(delta) > 0.5) {
      const newDirection: 'up' | 'down' =
        delta > 0 ? 'down' : 'up'

      // Reset accumulated distance when direction changes.
      if (newDirection !== lastDirection) {
        lastDirection = newDirection
        directionTravel = 0
      }

      directionTravel += Math.abs(delta)

      // Smaller threshold for touch devices.
      const threshold = window.matchMedia('(pointer: coarse)').matches
        ? 12
        : 14

      // Scrolling down: collapse navbar.
      if (
        newDirection === 'down' &&
        directionTravel >= threshold
      ) {
        nav.classList.add('compact')
        directionTravel = 0
      }

      // Scrolling up: expand navbar.
      if (
        newDirection === 'up' &&
        directionTravel >= threshold
      ) {
        nav.classList.remove('compact')
        directionTravel = 0
      }
    }

    lastY = y

    updateActiveSection()
  }

  // Schedule one update per animation frame.
  const onScroll = () => {
    if (scrollFrame) return

    scrollFrame = requestAnimationFrame(update)
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
    } else if (indicator) {
      indicator.style.opacity = '0'
    }
  })

  // Cleanup.
  return () => {
    destroyed = true

    window.clearTimeout(miniTimer)
    cancelAnimationFrame(scrollFrame)

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
