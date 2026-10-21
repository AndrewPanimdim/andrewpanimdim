export interface SplitOptions {
  /** Split into words or single characters. Default 'words'. */
  by?: 'words' | 'chars'
  /** CSS class given to every piece. Default 'tfx-piece'. */
  className?: string
}

export interface SplitResult {
  /** The <span> wrapped around each piece, in reading order. */
  elements: HTMLElement[]
  /** Put the element back exactly as it was. */
  revert: () => void
}

/** Wrap each word or character in a <span> so you can animate them one by one. */
export function splitText(el: HTMLElement, options: SplitOptions = {}): SplitResult {
  const { by = 'words', className = 'tfx-piece' } = options
  const originalHTML = el.innerHTML
  const originalAria = el.getAttribute('aria-label')
  const text = el.textContent ?? ''
  const pieces = by === 'words' ? text.split(/(\s+)/) : Array.from(text)
  const elements: HTMLElement[] = []

  el.setAttribute('aria-label', text) // screen readers read the real sentence
  el.textContent = ''

  for (const piece of pieces) {
    if (piece === '') continue
    if (/^\s+$/.test(piece)) {
      el.append(document.createTextNode(piece)) // keep spaces as plain text
      continue
    }
    const span = document.createElement('span')
    span.className = className
    span.style.display = 'inline-block'
    span.setAttribute('aria-hidden', 'true')
    span.textContent = piece
    el.append(span)
    elements.push(span)
  }

  return {
    elements,
    revert() {
      el.innerHTML = originalHTML
      if (originalAria === null) el.removeAttribute('aria-label')
      else el.setAttribute('aria-label', originalAria)
    },
  }
}
