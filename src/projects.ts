import './global.css'
import './css/projects.css'

import { initTopNav } from './sections/topnav'
import { initCurserTrack } from './sections/cursortrack'

const projects = document.querySelector<HTMLElement>('#projects')

if (!projects) {
    throw new Error('Projects container not found')
}

projects.innerHTML = `
    <section class="projects-page">
        <h1>PROJECTS</h1>
        <p>My projects will be displayed here.</p>
    </section>
`

initTopNav()
initCurserTrack()