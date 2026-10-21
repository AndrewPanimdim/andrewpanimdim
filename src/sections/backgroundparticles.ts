const PARTICLE_COUNT = 100

const random = (min: number, max: number): number =>
  min + Math.random() * (max - min)

export function setupBackgroundparticles(): void {
  const container = document.createElement('div')
  container.className = 'particles'
  container.setAttribute('aria-hidden', 'true')
  document.body.append(container)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    container.append(particle)

    // drift to a random spot while growing from nothing and shrinking back
    const x = random(-50, 50)
    const y = random(-50, 50)

    particle.animate(
      [
        { transform: 'translate(0vw, 0vh) scale(0)' },
        { transform: `translate(${x / 2}vw, ${y / 2}vh) scale(1)` },
        { transform: `translate(${x}vw, ${y}vh) scale(0)` },
      ],
      {
        duration: random(2000, 5000),
        delay: random(0, 2000),
        iterations: Infinity,
        easing: 'linear',
      },
    )
  }
}
