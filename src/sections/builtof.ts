import '../css/divscrollanimation.css'

export async function setupDivScrollAnimation(): Promise<void> {
  const root = document.querySelector<HTMLElement>('#name')
  if (!root) throw new Error('Missing #name element')

  root.innerHTML = `
    <div class="scroll-fade-in">
      <p style="font-size: 1.5rem; color: rgba(255, 255, 255, 0.8);">i'm here</p>
    </div>
  `

  const target = root.querySelector('.scroll-fade-in')
  if (!target) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(target)
}