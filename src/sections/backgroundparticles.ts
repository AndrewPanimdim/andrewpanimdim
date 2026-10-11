import { animate, utils } from 'animejs'

const PARTICLE_COUNT = 100

export function setupBackgroundparticles(): void {
  const container = document.createElement('div')
  container.className = 'particles'
  container.setAttribute('aria-hidden', 'true')
  document.body.append(container)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    container.append(particle)

    animate(particle, {
      x: utils.random(-50, 50, 2) + 'vw',
      y: utils.random(-50, 50, 2) + 'vh',
      scale: [{ from: 0, to: 1 }, { to: 0 }],
      duration: utils.random(2000, 5000),
      delay: utils.random(0, 2000),
      loop: true,
    })
  }
}