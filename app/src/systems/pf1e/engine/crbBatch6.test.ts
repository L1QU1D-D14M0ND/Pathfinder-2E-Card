import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyItem } from '../character/createRows'
import { parseCharacterJson } from '../character/saveLoad'
import { compute } from './compute'
import {
  effectiveLoadCategory,
  formatLoadSummary,
  loadCategory,
  loadThresholds,
  mediumBipedHeavyLoad,
  weightUsed,
} from './encumbrance'
import { readRepoFile } from '../../../test/readRepoFile'

/** CRB Medium biped heavy load in pounds (Strength 1–29). */
const MEDIUM_HEAVY_BY_STR: Record<number, number> = {
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
  6: 60,
  7: 70,
  8: 80,
  9: 90,
  10: 100,
  11: 115,
  12: 130,
  13: 150,
  14: 175,
  15: 200,
  16: 230,
  17: 260,
  18: 300,
  19: 350,
  20: 400,
  21: 460,
  22: 520,
  23: 600,
  24: 700,
  25: 800,
  26: 920,
  27: 1040,
  28: 1200,
  29: 1400,
}

describe('CRB batch 6: Strength heavy-load table', () => {
  it('matches the CRB Medium biped heavy-load column for Strength 1–29', () => {
    for (const [str, heavy] of Object.entries(MEDIUM_HEAVY_BY_STR)) {
      expect(mediumBipedHeavyLoad(Number(str))).toBe(heavy)
    }
  })

  it('uses light = floor(heavy/3) and medium = floor(2×heavy/3)', () => {
    const str14 = loadThresholds(14, 'medium')
    expect(str14).toEqual({ light: 58, medium: 116, heavy: 175 })
    const str18 = loadThresholds(18, 'medium')
    expect(str18).toEqual({ light: 100, medium: 200, heavy: 300 })
  })
})

describe('CRB batch 6: load category', () => {
  it('treats thresholds as inclusive and overloaded above heavy', () => {
    const t = { light: 100, medium: 200, heavy: 300 }
    expect(loadCategory(0, t)).toBe('light')
    expect(loadCategory(100, t)).toBe('light')
    expect(loadCategory(101, t)).toBe('medium')
    expect(loadCategory(200, t)).toBe('medium')
    expect(loadCategory(201, t)).toBe('heavy')
    expect(loadCategory(300, t)).toBe('heavy')
    expect(loadCategory(301, t)).toBe('overloaded')
  })

  it('excludes dropped items from carried pounds', () => {
    const carried = createEmptyItem()
    carried.pounds = 10
    carried.quantity = 2
    carried.location = 'carried'
    const dropped = createEmptyItem()
    dropped.pounds = 50
    dropped.quantity = 1
    dropped.location = 'dropped'
    expect(weightUsed([carried, dropped])).toBe(20)
  })

  it('matches Fighter 5 chainmail at light load (STR 18, 45 lb)', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const view = compute(character)
    expect(character.inventory.ignoreWeight).toBeUndefined()
    expect(view.weightUsed).toBe(45)
    expect(view.heavyLoad).toBe(300)
    expect(view.loadCategory).toBe('light')
  })
})

describe('CRB batch 6: ignore weight', () => {
  it('sets load category to ignored without changing carried pounds or thresholds', () => {
    const character = createEmptyCharacter()
    character.abilities.str.score = 10
    const item = createEmptyItem()
    item.pounds = 200
    item.location = 'carried'
    character.inventory.items = [item]
    const counted = compute(character)
    expect(counted.weightUsed).toBe(200)
    expect(counted.heavyLoad).toBe(100)
    expect(counted.loadCategory).toBe('overloaded')

    character.inventory.ignoreWeight = true
    const ignored = compute(character)
    expect(ignored.weightUsed).toBe(200)
    expect(ignored.lightLoad).toBe(counted.lightLoad)
    expect(ignored.heavyLoad).toBe(100)
    expect(ignored.loadCategory).toBe('ignored')
    expect(
      effectiveLoadCategory(200, loadThresholds(10, 'medium'), true),
    ).toBe('ignored')
  })

  it('treats a missing ignoreWeight flag as count-weight', () => {
    const character = createEmptyCharacter()
    delete character.inventory.ignoreWeight
    const item = createEmptyItem()
    item.pounds = 200
    character.inventory.items = [item]
    expect(compute(character).loadCategory).toBe('overloaded')
  })

  it('summarizes ignored load without L/M/H thresholds', () => {
    expect(formatLoadSummary(200, 'ignored', { light: 33, medium: 66, heavy: 100 })).toBe(
      '200 lb · ignored',
    )
    expect(formatLoadSummary(45, 'light', { light: 100, medium: 200, heavy: 300 })).toBe(
      '45 lb · light (L 100 / M 200 / H 300)',
    )
  })
})
