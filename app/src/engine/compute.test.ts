import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { compute } from './compute'
import { proficiencyBonus } from './proficiency'
import { stackTyped } from './stacking'
import { armorCheckPenalty } from './ac'
import { maxHp } from './hp'

describe('proficiencyBonus', () => {
  it('does not add level when untrained', () => {
    expect(proficiencyBonus('untrained', 5)).toBe(0)
    expect(proficiencyBonus('untrained', 20)).toBe(0)
  })

  it('adds rank bonus plus level when trained or better', () => {
    expect(proficiencyBonus('trained', 5)).toBe(7)
    expect(proficiencyBonus('expert', 5)).toBe(9)
    expect(proficiencyBonus('master', 5)).toBe(11)
    expect(proficiencyBonus('legendary', 5)).toBe(13)
  })

  it('has no maximum level cap', () => {
    expect(proficiencyBonus('trained', 21)).toBe(23)
  })
})

describe('stackTyped', () => {
  it('keeps the highest bonus and worst penalty', () => {
    expect(stackTyped([2, 1, -1, -2])).toBe(0)
    expect(stackTyped([3, 1])).toBe(3)
  })
})

describe('compute empty sheet', () => {
  it('uses boost sums, trained perception, and unarmored AC', () => {
    const character = createEmptyCharacter()
    const view = compute(character)
    expect(view.attributeModifiers.str).toBe(0)
    expect(view.perception).toBe(3)
    expect(view.fortitude).toBe(3)
    expect(view.reflex).toBe(3)
    expect(view.will).toBe(3)
    expect(view.classDC).toBe(13)
    expect(view.maxHp).toBe(0)
    expect(view.ac).toBe(13)
    expect(view.skillTotals.athletics).toBe(0)
    expect(view.skillTotals.acrobatics).toBe(0)
    expect(view.bulkUsed).toBe(0)
    expect(view.bulkCapacity).toBe(5)
    expect(view.investedCount).toBe(0)
  })

  it('applies a maxHp override and records the path', () => {
    const character = createEmptyCharacter()
    character.overrides['derived.maxHp'] = { value: 42, reason: 'test' }
    const view = compute(character)
    expect(view.maxHp).toBe(42)
    expect(view.overriddenPaths).toContain('derived.maxHp')
  })

  it('ignores unknown override paths', () => {
    const character = createEmptyCharacter()
    character.overrides['derived.notAField'] = { value: 1 }
    const view = compute(character)
    expect(view.ignoredOverridePaths).toContain('derived.notAField')
  })
})

describe('hp and armor penalty helpers', () => {
  it('applies the 1 HP per level floor once class HP is set', () => {
    const character = createEmptyCharacter()
    character.vitals.classHpPerLevel = 1
    character.attributes.con.boosts = [
      { kind: 'flaw', attribute: 'con', amount: -2 },
    ]
    character.identity.level = 3
    expect(maxHp(character, -2)).toBe(3)
  })

  it('applies armor check penalty only when Strength is below the requirement', () => {
    const armor = {
      category: 'medium' as const,
      acBonus: 4,
      dexCap: 1,
      checkPenalty: -2,
      speedPenalty: -5,
      strength: 3,
    }
    expect(armorCheckPenalty(armor, 4)).toBe(0)
    expect(armorCheckPenalty(armor, 2)).toBe(-2)
    expect(armorCheckPenalty({ ...armor, strength: null }, 0)).toBe(0)
  })
})
