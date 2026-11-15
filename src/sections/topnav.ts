
import '../css/topnav.css'

interface NavSection {
  label: string
  target: string
  className: string
}

const NAV_SECTIONS: NavSection[] = [
  { label: 'ABOUT', target: 'aboutMeSection', className: 'tn-about' },
  { label: 'EXPERIENCE', target: 'experiencesection', className: 'tn-experience' },
  { label: 'PROJECTS', target: 'moreAM', className: 'tn-projects' },
  { label: 'DOCS', target: 'docs', className: 'tn-docs' },
]

// Keep track of the active instance so repeated initialization
// cannot leave old scroll and resize listeners running.
let activeTopNavCleanup: (() => void) | null = null

export function initTopNav(): () => void {
  activeTopNavCleanup?.()
  activeTopNavCleanup = null

  // Remove any leftover navbar element.
  document.getElementById('topnav')?.remove()

  const nav = document.createElement('nav')
  nav.id = 'topnav'
  nav.setAttribute('aria-label', 'Main navigation')

  document.documentElement.classList.remove('topnav-no-intro')
  document.documentElement.classList.add('topnav-intro')

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
      aria-expanded="false"
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
  let lastY = window.scrollY
  let directionTravel = 0
  let waiting = false
  let destroyed = false
  let miniTimer: number | undefined

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

  const moveIndicator = (card: HTMLAnchorElement) => {
    if (!indicator || nav.classList.contains('compact')) return

    indicator.style.width = `${card.offsetWidth}px`
    indicator.style.transform = `translateX(${card.offsetLeft}px)`
  }

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

  const updateActiveSection = () => {
    const sections = getSections()

    if (!sections.length) return

    const activationPoint = window.innerHeight * 0.35
    const currentPosition = window.scrollY + activationPoint

    let currentSection: (typeof sections)[0] | null = null

    for (const section of sections) {
      if (section.top <= currentPosition) {
        currentSection = section
      } else {
        break
      }
    }

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

  
const scrollToSection = (target: string) => {
  const section = document.getElementById(target)

  if (!section) {
    console.warn(`[TopNav] Target #${target} does not exist.`)
    return
  }

  const destination =
    section.getBoundingClientRect().top + window.scrollY

  window.dispatchEvent(
    new CustomEvent<number>('portfolio:scroll-to', {
      detail: destination,
    }),
  )
}


  const onNavClick = (event: MouseEvent) => {
    const target = event.target

    if (!(target instanceof Element)) return

    const card = target.closest<HTMLAnchorElement>('.tn-card')

    if (!card || !full?.contains(card)) return

    const sectionId = card.dataset.section

    if (!sectionId) return

    const section = document.getElementById(sectionId)

    if (!section) {
      console.warn(`[TopNav] Target #${sectionId} does not exist.`)
      return
    }

    event.preventDefault()
    scrollToSection(sectionId)
  }

  full?.addEventListener('click', onNavClick)

  const onCardMouseEnter = (event: Event) => {
    if (destroyed || nav.classList.contains('compact')) return

    const card = event.currentTarget

    if (!(card instanceof HTMLAnchorElement)) return

    moveIndicator(card)

    if (indicator) {
      indicator.style.opacity = '1'
    }
  }

  cards.forEach((card) => {
    card.addEventListener('mouseenter', onCardMouseEnter)
  })

  const onFullMouseLeave = () => {
    if (destroyed || nav.classList.contains('compact')) return

    if (activeCard) {
      moveIndicator(activeCard)

      if (indicator) {
        indicator.style.opacity = '1'
      }
    } else if (indicator) {
      indicator.style.opacity = '0'
    }
  }

  full?.addEventListener('mouseleave', onFullMouseLeave)

  const expandNav = () => {
    nav.classList.remove('compact')

    mini?.setAttribute('aria-expanded', 'true')

    directionTravel = 0

    requestAnimationFrame(() => {
      if (activeCard && !destroyed) {
        moveIndicator(activeCard)
      }
    })
  }

  const onCompactClick = (event: MouseEvent) => {
    if (!nav.classList.contains('compact')) return

    const target = event.target

    if (!(target instanceof Element)) return

    if (target.closest('.tn-mini')) {
      event.stopPropagation()
      expandNav()
    }
  }

  const onMiniKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    expandNav()
  }

  nav.addEventListener('click', onCompactClick, true)
  mini?.addEventListener('keydown', onMiniKey)

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

  const onResize = () => {
    if (destroyed) return

    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    }
  }

  const update = () => {
    if (destroyed) return

    const y = window.scrollY
    const delta = y - lastY
    const isMobile = window.innerWidth <= 900

    if (y < 10 || isMobile) {
      nav.classList.remove('compact')
      mini?.setAttribute('aria-expanded', 'true')
      directionTravel = 0
    } else {
      directionTravel += delta

      if (directionTravel > 35) {
        nav.classList.add('compact')
        mini?.setAttribute('aria-expanded', 'false')
        directionTravel = 0
      } else if (directionTravel < -35) {
        nav.classList.remove('compact')
        mini?.setAttribute('aria-expanded', 'true')
        directionTravel = 0
      }
    }

    lastY = y
    updateActiveSection()
    waiting = false
  }

  const onScroll = () => {
    if (waiting || destroyed) return

    waiting = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  requestAnimationFrame(() => {
    if (destroyed) return

    updateActiveSection()

    if (activeCard) {
      moveIndicator(activeCard)
    } else if (indicator) {
      indicator.style.opacity = '0'
    }
  })

  const cleanup = () => {
    if (destroyed) return

    destroyed = true

    window.clearTimeout(miniTimer)

    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)

    full?.removeEventListener('click', onNavClick)
    full?.removeEventListener('mouseleave', onFullMouseLeave)

    cards.forEach((card) => {
      card.removeEventListener('mouseenter', onCardMouseEnter)
    })

    nav.removeEventListener('click', onCompactClick, true)
    mini?.removeEventListener('keydown', onMiniKey)
    nav.removeEventListener('transitionend', onNavTransitionEnd)

    nav.remove()

    document.documentElement.classList.remove(
      'topnav-intro',
      'topnav-no-intro',
    )

    if (activeTopNavCleanup === cleanup) {
      activeTopNavCleanup = null
    }
  }

  activeTopNavCleanup = cleanup

  return cleanup
}
