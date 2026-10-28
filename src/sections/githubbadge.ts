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
      <!-- GitHub icon -->
      <svg class="gh-github-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>

      <!-- Glossy golden star with little stars (shown on hover) -->
      <svg class="gh-star-icon" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id="gh-star-clip"><path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z"/></clipPath>
          <pattern id="gh-star-dots" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
            <circle cx="1.4" cy="1.4" r="0.75" fill="#C96A00" opacity="0.4"/>
          </pattern>
          <filter id="gh-star-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z" fill="#FFD92F" filter="url(#gh-star-shadow)"/>

        <g clip-path="url(#gh-star-clip)">
          <path d="M0 0 H40 C30 28 30 58 42 100 H0 Z" fill="#FFEE90"/>
          <path d="M50 0 C68 28 66 62 50 100 H100 V0 Z" fill="#FFA21F"/>
          <path d="M50 0 C68 28 66 62 50 100 H100 V0 Z" fill="url(#gh-star-dots)"/>
          <path d="M0 84 Q50 98 100 84 V100 H0 Z" fill="#B85C00" opacity="0.3"/>
        </g>

        <path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z" fill="none" stroke="#191C3B" stroke-width="4.6" stroke-linejoin="round"/>

        <path d="M32.5 63 L30 74" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="34.5" cy="55" r="1.9" fill="#fff"/>

        <g stroke="#191C3B" stroke-width="1.8" stroke-linejoin="round" fill="#FFE873">
          <path class="gh-mini-star s1" d="M85.8 8.6 Q87.0 6.5 88.2 8.6 L88.9 9.8 Q89.7 11.3 91.4 11.6 L92.8 11.9 Q95.1 12.4 93.5 14.1 L92.5 15.2 Q91.4 16.4 91.6 18.1 L91.7 19.5 Q92.0 21.9 89.8 20.9 L88.5 20.3 Q87.0 19.6 85.5 20.3 L84.2 20.9 Q82.0 21.9 82.3 19.5 L82.4 18.1 Q82.6 16.4 81.5 15.2 L80.5 14.1 Q78.9 12.4 81.2 11.9 L82.6 11.6 Q84.3 11.3 85.1 9.8 Z"/>
          <path class="gh-mini-star s2" d="M10.1 77.1 Q11.0 75.5 11.9 77.1 L12.5 78.0 Q13.1 79.1 14.4 79.4 L15.4 79.6 Q17.2 80.0 16.0 81.4 L15.3 82.1 Q14.4 83.1 14.5 84.4 L14.6 85.4 Q14.8 87.3 13.2 86.5 L12.2 86.1 Q11.0 85.6 9.8 86.1 L8.8 86.5 Q7.2 87.3 7.4 85.4 L7.5 84.4 Q7.6 83.1 6.7 82.1 L6.0 81.4 Q4.8 80.0 6.6 79.6 L7.6 79.4 Q8.9 79.1 9.5 78.0 Z"/>
          <path class="gh-mini-star s3" d="M90.2 73.8 Q91.0 72.5 91.8 73.8 L92.2 74.6 Q92.8 75.6 93.8 75.8 L94.7 76.0 Q96.2 76.3 95.2 77.4 L94.6 78.1 Q93.9 78.9 94.0 80.0 L94.1 80.9 Q94.2 82.4 92.8 81.8 L92.0 81.5 Q91.0 81.0 90.0 81.5 L89.2 81.8 Q87.8 82.4 87.9 80.9 L88.0 80.0 Q88.1 78.9 87.4 78.1 L86.8 77.4 Q85.8 76.3 87.3 76.0 L88.2 75.8 Q89.2 75.6 89.8 74.6 Z"/>
        </g>
      </svg>
    </span>

    <span class="gh-name">${GITHUB_USER}/${GITHUB_REPO}</span>

    <span class="gh-stars">
      <svg class="gh-stars-glyph" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
      </svg>
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