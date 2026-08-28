import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character'
import { compute } from './compute'
import { SCALARS } from './overrides'
import { isOverridden } from '../../../shared/overrides'

/**
 * Every entry in SCALARS is a hand-written one-line mutation, so a copy-paste
 * (`touchAc: (view, value) => { view.flatFootedAc = value }`) would silently
 * write the wrong derived field. These run the real compute + override path
 * once per key and assert it moves that field and nothing else.
 */
const KEYS = Object.keys(SCALARS).sort()
const SENTINEL = 1234

describe('PF1e derived scalar overrides', () => {
  it('covers every SCALARS key', () => {
    expect(KEYS.length).toBeGreaterThanOrEqual(22)
  })

  it.each(KEYS)('derived.%s overrides only that field', (key) => {
    const character = createEmptyCharacter()
    const before = compute(character) as unknown as Record<string, unknown>

    character.overrides[`derived.${key}`] = { value: SENTINEL }
    const after = compute(character) as unknown as Record<string, unknown>

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
    const view = compute(character)

    expect(view.ignoredOverridePaths).toContain(`derived.${key}`)
    expect(isOverridden(view, `derived.${key}`)).toBe(false)
  })
})
