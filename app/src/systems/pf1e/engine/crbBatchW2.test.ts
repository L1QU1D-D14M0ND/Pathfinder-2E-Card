import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const BRACE_ONLY_IDS = [
  'weapon.spear',
  'weapon.trident',
  'weapon.halberd',
  'weapon.dwarven-urgrosh',
] as const

describe('CRB W2: brace', () => {
  it('appends brace without replacing reach on the longspear', () => {
    expect(lookupCrbItem('weapon.longspear')?.weapon?.properties).toEqual([
      'reach',
      'brace',
    ])
    const stamped = applyCrbItem(createEmptyItem(), 'weapon.longspear')
    expect(stamped.weapon?.properties).toEqual(['reach', 'brace'])
  })

  it('stamps brace as a one-tag list on weapons that only have brace', () => {
    for (const id of BRACE_ONLY_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toEqual(['brace'])
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toEqual(['brace'])
    }
  })

  it('leaves non-brace reach weapons as a single reach tag', () => {
    expect(lookupCrbItem('weapon.glaive')?.weapon?.properties).toEqual([
      'reach',
    ])
    expect(lookupCrbItem('weapon.whip')?.weapon?.properties).toEqual(['reach'])
  })

  it('leaves unrelated weapons without a properties field', () => {
    expect(lookupCrbItem('weapon.longsword')?.weapon).not.toHaveProperty(
      'properties',
    )
    expect(lookupCrbItem('weapon.kama')?.weapon).not.toHaveProperty(
      'properties',
    )
  })
})

describe('CRB W2: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped spear', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.spear')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.properties).toEqual(['brace'])
    expect(row.pounds).toBe(6)
  })
})
