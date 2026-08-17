import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyClass, createEmptySpellcasting } from '../character/createRows'
import { compute } from './compute'
import { abilityModifierFromScore } from './abilities'
import { loadThresholds, mediumBipedHeavyLoad } from './encumbrance'
import {
  babFromProgression,
  iterativeAttacks,
  saveFromProgression,
} from './progressions'
import { bonusSpellsFromAbility, spellDc } from './spellcasting'

describe('abilityModifierFromScore', () => {
  it('uses floor((score-10)/2)', () => {
    expect(abilityModifierFromScore(18)).toBe(4)
    expect(abilityModifierFromScore(9)).toBe(-1)
    expect(abilityModifierFromScore(10)).toBe(0)
    expect(abilityModifierFromScore(11)).toBe(0)
  })
})

describe('progressions', () => {
  it('uses CRB BAB tables', () => {
    expect(babFromProgression('full', 5)).toBe(5)
    expect(babFromProgression('threeQuarter', 5)).toBe(3)
    expect(babFromProgression('half', 5)).toBe(2)
  })

  it('uses CRB save tables', () => {
    expect(saveFromProgression('good', 5)).toBe(4)
    expect(saveFromProgression('poor', 5)).toBe(1)
    expect(saveFromProgression('good', 1)).toBe(2)
    expect(saveFromProgression('poor', 1)).toBe(0)
  })

  it('starts extra attacks at BAB +6, not +5', () => {
    expect(iterativeAttacks(5)).toEqual([5])
    expect(iterativeAttacks(6)).toEqual([6, 1])
    expect(iterativeAttacks(11)).toEqual([11, 6, 1])
    expect(iterativeAttacks(16)).toEqual([16, 11, 6, 1])
  })
})

describe('encumbrance', () => {
  it('matches the CRB Strength heavy-load table', () => {
    expect(mediumBipedHeavyLoad(10)).toBe(100)
    expect(mediumBipedHeavyLoad(16)).toBe(230)
    expect(mediumBipedHeavyLoad(18)).toBe(300)
    expect(mediumBipedHeavyLoad(20)).toBe(400)
    const t = loadThresholds(18, 'medium')
    expect(t).toEqual({ light: 100, medium: 200, heavy: 300 })
  })
})

describe('spell DC and bonus slots', () => {
  it('uses 10 + spell level + ability mod', () => {
    expect(spellDc(0, 4)).toBe(14)
    expect(spellDc(3, 4)).toBe(17)
  })

  it('matches the CRB bonus-spells table', () => {
    expect(bonusSpellsFromAbility(18, 0)).toBe(0)
    expect(bonusSpellsFromAbility(18, 1)).toBe(1)
    expect(bonusSpellsFromAbility(18, 4)).toBe(1)
    expect(bonusSpellsFromAbility(18, 5)).toBe(0)
    expect(bonusSpellsFromAbility(20, 1)).toBe(2)
    expect(bonusSpellsFromAbility(10, 1)).toBe(0)
  })

  it('computes caster level and honors a DC override', () => {
    const character = createEmptyCharacter()
    const wizard = createEmptyClass()
    wizard.id = 'class-row-wizard'
    wizard.class = { id: 'class.wizard', name: 'Wizard' }
    wizard.levels = 5
    wizard.babProgression = 'half'
    wizard.saves = { fort: 'poor', ref: 'poor', will: 'good' }
    character.classes = [wizard]
    character.abilities.int.score = 18
    const entry = createEmptySpellcasting()
    entry.id = 'cast-test'
    entry.classRowId = 'class-row-wizard'
    character.spellcasting = [entry]
    const view = compute(character)
    expect(view.spellcasting['cast-test'].casterLevel).toBe(5)
    expect(view.spellcasting['cast-test'].dcByLevel[1]).toBe(15)

    character.overrides['derived.spellcasting.cast-test.dcByLevel.1'] = {
      value: 16,
    }
    const overridden = compute(character)
    expect(overridden.spellcasting['cast-test'].dcByLevel[1]).toBe(16)
    expect(overridden.overriddenPaths).toContain(
      'derived.spellcasting.cast-test.dcByLevel.1',
    )
  })
})

describe('compute empty sheet', () => {
  it('uses scores of 10 and no class rows', () => {
    const character = createEmptyCharacter()
    const view = compute(character)
    expect(view.level).toBe(0)
    expect(view.abilityModifiers.str).toBe(0)
    expect(view.bab).toBe(0)
    expect(view.babIteratives).toEqual([0])
    expect(view.maxHp).toBe(0)
    expect(view.ac).toBe(10)
    expect(view.touchAc).toBe(10)
    expect(view.flatFootedAc).toBe(10)
    expect(view.cmb).toBe(0)
    expect(view.cmd).toBe(10)
    expect(view.fortitude).toBe(0)
    expect(view.skillTotals.athletics).toBeUndefined()
    expect(view.skillTotals.climb).toBe(0)
    expect(view.loadCategory).toBe('light')
    expect(view.spellcasting).toEqual({})
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

  it('stacks Fighter 2 / Wizard 3 BAB and saves', () => {
    const character = createEmptyCharacter()
    const fighter = createEmptyClass()
    fighter.class = { id: 'class.fighter', name: 'Fighter' }
    fighter.levels = 2
    fighter.hitDie = 10
    fighter.babProgression = 'full'
    fighter.saves = { fort: 'good', ref: 'poor', will: 'poor' }
    const wizard = createEmptyClass()
    wizard.class = { id: 'class.wizard', name: 'Wizard' }
    wizard.levels = 3
    wizard.hitDie = 6
    wizard.babProgression = 'half'
    wizard.saves = { fort: 'poor', ref: 'poor', will: 'good' }
    character.classes = [fighter, wizard]
    const view = compute(character)
    expect(view.level).toBe(5)
    expect(view.bab).toBe(3)
    expect(view.fortitude).toBe(4)
    expect(view.reflex).toBe(1)
    expect(view.will).toBe(3)
  })
})
