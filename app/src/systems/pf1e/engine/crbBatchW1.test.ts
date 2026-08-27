import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const REACH_IDS = [
  'weapon.longspear',
  'weapon.glaive',
  'weapon.guisarme',
  'weapon.lance',
  'weapon.ranseur',
  'weapon.whip',
] as const

describe('CRB W1: reach', () => {
  it('appends reach as a one-tag list on matching weapons', () => {
    for (const id of REACH_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toEqual(['reach'])
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toEqual(['reach'])
    }
  })

  it('does not require a second tag on W1 rows', () => {
    expect(lookupCrbItem('weapon.longspear')?.weapon?.properties).toHaveLength(1)
    expect(lookupCrbItem('weapon.glaive')?.weapon?.properties).toHaveLength(1)
  })

  it('leaves other weapons without a properties field', () => {
    expect(lookupCrbItem('weapon.longsword')?.weapon).not.toHaveProperty(
      'properties',
    )
    expect(lookupCrbItem('weapon.spear')?.weapon).not.toHaveProperty(
      'properties',
    )
    expect(lookupCrbItem('weapon.kama')?.weapon).not.toHaveProperty(
      'properties',
    )
  })

  it('does not close the tag list to a seven-value enum', () => {
    const stamped = applyCrbItem(createEmptyItem(), 'weapon.longspear')
    stamped.weapon = {
      ...stamped.weapon,
      properties: ['reach', 'flaming'],
    }
    expect(stamped.weapon.properties).toEqual(['reach', 'flaming'])
  })
})

describe('CRB W1: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped longspear', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.longspear')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.properties).toEqual(['reach'])
  })
})
