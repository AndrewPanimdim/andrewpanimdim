export type ScrambleFrom = 'left' | 'right' | 'center' | 'random'

export interface ScrambleOptions {
  /** Text to reveal. Defaults to the element's current text. */
  text?: string
  /** Characters used for the scrambled (not yet revealed) letters. */
  chars?: string
  /** Total time in milliseconds. Default 1500. */
  duration?: number
  /** Where the reveal starts. Default 'left'. */
  from?: ScrambleFrom
  /** Random source in [0, 1). Pass your own to make output predictable (tests). */
  random?: () => number
  /** Called on every frame with the text currently shown. */
  onUpdate?: (text: string) => void
  /** Skip the animation if the user prefers reduced motion. Default true. */
  respectReducedMotion?: boolean
}

export interface ScrambleHandle {
  /** Resolves when the animation finishes or is cancelled. */
  finished: Promise<void>
  /** Stop now and show the final text. */
  cancel: () => void
}

export const DEFAULT_CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%#_'

/**
 * For each character index, decide WHEN it gets revealed (0 = first).
 * Pure function: no DOM, no timers, so it is easy to test.
 */
export function revealOrder(
  length: number,
  from: ScrambleFrom = 'left',
  random: () => number = Math.random,
): number[] {
  const indices = Array.from({ length }, (_, i) => i)

  if (from === 'random') {
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
    }
    return indices
  }

  const reference =
    from === 'right' ? length - 1 : from === 'center' ? (length - 1) / 2 : 0
  const sorted = [...indices].sort(
    (a, b) => Math.abs(a - reference) - Math.abs(b - reference),
  )
  const rank = new Array<number>(length)
  sorted.forEach((index, position) => {
    rank[index] = position
  })
  return rank
}

/**
 * Build the text for one frame. `progress` goes from 0 to 1.
 * Pure function: same inputs (and same `random`) give the same output.
 */
export function scrambleFrame(
  target: string,
  progress: number,
  order: number[],
  chars: string = DEFAULT_CHARS,
  random: () => number = Math.random,
): string {
  const revealed = Math.floor(progress * target.length)
  let out = ''
  for (let i = 0; i < target.length; i++) {
    const ch = target[i]!
    if (/\s/.test(ch) || (order[i] ?? 0) < revealed) {
      out += ch
    } else {
      out += chars[Math.floor(random() * chars.length)] ?? ch
    }
  }
  return out
}

function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Animate an element's text from scrambled characters to the real text. */
export function scrambleText(
  el: HTMLElement,
  options: ScrambleOptions = {},
): ScrambleHandle {
  const {
    chars = DEFAULT_CHARS,
    duration = 1500,
    from = 'left',
    random = Math.random,
    onUpdate,
    respectReducedMotion = true,
  } = options
  const target = options.text ?? el.textContent ?? ''
  const order = revealOrder(target.length, from, random)

  let rafId = 0
  let finish: () => void = () => {}
  let stopped = false

  const show = (text: string) => {
    el.textContent = text
    onUpdate?.(text)
  }

  const finished = new Promise<void>((resolve) => {
    finish = () => {
      stopped = true
      cancelAnimationFrame(rafId)
      resolve()
    }

    const skip =
      duration <= 0 ||
      target.length === 0 ||
      (respectReducedMotion && prefersReducedMotion())
    if (skip) {
      show(target)
      finish()
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      if (stopped) return
      const progress = Math.min((now - start) / duration, 1)
      show(
        progress >= 1
          ? target
          : scrambleFrame(target, progress, order, chars, random),
      )
      if (progress >= 1) finish()
      else rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
  })

  return {
    finished,
    cancel() {
      if (stopped) return
      show(target)
      finish()
    },
  }
}
