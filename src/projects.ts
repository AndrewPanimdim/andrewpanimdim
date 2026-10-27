import './global.css'
import { fetchJson } from './api.ts'
import { initCurserTrack } from './sections/cursortrack.ts'
import { initTopNav } from './sections/topnav'

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  url: string
}

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app element in projects.html')

const base = import.meta.env.BASE_URL

app.innerHTML = `
<section id="projects">
  <a class="pj-back" href="${base}">← Back</a>
  <h1>Projects</h1>
  <div class="pj-grid" id="pj-grid">
    <p class="pj-note">Loading…</p>
  </div>
</section>
`

initCurserTrack() // the page hides the system cursor, so bring the custom one too
initTopNav()

function note(text: string): HTMLElement {
  const p = document.createElement('p')
  p.className = 'pj-note'
  p.textContent = text
  return p
}

// Build cards with textContent (not innerHTML), so API text can never inject HTML
function projectCard(project: Project): HTMLElement {
  const card = document.createElement('a')
  card.className = 'pj-card'
  if (/^https?:\/\//.test(project.url)) card.href = project.url
  card.target = '_blank'
  card.rel = 'noopener noreferrer'

  const title = document.createElement('h2')
  title.textContent = project.title

  const description = document.createElement('p')
  description.textContent = project.description

  const tags = document.createElement('div')
  tags.className = 'pj-tags'
  for (const tag of project.tags) {
    const chip = document.createElement('span')
    chip.textContent = tag.trim()
    tags.appendChild(chip)
  }

  card.append(title, description, tags)
  return card
}

async function loadProjects(): Promise<void> {
  const grid = document.querySelector<HTMLElement>('#pj-grid')
  if (!grid) return

  try {
    const projects = await fetchJson<Project[]>('/api/projects')
    if (projects.length === 0) {
      grid.replaceChildren(note('No projects yet.'))
      return
    }
    grid.replaceChildren(...projects.map(projectCard))
  } catch {
    grid.replaceChildren(note('Could not load projects right now.'))
  }
}

loadProjects()