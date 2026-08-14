import type {
  ArmorItemStats,
  CharacterDocument,
  ItemEntry,
  ShieldItemStats,
} from '../character/types'
import { proficiencyBonus } from './proficiency'
import { stackBreakdown } from './stacking'

export function findItem(
  items: ItemEntry[],
  id: string | null | undefined,
): ItemEntry | undefined {
  if (!id) return undefined
  return items.find((item) => item.id === id)
}

export function equippedArmor(
  character: Pick<CharacterDocument, 'armorClass' | 'inventory'>,
): ItemEntry | undefined {
  const item = findItem(
    character.inventory.items,
    character.armorClass.equippedArmorItemId,
  )
  if (!item?.armor) return undefined
  return item
}

export function equippedShield(
  character: Pick<CharacterDocument, 'armorClass' | 'inventory'>,
): ItemEntry | undefined {
  const item = findItem(
    character.inventory.items,
    character.armorClass.equippedShieldItemId,
  )
  if (!item?.shield) return undefined
  return item
}

export function armorCheckPenaltyApplies(
  armor: ArmorItemStats | undefined,
  strModifier: number,
): boolean {
  if (!armor || armor.checkPenalty >= 0) return false
  if (armor.strength == null) return false
  return strModifier < armor.strength
}

export function armorCheckPenalty(
  armor: ArmorItemStats | undefined,
  strModifier: number,
): number {
  if (!armorCheckPenaltyApplies(armor, strModifier)) return 0
  return armor?.checkPenalty ?? 0
}

export function armorClassTotal(
  character: Pick<
    CharacterDocument,
    'identity' | 'proficiencies' | 'armorClass' | 'inventory'
  >,
  dexModifier: number,
): number {
  const armorItem = equippedArmor(character)
  const armor: ArmorItemStats | undefined = armorItem?.armor
  const category = armor?.category ?? 'unarmored'
  const rank = character.proficiencies.armor[category]
  const proficiency = proficiencyBonus(rank, character.identity.level)

  const dexCap =
    character.armorClass.dexCapOverride ?? armor?.dexCap ?? null
  const dexBonus = dexCap == null ? dexModifier : Math.min(dexModifier, dexCap)

  const itemBonus = armor
    ? armor.acBonus + (armor.potencyRune ?? 0)
    : 0

  const shield: ShieldItemStats | undefined = character.armorClass.shieldRaised
    ? equippedShield(character)?.shield
    : undefined
  const shieldCircumstance = shield?.acBonus ?? 0

  const extras = stackBreakdown(character.armorClass.modifiers, {
    item: itemBonus !== 0 ? [itemBonus] : [],
    circumstance: shieldCircumstance !== 0 ? [shieldCircumstance] : [],
  })

  return 10 + dexBonus + proficiency + extras
}
