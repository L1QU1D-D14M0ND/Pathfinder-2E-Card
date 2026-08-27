import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const MARTIAL_TWO_HANDED = [
  {
    id: 'weapon.falchion',
    name: 'Falchion',
    pounds: 8,
    weapon: {
      damageDice: '2d4',
      damageType: 'slashing',
      critRange: 18,
      critMultiplier: 2,
    },
  },
  {
    id: 'weapon.glaive',
    name: 'Glaive',
    pounds: 10,
    weapon: {
      damageDice: '1d10',
      damageType: 'slashing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.greataxe',
    name: 'Greataxe',
    pounds: 12,
    weapon: {
      damageDice: '1d12',
      damageType: 'slashing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.greatclub',
    name: 'Greatclub',
    pounds: 8,
    weapon: {
      damageDice: '1d10',
      damageType: 'bludgeoning',
      critRange: 20,
      critMultiplier: 2,
    },
  },
  {
    id: 'weapon.heavy-flail',
    name: 'Heavy flail',
    pounds: 10,
    weapon: {
      damageDice: '1d10',
      damageType: 'bludgeoning',
      critRange: 20,
      critMultiplier: 2,
    },
  },
  {
    id: 'weapon.greatsword',
    name: 'Greatsword',
    pounds: 8,
    weapon: {
      damageDice: '2d6',
      damageType: 'slashing',
      critRange: 19,
      critMultiplier: 2,
    },
  },
  {
    id: 'weapon.guisarme',
    name: 'Guisarme',
    pounds: 12,
    weapon: {
      damageDice: '2d4',
      damageType: 'slashing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.halberd',
    name: 'Halberd',
    pounds: 12,
    weapon: {
      damageDice: '1d10',
      damageType: 'piercing or slashing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.lance',
    name: 'Lance',
    pounds: 10,
    weapon: {
      damageDice: '1d8',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.ranseur',
    name: 'Ranseur',
    pounds: 12,
    weapon: {
      damageDice: '2d4',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
    },
  },
  {
    id: 'weapon.scythe',
    name: 'Scythe',
    pounds: 10,
    weapon: {
      damageDice: '2d4',
      damageType: 'piercing or slashing',
      critRange: 20,
      critMultiplier: 4,
    },
  },
] as const

const MARTIAL_RANGED = [
  {
    id: 'weapon.longbow',
    name: 'Longbow',
    pounds: 3,
    weapon: {
      damageDice: '1d8',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
      rangeFeet: 100,
    },
  },
  {
    id: 'weapon.composite-longbow',
    name: 'Composite longbow',
    pounds: 3,
    weapon: {
      damageDice: '1d8',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
      rangeFeet: 110,
    },
  },
  {
    id: 'weapon.shortbow',
    name: 'Shortbow',
    pounds: 2,
    weapon: {
      damageDice: '1d6',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
      rangeFeet: 60,
    },
  },
  {
    id: 'weapon.composite-shortbow',
    name: 'Composite shortbow',
    pounds: 2,
    weapon: {
      damageDice: '1d6',
      damageType: 'piercing',
      critRange: 20,
      critMultiplier: 3,
      rangeFeet: 70,
    },
  },
] as const

describe('CRB batch 18: martial two-handed', () => {
  it('stamps Medium CRB table numbers for martial two-handed weapons', () => {
    for (const row of MARTIAL_TWO_HANDED) {
      expect(lookupCrbItem(row.id)).toMatchObject(row)
      const stamped = applyCrbItem(createEmptyItem(), row.id)
      expect(stamped.item.name).toBe(row.name)
      expect(stamped.pounds).toBe(row.pounds)
      expect(stamped.weapon).toEqual(row.weapon)
    }
  })
})

describe('CRB batch 18: martial ranged and arrows', () => {
  it('stamps Medium CRB table numbers for martial bows', () => {
    for (const row of MARTIAL_RANGED) {
      expect(lookupCrbItem(row.id)).toMatchObject(row)
      const stamped = applyCrbItem(createEmptyItem(), row.id)
      expect(stamped.weapon).toEqual(row.weapon)
      expect(stamped.pounds).toBe(row.pounds)
    }
  })

  it('stamps arrows as a bundle with the published weight', () => {
    expect(lookupCrbItem('item.arrows')).toMatchObject({
      id: 'item.arrows',
      name: 'Arrows',
      kind: 'item',
      pounds: 3,
    })
    const stamped = applyCrbItem(createEmptyItem(), 'item.arrows')
    expect(stamped.pounds).toBe(3)
    expect(stamped.weapon).toBeUndefined()
  })

  it('does not encode composite Strength rating in the id', () => {
    expect(lookupCrbItem('weapon.composite-longbow-str-2')).toBeNull()
    expect(lookupCrbItem('weapon.composite-longbow')?.weapon?.rangeFeet).toBe(
      110,
    )
  })

  it('leaves exotic ids unknown', () => {
    expect(lookupCrbItem('weapon.kama')).toBeNull()
    expect(lookupCrbItem('weapon.bastard-sword')).toBeNull()
    expect(lookupCrbItem('item.repeating-crossbow-bolts')).toBeNull()
  })
})

describe('CRB batch 18: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped greatsword', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.greatsword')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.damageDice).toBe('2d6')
    expect(row.weapon?.critRange).toBe(19)
    expect(row.pounds).toBe(8)
  })
})
