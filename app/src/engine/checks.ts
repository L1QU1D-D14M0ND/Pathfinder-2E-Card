import type { RankedProficiency } from '../character/types'
import type { AttributeKey } from '../character/types'
import { proficiencyBonus } from './proficiency'
import { stackBreakdown } from './stacking'

export function rankedBonus(
  entry: RankedProficiency,
  level: number,
  attributeModifiers: Record<AttributeKey, number>,
): number {
  const attrKey = entry.attribute
  const attr = attrKey ? (attributeModifiers[attrKey] ?? 0) : 0
  const proficiency = proficiencyBonus(entry.rank, level)
  return attr + proficiency + stackBreakdown(entry.modifiers)
}

export function classDcValue(
  entry: RankedProficiency,
  level: number,
  attributeModifiers: Record<AttributeKey, number>,
): number {
  return 10 + rankedBonus(entry, level, attributeModifiers)
}
