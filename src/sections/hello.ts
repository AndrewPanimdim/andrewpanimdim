import { scrambleText, splitText } from 'andrewpanimdim'

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Configurable constants
const SCRAMBLE_TO = "Hello, I'm Andrew"
const SHOW_AT_MS = 300
const WORD_GAP_MS = 600
const SCRAMBLE_AT_MS = 2300
const BOTTOM_MARGIN = '30%'

export async function setupHello(): Promise<void> {
  const title = document.querySelector<HTMLElement>('#hello')
  if (!title) throw new Error('Missing #hello element')

  // Apply bottom margin directly to the element
  title.style.marginBottom = BOTTOM_MARGIN

  // Step 1: Fade in word by word
  const { elements, revert } = splitText(title, { by: 'words' })

  elements.forEach((word, i) => {
    word.animate(
      { opacity: [0, 1] },
      {
        duration: 1500,
        delay: SHOW_AT_MS + i * WORD_GAP_MS,
        easing: 'ease-out',
        fill: 'backwards',
      },
    )
  })

  // Step 2: Wait until the scramble trigger time
  await sleep(SCRAMBLE_AT_MS)

  // Step 3: Revert split text and trigger title scramble
  revert()
  await scrambleText(title, { text: SCRAMBLE_TO, duration: 1500 }).finished
}