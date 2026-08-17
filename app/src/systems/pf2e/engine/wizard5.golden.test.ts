import { describe, expect, it } from 'vitest'
import { parseCharacterJson, serializeCharacter } from '../character/saveLoad'
import { compute } from './compute'
import { readRepoFile } from '../../../test/readRepoFile'

describe('golden Wizard 5', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/wizard-5.json'),
  )
  const view = compute(character)

  it('loads as a prepared arcane wizard', () => {
    expect(character.schemaVersion).toBe(1)
    expect(character.identity.level).toBe(5)
    expect(character.identity.class.id).toBe('class.wizard')
    expect(character.spellcasting[0]?.castType).toBe('prepared')
    expect(character.spellcasting[0]?.tradition).toBe('arcane')
  })

  it('round-trips Save then Load', () => {
    const reloaded = parseCharacterJson(serializeCharacter(character))
    expect(reloaded.identity.characterName).toBe('Lira Spellwright')
    expect(reloaded.derived).toBeUndefined()
    expect(reloaded.feats).toHaveLength(3)
  })

  it('computes attribute modifiers from entered boosts', () => {
    expect(view.attributeModifiers).toEqual({
      str: 0,
      dex: 2,
      con: 1,
      int: 4,
      wis: 1,
      cha: 0,
    })
  })

  it('computes HP, AC, perception, saves, and class DC', () => {
    expect(view.maxHp).toBe(43)
    expect(view.ac).toBe(19)
    expect(view.perception).toBe(8)
    expect(view.fortitude).toBe(8)
    expect(view.reflex).toBe(9)
    expect(view.will).toBe(10)
    expect(view.classDC).toBe(21)
  })

  it('computes skills including untrained (no level)', () => {
    expect(view.skillTotals.arcana).toBe(11)
    expect(view.skillTotals.society).toBe(11)
    expect(view.skillTotals.athletics).toBe(0)
  })

  it('computes spell attack, spell DC, and a slot row', () => {
    expect(view.spellcasting['cast-wizard']).toEqual({ attack: 11, dc: 21 })
    const rank1 = character.spellcasting[0]?.slots.find((slot) => slot.rank === 1)
    expect(rank1).toEqual({ rank: 1, max: 4, remaining: 3 })
  })

  it('computes the staff strike snapshot', () => {
    expect(view.strikes['strike-staff']).toEqual({
      attack: 7,
      damage: '1d4',
    })
  })

  it('computes bulk tenths for staff plus spellbook', () => {
    expect(view.bulkUsed).toBe(1.1)
  })
})
