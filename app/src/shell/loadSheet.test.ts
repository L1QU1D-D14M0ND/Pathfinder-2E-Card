import { describe, expect, it } from 'vitest'
import { parseLoadedSheet } from './loadSheet'
import { readRepoFile } from '../test/readRepoFile'
import { createEmptyCharacter as createPf1e } from '../systems/pf1e/character'
import { serializeCharacter as serializePf1e } from '../systems/pf1e/character'
import { createEmptyCharacter as createPf2e } from '../systems/pf2e/character'
import { serializeCharacter as serializePf2e } from '../systems/pf2e/character'

describe('parseLoadedSheet', () => {
  it('loads a PF2e golden without system as pf2e', () => {
    const loaded = parseLoadedSheet(
      readRepoFile('fixtures/characters/golden/fighter-5.json'),
    )
    expect(loaded.system).toBe('pf2e')
    if (loaded.system === 'pf2e') {
      expect(loaded.character.identity.class.id).toBe('class.fighter')
    }
  })

  it('loads a PF1e golden as pf1e', () => {
    const loaded = parseLoadedSheet(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    expect(loaded.system).toBe('pf1e')
    if (loaded.system === 'pf1e') {
      expect(loaded.character.classes[0]?.class.id).toBe('class.fighter')
    }
  })

  it('round-trips empty sheets for both systems', () => {
    const pf1e = parseLoadedSheet(serializePf1e(createPf1e()))
    const pf2e = parseLoadedSheet(serializePf2e(createPf2e()))
    expect(pf1e.system).toBe('pf1e')
    expect(pf2e.system).toBe('pf2e')
  })
})
