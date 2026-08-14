import type {
  CharacterDocument,
  ProficiencyRank,
  StrikeEntry,
} from '../character/types'
import type { AttributeKey } from '../character/types'
import { findItem } from './ac'
import { proficiencyBonus } from './proficiency'
import { stackBreakdown } from './stacking'
import { signed, type StrikeDerived } from './types'

function weaponRank(
  strike: StrikeEntry,
  character: Pick<CharacterDocument, 'proficiencies' | 'inventory'>,
): ProficiencyRank {
  const specific = character.proficiencies.weapons.specific ?? []
  const linked = findItem(character.inventory.items, strike.itemId)
  const weaponRefId = linked?.item.id
  if (weaponRefId) {
    const match = specific.find((row) => row.weapon.id === weaponRefId)
    if (match) return match.rank
  }
  const category = strike.weaponCategory ?? 'other'
  if (category === 'other') return 'untrained'
  return character.proficiencies.weapons[category]
}

export function strikeAttack(
  strike: StrikeEntry,
  character: Pick<CharacterDocument, 'identity' | 'proficiencies' | 'inventory'>,
  attributeModifiers: Record<AttributeKey, number>,
): number {
  const attrKey = strike.attackAttribute ?? 'str'
  const attr = attributeModifiers[attrKey] ?? 0
  const rank = weaponRank(strike, character)
  const proficiency = proficiencyBonus(rank, character.identity.level)
  const extras = stackBreakdown(strike.modifiers)
  return attr + proficiency + extras
}

export function strikeDamage(
  strike: StrikeEntry,
  attributeModifiers: Record<AttributeKey, number>,
): string {
  const attrKey = strike.damageAttribute
  const bonus = attrKey ? (attributeModifiers[attrKey] ?? 0) : 0
  if (!attrKey || bonus === 0) return strike.damageDice
  return `${strike.damageDice}${signed(bonus)}`
}

export function strikeDerived(
  strike: StrikeEntry,
  character: Pick<CharacterDocument, 'identity' | 'proficiencies' | 'inventory'>,
  attributeModifiers: Record<AttributeKey, number>,
): StrikeDerived {
  return {
    attack: strikeAttack(strike, character, attributeModifiers),
    damage: strikeDamage(strike, attributeModifiers),
  }
}

export function allStrikeDerived(
  character: Pick<
    CharacterDocument,
    'identity' | 'proficiencies' | 'inventory' | 'strikes'
  >,
  attributeModifiers: Record<AttributeKey, number>,
): Record<string, StrikeDerived> {
  const result: Record<string, StrikeDerived> = {}
  for (const strike of character.strikes) {
    result[strike.id] = strikeDerived(strike, character, attributeModifiers)
  }
  return result
}
