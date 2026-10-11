const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))
  
  const infoaboutme: string[] = [
    'I am a BSCS Cyber Forensics Student at NU-APC',
    'I love building Softwares',
  ]
  
  // Keep these in sync with the durations in global.css
  const SLIDE_IN_MS = 800
  const SLIDE_OUT_MS = 600
  const HOLD_MS = 6000
  
  async function play(
    el: HTMLElement,
    className: 'slide-in' | 'slide-out',
    ms: number,
  ): Promise<void> {
    el.classList.remove('slide-in', 'slide-out')
    void el.offsetWidth // forces a reflow so the animation restarts
    el.classList.add(className)
    await sleep(ms)
  }

  
  export async function setupAboutMe(): Promise<void> {
    const about = document.querySelector<HTMLElement>('#aboutme')
    if (!about) throw new Error('Missing #aboutme element')
    
    about.style.visibility = 'hidden'
    await sleep(5000)

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