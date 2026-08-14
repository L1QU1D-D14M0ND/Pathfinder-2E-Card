import type { OverrideValue } from '../character/types'
import type { AttributeKey } from '../character/types'
import type { DerivedView } from './types'

const ATTRIBUTE_KEYS: AttributeKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

const SCALAR_KEYS = new Set([
  'ac',
  'maxHp',
  'perception',
  'fortitude',
  'reflex',
  'will',
  'classDC',
  'bulkUsed',
  'bulkCapacity',
  'investedCount',
])

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Apply overrides last. Unknown paths are ignored (stored on ignoredOverridePaths).
 * Allowed: derived.ac, derived.maxHp, derived.perception, derived.fortitude,
 * derived.reflex, derived.will, derived.classDC, derived.bulkUsed,
 * derived.bulkCapacity, derived.investedCount,
 * derived.attributeModifiers.{str|dex|con|int|wis|cha},
 * derived.skillTotals.<key>, derived.strikes.<id>.attack
 */
export function applyOverrides(
  view: DerivedView,
  overrides: Record<string, OverrideValue>,
): DerivedView {
  const next: DerivedView = structuredClone(view)
  for (const [path, override] of Object.entries(overrides)) {
    if (applyOne(next, path, override.value)) {
      next.overriddenPaths.push(path)
    } else {
      next.ignoredOverridePaths.push(path)
    }
  }
  return next
}

export function isOverridden(view: DerivedView, path: string): boolean {
  return view.overriddenPaths.includes(path)
}

function applyOne(view: DerivedView, path: string, value: unknown): boolean {
  const parts = path.split('.')
  if (parts[0] !== 'derived' || parts.length < 2) return false

  if (parts.length === 2 && SCALAR_KEYS.has(parts[1])) {
    if (!isFiniteNumber(value)) return false
    const key = parts[1]
    switch (key) {
      case 'ac':
        view.ac = value
        return true
      case 'maxHp':
        view.maxHp = value
        return true
      case 'perception':
        view.perception = value
        return true
      case 'fortitude':
        view.fortitude = value
        return true
      case 'reflex':
        view.reflex = value
        return true
      case 'will':
        view.will = value
        return true
      case 'classDC':
        view.classDC = value
        return true
      case 'bulkUsed':
        view.bulkUsed = value
        return true
      case 'bulkCapacity':
        view.bulkCapacity = value
        return true
      case 'investedCount':
        view.investedCount = value
        return true
      default:
        return false
    }
  }

  if (
    parts.length === 3 &&
    parts[1] === 'attributeModifiers' &&
    ATTRIBUTE_KEYS.includes(parts[2] as AttributeKey)
  ) {
    if (!isFiniteNumber(value)) return false
    view.attributeModifiers[parts[2] as AttributeKey] = value
    return true
  }

  if (parts.length === 3 && parts[1] === 'skillTotals' && parts[2]) {
    if (!isFiniteNumber(value)) return false
    view.skillTotals[parts[2]] = value
    return true
  }

  if (
    parts.length === 4 &&
    parts[1] === 'strikes' &&
    parts[3] === 'attack' &&
    parts[2]
  ) {
    if (!isFiniteNumber(value)) return false
    const existing = view.strikes[parts[2]]
    if (!existing) return false
    existing.attack = value
    return true
  }

  return false
}
