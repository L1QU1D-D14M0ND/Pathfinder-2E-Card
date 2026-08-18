import type {
  BabProgression,
  ClassEntry,
  ClassSaves,
  ContentRef,
  Identity,
} from '../character/types'
import classesJson from '../../../../../content/pf1e/crb/classes.json'
import racesJson from '../../../../../content/pf1e/crb/races.json'

export interface CrbClassProgression {
  id: string
  name: string
  hitDie: number
  babProgression: BabProgression
  saves: ClassSaves
  source?: ContentRef['source']
}

export const CRB_CLASSES: CrbClassProgression[] = classesJson.map((row) => ({
  id: row.id,
  name: row.name,
  hitDie: row.hitDie,
  babProgression: row.babProgression as BabProgression,
  saves: row.saves as ClassSaves,
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
  }
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
