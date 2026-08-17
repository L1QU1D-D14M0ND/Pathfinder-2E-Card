import { describe, expect, it } from 'vitest'
import { abilityModifierFromScore, abilityModifiers } from './abilities'
import {
  babFromProgression,
  saveFromProgression,
} from './progressions'
import type { BabProgression, SaveQuality } from '../character/types'

/** CRB Ability Modifiers table samples (score → modifier). */
const CRB_ABILITY_MODIFIERS: Array<[number, number]> = [
  [1, -5],
  [2, -4],
  [3, -4],
  [4, -3],
  [5, -3],
  [6, -2],
  [7, -2],
  [8, -1],
  [9, -1],
  [10, 0],
  [11, 0],
  [12, 1],
  [13, 1],
  [14, 2],
  [15, 2],
  [16, 3],
  [17, 3],
  [18, 4],
  [19, 4],
  [20, 5],
  [21, 5],
  [45, 17],
]

const BAB_FULL_1_TO_20 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]
const BAB_THREE_QUARTER_1_TO_20 = [
  0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15,
]
const BAB_HALF_1_TO_20 = [
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10,
]
const SAVE_GOOD_1_TO_20 = [
  2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12,
]
const SAVE_POOR_1_TO_20 = [
  0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6,
]

function tableFor(
  kind: BabProgression | 'good' | 'poor',
): number[] {
  return Array.from({ length: 20 }, (_, i) => {
    const level = i + 1
    if (kind === 'good' || kind === 'poor') {
      return saveFromProgression(kind, level)
    }
    return babFromProgression(kind, level)
  })
}

describe('CRB batch 1: ability modifiers', () => {
  it('matches the Ability Modifiers table, including odd scores', () => {
    for (const [score, modifier] of CRB_ABILITY_MODIFIERS) {
      expect(abilityModifierFromScore(score), `score ${score}`).toBe(modifier)
    }
  })

  it('adds tempModifier to the modifier, not as a score increase', () => {
    const mods = abilityModifiers({
      str: { score: 18, tempModifier: 4 },
      dex: { score: 10 },
      con: { score: 10 },
      int: { score: 10 },
      wis: { score: 10 },
      cha: { score: 10 },
    })
    // Score 18 is +4; temp +4 is a modifier addend → +8, not score 22 (+6).
    expect(mods.str).toBe(8)
    expect(abilityModifierFromScore(22)).toBe(6)
  })
})

describe('CRB batch 1: BAB and save progressions', () => {
  it('matches full / ¾ / ½ BAB tables for levels 1–20', () => {
    expect(tableFor('full')).toEqual(BAB_FULL_1_TO_20)
    expect(tableFor('threeQuarter')).toEqual(BAB_THREE_QUARTER_1_TO_20)
    expect(tableFor('half')).toEqual(BAB_HALF_1_TO_20)
  })

  it('matches good and poor save tables for levels 1–20', () => {
    expect(tableFor('good')).toEqual(SAVE_GOOD_1_TO_20)
    expect(tableFor('poor')).toEqual(SAVE_POOR_1_TO_20)
  })

  it('treats no class levels as +0, not good-save +2', () => {
    expect(babFromProgression('full', 0)).toBe(0)
    expect(saveFromProgression('good' satisfies SaveQuality, 0)).toBe(0)
  })
})
