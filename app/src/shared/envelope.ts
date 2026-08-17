export type SystemId = 'pf1e' | 'pf2e'

export const PF1E_SYSTEM_ID = 'pf1e' as const
export const PF2E_SYSTEM_ID = 'pf2e' as const

/** Missing `system` on Load means Pathfinder 2E (existing fixtures). */
export function resolveSystemId(value: unknown): SystemId {
  if (value === 'pf1e' || value === 'pf2e') return value
  return PF2E_SYSTEM_ID
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
