import './global.css'
import { setupAboutMe } from './sections/aboutme.ts'
// import { setupBackgroundparticles } from './sections/backgroundparticles.ts'
import { setupFloat } from './sections/float.ts'
import { setupHello } from './sections/hello.ts'

import { setupAvatar } from './sections/avatar.tsx'   //react import para sa blobatar ppluggin
import 'blobatar/gaze.css'   //react import para sa blobatar ppluggin


const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Missing #app element in index.html')

app.innerHTML = `
<main>
  <h1 id='hello'>Hello, World</h1>
  
  <div id='aboutme'></div>

  <div id='avatar'></div>   

  <div id='float' class='liquid-glass'>float</div>

  <div id="builtby">built by Andrew</div>
</main>
`


// setupBackgroundparticles()
setupHello()
setupFloat()
setupAboutMe()
setupAvatar()         //react import para sa blobatar ppluggin