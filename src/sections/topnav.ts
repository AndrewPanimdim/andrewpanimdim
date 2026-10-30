
import './topnav-docs.css'

export function initTopNav(): () => void {
  const base = import.meta.env.BASE_URL

  const nav = document.createElement('nav')
  nav.id = 'topnav'

  nav.innerHTML = `
    <div class="tn-full">

      <a class="tn-card tn-docs" href="${base}docs.html">
        <span>DOCS</span>
      </a>

      <a class="tn-card tn-projects" href="${base}projects.html">
        <span>PROJECTS</span>
      </a>

      <a class="tn-card tn-about" href="#about">
        <span>ABOUT</span>
      </a>

      <a class="tn-card tn-skills" href="#skills">
        <span>SKILLS</span>
      </a>

      <a class="tn-card tn-experience" href="#experience">
        <span>EXPERIENCE</span>
      </a>
  
      <!--
      <a class="tn-card tn-contact" href="#contact">
        <span>CONTACT</span>
      </a>
       -->
    </div>

    <div class="tn-mini">AP</div>
  `

  document.body.prepend(nav)

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
    nav.remove()
  }
}
