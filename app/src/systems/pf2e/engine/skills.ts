import type { CharacterDocument, SkillEntry } from '../character/types'
import type { AttributeKey } from '../character/types'
import { armorCheckPenalty, equippedArmor } from './ac'
import { proficiencyBonus } from './proficiency'
import { stackBreakdown } from './stacking'

export function skillTotal(
  skill: SkillEntry,
  character: Pick<
    CharacterDocument,
    'identity' | 'armorClass' | 'inventory'
  >,
  attributeModifiers: Record<AttributeKey, number>,
): number {
  const attr = attributeModifiers[skill.attribute] ?? 0
  const proficiency = proficiencyBonus(skill.rank, character.identity.level)
  const extras = stackBreakdown(skill.modifiers)
  let penalty = 0
  if (skill.armorPenaltyApplies) {
    penalty = armorCheckPenalty(
      equippedArmor(character)?.armor,
      attributeModifiers.str,
    )
  }
  return attr + proficiency + extras + penalty
}

export function skillTotals(
  character: Pick<
    CharacterDocument,
    'identity' | 'skills' | 'armorClass' | 'inventory'
  >,
  attributeModifiers: Record<AttributeKey, number>,
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const skill of character.skills) {
    totals[skill.key] = skillTotal(skill, character, attributeModifiers)
  }
  return totals
}
