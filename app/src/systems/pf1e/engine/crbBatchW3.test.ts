import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const TRIP_IDS = [
  'weapon.sickle',
  'weapon.flail',
  'weapon.heavy-flail',
  'weapon.guisarme',
  'weapon.halberd',
  'weapon.scythe',
  'weapon.kama',
  'weapon.whip',
  'weapon.gnome-hooked-hammer',
  'weapon.dire-flail',
  'weapon.bolas',
] as const

const TRIP_ONLY_IDS = [
  'weapon.sickle',
  'weapon.scythe',
  'weapon.kama',
  'weapon.gnome-hooked-hammer',
  'weapon.bolas',
] as const

describe('CRB W3: trip', () => {
  it('appends trip on matching weapons', () => {
    for (const id of TRIP_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toContain('trip')
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toContain('trip')
    }
  })

  it('stamps trip as a one-tag list on weapons that only have trip', () => {
    for (const id of TRIP_ONLY_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toEqual(['trip'])
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toEqual(['trip'])
    }
  })

  it('appends trip without replacing reach on the guisarme', () => {
    expect(lookupCrbItem('weapon.guisarme')?.weapon?.properties).toEqual([
      'reach',
      'trip',
    ])
    const stamped = applyCrbItem(createEmptyItem(), 'weapon.guisarme')
    expect(stamped.weapon?.properties).toEqual(['reach', 'trip'])
  })

  it('appends trip without replacing brace on the halberd', () => {
    expect(lookupCrbItem('weapon.halberd')?.weapon?.properties).toEqual([
      'brace',
      'trip',
    ])
    const stamped = applyCrbItem(createEmptyItem(), 'weapon.halberd')
    expect(stamped.weapon?.properties).toEqual(['brace', 'trip'])
  })

  it('appends trip without replacing reach on the whip', () => {
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toContain('reach')
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toContain('trip')
  })

  it('keeps trip on flails after later tags append', () => {
    expect(lookupCrbItem('weapon.flail')?.weapon?.properties).toContain('trip')
    expect(lookupCrbItem('weapon.heavy-flail')?.weapon?.properties).toContain(
      'trip',
    )
    expect(lookupCrbItem('weapon.dire-flail')?.weapon?.properties).toContain(
      'trip',
    )
  })

  it('does not pack monk or nonlethal yet', () => {
    for (const id of TRIP_IDS) {
      const tags = lookupCrbItem(id)?.weapon?.properties ?? []
      expect(tags).not.toContain('monk')
      expect(tags).not.toContain('nonlethal')
    }
  })

  it('leaves unrelated weapons without a properties field', () => {
    expect(lookupCrbItem('weapon.longsword')?.weapon).not.toHaveProperty(
      'properties',
    )
  })
})

describe('CRB W3: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped kama', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.kama')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.properties).toEqual(['trip'])
    expect(row.pounds).toBe(2)
  })
})
