import { describe, expect, it } from 'vitest'
import { translate, type MessageTree } from './i18n'
import en from '../locales/en.json'

const EN = en as MessageTree

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
    const es: MessageTree = { shell: { newSheet: 'Nueva hoja' } }
    expect(translate(es, 'shell.newSheet')).toBe('Nueva hoja')
    expect(translate(es, 'shell.saveSheet')).toBe('Save sheet')
  })
})
