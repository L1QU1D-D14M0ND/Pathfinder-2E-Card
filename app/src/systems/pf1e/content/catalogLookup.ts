import { STANDARD_SKILLS } from '../character/standardSkills'

const STANDARD_SKILL_ORDER = new Map(
  STANDARD_SKILLS.map((row, index) => [row.key, index]),
)

/** Unknown or empty id → null. Shared by CRB / APG catalogs. */
export function lookupById<T extends { id: string }>(
  rows: readonly T[],
  id: string | null | undefined,
): T | null {
  if (!id) return null
  return rows.find((row) => row.id === id) ?? null
}

export function seededClassSkills(keys: readonly string[]): string[] {
  return [...keys].sort((left, right) => {
    const a = STANDARD_SKILL_ORDER.get(left) ?? Number.MAX_SAFE_INTEGER
    const b = STANDARD_SKILL_ORDER.get(right) ?? Number.MAX_SAFE_INTEGER
    return a - b
  })
}
