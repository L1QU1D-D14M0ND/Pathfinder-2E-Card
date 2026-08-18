import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyClass } from '../character/createRows'
import type { ArmorClassInputs } from '../character/types'
import { parseCharacterJson } from '../character/saveLoad'
import { armorClassValues, cappedDexBonus, flatFootedDex } from './ac'
import { compute } from './compute'
import { readRepoFile } from '../../../test/readRepoFile'

function ac(partial: Partial<ArmorClassInputs> = {}): ArmorClassInputs {
  return {
    armorBonus: 0,
    shieldBonus: 0,
    natural: 0,
    deflection: 0,
    dodge: 0,
    other: 0,
    maxDex: null,
    armorCheckPenalty: 0,
    ...partial,
  }
}

describe('CRB batch 3: armor class trio', () => {
  it('caps a Dex bonus at maxDex and never caps a Dex penalty', () => {
    expect(cappedDexBonus(4, 2)).toBe(2)
    expect(cappedDexBonus(4, null)).toBe(4)
    expect(cappedDexBonus(2, 2)).toBe(2)
    expect(cappedDexBonus(-1, 2)).toBe(-1)
    expect(cappedDexBonus(-3, 0)).toBe(-3)
    expect(cappedDexBonus(0, 0)).toBe(0)
  })

  it('drops a Dex bonus when flat-footed and keeps a Dex penalty', () => {
    expect(flatFootedDex(4)).toBe(0)
    expect(flatFootedDex(0)).toBe(0)
    expect(flatFootedDex(-2)).toBe(-2)
  })

  it('matches the Fighter 5 chainmail snapshot (10 + 6 armor + 2 Dex)', () => {
    const trio = armorClassValues(ac({ armorBonus: 6, maxDex: 2 }), 2, 'medium')
    expect(trio).toEqual({ ac: 18, touchAc: 12, flatFootedAc: 16 })
  })

  it('omits armor, shield, and natural from touch', () => {
    const trio = armorClassValues(
      ac({ armorBonus: 6, shieldBonus: 2, natural: 3, deflection: 1, dodge: 1 }),
      2,
      'medium',
    )
    expect(trio.ac).toBe(10 + 6 + 2 + 2 + 3 + 1 + 1)
    expect(trio.touchAc).toBe(10 + 2 + 1 + 1)
    expect(trio.flatFootedAc).toBe(10 + 6 + 2 + 3 + 1)
  })

  it('applies other to AC, touch, and flat-footed', () => {
    const trio = armorClassValues(ac({ other: 2 }), 0, 'medium')
    expect(trio).toEqual({ ac: 12, touchAc: 12, flatFootedAc: 12 })
  })

  it('applies dodge to AC and touch, not flat-footed', () => {
    const trio = armorClassValues(ac({ dodge: 2 }), 0, 'medium')
    expect(trio).toEqual({ ac: 12, touchAc: 12, flatFootedAc: 10 })
  })

  it('keeps a Dex penalty on flat-footed AC', () => {
    const trio = armorClassValues(ac({ armorBonus: 6 }), -1, 'medium')
    expect(trio.ac).toBe(15)
    expect(trio.touchAc).toBe(9)
    expect(trio.flatFootedAc).toBe(15)
  })

  it('caps Dex on AC and touch when maxDex is lower than the bonus', () => {
    const trio = armorClassValues(ac({ armorBonus: 6, maxDex: 2 }), 4, 'medium')
    expect(trio.ac).toBe(18)
    expect(trio.touchAc).toBe(12)
    expect(trio.flatFootedAc).toBe(16)
  })
})

describe('CRB batch 3: CMB and CMD', () => {
  it('starts at +0 CMB and 10 CMD on an empty Medium sheet', () => {
    const view = compute(createEmptyCharacter())
    expect(view.cmb).toBe(0)
    expect(view.cmd).toBe(10)
  })

  it('matches Fighter 5: BAB 5 + Str +4 → CMB +9; CMD 21', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const view = compute(character)
    expect(view.bab).toBe(5)
    expect(view.abilityModifiers.str).toBe(4)
    expect(view.abilityModifiers.dex).toBe(2)
    expect(view.cmb).toBe(9)
    expect(view.cmd).toBe(21)
  })

  it('does not apply armor maxDex to CMD', () => {
    const character = createEmptyCharacter()
    const fighter = createEmptyClass()
    fighter.levels = 5
    fighter.babProgression = 'full'
    character.classes = [fighter]
    character.abilities.str.score = 18
    character.abilities.dex.score = 18
    character.armorClass.maxDex = 2
    const view = compute(character)
    expect(view.abilityModifiers.dex).toBe(4)
    expect(view.ac).toBe(12)
    expect(view.touchAc).toBe(12)
    expect(view.cmb).toBe(9)
    expect(view.cmd).toBe(23)
  })

  it('adds dodge and deflection to CMD, not CMB; other stays off CMD', () => {
    const character = createEmptyCharacter()
    character.armorClass.dodge = 1
    character.armorClass.deflection = 2
    character.armorClass.other = 5
    character.combat.cmdMisc = 0
    const view = compute(character)
    expect(view.cmb).toBe(0)
    expect(view.cmd).toBe(13)
    expect(view.ac).toBe(18)
  })

  it('adds cmdMisc to CMD and cmbMisc to CMB', () => {
    const character = createEmptyCharacter()
    character.combat.cmbMisc = 2
    character.combat.cmdMisc = 3
    const view = compute(character)
    expect(view.cmb).toBe(2)
    expect(view.cmd).toBe(13)
  })

  it('uses the opposite size modifier on CMB/CMD versus AC (Small spot check)', () => {
    const medium = createEmptyCharacter()
    medium.identity.size = 'medium'
    const small = createEmptyCharacter()
    small.identity.size = 'small'
    const mediumView = compute(medium)
    const smallView = compute(small)
    expect(mediumView.ac).toBe(10)
    expect(smallView.ac).toBe(11)
    expect(mediumView.cmb).toBe(0)
    expect(smallView.cmb).toBe(-1)
    expect(mediumView.cmd).toBe(10)
    expect(smallView.cmd).toBe(9)
  })
})
