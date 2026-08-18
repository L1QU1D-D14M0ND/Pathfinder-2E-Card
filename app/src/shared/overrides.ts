export interface OverrideValue {
  value: unknown
  reason?: string
  updatedAt?: string
}

export interface OverrideHost {
  overriddenPaths: string[]
  ignoredOverridePaths: string[]
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Apply overrides last. `applyOne` is per-system (allow-list + Derived shape).
 * Unknown paths are recorded on ignoredOverridePaths.
 */
export function applyOverrides<T extends OverrideHost>(
  view: T,
  overrides: Record<string, OverrideValue>,
  applyOne: (view: T, path: string, value: unknown) => boolean,
): T {
  const next: T = structuredClone(view)
  for (const [path, override] of Object.entries(overrides)) {
    if (applyOne(next, path, override.value)) {
      next.overriddenPaths.push(path)
    } else {
      next.ignoredOverridePaths.push(path)
    }
  }
  return next
}

export function isOverridden(view: OverrideHost, path: string): boolean {
  return view.overriddenPaths.includes(path)
}
