
import './global.css'
import './css/moream.css'
import './css/projects.css'
import './css/projectssection.css'

import { initCurserTrack } from './sections/cursortrack'
import { setProjectsSection } from './sections/projectssection'

const projects = document.querySelector<HTMLElement>('#projects')

if (!projects) {
  throw new Error('Projects container not found')
}

projects.innerHTML = `
  <section class="projects-page">
    <h1>PROJECTS</h1>

    <section id="projectShowcase"></section>
  </section>
`

initCurserTrack()
setProjectsSection()

// Navigate to the requested project after rendering.
function navigateToProject(): void {
  const projectId = decodeURIComponent(
    window.location.hash.slice(1),
  )

  if (!projectId) return

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const project = document.getElementById(projectId)

      if (!project || !project.classList.contains('project-card')) {
        return
      }

      project.scrollIntoView({
        behavior: window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    })
  })
}

navigateToProject()