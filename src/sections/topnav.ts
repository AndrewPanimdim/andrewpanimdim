import '../css/topnav.css'

export function initTopNav(): () => void {
  const base = import.meta.env.BASE_URL

  const nav = document.createElement('nav')
  nav.id = 'topnav'

  // Normalize paths for local and deployed URLs
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const basePath = normalizedBase.replace(/\/+$/, '') || '/'

  const currentPath =
    window.location.pathname.replace(/\/+$/, '') || '/'

  const homePath = basePath
  const indexPath = `${basePath === '/' ? '' : basePath}/index.html`
  const projectsPath = `${basePath === '/' ? '' : basePath}/projects.html`
  const docsPath = `${basePath === '/' ? '' : basePath}/docs.html`

  const isHomePage =
    currentPath === homePath || currentPath === indexPath

  // First homepage visit animation per tab
  const hasVisited = sessionStorage.getItem('topnav-visited')

  if (isHomePage && !hasVisited) {
    document.documentElement.classList.add('topnav-intro')
    sessionStorage.setItem('topnav-visited', 'true')
  } else {
    document.documentElement.classList.add('topnav-no-intro')
  }

  nav.innerHTML = `
    <div class="tn-full">

      <div class="tn-indicator" aria-hidden="true"></div>

      <a class="tn-card tn-about" href="${base}">
        <span>ABOUT</span>
      </a>

      <a class="tn-card tn-projects" href="${base}projects.html">
        <span>PROJECTS</span>
      </a>

      <a class="tn-card tn-experience" href="${base}#experience">
        <span>EXPERIENCE</span>
      </a>

      <a class="tn-card tn-docs" href="${base}docs.html">
        <span>DOCS</span>
      </a>

    </div>

    <div class="tn-mini"></div>
  `

  document.body.prepend(nav)

  const full = nav.querySelector<HTMLElement>('.tn-full')
  const indicator = nav.querySelector<HTMLElement>('.tn-indicator')
  const cards = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('.tn-card')
  )

  // Move the highlight behind the selected button
  const moveIndicator = (card: HTMLAnchorElement) => {
  if (!indicator) return

  indicator.style.transform = `translateX(${card.offsetLeft}px)`
  indicator.style.width = `${card.offsetWidth}px`
}

  // Update selected button
  const setActive = (card: HTMLAnchorElement) => {
    cards.forEach((item) => {
      item.classList.remove('active')
      item.removeAttribute('aria-current')
    })

    card.classList.add('active')
    card.setAttribute('aria-current', 'page')

    moveIndicator(card)
  }

  // Determine active page
  const getActiveCard = () => {
    if (currentPath === projectsPath) {
      return nav.querySelector<HTMLAnchorElement>('.tn-projects')
    }

    if (currentPath === docsPath) {
      return nav.querySelector<HTMLAnchorElement>('.tn-docs')
    }

    if (
      isHomePage &&
      window.location.hash === '#experience'
    ) {
      return nav.querySelector<HTMLAnchorElement>('.tn-experience')
    }

    return nav.querySelector<HTMLAnchorElement>('.tn-about')
  }

  // Set initial active button
  const initialActive = getActiveCard()

  if (initialActive) {
    initialActive.classList.add('active')
    initialActive.setAttribute('aria-current', 'page')

    requestAnimationFrame(() => {
      moveIndicator(initialActive)
    })
  }

  // Move highlight immediately when a button is clicked
  const onNavClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const card = target.closest<HTMLAnchorElement>('.tn-card')

    if (card) {
      setActive(card)
    }
  }

  full?.addEventListener('click', onNavClick)

  // Keep indicator aligned when window resizes
  const onResize = () => {
    const active = nav.querySelector<HTMLAnchorElement>('.tn-card.active')

    if (active) {
      moveIndicator(active)
    }
  }

  window.addEventListener('resize', onResize)

  // Compact navbar on scroll
  let lastY = window.scrollY
  let waiting = false

  const update = () => {
    const y = window.scrollY
    const delta = y - lastY

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