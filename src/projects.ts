
import './global.css'
import './css/projects.css'
import './css/projectssection.css'

import { initTopNav } from './sections/topnav'
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

initTopNav()
initCurserTrack()
setProjectsSection()
