import { scrambleText } from 'andrewpanimdim'

const SCRAMBLE_TO = "Hello, I'm Andrew"
const SCRAMBLE_DELAY = 2300 // Time to wait after entering view before scrambling
const SHOW_WHEN_VISIBLE = 0.2
const BOTTOM_MARGIN = '30%' // Increase this (e.g. 40% or 50%) to make it start disappearing sooner

export function setupHello(): () => void {
  const title = document.querySelector<HTMLElement>('#hello')
  if (!title) {
    console.error('Missing #hello element')
    return () => {}
  }

  // Ensure TypeScript knows this element is strictly non-null inside closures
  const el: HTMLElement = title

  // Apply bottom margin directly to the element
  el.style.marginBottom = BOTTOM_MARGIN
  const originalText = el.textContent || "Hello, I'm Andrew"

  let observer: IntersectionObserver
  let scrambleTimer: ReturnType<typeof setTimeout> | null = null

  function initObserver(): void {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class -> triggers CSS slide-down & fade-in
            entry.target.classList.add('visible')

            // Trigger text scramble after delay
            if (scrambleTimer === null) {
              scrambleTimer = setTimeout(() => {
                scrambleText(el, { text: SCRAMBLE_TO, duration: 1500 })
              }, SCRAMBLE_DELAY)
            }
          } else {
            // Remove visible class -> CSS instantly transitions it back out smoothly
            entry.target.classList.remove('visible')

            // Clear timer and reset text back to original when out of view
            if (scrambleTimer !== null) {
              clearTimeout(scrambleTimer)
              scrambleTimer = null
            }
            el.textContent = originalText
          }
        })
      },
      {
        threshold: SHOW_WHEN_VISIBLE,
        rootMargin: `0px 0px -${BOTTOM_MARGIN} 0px`,
      },
    )

    observer.observe(el)
  }

  initObserver()

  // Cleanup function
  return () => {
    if (observer) {
      observer.disconnect()
    }
    if (scrambleTimer !== null) {
      clearTimeout(scrambleTimer)
    }
    el.textContent = originalText
  }
}