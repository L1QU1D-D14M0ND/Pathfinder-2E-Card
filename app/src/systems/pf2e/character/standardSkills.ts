import type { AttributeKey, SkillEntry } from './types'

/** Standard PF2e skills auto-seeded on new sheets. */
export const STANDARD_SKILLS: ReadonlyArray<{
  key: string
  name: string
  attribute: AttributeKey
  armorPenaltyApplies: boolean
}> = [
  { key: 'acrobatics', name: 'Acrobatics', attribute: 'dex', armorPenaltyApplies: true },
  { key: 'arcana', name: 'Arcana', attribute: 'int', armorPenaltyApplies: false },
  { key: 'athletics', name: 'Athletics', attribute: 'str', armorPenaltyApplies: true },
  { key: 'crafting', name: 'Crafting', attribute: 'int', armorPenaltyApplies: false },
  { key: 'deception', name: 'Deception', attribute: 'cha', armorPenaltyApplies: false },
  { key: 'diplomacy', name: 'Diplomacy', attribute: 'cha', armorPenaltyApplies: false },
  { key: 'intimidation', name: 'Intimidation', attribute: 'cha', armorPenaltyApplies: false },
  { key: 'medicine', name: 'Medicine', attribute: 'wis', armorPenaltyApplies: false },
  { key: 'nature', name: 'Nature', attribute: 'wis', armorPenaltyApplies: false },
  { key: 'occultism', name: 'Occultism', attribute: 'int', armorPenaltyApplies: false },
  { key: 'performance', name: 'Performance', attribute: 'cha', armorPenaltyApplies: false },
  { key: 'religion', name: 'Religion', attribute: 'wis', armorPenaltyApplies: false },
  { key: 'society', name: 'Society', attribute: 'int', armorPenaltyApplies: false },
  { key: 'stealth', name: 'Stealth', attribute: 'dex', armorPenaltyApplies: true },
  { key: 'survival', name: 'Survival', attribute: 'wis', armorPenaltyApplies: false },
  { key: 'thievery', name: 'Thievery', attribute: 'dex', armorPenaltyApplies: true },
]

export function createStandardSkillEntries(): SkillEntry[] {
  return STANDARD_SKILLS.map((s) => ({
    key: s.key,
    name: s.name,
    attribute: s.attribute,
    rank: 'untrained',
    isLore: false,
    armorPenaltyApplies: s.armorPenaltyApplies,
    modifiers: {},
    notes: '',
    effects: [],
  }))
}
