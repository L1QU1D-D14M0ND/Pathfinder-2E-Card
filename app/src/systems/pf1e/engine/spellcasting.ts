import type { AbilityKey, ClassEntry, SpellcastingEntry } from '../character/types'

/** Spell DC = 10 + spell level + ability modifier (CRB). */
export function spellDc(spellLevel: number, abilityMod: number): number {
  return 10 + spellLevel + abilityMod
}

/**
 * Bonus spells per day from a high ability score (CRB table).
 * Level 0 (cantrips/orisons) never receive bonus slots.
 */
export function bonusSpellsFromAbility(
  abilityScore: number,
  spellLevel: number,
): number {
  if (spellLevel < 1 || spellLevel > 9) return 0
  const mod = Math.floor((abilityScore - 10) / 2)
  if (mod < spellLevel) return 0
  return Math.floor((mod - spellLevel) / 4) + 1
}

export function bonusSlotsByLevel(abilityScore: number): number[] {
  return Array.from({ length: 10 }, (_, spellLevel) =>
    bonusSpellsFromAbility(abilityScore, spellLevel),
  )
}

export function dcByLevel(abilityMod: number): number[] {
  return Array.from({ length: 10 }, (_, spellLevel) =>
    spellDc(spellLevel, abilityMod),
  )
}

export function casterLevelForEntry(
  entry: SpellcastingEntry,
  classes: ClassEntry[],
): number {
  if (entry.casterLevelOverride != null) return entry.casterLevelOverride
  if (entry.classRowId) {
    const row = classes.find((cls) => cls.id === entry.classRowId)
    return row?.levels ?? 0
  }
  return 0
}

export interface SpellcastingDerived {
  casterLevel: number
  ability: AbilityKey
  abilityMod: number
  dcByLevel: number[]
  bonusSlotsByLevel: number[]
}

export function spellcastingDerived(
  entries: SpellcastingEntry[],
  classes: ClassEntry[],
  scores: Record<AbilityKey, number>,
  mods: Record<AbilityKey, number>,
): Record<string, SpellcastingDerived> {
  const result: Record<string, SpellcastingDerived> = {}
  for (const entry of entries) {
    const abilityMod = mods[entry.ability]
    result[entry.id] = {
      casterLevel: casterLevelForEntry(entry, classes),
      ability: entry.ability,
      abilityMod,
      dcByLevel: dcByLevel(abilityMod),
      bonusSlotsByLevel: bonusSlotsByLevel(scores[entry.ability]),
    }
  }
  return result
}
