import { describe, expect, it } from 'vitest'
import { createSheet, stampSheetLocale } from './registry'

describe('stampSheetLocale', () => {
  it('writes the UI locale onto meta.locale without rewriting the rest', () => {
    const pf1e = createSheet('pf1e')
    expect(pf1e.character.meta.locale).toBe('en')
    const stamped = stampSheetLocale(pf1e, 'es')
    expect(stamped.system).toBe('pf1e')
    expect(stamped.character.meta.locale).toBe('es')
    expect(stamped.character.meta.characterId).toBe(
      pf1e.character.meta.characterId,
    )
    expect(pf1e.character.meta.locale).toBe('en')
  })

  it('returns the same sheet when the locale already matches', () => {
    const pf2e = createSheet('pf2e')
    expect(stampSheetLocale(pf2e, 'en')).toBe(pf2e)
  })
})
