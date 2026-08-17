import type { OverrideValue } from '../character/types'
import type { AbilityKey } from '../character/types'
import type { DerivedView } from './types'

const ABILITY_KEYS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

const SCALAR_KEYS = new Set([
  'level',
  'bab',
  'maxHp',
  'deadAt',
  'ac',
  'touchAc',
  'flatFootedAc',
  'cmb',
  'cmd',
  'initiative',
  'fortitude',
  'reflex',
  'will',
  'meleeAttack',
  'rangedAttack',
  'weightUsed',
  'lightLoad',
  'mediumLoad',
  'heavyLoad',
])

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function setScalar(
  view: DerivedView,
  key: string,
  value: number,
): boolean {
  switch (key) {
    case 'level':
      view.level = value
      return true
    case 'bab':
      view.bab = value
      return true
    case 'maxHp':
      view.maxHp = value
      return true
    case 'deadAt':
      view.deadAt = value
      return true
    case 'ac':
      view.ac = value
      return true
    case 'touchAc':
      view.touchAc = value
      return true
    case 'flatFootedAc':
      view.flatFootedAc = value
      return true
    case 'cmb':
      view.cmb = value
      return true
    case 'cmd':
      view.cmd = value
      return true
    case 'initiative':
      view.initiative = value
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
    case 'meleeAttack':
      view.meleeAttack = value
      return true
    case 'rangedAttack':
      view.rangedAttack = value
      return true
    case 'weightUsed':
      view.weightUsed = value
      return true
    case 'lightLoad':
      view.lightLoad = value
      return true
    case 'mediumLoad':
      view.mediumLoad = value
      return true
    case 'heavyLoad':
      view.heavyLoad = value
      return true
    default:
      return false
  }
}

/**
 * Apply overrides last. Unknown paths are ignored (stored on ignoredOverridePaths).
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
    return setScalar(view, parts[1], value)
  }

  if (
    parts.length === 3 &&
    parts[1] === 'abilityModifiers' &&
    ABILITY_KEYS.includes(parts[2] as AbilityKey)
  ) {
    if (!isFiniteNumber(value)) return false
    view.abilityModifiers[parts[2] as AbilityKey] = value
    return true
  }

  if (parts.length === 3 && parts[1] === 'skillTotals' && parts[2]) {
    if (!isFiniteNumber(value)) return false
    view.skillTotals[parts[2]] = value
    return true
  }

  if (
    parts.length === 4 &&
    parts[1] === 'attacks' &&
    parts[3] === 'attack' &&
    parts[2]
  ) {
    if (!isFiniteNumber(value)) return false
    const existing = view.attacks[parts[2]]
    if (!existing) return false
    existing.attack = value
    return true
  }

  if (
    parts.length === 4 &&
    parts[1] === 'spellcasting' &&
    parts[3] === 'casterLevel' &&
    parts[2]
  ) {
    if (!isFiniteNumber(value)) return false
    const existing = view.spellcasting[parts[2]]
    if (!existing) return false
    existing.casterLevel = value
    return true
  }

  if (
    parts.length === 5 &&
    parts[1] === 'spellcasting' &&
    (parts[3] === 'dcByLevel' || parts[3] === 'bonusSlotsByLevel') &&
    parts[2]
  ) {
    if (!isFiniteNumber(value)) return false
    const existing = view.spellcasting[parts[2]]
    if (!existing) return false
    const index = Number(parts[4])
    if (!Number.isInteger(index) || index < 0 || index > 9) return false
    if (parts[3] === 'dcByLevel') existing.dcByLevel[index] = value
    else existing.bonusSlotsByLevel[index] = value
    return true
  }

  return false
}
