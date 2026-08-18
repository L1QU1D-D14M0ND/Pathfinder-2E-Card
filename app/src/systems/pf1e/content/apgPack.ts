import type {
  BabProgression,
  ClassEntry,
  ClassSaves,
  ContentRef,
} from '../character/types'
import { lookupById, seededClassSkills } from './catalogLookup'
import archetypesJson from '../../../../../content/pf1e/apg/archetypes.json'
import classesJson from '../../../../../content/pf1e/apg/classes.json'

export interface ApgClassProgression {
  id: string
  name: string
  hitDie: number
  babProgression: BabProgression
  saves: ClassSaves
  skillPointsPerLevel: number
  classSkills: string[]
  source?: ContentRef['source']
}

export const APG_CLASSES: ApgClassProgression[] = classesJson.map((row) => ({
  id: row.id,
  name: row.name,
  hitDie: row.hitDie,
  babProgression: row.babProgression as BabProgression,
  saves: row.saves as ClassSaves,
  skillPointsPerLevel: row.skillPointsPerLevel,
  classSkills: seededClassSkills(row.classSkills),
  source: row.source,
}))

/** Unknown or empty id → null. Never throws. CRB lookup stays on lookupCrbClass. */
export function lookupApgClass(
  id: string | null | undefined,
): ApgClassProgression | null {
  return lookupById(APG_CLASSES, id)
}

export interface ApgArchetype {
  id: string
  name: string
  classId: string
  source?: ContentRef['source']
}

export const APG_ARCHETYPES: ApgArchetype[] = archetypesJson.map((row) => ({
  id: row.id,
  name: row.name,
  classId: row.classId,
  source: row.source,
}))

export function lookupApgArchetype(
  id: string | null | undefined,
): ApgArchetype | null {
  return lookupById(APG_ARCHETYPES, id)
}

/**
 * Stamp archetype id, name, and source.
 * Does not rewrite HD / BAB / saves, ability scores, HP, or evolutions.
 * Unknown or empty id clears `archetype`.
 */
export function applyApgArchetype(
  row: ClassEntry,
  id: string | null,
): ClassEntry {
  const found = lookupApgArchetype(id)
  if (!found) {
    return { ...row, archetype: undefined }
  }
  return {
    ...row,
    archetype: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
  }
}
