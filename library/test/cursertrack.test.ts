import { describe, it, expect } from 'vitest'
import { speedToScale, approach } from '../src/cursortrack'

describe('speedToScale', () => {
  it('stays 1 at or below threshold', () => {
    expect(speedToScale(0, 1.2, 5, 3)).toBe(1)
    expect(speedToScale(1.2, 1.2, 5, 3)).toBe(1)
  })
  it('reaches maxScale at maxSpeed and never beyond', () => {
    expect(speedToScale(5, 1.2, 5, 3)).toBe(3)
    expect(speedToScale(50, 1.2, 5, 3)).toBe(3)
  })
  it('grows in between', () => {
    const s = speedToScale(3.1, 1.2, 5, 3)
    expect(s).toBeGreaterThan(1); expect(s).toBeLessThan(3)
  })
})
describe('approach', () => {
  it('moves toward target without overshooting', () => {
    const a = approach(1, 3, 0.02, 16)
    expect(a).toBeGreaterThan(1); expect(a).toBeLessThan(3)
  })
  it('does nothing when already there', () => expect(approach(2, 2, 0.02, 16)).toBe(2))
})
