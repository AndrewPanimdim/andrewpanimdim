export function setExperienceSection(): () => void {
  // Find MoreAM and explicitly establish a non-null reference.
  const foundexperiencesection = document.getElementById('experiencesection')

  if (!(foundexperiencesection instanceof HTMLElement)) {
    throw new Error('Missing #experiencesection element. Check main.ts for id="experiencesection".')
  }

  const experience: HTMLElement = foundexperiencesection

  const existingRoot = document.getElementById('experiencesection')

    const root: HTMLElement =
    existingRoot instanceof HTMLElement
        ? existingRoot
        : document.createElement('section')

    if (!existingRoot) {
    root.id = 'experiencesection'
    experience.before(root)
    }

  root.innerHTML = `
    <h1>experience</h1>

  experience section 
    
  `


  // MoreAM follows About Me. CSS controls About Me's own position.
  function updateMoreAMPosition(): void {

  }

  updateMoreAMPosition()

  return () => {

  }

}
