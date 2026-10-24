export function initTopNav() {
    // Create the navbar
    const nav = document.createElement('nav')
    nav.id = 'topnav'
  
    nav.innerHTML = `
      <div class="tn-full">
        <a
          class="tn-repo"
          href="https://github.com/AndrewPanimdim/andrewpanimdim"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View GitHub repository and star count"
        >
          <span class="tn-icon-box">
  
            <!-- GitHub icon -->
            <svg
              class="tn-github-icon"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
  
            <!-- Glossy golden star with little stars -->
            <svg
                        class="tn-star-icon" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <clipPath id="tn-star-clip"><path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z"/></clipPath>
                <pattern id="tn-star-dots" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
                  <circle cx="1.4" cy="1.4" r="0.75" fill="#C96A00" opacity="0.4"/>
                </pattern>
                <filter id="tn-star-shadow" x="-30%" y="-30%" width="160%" height="170%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.6"/>
                </filter>
              </defs>
            
              <!-- main star: base fill + drop shadow -->
              <path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z" fill="#FFD92F" filter="url(#tn-star-shadow)"/>
            
              <!-- shading and texture, clipped to the star -->
              <g clip-path="url(#tn-star-clip)">
                <path d="M0 0 H40 C30 28 30 58 42 100 H0 Z" fill="#FFEE90"/>
                <path d="M50 0 C68 28 66 62 50 100 H100 V0 Z" fill="#FFA21F"/>
                <path d="M50 0 C68 28 66 62 50 100 H100 V0 Z" fill="url(#tn-star-dots)"/>
                <path d="M0 84 Q50 98 100 84 V100 H0 Z" fill="#B85C00" opacity="0.3"/>
              </g>
            
              <!-- navy outline -->
              <path d="M45.4 24.8 Q50.0 17.0 54.6 24.8 L59.3 32.8 Q62.3 38.0 68.2 39.3 L77.4 41.3 Q86.1 43.3 80.2 50.0 L74.0 57.0 Q70.0 61.5 70.6 67.5 L71.5 76.8 Q72.3 85.7 64.1 82.1 L55.5 78.4 Q50.0 76.0 44.5 78.4 L35.9 82.1 Q27.7 85.7 28.5 76.8 L29.4 67.5 Q30.0 61.5 26.0 57.0 L19.8 50.0 Q13.9 43.3 22.6 41.3 L31.8 39.3 Q37.7 38.0 40.7 32.8 Z" fill="none" stroke="#191C3B" stroke-width="4.6" stroke-linejoin="round"/>
            
              <!-- gloss -->
              <path d="M32.5 63 L30 74" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>
              <circle cx="34.5" cy="55" r="1.9" fill="#fff"/>
            
              <!-- little stars -->
              <g stroke="#191C3B" stroke-width="1.8" stroke-linejoin="round" fill="#FFE873">
                <path class="tn-mini-star s1" d="M85.8 8.6 Q87.0 6.5 88.2 8.6 L88.9 9.8 Q89.7 11.3 91.4 11.6 L92.8 11.9 Q95.1 12.4 93.5 14.1 L92.5 15.2 Q91.4 16.4 91.6 18.1 L91.7 19.5 Q92.0 21.9 89.8 20.9 L88.5 20.3 Q87.0 19.6 85.5 20.3 L84.2 20.9 Q82.0 21.9 82.3 19.5 L82.4 18.1 Q82.6 16.4 81.5 15.2 L80.5 14.1 Q78.9 12.4 81.2 11.9 L82.6 11.6 Q84.3 11.3 85.1 9.8 Z"/>
                <path class="tn-mini-star s2" d="M10.1 77.1 Q11.0 75.5 11.9 77.1 L12.5 78.0 Q13.1 79.1 14.4 79.4 L15.4 79.6 Q17.2 80.0 16.0 81.4 L15.3 82.1 Q14.4 83.1 14.5 84.4 L14.6 85.4 Q14.8 87.3 13.2 86.5 L12.2 86.1 Q11.0 85.6 9.8 86.1 L8.8 86.5 Q7.2 87.3 7.4 85.4 L7.5 84.4 Q7.6 83.1 6.7 82.1 L6.0 81.4 Q4.8 80.0 6.6 79.6 L7.6 79.4 Q8.9 79.1 9.5 78.0 Z"/>
                <path class="tn-mini-star s3" d="M90.2 73.8 Q91.0 72.5 91.8 73.8 L92.2 74.6 Q92.8 75.6 93.8 75.8 L94.7 76.0 Q96.2 76.3 95.2 77.4 L94.6 78.1 Q93.9 78.9 94.0 80.0 L94.1 80.9 Q94.2 82.4 92.8 81.8 L92.0 81.5 Q91.0 81.0 90.0 81.5 L89.2 81.8 Q87.8 82.4 87.9 80.9 L88.0 80.0 Q88.1 78.9 87.4 78.1 L86.8 77.4 Q85.8 76.3 87.3 76.0 L88.2 75.8 Q89.2 75.6 89.8 74.6 Z"/>
              </g>
            </svg>
          </span>
  
          <!-- Live GitHub star count -->
          <span class="tn-star-count" id="tn-star-count">—</span>
        </a>
      </div>
  
      <!-- Compact navbar label -->
      <div class="tn-mini">AP</div>
    `
  
    document.body.prepend(nav)
  
    // Fetch the repository's live star count
    const starCount = nav.querySelector('#tn-star-count')
  
    const updateStarCount = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/AndrewPanimdim/andrewpanimdim'
        )
  
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
  
        const repo = await response.json()
  
        if (starCount) {
          starCount.textContent =
            Number(repo.stargazers_count).toLocaleString()
        }
      } catch (error) {
        console.error('Could not fetch GitHub stars:', error)
  
        if (starCount) {
          starCount.textContent = '—'
        }
      }
    }
  
    // Fetch immediately
    updateStarCount()
  
    // Refresh every five minutes
    const starRefresh = window.setInterval(
      updateStarCount,
      5 * 60 * 1000
    )
  
    // Compact navbar when scrolling down
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
  
    // Cleanup if the navbar is removed or reinitialized
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(starRefresh)
      nav.remove()
    }
  }