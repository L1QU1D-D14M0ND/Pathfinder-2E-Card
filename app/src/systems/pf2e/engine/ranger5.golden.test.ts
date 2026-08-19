import { describe, expect, it } from 'vitest'
import { parseCharacterJson, serializeCharacter } from '../character/saveLoad'
import { compute } from './compute'
import { computeCompanion } from './companion'
import { readRepoFile } from '../../../test/readRepoFile'

describe('golden Ranger 5', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/ranger-5.json'),
  )
  const view = compute(character)
  const companion = character.companions[0]
  if (!companion) throw new Error('Ranger 5 golden must include a companion')
  const companionView = computeCompanion(companion.sheet)

  it('loads as a ranger with a nested animal companion', () => {
    expect(character.schemaVersion).toBe(1)
    expect(character.identity.level).toBe(5)
    expect(character.identity.class.id).toBe('class.ranger')
    expect(character.identity.subclass?.id).toBe('class.ranger.precision')
    expect(companion.kind).toBe('animalCompanion')
    expect(companion.name).toBe('Ash')
    expect(companion.linkedFeatureId).toBe('feat-animal-companion')
    expect(companion.sheet.identity.level).toBe(5)
  })

  it('round-trips Save then Load without dropping the companion sheet', () => {
    const reloaded = parseCharacterJson(serializeCharacter(character))
    expect(reloaded.identity.characterName).toBe('Ryn Trackwell')
    expect(reloaded.derived).toBeUndefined()
    expect(reloaded.companions).toHaveLength(1)
    expect(reloaded.companions[0]?.sheet.strikes[0]?.id).toBe('strike-jaws')
  })

  it('computes attribute modifiers from entered boosts', () => {
    expect(view.attributeModifiers).toEqual({
      str: 1,
      dex: 4,
      con: 2,
      int: 0,
      wis: 1,
      cha: 0,
    })
  })

  it('computes HP, AC, perception, saves, and class DC', () => {
    expect(view.maxHp).toBe(68)
    expect(view.ac).toBe(22)
    expect(view.perception).toBe(10)
    expect(view.fortitude).toBe(11)
    expect(view.reflex).toBe(13)
    expect(view.will).toBe(8)
    expect(view.classDC).toBe(21)
  })

  it('computes skills including untrained (no level)', () => {
    expect(view.skillTotals.stealth).toBe(11)
    expect(view.skillTotals.survival).toBe(8)
    expect(view.skillTotals.athletics).toBe(8)
    expect(view.skillTotals.arcana).toBe(0)
  })

  it('computes the longbow strike snapshot', () => {
    expect(view.strikes['strike-longbow']).toEqual({
      attack: 11,
      damage: '1d8',
    })
  })

  it('computes bulk tenths for leather, longbow, and arrows', () => {
    expect(view.bulkUsed).toBe(3.1)
    expect(view.investedCount).toBe(0)
  })

  it('computes nested companion HP, AC, and jaws', () => {
    expect(companionView.attributeModifiers).toEqual({
      str: 3,
      dex: 2,
      con: 2,
      int: -4,
      wis: 1,
      cha: 0,
    })
    expect(companionView.maxHp).toBe(50)
    expect(companionView.ac).toBe(19)
    expect(companionView.perception).toBe(8)
    expect(companionView.fortitude).toBe(11)
    expect(companionView.reflex).toBe(9)
    expect(companionView.will).toBe(8)
    expect(companionView.strikes['strike-jaws']).toEqual({
      attack: 10,
      damage: '1d8+3',
    })
    expect(companionView.skillTotals.athletics).toBe(10)
  })

  it('computes companion from nested level, not the ranger level', () => {
    const atLevelOne = structuredClone(companion.sheet)
    atLevelOne.identity.level = 1
    expect(computeCompanion(atLevelOne).maxHp).toBe(18)
    expect(computeCompanion(atLevelOne).maxHp).toBeLessThan(companionView.maxHp)
  })
})
