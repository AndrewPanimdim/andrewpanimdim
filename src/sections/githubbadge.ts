// A GitHub link in the top-right corner of the page.
// It slides into place while the page is at the very top,
// and slides away as soon as the visitor scrolls down.

const GITHUB_USER = 'AndrewPanimdim'
const GITHUB_REPO = 'andrewpanimdim'

// Scrolled less than this many pixels still counts as "at the top"
const TOP_ZONE = 10

export function initGithubBadge(): () => void {
  const badge = document.createElement('a')
  badge.id = 'ghbadge'
  // starts hidden, so it can slide into place once the page is ready
  badge.className = 'gh-badge is-hidden'
  badge.href = `https://github.com/${GITHUB_USER}/${GITHUB_REPO}`
  badge.target = '_blank'
  badge.rel = 'noopener noreferrer'
  badge.setAttribute('aria-label', `${GITHUB_USER}/${GITHUB_REPO} on GitHub`)

  badge.innerHTML = `
    <span class="gh-icon-box">
      <!-- GitHub icon (no hover change) -->
      <svg class="gh-github-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </span>

    <span class="gh-name">${GITHUB_USER}/${GITHUB_REPO}</span>

    <span class="gh-stars">
      <span class="gh-star-wrap">
        <svg class="gh-stars-glyph" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <defs>
            <!-- two shades of yellow, split down the middle (shown on hover) -->
            <linearGradient id="gh-star-split" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.5" stop-color="#FFEE90"/>
              <stop offset="0.5" stop-color="#FFA21F"/>
            </linearGradient>
          </defs>
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
        </svg>
        <!-- little blinking stars (only seen on hover) -->
        <svg class="gh-spark s1" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z"/></svg>
        <svg class="gh-spark s2" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z"/></svg>
        <svg class="gh-spark s3" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z"/></svg>
        <svg class="gh-spark s4" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z"/></svg>
      </span>
      <span class="gh-star-count">—</span>
    </span>
  `

  document.body.append(badge)

  // ---- live star count ----
  const countEl = badge.querySelector<HTMLElement>('.gh-star-count')

  const updateStarCount = async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
      const repo = (await res.json()) as { stargazers_count: number }
      if (countEl) countEl.textContent = Number(repo.stargazers_count).toLocaleString()
    } catch {
      if (countEl) countEl.textContent = '—'
    }
  }

  updateStarCount()
  const starRefresh = window.setInterval(updateStarCount, 5 * 60 * 1000)

  // ---- show at the top, hide once the visitor scrolls down ----
  const sync = () => {
    badge.classList.toggle('is-hidden', window.scrollY > TOP_ZONE)
  }

  window.addEventListener('scroll', sync, { passive: true })

  // wait two frames so the browser first paints the hidden state,
  // otherwise there is nothing to slide in from
  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(sync)
  })

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', sync)
    window.clearInterval(starRefresh)
    badge.remove()
  }
}