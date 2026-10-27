// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { cursertrack } from '../src/cursortrack'

const move = () => window.dispatchEvent(new MouseEvent('pointermove', { clientX: 10, clientY: 10 }))
const leave = () => document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null }))

describe('cursertrack hideOutside', () => {
  it('starts hidden, shows on move, hides when the pointer leaves the page', () => {
    const el = document.createElement('div')
    const t = cursertrack(el)
    expect(el.style.opacity).toBe('0')
    move()
    expect(el.style.opacity).toBe('1')
    leave()
    expect(el.style.opacity).toBe('0')
    move()
    expect(el.style.opacity).toBe('1')
    t.destroy()
  })
  it('ignores mouseout between two elements on the page', () => {
    const el = document.createElement('div')
    const t = cursertrack(el)
    move()
    document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }))
    expect(el.style.opacity).toBe('1')
    t.destroy()
  })
  it('hides when the last pointer position is on the window edge', () => {
    const el = document.createElement('div')
    const t = cursertrack(el)
    move()
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 0, clientY: 300 }))
    expect(el.style.opacity).toBe('0')
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: window.innerWidth - 1, clientY: 300 }))
    expect(el.style.opacity).toBe('0')
    window.dispatchEvent(new MouseEvent('pointermove', { clientX: 400, clientY: 300 }))
    expect(el.style.opacity).toBe('1')
    t.destroy()
  })
  it('hides on mouseleave of the document', () => {
    const el = document.createElement('div')
    const t = cursertrack(el)
    move()
    document.documentElement.dispatchEvent(new MouseEvent('mouseleave'))
    expect(el.style.opacity).toBe('0')
    t.destroy()
  })
  it('hides on window blur', () => {
    const el = document.createElement('div')
    const t = cursertrack(el)
    move()
    window.dispatchEvent(new Event('blur'))
    expect(el.style.opacity).toBe('0')
    t.destroy()
  })
  it('hideOutside: false never touches opacity', () => {
    const el = document.createElement('div')
    const t = cursertrack(el, { hideOutside: false })
    leave()
    expect(el.style.opacity).toBe('')
    t.destroy()
  })
  it('destroy restores the element', () => {
    const el = document.createElement('div')
    el.style.opacity = '0.5'
    cursertrack(el).destroy()
    expect(el.style.opacity).toBe('0.5')
  })
})