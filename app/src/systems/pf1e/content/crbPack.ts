import type {
  BabProgression,
  ClassEntry,
  ClassSaves,
  ContentRef,
  Identity,
  SkillEntry,
} from '../character/types'
import { STANDARD_SKILLS } from '../character/standardSkills'
import classesJson from '../../../../../content/pf1e/crb/classes.json'
import racesJson from '../../../../../content/pf1e/crb/races.json'

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
  classSkills: [...row.classSkills],
  source: row.source,
}))

/** Unknown or empty id → null. Never throws (isolate to the row). */
export function lookupCrbClass(id: string | null | undefined): CrbClassProgression | null {
  if (!id) return null
  return CRB_CLASSES.find((entry) => entry.id === id) ?? null
}

/**
 * Stamp HD / BAB / saves from the CRB class catalog.
 * Leaves levels and favored-class totals unchanged.
 * Unknown id clears `class.id` and does not rewrite progressions.
 */
export function applyCrbClassProgression(
  row: ClassEntry,
  id: string | null,
): ClassEntry {
  const found = lookupCrbClass(id)
  if (!found) {
    return {
      ...row,
      class: { ...row.class, id: null },
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
  }
}

const STANDARD_SKILL_KEYS = new Set(STANDARD_SKILLS.map((row) => row.key))

/** Union of catalog class-skill keys for the given class rows. */
export function classSkillKeySet(classes: ClassEntry[]): Set<string> {
  const keys = new Set<string>()
  for (const row of classes) {
    const found = lookupCrbClass(row.class.id)
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
  if (!id) return null
  return CRB_RACES.find((entry) => entry.id === id) ?? null
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
  return lookupCrbClass(row.class.id)?.skillPointsPerLevel ?? 0
}
