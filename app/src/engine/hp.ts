import type { CharacterDocument } from '../character/types'

export function maxHp(
  character: Pick<CharacterDocument, 'identity' | 'vitals'>,
  conModifier: number,
): number {
  const level = character.identity.level
  const rawPerLevel = character.vitals.classHpPerLevel + conModifier
  const perLevel =
    character.vitals.classHpPerLevel > 0
      ? Math.max(1, rawPerLevel)
      : Math.max(0, rawPerLevel)
  const fromClassAndCon = perLevel * level
  const fromBonuses = character.vitals.bonuses.reduce((sum, bonus) => {
    return sum + (bonus.perLevel ? bonus.amount * level : bonus.amount)
  }, 0)
  return character.vitals.ancestryHp + fromClassAndCon + fromBonuses
}
