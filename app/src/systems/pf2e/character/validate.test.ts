import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from './createEmptyCharacter'
import {
  createEmptyAction,
  createEmptyCondition,
  createEmptyDailyResource,
  createEmptyFeat,
  createEmptyFeature,
  createEmptySpellListEntry,
  createEmptySpellcasting,
} from './createRows'
import {
  CharacterLoadError,
  CharacterSaveError,
  parseCharacterJson,
  serializeCharacter,
} from './saveLoad'
import { readRepoFile } from '../../../test/readRepoFile'
import { validateCharacterDocument } from './validate'

describe('character JSON Schema validation', () => {
  it('treats files without system as pf2e and writes system on save', () => {
    const text = readRepoFile('fixtures/characters/minimal.example.json')
    const doc = parseCharacterJson(text)
    expect(doc.schemaVersion).toBe(1)
    expect(doc.system).toBe('pf2e')
    expect(doc.skills).toEqual([])
    const saved = JSON.parse(serializeCharacter(doc)) as { system: string }
    expect(saved.system).toBe('pf2e')
  })

  it('writes system on a new sheet', () => {
    const empty = createEmptyCharacter()
    expect(empty.system).toBe('pf2e')
    expect(serializeCharacter(empty)).toContain('"system": "pf2e"')
  })

  it('rejects a non-pf2e system id', () => {
    const text = readRepoFile('fixtures/characters/minimal.example.json')
    const data = JSON.parse(text) as Record<string, unknown>
    data.system = 'pf1e'
    expect(() => parseCharacterJson(JSON.stringify(data))).toThrow(
      /Invalid character sheet/,
    )
  })

  it('accepts the new-sheet fixture', () => {
    const text = readRepoFile('fixtures/characters/new-sheet.example.json')
    const doc = parseCharacterJson(text)
    expect(doc.skills).toHaveLength(16)
  })

  it.each([
    'fixtures/characters/golden/fighter-5.json',
    'fixtures/characters/golden/wizard-5.json',
    'fixtures/characters/golden/bard-5.json',
  ])('accepts golden fixture %s', (path) => {
    expect(() => parseCharacterJson(readRepoFile(path))).not.toThrow()
  })

  it('accepts createEmptyCharacter()', () => {
    const empty = createEmptyCharacter()
    expect(() => validateCharacterDocument(empty)).not.toThrow()
    expect(() => serializeCharacter(empty)).not.toThrow()
  })

  it('accepts empty feat, spell, and play rows added from factories', () => {
    const doc = createEmptyCharacter()
    const entry = createEmptySpellcasting()
    entry.cantrips.push(createEmptySpellListEntry(0))
    entry.spells.push(createEmptySpellListEntry(1))
    doc.spellcasting.push(entry)
    doc.feats.push(createEmptyFeat())
    doc.features.push(createEmptyFeature())
    doc.actions.push(createEmptyAction())
    doc.conditions.push(createEmptyCondition())
    doc.play.dailyResources.push(createEmptyDailyResource())
    expect(() => serializeCharacter(doc)).not.toThrow()
  })

  it('rejects invalid JSON', () => {
    expect(() => parseCharacterJson('{')).toThrow(CharacterLoadError)
  })

  it('rejects the wrong schemaVersion', () => {
    const text = readRepoFile('fixtures/characters/minimal.example.json')
    const data = JSON.parse(text) as { schemaVersion: number }
    data.schemaVersion = 2
    expect(() => parseCharacterJson(JSON.stringify(data))).toThrow(
      /Invalid character sheet/,
    )
  })

  it('rejects unknown top-level properties', () => {
    const text = readRepoFile('fixtures/characters/minimal.example.json')
    const data = JSON.parse(text) as Record<string, unknown>
    data.campaignOptions = { freeArchetype: true }
    expect(() => parseCharacterJson(JSON.stringify(data))).toThrow(
      CharacterLoadError,
    )
  })

  it('strips derived on save and still validates', () => {
    const doc = createEmptyCharacter()
    doc.derived = { maxHp: 99, ac: 99 }
    const saved = serializeCharacter(doc)
    expect(saved).not.toContain('"derived"')
    const reloaded = parseCharacterJson(saved)
    expect(reloaded.derived).toBeUndefined()
  })

  it('refuses to save a document that does not match the schema', () => {
    const doc = createEmptyCharacter()
    doc.identity.level = 0
    expect(() => serializeCharacter(doc)).toThrow(CharacterSaveError)
  })
})
