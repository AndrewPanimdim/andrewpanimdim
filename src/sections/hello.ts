import { animate, scrambleText, splitText, stagger } from 'animejs'

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

// Placeholder: change this to whatever text you want the heading to scramble into
const SCRAMBLE_TO = "Hello, I'm Andrew"

export async function setupHello(): Promise<void> {
  const title = document.querySelector<HTMLElement>('#hello')
  if (!title) throw new Error('Missing #hello element')

  // Step 1: fade in word by word
  const split = splitText(title, { words: true })

  split.addEffect(({ words }) =>
    animate(words, {
      opacity: [0, 1],
      duration: 1500,
      ease: 'outQuad',
      delay: stagger(600, { start: 1500 }),
    }),
  )

  // Step 2: wait 5 seconds
  await sleep(4000)

  // Step 3: undo the word split, then scramble into the new text
  split.revert()

  animate(title, {
    innerHTML: scrambleText({ text: SCRAMBLE_TO }),
    duration: 1500,
  })
}