import type {
  BabProgression,
  ClassSaves,
  ContentRef,
  FeatEntry,
  ItemEntry,
  Size,
} from '../character/types'
import { lookupById } from './catalogLookup'

export interface ClassProgression {
  id: string
  name: string
  hitDie: number
  babProgression: BabProgression
  saves: ClassSaves
  skillPointsPerLevel: number
  classSkills: string[]
  source?: ContentRef['source']
}

export interface RaceCatalogRow {
  id: string
  name: string
  size?: Size
  source?: ContentRef['source']
}

export type ItemKind = 'weapon' | 'armor' | 'item'

export interface ItemCatalogRow {
  id: string
  name: string
  kind: ItemKind
  pounds: number
  weapon?: ItemEntry['weapon']
  armor?: ItemEntry['armor']
  source?: ContentRef['source']
}

export interface FeatCatalogRow {
  id: string
  name: string
  category: FeatEntry['category']
  source?: ContentRef['source']
}

export interface SpellCatalogRow {
  id: string
  name: string
  spellLevel: number
  source?: ContentRef['source']
}

export interface ArchetypeCatalogRow {
  id: string
  name: string
  classId: string
  source?: ContentRef['source']
}

export interface EvolutionCatalogRow {
  id: string
  name: string
  source?: ContentRef['source']
}

const classPacks: ClassProgression[][] = []
const racePacks: RaceCatalogRow[][] = []
const itemPacks: ItemCatalogRow[][] = []
const featPacks: FeatCatalogRow[][] = []
const spellPacks: SpellCatalogRow[][] = []
const archetypePacks: ArchetypeCatalogRow[][] = []
const evolutionPacks: EvolutionCatalogRow[][] = []

function lookupRegistered<T extends { id: string }>(
  packs: readonly T[][],
  id: string | null | undefined,
): T | null {
  if (!id) return null
  for (const rows of packs) {
    const found = lookupById(rows, id)
    if (found) return found
  }
  return null
}

export function registerClassPack(rows: readonly ClassProgression[]): void {
  classPacks.push([...rows])
}

export function registerRacePack(rows: readonly RaceCatalogRow[]): void {
  racePacks.push([...rows])
}

export function registerItemPack(rows: readonly ItemCatalogRow[]): void {
  itemPacks.push([...rows])
}

export function registerFeatPack(rows: readonly FeatCatalogRow[]): void {
  featPacks.push([...rows])
}

export function registerSpellPack(rows: readonly SpellCatalogRow[]): void {
  spellPacks.push([...rows])
}

export function registerArchetypePack(
  rows: readonly ArchetypeCatalogRow[],
): void {
  archetypePacks.push([...rows])
}

export function registerEvolutionPack(
  rows: readonly EvolutionCatalogRow[],
): void {
  evolutionPacks.push([...rows])
}

export function lookupClassProgression(
  id: string | null | undefined,
): ClassProgression | null {
  return lookupRegistered(classPacks, id)
}

export function lookupRace(
  id: string | null | undefined,
): RaceCatalogRow | null {
  return lookupRegistered(racePacks, id)
}

export function lookupItem(
  id: string | null | undefined,
): ItemCatalogRow | null {
  return lookupRegistered(itemPacks, id)
}

export function lookupFeat(
  id: string | null | undefined,
): FeatCatalogRow | null {
  return lookupRegistered(featPacks, id)
}

export function lookupSpell(
  id: string | null | undefined,
): SpellCatalogRow | null {
  return lookupRegistered(spellPacks, id)
}

export function lookupArchetype(
  id: string | null | undefined,
): ArchetypeCatalogRow | null {
  return lookupRegistered(archetypePacks, id)
}

export function lookupEvolution(
  id: string | null | undefined,
): EvolutionCatalogRow | null {
  return lookupRegistered(evolutionPacks, id)
}
