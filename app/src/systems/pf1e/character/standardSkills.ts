import type { AbilityKey, SkillEntry } from './types'

/** CRB skills that are not Craft/Perform/Profession wildcards. Knowledge subtypes are seeded. */
export const STANDARD_SKILLS: ReadonlyArray<{
  key: string
  name: string
  ability: AbilityKey
  armorPenaltyApplies: boolean
}> = [
  { key: 'acrobatics', name: 'Acrobatics', ability: 'dex', armorPenaltyApplies: true },
  { key: 'appraise', name: 'Appraise', ability: 'int', armorPenaltyApplies: false },
  { key: 'bluff', name: 'Bluff', ability: 'cha', armorPenaltyApplies: false },
  { key: 'climb', name: 'Climb', ability: 'str', armorPenaltyApplies: true },
  { key: 'diplomacy', name: 'Diplomacy', ability: 'cha', armorPenaltyApplies: false },
  { key: 'disable-device', name: 'Disable Device', ability: 'dex', armorPenaltyApplies: true },
  { key: 'disguise', name: 'Disguise', ability: 'cha', armorPenaltyApplies: false },
  { key: 'escape-artist', name: 'Escape Artist', ability: 'dex', armorPenaltyApplies: true },
  { key: 'fly', name: 'Fly', ability: 'dex', armorPenaltyApplies: true },
  { key: 'handle-animal', name: 'Handle Animal', ability: 'cha', armorPenaltyApplies: false },
  { key: 'heal', name: 'Heal', ability: 'wis', armorPenaltyApplies: false },
  { key: 'intimidate', name: 'Intimidate', ability: 'cha', armorPenaltyApplies: false },
  { key: 'linguistics', name: 'Linguistics', ability: 'int', armorPenaltyApplies: false },
  { key: 'perception', name: 'Perception', ability: 'wis', armorPenaltyApplies: false },
  { key: 'ride', name: 'Ride', ability: 'dex', armorPenaltyApplies: true },
  { key: 'sense-motive', name: 'Sense Motive', ability: 'wis', armorPenaltyApplies: false },
  { key: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'dex', armorPenaltyApplies: true },
  { key: 'spellcraft', name: 'Spellcraft', ability: 'int', armorPenaltyApplies: false },
  { key: 'stealth', name: 'Stealth', ability: 'dex', armorPenaltyApplies: true },
  { key: 'survival', name: 'Survival', ability: 'wis', armorPenaltyApplies: false },
  { key: 'swim', name: 'Swim', ability: 'str', armorPenaltyApplies: true },
  { key: 'use-magic-device', name: 'Use Magic Device', ability: 'cha', armorPenaltyApplies: false },
  { key: 'knowledge-arcana', name: 'Knowledge (arcana)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-dungeoneering', name: 'Knowledge (dungeoneering)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-engineering', name: 'Knowledge (engineering)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-geography', name: 'Knowledge (geography)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-history', name: 'Knowledge (history)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-local', name: 'Knowledge (local)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-nature', name: 'Knowledge (nature)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-nobility', name: 'Knowledge (nobility)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-planes', name: 'Knowledge (planes)', ability: 'int', armorPenaltyApplies: false },
  { key: 'knowledge-religion', name: 'Knowledge (religion)', ability: 'int', armorPenaltyApplies: false },
]

export function createStandardSkillEntries(): SkillEntry[] {
  return STANDARD_SKILLS.map((skill) => ({
    key: skill.key,
    name: skill.name,
    ability: skill.ability,
    ranks: 0,
    classSkill: false,
    armorPenaltyApplies: skill.armorPenaltyApplies,
    misc: 0,
    notes: '',
    effects: [],
  }))
}
