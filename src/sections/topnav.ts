export function initTopNav() {
    const nav = document.createElement('nav')
    nav.id = 'topnav'
    nav.innerHTML = `
      <div class="tn-full"><!-- wide contents go here --></div>
      <div class="tn-mini">AP</div>
    `
    document.body.prepend(nav)
  
    let lastY = window.scrollY
    let waiting = false
  
    const update = () => {
      const y = window.scrollY
      const delta = y - lastY
  
      if (y < 10) nav.classList.remove('compact')          // at the top: wide
      else if (delta > 4) nav.classList.add('compact')     // scrolling down: compressed
      else if (delta < -4) nav.classList.remove('compact') // scrolling up: wide
  
      if (Math.abs(delta) > 4) lastY = y
      waiting = false
    }
  
    window.addEventListener(
      'scroll',
      () => {
        if (waiting) return
        waiting = true
        requestAnimationFrame(update) // run at most once per frame
      },
      { passive: true },
    )
  }