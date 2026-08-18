import type { ClassEntry } from '../character/types'
import { lookupById, seededClassSkills } from './catalogLookup'
import { loadCatalog } from './loadCatalog'
import {
  registerArchetypePack,
  registerClassPack,
  type ArchetypeCatalogRow,
  type ClassProgression,
} from './packRegistry'
import archetypesSchema from '../../../../../schemas/content/pf1e/archetypes.schema.json'
import classesSchema from '../../../../../schemas/content/pf1e/classes.schema.json'
import archetypesJson from '../../../../../content/pf1e/apg/archetypes.json'
import classesJson from '../../../../../content/pf1e/apg/classes.json'

export type ApgClassProgression = ClassProgression
export type ApgArchetype = ArchetypeCatalogRow

const classRows = loadCatalog<ClassProgression[]>(
  classesSchema,
  classesJson,
  'content/pf1e/apg/classes.json',
)
const archetypeRows = loadCatalog<ArchetypeCatalogRow[]>(
  archetypesSchema,
  archetypesJson,
  'content/pf1e/apg/archetypes.json',
)

export const APG_CLASSES: ClassProgression[] = classRows.map((row) => ({
  ...row,
  classSkills: seededClassSkills(row.classSkills),
}))

export const APG_ARCHETYPES: ArchetypeCatalogRow[] = archetypeRows.map(
  (row) => ({ ...row }),
)

registerClassPack(APG_CLASSES)
registerArchetypePack(APG_ARCHETYPES)

/** Unknown or empty id → null. Never throws. CRB lookup stays on lookupCrbClass. */
export function lookupApgClass(
  id: string | null | undefined,
): ClassProgression | null {
  return lookupById(APG_CLASSES, id)
}

export function lookupApgArchetype(
  id: string | null | undefined,
): ArchetypeCatalogRow | null {
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
