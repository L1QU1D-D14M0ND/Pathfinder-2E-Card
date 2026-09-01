import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const DISARM_IDS = [
  'weapon.flail',
  'weapon.heavy-flail',
  'weapon.ranseur',
  'weapon.nunchaku',
  'weapon.sai',
  'weapon.whip',
  'weapon.dire-flail',
] as const

describe('CRB W4: disarm', () => {
  it('appends disarm on matching weapons', () => {
    for (const id of DISARM_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toContain('disarm')
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toContain('disarm')
    }
  })

  it('keeps disarm on nunchaku and sai after later tags append', () => {
    expect(lookupCrbItem('weapon.nunchaku')?.weapon?.properties).toContain(
      'disarm',
    )
    expect(lookupCrbItem('weapon.sai')?.weapon?.properties).toContain('disarm')
  })

  it('appends disarm without replacing trip on the flail and heavy flail', () => {
    expect(lookupCrbItem('weapon.flail')?.weapon?.properties).toEqual([
      'trip',
      'disarm',
    ])
    expect(lookupCrbItem('weapon.heavy-flail')?.weapon?.properties).toEqual([
      'trip',
      'disarm',
    ])
  })

  it('appends disarm without replacing reach on the ranseur', () => {
    expect(lookupCrbItem('weapon.ranseur')?.weapon?.properties).toEqual([
      'reach',
      'disarm',
    ])
  })

  it('appends disarm without replacing reach or trip on the whip', () => {
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toContain('reach')
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toContain('trip')
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toContain('disarm')
  })

  it('appends disarm without replacing trip on the dire flail', () => {
    expect(lookupCrbItem('weapon.dire-flail')?.weapon?.properties).toEqual([
      'trip',
      'disarm',
    ])
  })

  it('does not pack double yet', () => {
    for (const id of DISARM_IDS) {
      const tags = lookupCrbItem(id)?.weapon?.properties ?? []
      expect(tags).not.toContain('double')
    }
  })

  it('leaves unrelated weapons without a properties field', () => {
    expect(lookupCrbItem('weapon.longsword')?.weapon).not.toHaveProperty(
      'properties',
    )
  })
})

describe('CRB W4: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped nunchaku', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.nunchaku')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.properties).toContain('disarm')
    expect(row.pounds).toBe(2)
  })
})
