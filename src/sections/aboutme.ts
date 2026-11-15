import { fetchJson } from '../api.ts'

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })

type Profile = {
  bio?: string
  name?: string
  location?: string
}

type Fact = {
  fact: string
}

const FALLBACK_LINES = [
  'I am a BSCS Cyber Forensics Student at NU-APC',
  'I love building Softwares',
]

const SHOW_AT_MS = 1000 // Initial delay when entering view
const SLIDE_IN_MS = 800
const SLIDE_OUT_MS = 600
const HOLD_MS = 1500
const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '30%'

async function play(
  el: HTMLElement,
  className: 'slide-in' | 'slide-out',
  ms: number,
  signal: AbortSignal,
): Promise<void> {
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
  el.classList.remove('slide-in', 'slide-out')
  void el.offsetWidth
  el.classList.add(className)
  await sleep(ms, signal)
}

async function loadAboutLines(): Promise<string[]> {
  try {
    const [profile, facts] = await Promise.all([
      fetchJson<Profile>('/api/me'),
      fetchJson<Fact[]>('/api/facts'),
    ])

    const lines = [
      profile.name && profile.location
        ? `${profile.name} · ${profile.location}`
        : profile.name,
      ...facts.map((item) => item.fact),
      profile.bio,
    ].filter((line): line is string => Boolean(line?.trim()))

    if (lines.length > 0) return lines
  } catch {
    // GitHub Pages and local previews still render if the API is offline.
  }

  return FALLBACK_LINES
}

export function setupAboutMe(): () => void {
  const about = document.querySelector<HTMLElement>('#aboutme')
  if (!about) {
    console.error('Missing #aboutme element')
    return () => {}
  }

  const el: HTMLElement = about
  el.style.visibility = 'hidden'

  let abortController: AbortController | null = null
  let observer: IntersectionObserver
  let linesCache: string[] | null = null

  async function startRotation(signal: AbortSignal) {
    try {
      // Load lines if not already cached
      if (!linesCache) {
        linesCache = await loadAboutLines()
      }
      if (signal.aborted) return

      await sleep(SHOW_AT_MS, signal)
      if (signal.aborted) return

      let i = 0
      while (!signal.aborted) {
        el.textContent = linesCache[i] ?? ''
        el.style.visibility = 'visible'

        await play(el, 'slide-in', SLIDE_IN_MS, signal)
        await sleep(HOLD_MS, signal)
        await play(el, 'slide-out', SLIDE_OUT_MS, signal)

        i = (i + 1) % linesCache.length
      }
    } catch {
      // Rotation was safely aborted when scrolling out of view
    }
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start the loop when entering view if not already running
          if (!abortController) {
            abortController = new AbortController()
            startRotation(abortController.signal)
          }
        } else {
          // Stop the loop and hide immediately when leaving view
          if (abortController) {
            abortController.abort()
            abortController = null
          }
          el.style.visibility = 'hidden'
          el.textContent = ''
          el.classList.remove('slide-in', 'slide-out')
        }
      })
    },
    {
      threshold: SHOW_WHEN_VISIBLE,
      rootMargin: `0px 0px -${BOTTOM_MARGIN} 0px`,
    },
  )

  observer.observe(el)

  // Cleanup function
  return () => {
    if (abortController) {
      abortController.abort()
    }
    observer.disconnect()
    el.style.visibility = 'hidden'
    el.textContent = ''
  }
}