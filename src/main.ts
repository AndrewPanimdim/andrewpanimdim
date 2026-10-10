import './global.css'

const hello: string = "Hello, I'm Andrew"

const aboutme: string ='I am a BSCS Cyber Forensics Student at NU - APC';



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main>


  <h1 id='hello'> ${hello}</h1>

  <div id='aboutme'> ${aboutme}</div>


</main>
`

