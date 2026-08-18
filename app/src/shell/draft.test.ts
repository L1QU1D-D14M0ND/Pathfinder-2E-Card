import { describe, expect, it } from 'vitest'
import { parseDraft, serializeSheet } from './draft'
import { parseLoadedSheet } from './loadSheet'
import { readRepoFile } from '../test/readRepoFile'
import { createEmptyCharacter as createPf1e } from '../systems/pf1e/character'
import { createEmptyCharacter as createPf2e } from '../systems/pf2e/character'

describe('draft buffer payload', () => {
  it('round-trips a PF1e golden with system on the document', () => {
    const text = readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json')
    const loaded = parseLoadedSheet(text)
    const draft = serializeSheet(loaded)
    const restored = parseDraft(draft)
    expect(restored?.system).toBe('pf1e')
    expect(draft).toContain('"system": "pf1e"')
    expect(draft).not.toMatch(/"derived"\s*:/)
    if (restored?.system === 'pf1e') {
      expect(restored.character.identity.characterName).toBe('Golden Wizard')
    }
  })

  it('round-trips a PF2e golden (including files without system)', () => {
    const loaded = parseLoadedSheet(
      readRepoFile('fixtures/characters/golden/fighter-5.json'),
    )
    const restored = parseDraft(serializeSheet(loaded))
    expect(restored?.system).toBe('pf2e')
    expect(serializeSheet(loaded)).toContain('"system": "pf2e"')
    if (restored?.system === 'pf2e') {
      expect(restored.character.identity.class.id).toBe('class.fighter')
    }
  })

  it('round-trips empty sheets for both systems', () => {
    const pf1e = parseDraft(
      serializeSheet({ system: 'pf1e', character: createPf1e() }),
    )
    const pf2e = parseDraft(
      serializeSheet({ system: 'pf2e', character: createPf2e() }),
    )
    expect(pf1e?.system).toBe('pf1e')
    expect(pf2e?.system).toBe('pf2e')
  })

  it('returns null for missing, empty, or invalid payloads', () => {
    expect(parseDraft(undefined)).toBeNull()
    expect(parseDraft(null)).toBeNull()
    expect(parseDraft('')).toBeNull()
    expect(parseDraft('not json')).toBeNull()
    expect(parseDraft('{}')).toBeNull()
    expect(parseDraft('[]')).toBeNull()
  })
})
