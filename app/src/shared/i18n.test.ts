import { describe, expect, it } from 'vitest'
import { t } from './i18n'

describe('t()', () => {
  it('resolves shell chrome keys', () => {
    expect(t('shell.newSheet')).toBe('New sheet')
    expect(t('shell.tagline', { system: 'Test', version: 1 })).toBe(
      'Test · local Build + Play · schema v1',
    )
  })

  it('resolves draft-restore chrome keys', () => {
    expect(t('shell.draftRestore')).toBe('Restore draft')
    expect(t('shell.draftDiscard')).toBe('Discard draft')
  })

  it('returns the key when missing', () => {
    expect(t('does.not.exist')).toBe('does.not.exist')
  })
})
