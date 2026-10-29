import './global.css'
import './docs.css'
import { initCurserTrack } from './sections/cursortrack.ts'
import { fetchJson } from './api.ts'

// The page hides the system cursor, so every page starts the custom one
initCurserTrack()

// ---------- 1. "Copy" button on every code block ----------
document.querySelectorAll<HTMLPreElement>('.docs-content pre:not(.try-out)').forEach((pre) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'copy'
  button.textContent = 'Copy'

  button.addEventListener('click', async () => {
    const text = pre.querySelector('code')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      button.textContent = 'Copied'
    } catch {
      button.textContent = 'Select and press Ctrl+C'
    }
    window.setTimeout(() => {
      button.textContent = 'Copy'
    }, 1600)
  })

  pre.append(button)
})

// ---------- 2. Highlight the table-of-contents link of the section being read ----------
const toc = document.querySelector<HTMLElement>('.docs-toc')
const tocLinks = new Map<string, HTMLAnchorElement>()
toc?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  tocLinks.set(link.hash.slice(1), link)
})

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const link = tocLinks.get(entry.target.id)
      if (!link) continue

      tocLinks.forEach((other) => other.classList.remove('active'))
      link.classList.add('active')

      // on small screens the table of contents scrolls sideways: keep the active chip in view
      if (toc && toc.scrollWidth > toc.clientWidth) {
        toc.scrollTo({ left: link.offsetLeft - 24, behavior: 'smooth' })
      }
    }
  },
  // a thin band near the top of the screen decides which section counts as "current"
  { rootMargin: '-15% 0px -75% 0px' },
)

document.querySelectorAll<HTMLElement>('.docs-content section[id]').forEach((section) => {
  spy.observe(section)
})

// ---------- 3. "Try it" buttons: call the API and show the answer ----------
const output = document.querySelector<HTMLPreElement>('#try-out')
const outputCode = output?.querySelector('code')

document.querySelectorAll<HTMLButtonElement>('button.try').forEach((button) => {
  button.addEventListener('click', async () => {
    const path = button.dataset.path
    if (!path || !output || !outputCode) return

    document.querySelectorAll('button.try').forEach((other) => other.classList.remove('on'))
    button.classList.add('on')

    output.hidden = false
    outputCode.textContent = `Loading ${path} ...`

    try {
      const data = await fetchJson<unknown>(path)
      // textContent, not innerHTML: whatever the API returns is shown as plain text
      outputCode.textContent = `GET ${path}\n\n${JSON.stringify(data, null, 2)}`
    } catch (error) {
      outputCode.textContent =
        `GET ${path}\n\nCould not reach the API.\n` +
        `Start it with "npm run dev:api", or check VITE_API_URL.\n\n${String(error)}`
    }
  })
})