import type { AttributeKey, SpellcastingEntry } from '../character/types'
import { rankedBonus } from './checks'
import type { SpellcastingDerived } from './types'

export function spellcastingDerived(
  entries: SpellcastingEntry[],
  level: number,
  attributeModifiers: Record<AttributeKey, number>,
): Record<string, SpellcastingDerived> {
  const result: Record<string, SpellcastingDerived> = {}
  for (const entry of entries) {
    const attrKey = entry.attribute ?? entry.proficiency.attribute
    const bonus = rankedBonus(
      { ...entry.proficiency, attribute: attrKey },
      level,
      attributeModifiers,
    )
    result[entry.id] = { attack: bonus, dc: 10 + bonus }
  }
  return result
}
