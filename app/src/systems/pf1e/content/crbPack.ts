import type {
  BabProgression,
  ClassEntry,
  ClassSaves,
  ContentRef,
  FeatEntry,
  Identity,
  ItemEntry,
  SkillEntry,
  SpellListEntry,
} from '../character/types'
import { STANDARD_SKILLS } from '../character/standardSkills'
import { lookupApgClass } from './apgPack'
import { lookupById, seededClassSkills } from './catalogLookup'
import classesJson from '../../../../../content/pf1e/crb/classes.json'
import racesJson from '../../../../../content/pf1e/crb/races.json'
import itemsJson from '../../../../../content/pf1e/crb/items.json'
import featsJson from '../../../../../content/pf1e/crb/feats.json'
import spellsJson from '../../../../../content/pf1e/crb/spells.json'

const STANDARD_SKILL_KEYS = new Set(STANDARD_SKILLS.map((row) => row.key))

export interface CrbClassProgression {
  id: string
  name: string
  hitDie: number
  babProgression: BabProgression
  saves: ClassSaves
  skillPointsPerLevel: number
  classSkills: string[]
  source?: ContentRef['source']
}

export const CRB_CLASSES: CrbClassProgression[] = classesJson.map((row) => ({
  id: row.id,
  name: row.name,
  hitDie: row.hitDie,
  babProgression: row.babProgression as BabProgression,
  saves: row.saves as ClassSaves,
  skillPointsPerLevel: row.skillPointsPerLevel,
  classSkills: seededClassSkills(row.classSkills),
  source: row.source,
}))

/** Unknown or empty id → null. Never throws (isolate to the row). */
export function lookupCrbClass(id: string | null | undefined): CrbClassProgression | null {
  return lookupById(CRB_CLASSES, id)
}

function lookupClassProgression(
  id: string | null | undefined,
): CrbClassProgression | null {
  return lookupCrbClass(id) ?? lookupApgClass(id)
}

/**
 * Stamp HD / BAB / saves from the CRB or APG class catalog.
 * Leaves levels and favored-class totals unchanged.
 * Unknown id clears `class.id` and does not rewrite progressions.
 * Leaving Summoner clears a stamped Synthesist archetype.
 */
export function applyCrbClassProgression(
  row: ClassEntry,
  id: string | null,
): ClassEntry {
  const found = lookupClassProgression(id)
  if (!found) {
    return {
      ...row,
      class: { ...row.class, id: null },
      archetype: undefined,
    }
  }
  return {
    ...row,
    class: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
    hitDie: found.hitDie,
    babProgression: found.babProgression,
    saves: { ...found.saves },
    skillPointsPerLevel: found.skillPointsPerLevel,
    archetype: found.id === 'class.summoner' ? row.archetype : undefined,
  }
}

/** Union of catalog class-skill keys for the given class rows. */
export function classSkillKeySet(classes: ClassEntry[]): Set<string> {
  const keys = new Set<string>()
  for (const row of classes) {
    const found = lookupClassProgression(row.class.id)
    if (!found) continue
    for (const key of found.classSkills) keys.add(key)
  }
  return keys
}

/**
 * Stamp class-skill checkboxes from the catalog union.
 * Standard CRB skills are overwritten. Craft/Perform/Profession extras keep
 * their current checkbox. Does not change ranks.
 */
export function stampClassSkills(
  skills: SkillEntry[],
  classes: ClassEntry[],
): SkillEntry[] {
  const keys = classSkillKeySet(classes)
  return skills.map((skill) => {
    if (!STANDARD_SKILL_KEYS.has(skill.key)) return skill
    return { ...skill, classSkill: keys.has(skill.key) }
  })
}

export interface CrbRace {
  id: string
  name: string
  source?: ContentRef['source']
}

export const CRB_RACES: CrbRace[] = racesJson.map((row) => ({
  id: row.id,
  name: row.name,
  source: row.source,
}))

/** Unknown or empty id → null. Never throws. */
export function lookupCrbRace(id: string | null | undefined): CrbRace | null {
  return lookupById(CRB_RACES, id)
}

/**
 * Stamp race id + name from the CRB catalog.
 * Does not rewrite size, languages, or ability scores.
 * Unknown id clears `race.id` and leaves the typed name.
 */
export function applyCrbRace(identity: Identity, id: string | null): Identity {
  const found = lookupCrbRace(id)
  if (!found) {
    return {
      ...identity,
      race: { ...identity.race, id: null },
    }
  }
  return {
    ...identity,
    race: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
  }
}

/** Row field if present; otherwise catalog; otherwise 0. */
export function skillPointsPerLevelFor(row: ClassEntry): number {
  if (row.skillPointsPerLevel != null) return row.skillPointsPerLevel
  return lookupClassProgression(row.class.id)?.skillPointsPerLevel ?? 0
}

export type CrbItemKind = 'weapon' | 'armor' | 'item'

export interface CrbItem {
  id: string
  name: string
  kind: CrbItemKind
  pounds: number
  weapon?: ItemEntry['weapon']
  armor?: ItemEntry['armor']
  source?: ContentRef['source']
}

export const CRB_ITEMS: CrbItem[] = itemsJson.map((row) => ({
  id: row.id,
  name: row.name,
  kind: row.kind as CrbItemKind,
  pounds: row.pounds,
  weapon: 'weapon' in row ? row.weapon : undefined,
  armor: 'armor' in row ? row.armor : undefined,
  source: row.source,
}))

/** Unknown or empty id → null. Never throws. */
export function lookupCrbItem(id: string | null | undefined): CrbItem | null {
  return lookupById(CRB_ITEMS, id)
}

/**
 * Stamp catalog id, name, pounds, and documentary weapon/armor fields.
 * Does not rewrite quantity, location, armorClass, or attacks.
 * Unknown id clears `item.id` and leaves the rest of the row.
 */
export function applyCrbItem(row: ItemEntry, id: string | null): ItemEntry {
  const found = lookupCrbItem(id)
  if (!found) {
    return {
      ...row,
      item: { ...row.item, id: null },
    }
  }
  return {
    ...row,
    item: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
    pounds: found.pounds,
    weapon:
      found.kind === 'weapon' && found.weapon
        ? { ...found.weapon }
        : undefined,
    armor:
      found.kind === 'armor' && found.armor ? { ...found.armor } : undefined,
  }
}

export type CrbFeatCategory = FeatEntry['category']

export interface CrbFeat {
  id: string
  name: string
  category: CrbFeatCategory
  source?: ContentRef['source']
}

export const CRB_FEATS: CrbFeat[] = featsJson.map((row) => ({
  id: row.id,
  name: row.name,
  category: row.category as CrbFeatCategory,
  source: row.source,
}))

/** Unknown or empty id → null. Never throws. */
export function lookupCrbFeat(id: string | null | undefined): CrbFeat | null {
  return lookupById(CRB_FEATS, id)
}

/**
 * Stamp catalog id, name, category, and source.
 * Does not rewrite level gained, summary, combat math, or effects.
 * Unknown id clears `feat.id` and leaves the rest of the row.
 */
export function applyCrbFeat(row: FeatEntry, id: string | null): FeatEntry {
  const found = lookupCrbFeat(id)
  if (!found) {
    return {
      ...row,
      feat: { ...row.feat, id: null },
    }
  }
  return {
    ...row,
    feat: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
    category: found.category,
  }
}

export interface CrbSpell {
  id: string
  name: string
  spellLevel: number
  source?: ContentRef['source']
}

export const CRB_SPELLS: CrbSpell[] = spellsJson.map((row) => ({
  id: row.id,
  name: row.name,
  spellLevel: row.spellLevel,
  source: row.source,
}))

/** Unknown or empty id → null. Never throws. */
export function lookupCrbSpell(id: string | null | undefined): CrbSpell | null {
  return lookupById(CRB_SPELLS, id)
}

/**
 * Stamp catalog id, name, source, and spell level.
 * Does not rewrite prepared flags, summaries, slots, or DCs.
 * Unknown id clears `spell.id` and leaves the rest of the row.
 */
export function applyCrbSpell(
  row: SpellListEntry,
  id: string | null,
): SpellListEntry {
  const found = lookupCrbSpell(id)
  if (!found) {
    return {
      ...row,
      spell: { ...row.spell, id: null },
    }
  }
  return {
    ...row,
    spell: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
    spellLevel: found.spellLevel,
  }
}
