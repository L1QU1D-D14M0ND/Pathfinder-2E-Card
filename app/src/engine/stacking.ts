import type { ModifierBreakdown } from '../character/types'

const TYPED_KEYS = ['item', 'status', 'circumstance'] as const
const SUMMED_KEYS = ['untyped', 'ability', 'proficiency', 'other'] as const

/** Same-type item/status/circumstance: highest bonus and worst penalty. Others sum. */
export function stackTyped(values: number[]): number {
  const bonuses = values.filter((v) => v > 0)
  const penalties = values.filter((v) => v < 0)
  const bestBonus = bonuses.length > 0 ? Math.max(...bonuses) : 0
  const worstPenalty = penalties.length > 0 ? Math.min(...penalties) : 0
  return bestBonus + worstPenalty
}

export function stackBreakdown(
  breakdown: ModifierBreakdown | undefined,
  extra?: Partial<Record<keyof ModifierBreakdown, number[]>>,
): number {
  let total = 0
  for (const key of TYPED_KEYS) {
    const values = [breakdown?.[key] ?? 0, ...(extra?.[key] ?? [])].filter(
      (v) => v !== 0,
    )
    total += stackTyped(values)
  }
  for (const key of SUMMED_KEYS) {
    total += breakdown?.[key] ?? 0
    for (const extraValue of extra?.[key] ?? []) total += extraValue
  }
  return total
}
