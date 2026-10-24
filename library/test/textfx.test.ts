// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { revealOrder, scrambleFrame, scrambleText, splitText } from '../src/index'

const fixedRandom = () => 0 // always picks the first character in `chars`

describe('revealOrder', () => {
  it('reveals left to right', () => {
    expect(revealOrder(4, 'left')).toEqual([0, 1, 2, 3])
  })
  it('reveals right to left', () => {
    expect(revealOrder(4, 'right')).toEqual([3, 2, 1, 0])
  })
  it('reveals from the center outward', () => {
    const order = revealOrder(5, 'center')
    expect(order[2]).toBe(0) // middle char first
  })
  it('random order is a permutation', () => {
    const order = revealOrder(6, 'random')
    expect([...order].sort()).toEqual([0, 1, 2, 3, 4, 5])
  })
})

describe('scrambleFrame', () => {
  const order = revealOrder(5, 'left')
  it('shows only scrambled chars at progress 0', () => {
    expect(scrambleFrame('hello', 0, order, 'x', fixedRandom)).toBe('xxxxx')
  })
  it('reveals part of the text midway', () => {
    expect(scrambleFrame('hello', 0.4, order, 'x', fixedRandom)).toBe('hexxx')
  })
  it('keeps spaces untouched', () => {
    const o = revealOrder(7, 'left')
    expect(scrambleFrame('hi andy', 0, o, 'x', fixedRandom)).toBe('xx xxxx')
  })
})

describe('scrambleText', () => {
  it('ends on the real text and resolves', async () => {
    vi.useFakeTimers()
    const el = document.createElement('h1')
    el.textContent = 'Hello'
    const handle = scrambleText(el, { duration: 100, respectReducedMotion: false })
    await vi.advanceTimersByTimeAsync(500)
    await handle.finished
    expect(el.textContent).toBe('Hello')
    vi.useRealTimers()
  })
  it('cancel() jumps to the final text', async () => {
    const el = document.createElement('p')
    el.textContent = 'abc'
    const handle = scrambleText(el, { duration: 10_000, text: 'done', respectReducedMotion: false })
    handle.cancel()
    await handle.finished
    expect(el.textContent).toBe('done')
  })
})

describe('splitText', () => {
  it('wraps words and can revert', () => {
    const el = document.createElement('h1')
    el.innerHTML = 'Hello, <em>I\'m</em> Andrew'
    const before = el.innerHTML
    const { elements, revert } = splitText(el, { by: 'words' })
    expect(elements.map((e) => e.textContent)).toEqual(['Hello,', "I'm", 'Andrew'])
    expect(el.getAttribute('aria-label')).toBe("Hello, I'm Andrew")
    revert()
    expect(el.innerHTML).toBe(before)
    expect(el.hasAttribute('aria-label')).toBe(false)
  })
  it('splits into characters', () => {
    const el = document.createElement('p')
    el.textContent = 'hi you'
    expect(splitText(el, { by: 'chars' }).elements).toHaveLength(5)
  })
})
