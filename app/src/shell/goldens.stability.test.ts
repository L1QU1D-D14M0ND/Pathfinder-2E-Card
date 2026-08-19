import { describe, expect, it } from 'vitest'
import { readRepoFile } from '../test/readRepoFile'
import { compute as computePf1e } from '../systems/pf1e/engine'
import { compute as computePf2e } from '../systems/pf2e/engine'
import { parseLoadedSheet } from './loadSheet'

const GOLDENS = [
  ['fixtures/characters/golden/fighter-5.json', 'pf2e'],
  ['fixtures/characters/golden/wizard-5.json', 'pf2e'],
  ['fixtures/characters/golden/bard-5.json', 'pf2e'],
  ['fixtures/characters/golden/cleric-5.json', 'pf2e'],
  ['fixtures/characters/golden/pf1e/fighter-5.json', 'pf1e'],
  ['fixtures/characters/golden/pf1e/wizard-5.json', 'pf1e'],
  ['fixtures/characters/golden/pf1e/fighter-2-wizard-3.json', 'pf1e'],
  ['fixtures/characters/golden/pf1e/synthesist-5.json', 'pf1e'],
] as const

describe('1.0 golden stability', () => {
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
