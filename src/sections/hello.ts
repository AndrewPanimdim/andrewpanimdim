import { scrambleText, splitText } from 'andrewpanimdim'

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Placeholder: change this to whatever text you want the heading to scramble into
const SCRAMBLE_TO = "Hello, I'm Andrew"

export async function setupHello(): Promise<void> {
  const title = document.querySelector<HTMLElement>('#hello')
  if (!title) throw new Error('Missing #hello element')

  // Step 1: fade in word by word (the browser's built-in element.animate)
  const { elements, revert } = splitText(title, { by: 'words' })

  elements.forEach((word, i) => {
    word.animate(
      { opacity: [0, 1] },
      {
        duration: 1500,
        delay: 1500 + i * 600, // each word starts 600ms after the previous one
        easing: 'ease-out',
        fill: 'backwards', // stay invisible until this word's turn
      },
    )
  })

  // Step 2: wait
  await sleep(4000)

  // Step 3: undo the word split, then scramble into the new text
  revert()
  await scrambleText(title, { text: SCRAMBLE_TO, duration: 1500 }).finished
}
