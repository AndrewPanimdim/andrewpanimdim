import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    scramble: 'src/scramble.ts',
    split: 'src/split.ts',
    draggable: 'src/draggable.ts',
    cursortrack: 'src/cursortrack.ts',
    scrolltilt: 'src/scrolltilt.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
})
