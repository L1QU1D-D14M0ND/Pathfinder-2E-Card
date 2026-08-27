import { describe, expect, it } from 'vitest'
import {
  addWeaponProperty,
  normalizeWeaponProperties,
  removeWeaponProperty,
  toKebabTag,
} from './weaponProperties'

describe('weapon.properties N tags', () => {
  it('slugifies to kebab-case', () => {
    expect(toKebabTag('Ghost Touch')).toBe('ghost-touch')
    expect(toKebabTag('REACH')).toBe('reach')
  })

  it('omits an empty list rather than storing []', () => {
    expect(normalizeWeaponProperties([])).toBeUndefined()
    expect(normalizeWeaponProperties(['  '])).toBeUndefined()
  })

  it('allows a single tag', () => {
    expect(normalizeWeaponProperties(['reach'])).toEqual(['reach'])
  })

  it('allows many tags and de-duplicates', () => {
    expect(
      normalizeWeaponProperties(['reach', 'trip', 'reach', 'Trip']),
    ).toEqual(['reach', 'trip'])
  })

  it('adds and removes without requiring a second tag', () => {
    expect(addWeaponProperty(undefined, 'reach')).toEqual(['reach'])
    expect(addWeaponProperty(['reach'], 'trip')).toEqual(['reach', 'trip'])
    expect(removeWeaponProperty(['reach', 'trip'], 'trip')).toEqual(['reach'])
    expect(removeWeaponProperty(['reach'], 'reach')).toBeUndefined()
  })
})
