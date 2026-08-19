import { describe, expect, it } from 'vitest'
import { parseCharacterJson, serializeCharacter } from '../character/saveLoad'
import { compute } from './compute'
import { readRepoFile } from '../../../test/readRepoFile'

describe('golden Cleric 5', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/cleric-5.json'),
  )
  const view = compute(character)

  it('loads as a prepared divine cleric', () => {
    expect(character.schemaVersion).toBe(1)
    expect(character.identity.level).toBe(5)
    expect(character.identity.class.id).toBe('class.cleric')
    expect(character.identity.subclass?.id).toBe('class.cleric.cloistered')
    expect(character.identity.deity?.name).toBe('The First Hymn')
    expect(character.spellcasting[0]?.castType).toBe('prepared')
    expect(character.spellcasting[0]?.tradition).toBe('divine')
  })

  it('round-trips Save then Load with Heal prepared at three ranks', () => {
    const reloaded = parseCharacterJson(serializeCharacter(character))
    expect(reloaded.identity.characterName).toBe('Orrin Lampkeep')
    expect(reloaded.derived).toBeUndefined()
    const heals = reloaded.spellcasting[0]?.spells.filter(
      (row) => row.spell.id === 'spell.heal',
    )
    expect(heals?.map((row) => row.rank)).toEqual([1, 2, 3])
    expect(heals?.every((row) => row.prepared)).toBe(true)
    expect(reloaded.play.dailyResources[0]).toMatchObject({
      name: 'Divine Font',
      max: 4,
      remaining: 3,
    })
  })

  it('computes attribute modifiers from entered boosts', () => {
    expect(view.attributeModifiers).toEqual({
      str: 0,
      dex: 1,
      con: 2,
      int: 0,
      wis: 4,
      cha: 1,
    })
  })

  it('computes HP, AC, perception, saves, and class DC', () => {
    expect(view.maxHp).toBe(58)
    expect(view.ac).toBe(19)
    expect(view.perception).toBe(11)
    expect(view.fortitude).toBe(11)
    expect(view.reflex).toBe(8)
    expect(view.will).toBe(13)
    expect(view.classDC).toBe(21)
  })

  it('computes skills including untrained (no level)', () => {
    expect(view.skillTotals.religion).toBe(11)
    expect(view.skillTotals.medicine).toBe(11)
    expect(view.skillTotals.diplomacy).toBe(8)
    expect(view.skillTotals.athletics).toBe(0)
  })

  it('computes spell attack, spell DC, and a typed slot row', () => {
    expect(view.spellcasting['cast-cleric']).toEqual({ attack: 11, dc: 21 })
    const rank1 = character.spellcasting[0]?.slots.find((slot) => slot.rank === 1)
    expect(rank1).toEqual({ rank: 1, max: 4, remaining: 3 })
  })

  it('computes the mace strike snapshot', () => {
    expect(view.strikes['strike-mace']).toEqual({
      attack: 7,
      damage: '1d6',
    })
  })

  it('computes bulk tenths for leather, mace, and religious symbol', () => {
    expect(view.bulkUsed).toBe(2.1)
  })
})
