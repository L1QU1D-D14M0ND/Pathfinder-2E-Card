import type { AbilityKey, Vitals, ClassEntry } from '../character/types'

/**
 * Max HP = per-HD max(1, rolled + Con) + favored-class HP.
 * Constitution applies once per recorded HD, not per class level with a missing roll.
 */
export function maxHp(
  vitals: Vitals,
  classes: ClassEntry[],
  conMod: number,
): number {
  const fromDice = vitals.hpRolled.reduce(
    (sum, rolled) => sum + Math.max(1, rolled + conMod),
    0,
  )
  const favored = classes.reduce((sum, row) => sum + (row.favored?.hp ?? 0), 0)
  return fromDice + favored
}

export function deadAtThreshold(conScore: number): number {
  return -conScore
}

export function classSkillBonus(trained: boolean, classSkill: boolean): number {
  return trained && classSkill ? 3 : 0
}

export function skillTotal(args: {
  ranks: number
  abilityMod: number
  classSkill: boolean
  armorPenaltyApplies: boolean
  armorCheckPenalty: number
  misc: number
}): number {
  const trained = args.ranks >= 1
  const acp = args.armorPenaltyApplies ? args.armorCheckPenalty : 0
  return (
    args.ranks +
    args.abilityMod +
    classSkillBonus(trained, args.classSkill) +
    acp +
    args.misc
  )
}

export function defaultAttackAbility(
  attackType: 'melee' | 'ranged',
): AbilityKey {
  return attackType === 'ranged' ? 'dex' : 'str'
}
