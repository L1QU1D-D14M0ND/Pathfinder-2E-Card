import { describe, expect, it } from 'vitest'
import { parseCharacterJson } from '../character/saveLoad'
import { compute } from './compute'
import { signed } from './types'
import { readRepoFile } from '../test/readRepoFile'

describe('golden Fighter 5', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/fighter-5.json'),
  )
  const view = compute(character)

  it('loads as schemaVersion 1', () => {
    expect(character.schemaVersion).toBe(1)
    expect(character.identity.level).toBe(5)
    expect(character.identity.class.id).toBe('class.fighter')
  })

  it('computes attribute modifiers from entered boosts', () => {
    expect(view.attributeModifiers).toEqual({
      str: 4,
      dex: 2,
      con: 2,
      int: 0,
      wis: 1,
      cha: 0,
    })
  })

  it('computes HP, AC, perception, saves, and class DC', () => {
    expect(view.maxHp).toBe(73)
    expect(view.ac).toBe(25)
    expect(view.perception).toBe(10)
    expect(view.fortitude).toBe(11)
    expect(view.reflex).toBe(11)
    expect(view.will).toBe(8)
    expect(view.classDC).toBe(21)
  })

  it('computes skills including untrained (no level) and armor-penalty skip', () => {
    expect(view.skillTotals.athletics).toBe(11)
    expect(view.skillTotals.acrobatics).toBe(9)
    expect(view.skillTotals.intimidation).toBe(7)
    expect(view.skillTotals.stealth).toBe(2)
    expect(view.skillTotals.arcana).toBe(0)
  })

  it('computes strike attack and damage snapshots', () => {
    expect(view.strikes['strike-longsword']).toEqual({
      attack: 16,
      damage: '1d8+4',
    })
    expect(view.strikes['strike-fist']).toEqual({
      attack: 13,
      damage: '1d4+4',
    })
    expect(signed(view.strikes['strike-longsword'].attack)).toBe('+16')
  })

  it('computes bulk tenths and investiture', () => {
    expect(view.bulkUsed).toBe(5.1)
    expect(view.bulkCapacity).toBe(9)
    expect(view.bulkMaximum).toBe(14)
    expect(view.investedCount).toBe(1)
  })
})
