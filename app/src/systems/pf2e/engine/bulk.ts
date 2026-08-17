import type { ItemEntry } from '../character/types'

/** Persist decimals; compute in integer tenths to avoid float noise. */
export function bulkToTenths(bulk: number): number {
  return Math.round(bulk * 10)
}

export function tenthsToBulk(tenths: number): number {
  return tenths / 10
}

export function bulkUsedTenths(items: ItemEntry[]): number {
  return items.reduce((sum, item) => {
    return sum + item.quantity * bulkToTenths(item.bulk)
  }, 0)
}

export function bulkCapacityTenths(
  strModifier: number,
  bulkBonus: number,
): number {
  return (5 + strModifier + bulkBonus) * 10
}

export function bulkMaximumTenths(
  strModifier: number,
  bulkBonus: number,
): number {
  return (10 + strModifier + bulkBonus) * 10
}

export function investedCount(items: ItemEntry[]): number {
  return items.filter((item) => item.invested).length
}
