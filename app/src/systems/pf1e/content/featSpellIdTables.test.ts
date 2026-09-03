import { describe, expect, it } from 'vitest'
import { readRepoJson } from '../../../test/readRepoFile'
import { CRB_FEATS, CRB_SPELLS } from './crbPack'

type FeatLock = { id: string; name: string; category: string }
type SpellLock = { id: string; name: string; spellLevel: number }

type FeatSpellLock = {
  schemaVersion: number
  packedFeats: FeatLock[]
  packedSpells: SpellLock[]
  batches: Record<string, Array<FeatLock | SpellLock>>
}

const FEAT_ID = /^feat\.[a-z0-9]+(?:-[a-z0-9]+)*$/
const SPELL_ID = /^spell\.[a-z0-9]+(?:-[a-z0-9]+)*$/
const CATEGORIES = new Set([
  'general',
  'combat',
  'metamagic',
  'itemCreation',
  'other',
])

const lock = readRepoJson(
  'docs/pf1e-crb-feat-spell-ids.json',
) as FeatSpellLock

describe('CRB feat/spell id tables', () => {
  it('locks 171 remaining feats and 618 remaining spells in F1–F4 and S1–S5', () => {
    expect(lock.schemaVersion).toBe(1)
    expect(lock.packedFeats.map((row) => row.id)).toEqual([
      'feat.improved-initiative',
      'feat.power-attack',
      'feat.scribe-scroll',
      'feat.spell-focus',
      'feat.weapon-focus',
    ])
    expect(lock.packedSpells.map((row) => row.id)).toEqual([
      'spell.detect-magic',
      'spell.fireball',
      'spell.light',
      'spell.magic-missile',
    ])
    expect(Object.keys(lock.batches)).toEqual([
      'F1',
      'F2',
      'F3',
      'F4',
      'S1',
      'S2',
      'S3',
      'S4',
      'S5',
    ])
    expect(lock.batches.F1).toHaveLength(54)
    expect(lock.batches.F2).toHaveLength(53)
    expect(lock.batches.F3).toHaveLength(48)
    expect(lock.batches.F4).toHaveLength(16)
    expect(lock.batches.S1).toHaveLength(108)
    expect(lock.batches.S2).toHaveLength(159)
    expect(lock.batches.S3).toHaveLength(141)
    expect(lock.batches.S4).toHaveLength(127)
    expect(lock.batches.S5).toHaveLength(83)
  })

  it('uses unique kebab ids and mechanics-only fields', () => {
    const remaining = Object.values(lock.batches).flat()
    const ids = remaining.map((row) => row.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const row of lock.packedFeats.concat(
      lock.batches.F1 as FeatLock[],
      lock.batches.F2 as FeatLock[],
      lock.batches.F3 as FeatLock[],
      lock.batches.F4 as FeatLock[],
    )) {
      expect(row.id).toMatch(FEAT_ID)
      expect(row.name.length).toBeGreaterThan(0)
      expect(CATEGORIES.has(row.category)).toBe(true)
      expect(row).not.toHaveProperty('description')
      expect(row).not.toHaveProperty('benefit')
      expect(row).not.toHaveProperty('summary')
    }

    for (const row of lock.packedSpells.concat(
      lock.batches.S1 as SpellLock[],
      lock.batches.S2 as SpellLock[],
      lock.batches.S3 as SpellLock[],
      lock.batches.S4 as SpellLock[],
      lock.batches.S5 as SpellLock[],
    )) {
      expect(row.id).toMatch(SPELL_ID)
      expect(row.name.length).toBeGreaterThan(0)
      expect(row.spellLevel).toBeGreaterThanOrEqual(0)
      expect(row.spellLevel).toBeLessThanOrEqual(9)
      expect(row).not.toHaveProperty('description')
      expect(row).not.toHaveProperty('text')
    }
  })

  it('keeps Batch 12 / 13 goldens packed and does not pack remaining rows yet', () => {
    const packedFeatIds = new Set(CRB_FEATS.map((row) => row.id))
    const packedSpellIds = new Set(CRB_SPELLS.map((row) => row.id))
    for (const row of lock.packedFeats) {
      expect(packedFeatIds.has(row.id)).toBe(true)
    }
    for (const row of lock.packedSpells) {
      expect(packedSpellIds.has(row.id)).toBe(true)
    }
    const remainingIds = Object.values(lock.batches).flatMap((rows) =>
      rows.map((row) => row.id),
    )
    for (const id of remainingIds) {
      expect(packedFeatIds.has(id) || packedSpellIds.has(id)).toBe(false)
    }
  })
})
