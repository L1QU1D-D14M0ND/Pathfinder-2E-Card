import { describe, expect, it } from 'vitest'
import { translate, type MessageTree } from './i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

const EN = en as MessageTree
const ES = es as MessageTree

function leafPaths(
  tree: MessageTree,
  prefix = '',
): Array<{ path: string; value: string }> {
  const rows: Array<{ path: string; value: string }> = []
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') rows.push({ path, value })
    else rows.push(...leafPaths(value, path))
  }
  return rows
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]!).sort()
}

describe('translate()', () => {
  it('resolves shell chrome keys', () => {
    expect(translate(EN, 'shell.newSheet')).toBe('New sheet')
    expect(translate(EN, 'shell.tagline', { system: 'Test', version: 1 })).toBe(
      'Test · local Build + Play · schema v1',
    )
  })

  it('resolves draft-restore chrome keys', () => {
    expect(translate(EN, 'shell.draftRestore')).toBe('Restore draft')
    expect(translate(EN, 'shell.draftDiscard')).toBe('Discard draft')
  })

  it('returns the key when missing from every catalog', () => {
    expect(translate(EN, 'does.not.exist')).toBe('does.not.exist')
  })

  it('falls back from an empty locale catalog to English', () => {
    expect(translate({}, 'shell.newSheet')).toBe('New sheet')
  })

  it('prefers the active catalog over English', () => {
    expect(translate(ES, 'shell.newSheet')).toBe('Nueva hoja')
    expect(translate(ES, 'shell.saveSheet')).toBe('Guardar hoja')
    expect(translate(ES, 'pf1e.tabs.feats')).toBe('Dotes')
    expect(
      translate(ES, 'shell.tagline', { system: 'Prueba', version: 1 }),
    ).toBe('Prueba · Construcción + juego local · esquema v1')
  })
})

describe('Spanish catalog', () => {
  it('covers every English key with the same interpolation placeholders', () => {
    const english = leafPaths(EN)
    const spanish = new Map(leafPaths(ES).map((row) => [row.path, row.value]))
    expect([...spanish.keys()].sort()).toEqual(english.map((row) => row.path).sort())
    for (const row of english) {
      const translated = spanish.get(row.path)
      expect(translated, row.path).toBeTruthy()
      expect(placeholders(translated ?? ''), row.path).toEqual(
        placeholders(row.value),
      )
    }
  })
})
