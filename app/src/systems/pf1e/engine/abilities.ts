import type { Abilities, AbilityKey, Size } from '../character/types'

/** CRB Ability Modifiers table: floor((score − 10) / 2). */
export function abilityModifierFromScore(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function abilityModifiers(
  abilities: Abilities,
): Record<AbilityKey, number> {
  const keys: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
  const result = {} as Record<AbilityKey, number>
  for (const key of keys) {
    const block = abilities[key]
    result[key] =
      abilityModifierFromScore(block.score) + (block.tempModifier ?? 0)
  }
  return result
}

/** Size modifier to AC and attack rolls (CRB). */
export function sizeAcAttackModifier(size: Size): number {
  switch (size) {
    case 'fine':
      return 8
    case 'diminutive':
      return 4
    case 'tiny':
      return 2
    case 'small':
      return 1
    case 'medium':
      return 0
    case 'large':
      return -1
    case 'huge':
      return -2
    case 'gargantuan':
      return -4
    case 'colossal':
      return -8
  }
}

/** Special size modifier to CMB and CMD (CRB). */
export function sizeCmbModifier(size: Size): number {
  return -sizeAcAttackModifier(size)
}

/** Carrying-capacity size multiplier vs a Medium creature (CRB). */
export function sizeCarryMultiplier(size: Size): number {
  switch (size) {
    case 'fine':
      return 1 / 8
    case 'diminutive':
      return 1 / 4
    case 'tiny':
      return 1 / 2
    case 'small':
      return 3 / 4
    case 'medium':
      return 1
    case 'large':
      return 2
    case 'huge':
      return 4
    case 'gargantuan':
      return 8
    case 'colossal':
      return 16
  }
}
