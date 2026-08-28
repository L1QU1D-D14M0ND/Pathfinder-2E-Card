import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character'
import { computeCharacter } from './compute'
import { SCALARS } from './overrides'
import { isOverridden } from '../../../shared/overrides'

/**
 * Twin of the PF1e suite: every SCALARS entry is a hand-written one-line
 * mutation, so a copy-paste would silently write the wrong derived field.
 */
const KEYS = Object.keys(SCALARS).sort()
const SENTINEL = 1234

describe('PF2e derived scalar overrides', () => {
  it('covers every SCALARS key', () => {
    expect(KEYS.length).toBeGreaterThanOrEqual(10)
  })

  it.each(KEYS)('derived.%s overrides only that field', (key) => {
    const character = createEmptyCharacter()
    const before = computeCharacter(character) as unknown as Record<
      string,
      unknown
    >

    character.overrides[`derived.${key}`] = { value: SENTINEL }
    const after = computeCharacter(character) as unknown as Record<
      string,
      unknown
    >

    expect(after[key], `derived.${key} did not take the override`).toBe(
      SENTINEL,
    )
    expect(isOverridden(after, `derived.${key}`)).toBe(true)

    const collateral = KEYS.filter(
      (other) => other !== key && after[other] !== before[other],
    )
    expect(collateral, `derived.${key} also changed other fields`).toEqual([])
  })

  it.each(KEYS)('derived.%s rejects a non-numeric value', (key) => {
    const character = createEmptyCharacter()
    character.overrides[`derived.${key}`] = { value: 'nope' as never }
    const view = computeCharacter(character)

    expect(view.ignoredOverridePaths).toContain(`derived.${key}`)
    expect(isOverridden(view, `derived.${key}`)).toBe(false)
  })
})
