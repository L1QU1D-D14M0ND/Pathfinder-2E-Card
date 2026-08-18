import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptySpellcasting } from '../character/createRows'
import { parseCharacterJson } from '../character/saveLoad'
import { compute } from './compute'
import { bonusSpellsFromAbility, spellDc } from './spellcasting'
import { readRepoFile } from '../../../test/readRepoFile'

/**
 * CRB Ability Modifiers and Bonus Spells: bonus slots for spell levels 0–9.
 * Level 0 (cantrips) is always 0. Odd scores share the even score below.
 */
const BONUS_SPELLS_BY_SCORE: Record<number, readonly number[]> = {
  10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  12: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  14: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  16: [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  18: [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  20: [0, 2, 1, 1, 1, 1, 0, 0, 0, 0],
  22: [0, 2, 2, 1, 1, 1, 1, 0, 0, 0],
  24: [0, 2, 2, 2, 1, 1, 1, 1, 0, 0],
  26: [0, 2, 2, 2, 2, 1, 1, 1, 1, 0],
  28: [0, 3, 2, 2, 2, 2, 1, 1, 1, 1],
  30: [0, 3, 3, 2, 2, 2, 2, 1, 1, 1],
}

describe('CRB batch 7: spell DC', () => {
  it('is 10 + spell level + ability modifier, including a penalty', () => {
    expect(spellDc(0, 4)).toBe(14)
    expect(spellDc(1, 4)).toBe(15)
    expect(spellDc(3, 4)).toBe(17)
    expect(spellDc(9, 4)).toBe(23)
    expect(spellDc(1, 0)).toBe(11)
    expect(spellDc(1, -1)).toBe(10)
  })

  it('matches Wizard 5 INT +4 (cantrip 14, 1st 15, 3rd 17)', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const view = compute(character)
    const casting = view.spellcasting['cast-wizard']
    expect(view.abilityModifiers.int).toBe(4)
    expect(casting.dcByLevel[0]).toBe(14)
    expect(casting.dcByLevel[1]).toBe(15)
    expect(casting.dcByLevel[3]).toBe(17)
  })

  it('matches Fighter 2 / Wizard 3 INT +3 (cantrip 13, 1st 14, 2nd 15)', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-2-wizard-3.json'),
    )
    const view = compute(character)
    const casting = view.spellcasting['cast-wizard']
    expect(view.abilityModifiers.int).toBe(3)
    expect(casting.dcByLevel[0]).toBe(13)
    expect(casting.dcByLevel[1]).toBe(14)
    expect(casting.dcByLevel[2]).toBe(15)
  })

  it('does not add Spell Focus to Wizard 5 Fireball DC', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const view = compute(character)
    expect(
      character.feats.some((row) => row.feat.id === 'feat.spell-focus'),
    ).toBe(true)
    expect(view.spellcasting['cast-wizard'].dcByLevel[3]).toBe(17)
  })

  it('adds tempModifier to DC and leaves bonus slots on the score', () => {
    const character = createEmptyCharacter()
    character.abilities.int = { score: 18, tempScore: 0, tempModifier: 1 }
    const entry = createEmptySpellcasting()
    entry.id = 'cast-dc'
    character.spellcasting = [entry]
    const view = compute(character)
    expect(view.abilityModifiers.int).toBe(5)
    expect(view.spellcasting['cast-dc'].dcByLevel[1]).toBe(16)
    expect(view.spellcasting['cast-dc'].bonusSlotsByLevel[1]).toBe(1)
  })
})

describe('CRB batch 7: bonus spells from ability', () => {
  it('matches the CRB bonus-spells columns for scores 10–30', () => {
    for (const [score, expected] of Object.entries(BONUS_SPELLS_BY_SCORE)) {
      const n = Number(score)
      for (let level = 0; level <= 9; level++) {
        expect(bonusSpellsFromAbility(n, level)).toBe(expected[level])
        expect(bonusSpellsFromAbility(n + 1, level)).toBe(expected[level])
      }
    }
  })

  it('never grants bonus cantrips, even at INT 30', () => {
    expect(bonusSpellsFromAbility(30, 0)).toBe(0)
  })

  it('matches Wizard 5 INT 18 bonus 1/1/1/1 and does not write them into max', () => {
    const character = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const view = compute(character)
    expect(view.spellcasting['cast-wizard'].bonusSlotsByLevel.slice(0, 5)).toEqual(
      [0, 1, 1, 1, 1],
    )
    expect(character.spellcasting[0]?.slots.find((row) => row.spellLevel === 1)?.max).toBe(
      4,
    )
  })

  it('keeps empty-sheet slot max at 0 while showing INT 18 bonus slots', () => {
    const character = createEmptyCharacter()
    character.abilities.int.score = 18
    const entry = createEmptySpellcasting()
    entry.id = 'cast-empty'
    character.spellcasting = [entry]
    const before = structuredClone(entry.slots)
    const view = compute(character)
    expect(entry.slots).toEqual(before)
    expect(entry.slots.every((row) => row.max === 0)).toBe(true)
    expect(view.spellcasting['cast-empty'].bonusSlotsByLevel.slice(0, 5)).toEqual(
      [0, 1, 1, 1, 1],
    )
  })

  it('uses tempScore for bonus slots (INT 18 + 2 → score 20)', () => {
    const character = createEmptyCharacter()
    character.abilities.int = { score: 18, tempScore: 2, tempModifier: 0 }
    const entry = createEmptySpellcasting()
    entry.id = 'cast-temp'
    character.spellcasting = [entry]
    const view = compute(character)
    expect(view.spellcasting['cast-temp'].bonusSlotsByLevel[1]).toBe(2)
    expect(view.spellcasting['cast-temp'].dcByLevel[1]).toBe(16)
  })
})
