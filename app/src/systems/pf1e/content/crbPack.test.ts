import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import { createEmptyClass } from '../character/createRows'
import { parseCharacterJson } from '../character/saveLoad'
import {
  applyCrbClassProgression,
  applyCrbRace,
  classSkillKeySet,
  lookupCrbClass,
  lookupCrbRace,
  stampClassSkills,
  CRB_CLASSES,
  CRB_RACES,
} from './crbPack'
import { readRepoFile, readRepoJson } from '../../../test/readRepoFile'
import {
  babFromProgression,
  saveFromProgression,
} from '../engine/progressions'

describe('CRB pack batch 1: class progression catalog', () => {
  it('lists Fighter and Wizard only', () => {
    expect(CRB_CLASSES.map((row) => row.id)).toEqual([
      'class.fighter',
      'class.wizard',
    ])
  })

  it('Fighter and Wizard tags match the CRB class tables', () => {
    const fighter = lookupCrbClass('class.fighter')
    const wizard = lookupCrbClass('class.wizard')
    expect(fighter).toMatchObject({
      hitDie: 10,
      babProgression: 'full',
      saves: { fort: 'good', ref: 'poor', will: 'poor' },
    })
    expect(wizard).toMatchObject({
      hitDie: 6,
      babProgression: 'half',
      saves: { fort: 'poor', ref: 'poor', will: 'good' },
    })
    expect(babFromProgression(fighter!.babProgression, 5)).toBe(5)
    expect(babFromProgression(wizard!.babProgression, 5)).toBe(2)
    expect(saveFromProgression(fighter!.saves.fort, 5)).toBe(4)
    expect(saveFromProgression(wizard!.saves.will, 5)).toBe(4)
  })

  it('returns null for an unknown class id (isolate the row)', () => {
    expect(lookupCrbClass('class.rogue')).toBeNull()
    expect(lookupCrbClass(null)).toBeNull()
    expect(lookupCrbClass('')).toBeNull()
  })

  it('applies catalog tags without changing levels or favored totals', () => {
    const row = createEmptyClass()
    row.levels = 5
    row.favored = { hp: 5, skillRanks: 1 }
    const fighter = applyCrbClassProgression(row, 'class.fighter')
    expect(fighter.levels).toBe(5)
    expect(fighter.favored).toEqual({ hp: 5, skillRanks: 1 })
    expect(fighter.hitDie).toBe(10)
    expect(fighter.babProgression).toBe('full')
    expect(fighter.saves).toEqual({ fort: 'good', ref: 'poor', will: 'poor' })
    expect(fighter.class.id).toBe('class.fighter')
    expect(fighter.class.name).toBe('Fighter')
    expect(fighter.skillPointsPerLevel).toBe(2)
  })

  it('unknown apply clears id and leaves progressions', () => {
    const row = createEmptyClass()
    row.hitDie = 12
    row.babProgression = 'full'
    const custom = applyCrbClassProgression(row, 'class.rogue')
    expect(custom.class.id).toBeNull()
    expect(custom.hitDie).toBe(12)
    expect(custom.babProgression).toBe('full')
  })

  it('goldens use catalog ids that resolve', () => {
    const fighter = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const wizard = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const mixed = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-2-wizard-3.json'),
    )
    expect(lookupCrbClass(fighter.classes[0]?.class.id)).not.toBeNull()
    expect(lookupCrbClass(wizard.classes[0]?.class.id)).not.toBeNull()
    expect(lookupCrbClass(mixed.classes[0]?.class.id)?.id).toBe('class.fighter')
    expect(lookupCrbClass(mixed.classes[1]?.class.id)?.id).toBe('class.wizard')
  })

  it('pack manifest records batches 1–6, 8, and 9', () => {
    const pack = readRepoJson('content/pf1e/crb/pack.json') as {
      status: string
      batches: Array<{ id: number }>
    }
    expect(pack.status).toBe('batch-9')
    expect(pack.batches.map((batch) => batch.id)).toEqual([
      1, 2, 3, 4, 5, 6, 8, 9,
    ])
  })
})

describe('CRB pack batch 8: Human race catalog', () => {
  it('lists Human only', () => {
    expect(CRB_RACES.map((row) => row.id)).toEqual(['race.human'])
    expect(lookupCrbRace('race.human')).toMatchObject({
      id: 'race.human',
      name: 'Human',
    })
  })

  it('returns null for an unknown race id', () => {
    expect(lookupCrbRace('race.elf')).toBeNull()
    expect(lookupCrbRace(null)).toBeNull()
    expect(lookupCrbRace('')).toBeNull()
  })

  it('stamps id and name without rewriting size or ability scores', () => {
    const character = createEmptyCharacter()
    character.identity.size = 'small'
    character.abilities.str.score = 16
    const before = structuredClone(character.abilities)
    const identity = applyCrbRace(character.identity, 'race.human')
    expect(identity.race.id).toBe('race.human')
    expect(identity.race.name).toBe('Human')
    expect(identity.size).toBe('small')
    expect(character.abilities).toEqual(before)
    expect(character.abilities.str.score).toBe(16)
  })

  it('unknown apply clears id and leaves the typed name', () => {
    const character = createEmptyCharacter()
    character.identity.race = { id: 'race.human', name: 'Half-Elf' }
    const identity = applyCrbRace(character.identity, 'race.elf')
    expect(identity.race.id).toBeNull()
    expect(identity.race.name).toBe('Half-Elf')
  })

  it('goldens resolve race.human and keep scores as typed', () => {
    const fighter = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const wizard = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/wizard-5.json'),
    )
    const mixed = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-2-wizard-3.json'),
    )
    expect(lookupCrbRace(fighter.identity.race.id)?.id).toBe('race.human')
    expect(lookupCrbRace(wizard.identity.race.id)?.id).toBe('race.human')
    expect(lookupCrbRace(mixed.identity.race.id)?.id).toBe('race.human')
    expect(fighter.abilities.str.score).toBe(18)
    expect(wizard.abilities.int.score).toBe(18)
  })
})

describe('CRB pack batch 9: class skills', () => {
  it('lists Fighter and Wizard class skills and 2 skill points per level', () => {
    const fighter = lookupCrbClass('class.fighter')
    const wizard = lookupCrbClass('class.wizard')
    expect(fighter?.skillPointsPerLevel).toBe(2)
    expect(wizard?.skillPointsPerLevel).toBe(2)
    expect(fighter?.classSkills).toEqual([
      'climb',
      'handle-animal',
      'intimidate',
      'knowledge-dungeoneering',
      'knowledge-engineering',
      'ride',
      'survival',
      'swim',
    ])
    expect(wizard?.classSkills).toContain('spellcraft')
    expect(wizard?.classSkills).toContain('knowledge-arcana')
    expect(wizard?.classSkills).not.toContain('climb')
    expect(fighter?.classSkills).not.toContain('spellcraft')
  })

  it('stamps Fighter class-skill checkboxes and leaves ranks alone', () => {
    const character = createEmptyCharacter()
    const row = applyCrbClassProgression(createEmptyClass(), 'class.fighter')
    const skills = stampClassSkills(character.skills, [row])
    const flagged = skills.filter((skill) => skill.classSkill).map((skill) => skill.key)
    expect(flagged).toEqual([
      'climb',
      'handle-animal',
      'intimidate',
      'ride',
      'survival',
      'swim',
      'knowledge-dungeoneering',
      'knowledge-engineering',
    ])
    expect(skills.every((skill) => skill.ranks === 0)).toBe(true)
  })

  it('unions Fighter and Wizard class skills', () => {
    const fighter = applyCrbClassProgression(createEmptyClass(), 'class.fighter')
    const wizard = applyCrbClassProgression(createEmptyClass(), 'class.wizard')
    const keys = classSkillKeySet([fighter, wizard])
    expect(keys.has('climb')).toBe(true)
    expect(keys.has('spellcraft')).toBe(true)
    expect(keys.has('perception')).toBe(false)
  })

  it('does not rewrite Craft/Perform/Profession extras', () => {
    const character = createEmptyCharacter()
    character.skills.push({
      key: 'craft-weapons',
      name: 'Craft (weapons)',
      ability: 'int',
      ranks: 1,
      classSkill: true,
      armorPenaltyApplies: false,
      misc: 0,
    })
    const row = applyCrbClassProgression(createEmptyClass(), 'class.wizard')
    const skills = stampClassSkills(character.skills, [row])
    const craft = skills.find((skill) => skill.key === 'craft-weapons')
    expect(craft?.classSkill).toBe(true)
    expect(craft?.ranks).toBe(1)
    expect(skills.find((skill) => skill.key === 'climb')?.classSkill).toBe(false)
  })

  it('matches golden class-skill flags after a stamp', () => {
    const fighter = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    const stamped = stampClassSkills(fighter.skills, fighter.classes)
    for (const skill of fighter.skills) {
      const next = stamped.find((row) => row.key === skill.key)
      expect(next?.classSkill).toBe(skill.classSkill)
    }
  })
})
