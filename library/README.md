# andrewpanimdim

Tiny, dependency-free web effects.

```
npm install andrewpanimdim
```

```ts
import { scrambleText, splitText, draggable, cursertrack } from 'andrewpanimdim'

await scrambleText(el, { text: 'Hello', duration: 1500 }).finished   // scramble reveal
const { elements, revert } = splitText(el, { by: 'words' })          // split into spans
draggable(box, { container: 'main', friction: 6 })                   // drag + glide
cursertrack(dot)                                                     // cursor that grows when you move fast
```

Load one feature only: `import { cursertrack } from 'andrewpanimdim/cursortrack'`.

MIT
