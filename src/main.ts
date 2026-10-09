import './style.css'


const Iam: string ='i am a BSCS Cyber forensics student at NU - APC';



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main>

  <h1>Hello, I'm Andrew</h1>

  
  <div> ${Iam}</div>


</main>
`
