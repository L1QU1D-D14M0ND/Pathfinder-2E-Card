import { describe, expect, it } from 'vitest'
import { applyOverrides, isOverridden } from './overrides'

describe('shared applyOverrides', () => {
  it('records hits and misses via the injected applyOne', () => {
    const view = { n: 1, overriddenPaths: [] as string[], ignoredOverridePaths: [] as string[] }
    const next = applyOverrides(
      view,
      {
        'derived.n': { value: 9 },
        'derived.nope': { value: 1 },
      },
      (target, path, value) => {
        if (path === 'derived.n' && typeof value === 'number') {
          target.n = value
          return true
        }
        return false
      },
    )
    expect(next.n).toBe(9)
    expect(isOverridden(next, 'derived.n')).toBe(true)
    expect(next.ignoredOverridePaths).toEqual(['derived.nope'])
  })
})
