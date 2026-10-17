import './global.css'
import { setupAboutMe } from './sections/aboutme.ts'
// import { setupBackgroundparticles } from './sections/backgroundparticles.ts'
import { setupFloat } from './sections/float.ts'
import { setupHello } from './sections/hello.ts'


const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app element in index.html')

app.innerHTML = `
<main>
  <h1 id='hello'>Hello, World</h1>
  <div id='aboutme'></div>
  <div id='float' class='liquid-glass'>float</div>
</main>
`


// setupBackgroundparticles()
setupHello()
setupFloat()
setupAboutMe()