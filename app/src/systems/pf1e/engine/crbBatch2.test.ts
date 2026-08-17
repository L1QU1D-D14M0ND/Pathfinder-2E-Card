import { describe, expect, it } from 'vitest'
import { parseCharacterJson } from '../character/saveLoad'
import { compute } from './compute'
import {
  formatIteratives,
  iterativeAttacks,
} from './progressions'
import {
  hpBreakdown,
  hpFromHitDie,
  setHitDieRoll,
} from './vitals'
import { readRepoFile } from '../../../test/readRepoFile'

const FULL_BAB_ITERATIVES_1_TO_20: number[][] = [
  [1],
  [2],
  [3],
  [4],
  [5],
  [6, 1],
  [7, 2],
  [8, 3],
  [9, 4],
  [10, 5],
  [11, 6, 1],
  [12, 7, 2],
  [13, 8, 3],
  [14, 9, 4],
  [15, 10, 5],
  [16, 11, 6, 1],
  [17, 12, 7, 2],
  [18, 13, 8, 3],
  [19, 14, 9, 4],
  [20, 15, 10, 5],
]

describe('CRB batch 2: hit points', () => {
  it('uses max(1, roll + Con) per HD', () => {
    expect(hpFromHitDie(10, 2)).toBe(12)
    expect(hpFromHitDie(1, -2)).toBe(1)
    expect(hpFromHitDie(1, 0)).toBe(1)
  })

  it('breaks down the Fighter 5 golden (max 1st HD + average later + favored)', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const view = compute(character)
    const breakdown = hpBreakdown(
      character.vitals,
      character.classes,
      view.abilityModifiers.con,
    )
    expect(breakdown.expectedHitDice).toBe(5)
    expect(breakdown.slots.map((slot) => slot.rolled)).toEqual([10, 6, 6, 6, 6])
    expect(breakdown.slots.map((slot) => slot.fromHd)).toEqual([12, 8, 8, 8, 8])
    expect(breakdown.slots[0]?.firstLevel).toBe(true)
    expect(breakdown.slots[0]?.hitDie).toBe(10)
    expect(breakdown.fromDice).toBe(44)
    expect(breakdown.fromFavored).toBe(5)
    expect(breakdown.maxHp).toBe(49)
    expect(view.maxHp).toBe(49)
  })

  it('breaks down the Wizard 5 golden', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const view = compute(character)
    const breakdown = hpBreakdown(
      character.vitals,
      character.classes,
      view.abilityModifiers.con,
    )
    expect(breakdown.slots.map((slot) => slot.rolled)).toEqual([6, 4, 4, 4, 4])
    expect(breakdown.slots.map((slot) => slot.fromHd)).toEqual([8, 6, 6, 6, 6])
    expect(breakdown.fromDice).toBe(32)
    expect(breakdown.fromFavored).toBe(5)
    expect(breakdown.maxHp).toBe(37)
    expect(view.maxHp).toBe(37)
  })

  it('assigns multiclass HD in class-row order', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-2-wizard-3.json'),
    )
    const view = compute(character)
    const breakdown = hpBreakdown(
      character.vitals,
      character.classes,
      view.abilityModifiers.con,
    )
    expect(breakdown.slots.map((slot) => slot.className)).toEqual([
      'Fighter',
      'Fighter',
      'Wizard',
      'Wizard',
      'Wizard',
    ])
    expect(breakdown.slots.map((slot) => slot.hitDie)).toEqual([10, 10, 6, 6, 6])
    expect(breakdown.slots.map((slot) => slot.fromHd)).toEqual([12, 8, 6, 6, 6])
    expect(breakdown.fromFavored).toBe(2)
    expect(breakdown.maxHp).toBe(40)
  })

  it('fills HD rolls in order and only clears the last roll', () => {
    expect(setHitDieRoll([], 0, 10)).toEqual([10])
    expect(setHitDieRoll([10], 1, 6)).toEqual([10, 6])
    expect(setHitDieRoll([10], 2, 6)).toEqual([10])
    expect(setHitDieRoll([10, 6], 0, 8)).toEqual([8, 6])
    expect(setHitDieRoll([10, 6], 1, null)).toEqual([10])
    expect(setHitDieRoll([10, 6], 0, null)).toEqual([10, 6])
  })

  it('counts missing HD rolls as 0 until they are entered', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    character.vitals = { ...character.vitals, hpRolled: [10] }
    const view = compute(character)
    const breakdown = hpBreakdown(
      character.vitals,
      character.classes,
      view.abilityModifiers.con,
    )
    expect(breakdown.slots[0]?.fromHd).toBe(12)
    expect(breakdown.slots[1]?.rolled).toBeNull()
    expect(breakdown.slots[1]?.editable).toBe(true)
    expect(breakdown.slots[2]?.editable).toBe(false)
    expect(breakdown.fromDice).toBe(12)
    expect(breakdown.maxHp).toBe(17)
  })
})

describe('CRB batch 2: iterative attacks', () => {
  it('matches the CRB extra-attack table for full BAB 1–20', () => {
    for (let bab = 1; bab <= 20; bab += 1) {
      expect(iterativeAttacks(bab), `BAB ${bab}`).toEqual(
        FULL_BAB_ITERATIVES_1_TO_20[bab - 1],
      )
    }
  })

  it('does not invent a +5/+0 iterative', () => {
    expect(iterativeAttacks(5)).toEqual([5])
    expect(formatIteratives([5])).toBe('+5')
    expect(formatIteratives([6, 1])).toBe('+6/+1')
    expect(formatIteratives([11, 6, 1])).toBe('+11/+6/+1')
    expect(formatIteratives([16, 11, 6, 1])).toBe('+16/+11/+6/+1')
  })

  it('puts iteratives on the Fighter 5 longsword as a single +9', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const view = compute(character)
    expect(view.babIteratives).toEqual([5])
    expect(formatIteratives(view.attacks['atk-longsword'].iteratives)).toBe('+9')
  })
})
