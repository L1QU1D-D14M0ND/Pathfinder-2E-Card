import { describe, expect, it } from 'vitest'
import { listRepoFiles, readRepoFile } from '../test/readRepoFile'
import { compute as computePf1e } from '../systems/pf1e/engine'
import { compute as computePf2e } from '../systems/pf2e/engine'
import { parseLoadedSheet } from './loadSheet'

// Globbed so a golden added later is covered without editing this file. The
// expected system comes from the path (`golden/pf1e/**` is PF1e, everything
// else defaults to PF2e, matching resolveSystemId's back-compat rule).
const GOLDENS = listRepoFiles('fixtures/characters/golden').map(
  (path) => [path, path.includes('/golden/pf1e/') ? 'pf1e' : 'pf2e'] as const,
)

describe('1.0 golden stability', () => {
  it('actually found goldens to load', () => {
    expect(GOLDENS.length).toBeGreaterThanOrEqual(9)
  })

  it.each(GOLDENS)('loads and computes %s as %s', (path, system) => {
    const loaded = parseLoadedSheet(readRepoFile(path))
    expect(loaded.system).toBe(system)
    if (loaded.system === 'pf1e') {
      const view = computePf1e(loaded.character)
      expect(view.level).toBeGreaterThan(0)
      expect(Number.isFinite(view.maxHp)).toBe(true)
    } else {
      const view = computePf2e(loaded.character)
      expect(view.maxHp).toBeGreaterThan(0)
      expect(Number.isFinite(view.ac)).toBe(true)
    }
  })
})
