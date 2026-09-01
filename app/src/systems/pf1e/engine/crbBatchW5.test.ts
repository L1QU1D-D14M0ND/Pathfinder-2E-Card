import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyAttack, createEmptyItem } from '../character/createRows'
import { applyCrbItem, lookupCrbItem } from '../content'
import { compute } from './compute'

const MONK_IDS = [
  'weapon.quarterstaff',
  'weapon.kama',
  'weapon.nunchaku',
  'weapon.sai',
  'weapon.siangham',
  'weapon.shuriken',
] as const

const MONK_ONLY_IDS = [
  'weapon.quarterstaff',
  'weapon.siangham',
  'weapon.shuriken',
] as const

describe('CRB W5: monk', () => {
  it('appends monk on matching weapons', () => {
    for (const id of MONK_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toContain('monk')
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toContain('monk')
    }
  })

  it('stamps monk as a one-tag list on weapons that only have monk', () => {
    for (const id of MONK_ONLY_IDS) {
      expect(lookupCrbItem(id)?.weapon?.properties).toEqual(['monk'])
      const stamped = applyCrbItem(createEmptyItem(), id)
      expect(stamped.weapon?.properties).toEqual(['monk'])
    }
  })

  it('appends monk without replacing trip on the kama', () => {
    expect(lookupCrbItem('weapon.kama')?.weapon?.properties).toEqual([
      'trip',
      'monk',
    ])
    const stamped = applyCrbItem(createEmptyItem(), 'weapon.kama')
    expect(stamped.weapon?.properties).toEqual(['trip', 'monk'])
  })

  it('appends monk without replacing disarm on the nunchaku and sai', () => {
    expect(lookupCrbItem('weapon.nunchaku')?.weapon?.properties).toEqual([
      'disarm',
      'monk',
    ])
    expect(lookupCrbItem('weapon.sai')?.weapon?.properties).toEqual([
      'disarm',
      'monk',
    ])
    const nunchaku = applyCrbItem(createEmptyItem(), 'weapon.nunchaku')
    const sai = applyCrbItem(createEmptyItem(), 'weapon.sai')
    expect(nunchaku.weapon?.properties).toEqual(['disarm', 'monk'])
    expect(sai.weapon?.properties).toEqual(['disarm', 'monk'])
  })

  it('does not pack nonlethal or double yet', () => {
    for (const id of MONK_IDS) {
      const tags = lookupCrbItem(id)?.weapon?.properties ?? []
      expect(tags).not.toContain('nonlethal')
      expect(tags).not.toContain('double')
    }
  })

  it('leaves unrelated weapons without a properties field', () => {
    expect(lookupCrbItem('weapon.longsword')?.weapon).not.toHaveProperty(
      'properties',
    )
  })
})

describe('CRB W5: Combat stays typed', () => {
  it('does not rewrite AC or attacks after applying an equipped siangham', () => {
    const character = createEmptyCharacter()
    const attack = createEmptyAttack()
    character.attacks = [attack]
    const row = applyCrbItem(createEmptyItem(), 'weapon.siangham')
    row.location = 'equipped'
    character.inventory.items = [row]
    const beforeAc = structuredClone(character.armorClass)
    const beforeAttack = structuredClone(character.attacks[0])
    const view = compute(character)
    expect(character.armorClass).toEqual(beforeAc)
    expect(character.attacks[0]).toEqual(beforeAttack)
    expect(view.ac).toBe(10)
    expect(row.weapon?.properties).toEqual(['monk'])
    expect(row.pounds).toBe(1)
  })
})
