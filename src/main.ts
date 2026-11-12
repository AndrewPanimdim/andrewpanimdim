import './global.css'
import './css/aboutmesections.css'
import './css/experience.css'
import './css/moream.css'

import { setupAboutMe } from './sections/aboutme.ts'
import { setupFloat } from './sections/float.ts'
import { setupHello } from './sections/hello.ts'
import { initCurserTrack } from './sections/cursortrack.ts'
import { initTopNav } from './sections/topnav'
import { initGithubBadge } from './sections/githubbadge.ts'
import { initScrollDelay } from './sections/scrolldelay.ts'

import { setAboutMeSection } from './sections/aboutmesection.ts'
import { setExperienceSection } from './sections/experiencesection.ts'
import { setmoreaboutme } from './sections/moreAM.ts'

// =========================
// APPLICATION INITIALIZATION
// =========================

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app element in index.html')
}

// =========================
// HTML STRUCTURE
// =========================

app.innerHTML = `
  <main>
    <h1 id="hello">Hello, World</h1>

    <div id="aboutme"></div>

    <section id="aboutMeSection"></section>

    <section id="experiencesection"></section>

    <section id="moreAM"></section>

    <div id="float" class="liquid-glass">float</div>

    <div id="weight">weight</div>
  </main>
`

// =========================
// GENERAL SETUP
// =========================

setupHello()
setupFloat()
setupAboutMe()

initCurserTrack()
initTopNav()
initScrollDelay()

// =========================
// PORTFOLIO SECTIONS
// =========================

setAboutMeSection()
setExperienceSection()
setmoreaboutme()

// =========================
// OTHER COMPONENTS
// =========================

initGithubBadge()