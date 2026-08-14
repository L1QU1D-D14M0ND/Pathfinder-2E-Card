import type { ProficiencyRank } from '../character/types'

const RANK_BONUS: Record<ProficiencyRank, number> = {
  untrained: 0,
  trained: 2,
  expert: 4,
  master: 6,
  legendary: 8,
}

/** Untrained does not add level. Trained+ is rank bonus + level (no max-level cap). */
export function proficiencyBonus(rank: ProficiencyRank, level: number): number {
  if (rank === 'untrained') return 0
  return RANK_BONUS[rank] + level
}
