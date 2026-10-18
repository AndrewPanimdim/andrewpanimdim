import { fetchJson } from '../api.ts'

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

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

const SLIDE_IN_MS = 800
const SLIDE_OUT_MS = 600
const HOLD_MS = 4000

async function play(
  el: HTMLElement,
  className: 'slide-in' | 'slide-out',
  ms: number,
): Promise<void> {
  el.classList.remove('slide-in', 'slide-out')
  void el.offsetWidth
  el.classList.add(className)
  await sleep(ms)
}

async function loadAboutLines(): Promise<string[]> {
  try {
    const [profile, facts] = await Promise.all([
      fetchJson<Profile>('/api/me'),
      fetchJson<Fact[]>('/api/facts'),
    ])

    const lines = [
      profile.bio,
      profile.name && profile.location
        ? `${profile.name} · ${profile.location}`
        : profile.name,
      ...facts.map((item) => item.fact),
    ].filter((line): line is string => Boolean(line?.trim()))

    if (lines.length > 0) return lines
  } catch {
    // GitHub Pages and local previews still render if the API is offline.
  }

  return FALLBACK_LINES
}

export async function setupAboutMe(): Promise<void> {
  const about = document.querySelector<HTMLElement>('#aboutme')
  if (!about) throw new Error('Missing #aboutme element')

  about.style.visibility = 'hidden'
  const [infoaboutme] = await Promise.all([loadAboutLines(), sleep(5000)])

  let i = 0
  while (true) {
    about.textContent = infoaboutme[i] ?? ''
    about.style.visibility = 'visible'
    await play(about, 'slide-in', SLIDE_IN_MS)
    await sleep(HOLD_MS)
    await play(about, 'slide-out', SLIDE_OUT_MS)
    i = (i + 1) % infoaboutme.length
  }
}
