import { describe, expect, it } from 'vitest'
import { createEmptyClass } from '../character/createRows'
import { parseCharacterJson } from '../character/saveLoad'
import { applyCrbClassProgression, lookupCrbClass, CRB_CLASSES } from './crbPack'
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

  it('pack manifest records batches 1 through 5', () => {
    const pack = readRepoJson('content/pf1e/crb/pack.json') as {
      status: string
      batches: Array<{ id: number }>
    }
    expect(pack.status).toBe('batch-5')
    expect(pack.batches.map((batch) => batch.id)).toEqual([1, 2, 3, 4, 5])
  })
})
