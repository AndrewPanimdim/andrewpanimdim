// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { scrollProgress, mix, scrolltilt } from '../src/scrolltilt'

describe('scrollProgress', () => {
  it('is 0 before start and 1 after end', () => {
    expect(scrollProgress(0, 100, 500)).toBe(0)
    expect(scrollProgress(900, 100, 500)).toBe(1)
  })
  it('is proportional in between', () => expect(scrollProgress(300, 100, 500)).toBe(0.5))
  it('handles start === end', () => {
    expect(scrollProgress(10, 50, 50)).toBe(0)
    expect(scrollProgress(60, 50, 50)).toBe(1)
  })
})
describe('mix', () => {
  it('blends', () => {
    expect(mix(0, 10, 0)).toBe(0)
    expect(mix(0, 10, 0.5)).toBe(5)
    expect(mix(1, 3, 1)).toBe(3)
  })
})
describe('scrolltilt', () => {
  it('writes a transform immediately and follows scroll instantly when smooth = 1', () => {
    const el = document.createElement('div')
    const t = scrolltilt(el, { start: 0, end: 100, rotate: 20, smooth: 1 })
    expect(el.style.transform).toContain('rotate(0deg)')
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    expect(el.style.transform).toContain('rotate(20deg)')
    t.destroy()
    expect(el.style.transform).toBe('')
  })
  it('never changes the element position (no top/left/position written)', () => {
    const el = document.createElement('div')
    const t = scrolltilt(el, { smooth: 1 })
    expect(el.style.position + el.style.top + el.style.left).toBe('')
    t.destroy()
  })
})
