import type { BabProgression, ClassEntry, SaveQuality } from '../character/types'

/**
 * CRB class BAB tables: full = levels; ¾ = floor(levels×3/4); ½ = floor(levels/2).
 * Stack per class row, then sum (no fractional BAB).
 */
export function babFromProgression(
  progression: BabProgression,
  levels: number,
): number {
  if (levels <= 0) return 0
  switch (progression) {
    case 'full':
      return levels
    case 'threeQuarter':
      return Math.floor((levels * 3) / 4)
    case 'half':
      return Math.floor(levels / 2)
  }
}

/** CRB: good = 2 + floor(levels/2); poor = floor(levels/3). Stack per class row. */
export function saveFromProgression(
  quality: SaveQuality,
  levels: number,
): number {
  if (levels <= 0) return 0
  if (quality === 'good') return 2 + Math.floor(levels / 2)
  return Math.floor(levels / 3)
}

export function stackedBab(classes: ClassEntry[]): number {
  return classes.reduce(
    (sum, row) => sum + babFromProgression(row.babProgression, row.levels),
    0,
  )
}

export function stackedSave(
  classes: ClassEntry[],
  save: 'fort' | 'ref' | 'will',
): number {
  return classes.reduce(
    (sum, row) => sum + saveFromProgression(row.saves[save], row.levels),
    0,
  )
}

export function characterLevel(classes: ClassEntry[]): number {
  return classes.reduce((sum, row) => sum + row.levels, 0)
}

/**
 * Iterative attack bonuses from BAB (CRB). Extra attacks start at BAB +6,
 * in −5 steps, maximum four from BAB. Fighter 5 is [5], not [5, 0].
 */
export function iterativeAttacks(bab: number): number[] {
  const attacks = [bab]
  for (let step = 1; step <= 3; step += 1) {
    const next = bab - step * 5
    if (next < 1) break
    attacks.push(next)
  }
  return attacks
}
