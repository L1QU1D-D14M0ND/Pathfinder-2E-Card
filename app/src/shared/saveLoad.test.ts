import { describe, expect, it } from 'vitest'
import {
  CharacterLoadError,
  parseJsonObject,
  suggestedSaveFilename,
} from './saveLoad'

describe('suggestedSaveFilename', () => {
  it('slugifies an ASCII name', () => {
    expect(suggestedSaveFilename('Grognak the Destroyer')).toBe(
      'Grognak-the-Destroyer.json',
    )
  })

  it('keeps accented letters instead of stripping them', () => {
    expect(suggestedSaveFilename('Álvaro Núñez')).toBe('Álvaro-Núñez.json')
    expect(suggestedSaveFilename('Zoë')).toBe('Zoë.json')
    expect(suggestedSaveFilename("Séverin d'Aubigné")).toBe(
      'Séverin-dAubigné.json',
    )
  })

  it('keeps non-Latin scripts', () => {
    expect(suggestedSaveFilename('日本語の名前')).toBe('日本語の名前.json')
  })

  it('drops path separators and punctuation', () => {
    expect(suggestedSaveFilename('../../etc/passwd')).toBe('etcpasswd.json')
    expect(suggestedSaveFilename('a/b\\c:d*e?f')).toBe('abcdef.json')
  })

  it('falls back to "character" for blank or fully stripped names', () => {
    expect(suggestedSaveFilename('')).toBe('character.json')
    expect(suggestedSaveFilename('   ')).toBe('character.json')
    expect(suggestedSaveFilename('***')).toBe('character.json')
  })

  it('collapses runs of whitespace into single dashes', () => {
    expect(suggestedSaveFilename('  Bran   the\tBold  ')).toBe(
      'Bran-the-Bold.json',
    )
  })

  it('caps the stem at 64 characters', () => {
    const stem = suggestedSaveFilename('á'.repeat(200)).replace('.json', '')
    expect(stem).toHaveLength(64)
  })

  it('honours a custom extension', () => {
    expect(suggestedSaveFilename('Kyra', '.pf1e.json')).toBe('Kyra.pf1e.json')
  })
})

describe('parseJsonObject', () => {
  it('parses a JSON object', () => {
    expect(parseJsonObject('{"a":1}')).toEqual({ a: 1 })
  })

  it('rejects malformed JSON', () => {
    expect(() => parseJsonObject('{nope')).toThrow(CharacterLoadError)
  })

  it('rejects JSON that is not an object', () => {
    expect(() => parseJsonObject('[1,2]')).toThrow(CharacterLoadError)
    expect(() => parseJsonObject('"text"')).toThrow(CharacterLoadError)
    expect(() => parseJsonObject('null')).toThrow(CharacterLoadError)
  })
})
