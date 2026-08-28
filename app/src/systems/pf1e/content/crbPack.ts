import type {
  FeatEntry,
  Identity,
  ItemEntry,
  SpellListEntry,
} from '../character/types'
import { lookupById, seededClassSkills } from './catalogLookup'
import { loadCatalog } from './loadCatalog'
import {
  registerClassPack,
  registerFeatPack,
  registerItemPack,
  registerRacePack,
  registerSpellPack,
  type ClassProgression,
  type FeatCatalogRow,
  type ItemCatalogRow,
  type ItemKind,
  type RaceCatalogRow,
  type SpellCatalogRow,
} from './packRegistry'
import classesSchema from '../../../../../schemas/content/pf1e/classes.schema.json'
import racesSchema from '../../../../../schemas/content/pf1e/races.schema.json'
import itemsSchema from '../../../../../schemas/content/pf1e/items.schema.json'
import featsSchema from '../../../../../schemas/content/pf1e/feats.schema.json'
import spellsSchema from '../../../../../schemas/content/pf1e/spells.schema.json'
import classesJson from '../../../../../content/pf1e/crb/classes.json'
import racesJson from '../../../../../content/pf1e/crb/races.json'
import itemsJson from '../../../../../content/pf1e/crb/items.json'
import featsJson from '../../../../../content/pf1e/crb/feats.json'
import spellsJson from '../../../../../content/pf1e/crb/spells.json'

export type CrbClassProgression = ClassProgression
export type CrbRace = RaceCatalogRow
export type CrbItem = ItemCatalogRow
export type CrbFeat = FeatCatalogRow
export type CrbSpell = SpellCatalogRow

const classRows = loadCatalog<ClassProgression[]>(
  classesSchema,
  classesJson,
  'content/pf1e/crb/classes.json',
)
const raceRows = loadCatalog<RaceCatalogRow[]>(
  racesSchema,
  racesJson,
  'content/pf1e/crb/races.json',
)
const itemRows = loadCatalog<ItemCatalogRow[]>(
  itemsSchema,
  itemsJson,
  'content/pf1e/crb/items.json',
)
const featRows = loadCatalog<FeatCatalogRow[]>(
  featsSchema,
  featsJson,
  'content/pf1e/crb/feats.json',
)
const spellRows = loadCatalog<SpellCatalogRow[]>(
  spellsSchema,
  spellsJson,
  'content/pf1e/crb/spells.json',
)

export const CRB_CLASSES: ClassProgression[] = classRows.map((row) => ({
  ...row,
  classSkills: seededClassSkills(row.classSkills),
}))

export const CRB_RACES: RaceCatalogRow[] = raceRows.map((row) => ({ ...row }))

export const CRB_ITEMS: ItemCatalogRow[] = itemRows.map((row) => ({
  ...row,
  kind: row.kind,
  weapon: row.kind === 'weapon' ? row.weapon : undefined,
  armor: row.kind === 'armor' ? row.armor : undefined,
}))

export const CRB_FEATS: FeatCatalogRow[] = featRows.map((row) => ({ ...row }))

export const CRB_SPELLS: SpellCatalogRow[] = spellRows.map((row) => ({ ...row }))

registerClassPack(CRB_CLASSES)
registerRacePack(CRB_RACES)
registerItemPack(CRB_ITEMS)
registerFeatPack(CRB_FEATS)
registerSpellPack(CRB_SPELLS)

/** Unknown or empty id → null. Never throws (isolate to the row). CRB only. */
export function lookupCrbClass(
  id: string | null | undefined,
): ClassProgression | null {
  return lookupById(CRB_CLASSES, id)
}

export function lookupCrbRace(
  id: string | null | undefined,
): RaceCatalogRow | null {
  return lookupById(CRB_RACES, id)
}

export function lookupCrbItem(
  id: string | null | undefined,
): ItemCatalogRow | null {
  return lookupById(CRB_ITEMS, id)
}

export function lookupCrbFeat(
  id: string | null | undefined,
): FeatCatalogRow | null {
  return lookupById(CRB_FEATS, id)
}

export function lookupCrbSpell(
  id: string | null | undefined,
): SpellCatalogRow | null {
  return lookupById(CRB_SPELLS, id)
}

export { applyClassProgression as applyCrbClassProgression } from './classLookup'
export {
  applyClassProgression,
  classSkillKeySet,
  classSpellsPerDayRow,
  skillPointsPerLevelFor,
  stampClassSkills,
} from './classLookup'

/**
 * Stamp race id, name, and catalog size from the CRB catalog.
 * Does not rewrite languages or ability scores.
 * Unknown id clears `race.id` and leaves the typed name and size.
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
    size: found.size ?? identity.size,
    race: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
  }
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
  const kind: ItemKind = found.kind
  return {
    ...row,
    item: {
      id: found.id,
      name: found.name,
      source: found.source,
    },
    pounds: found.pounds,
    weapon: kind === 'weapon' && found.weapon ? { ...found.weapon } : undefined,
    armor: kind === 'armor' && found.armor ? { ...found.armor } : undefined,
  }
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
