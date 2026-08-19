import { describe, expect, it } from 'vitest'
import { parseCharacterJson, serializeCharacter } from '../character/saveLoad'
import { compute } from './compute'
import { readRepoFile } from '../../../test/readRepoFile'

describe('golden Bard 5', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/bard-5.json'),
  )
  const view = compute(character)

  it('loads as a spontaneous occult bard', () => {
    expect(character.schemaVersion).toBe(1)
    expect(character.identity.level).toBe(5)
    expect(character.identity.class.id).toBe('class.bard')
    expect(character.identity.subclass?.id).toBe('class.bard.maestro')
    expect(character.spellcasting[0]?.castType).toBe('spontaneous')
    expect(character.spellcasting[0]?.tradition).toBe('occult')
  })

  it('round-trips Save then Load with signature spells', () => {
    const reloaded = parseCharacterJson(serializeCharacter(character))
    expect(reloaded.identity.characterName).toBe('Nim Voicewell')
    expect(reloaded.derived).toBeUndefined()
    const signatures = reloaded.spellcasting[0]?.spells.filter((row) => row.signature)
    expect(signatures?.map((row) => row.spell.id)).toEqual([
      'spell.fear',
      'spell.invisibility',
    ])
  })

  it('computes attribute modifiers from entered boosts', () => {
    expect(view.attributeModifiers).toEqual({
      str: 0,
      dex: 2,
      con: 1,
      int: 1,
      wis: 1,
      cha: 4,
    })
  })

  it('computes HP, AC, perception, saves, and class DC', () => {
    expect(view.maxHp).toBe(53)
    expect(view.ac).toBe(20)
    expect(view.perception).toBe(10)
    expect(view.fortitude).toBe(8)
    expect(view.reflex).toBe(9)
    expect(view.will).toBe(10)
    expect(view.classDC).toBe(21)
  })

  it('computes skills including untrained (no level)', () => {
    expect(view.skillTotals.performance).toBe(11)
    expect(view.skillTotals.occultism).toBe(8)
    expect(view.skillTotals.deception).toBe(11)
    expect(view.skillTotals.athletics).toBe(0)
  })

  it('computes spell attack, spell DC, and a typed slot row', () => {
    expect(view.spellcasting['cast-bard']).toEqual({ attack: 11, dc: 21 })
    const rank1 = character.spellcasting[0]?.slots.find((slot) => slot.rank === 1)
    expect(rank1).toEqual({ rank: 1, max: 3, remaining: 2 })
  })

  it('computes the shortbow strike snapshot', () => {
    expect(view.strikes['strike-shortbow']).toEqual({
      attack: 9,
      damage: '1d6',
    })
  })

  it('computes bulk tenths for leather, shortbow, and instrument', () => {
    expect(view.bulkUsed).toBe(2.1)
  })
})
