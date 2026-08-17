import type { ArmorClassInputs, Size } from '../character/types'
import { sizeAcAttackModifier } from './abilities'

export function cappedDexBonus(
  dexMod: number,
  maxDex: number | null,
): number {
  if (dexMod <= 0) return dexMod
  if (maxDex === null) return dexMod
  return Math.min(dexMod, maxDex)
}

/** Flat-footed loses Dex *bonus* and dodge; Dex penalties still apply. */
export function flatFootedDex(dexMod: number): number {
  return dexMod < 0 ? dexMod : 0
}

export function armorClassValues(
  armorClass: ArmorClassInputs,
  dexMod: number,
  size: Size,
): { ac: number; touchAc: number; flatFootedAc: number } {
  const sizeMod = sizeAcAttackModifier(size)
  const dex = cappedDexBonus(dexMod, armorClass.maxDex)
  const ffDex = flatFootedDex(dex)
  const {
    armorBonus,
    shieldBonus,
    natural,
    deflection,
    dodge,
    other,
  } = armorClass

  return {
    ac:
      10 +
      armorBonus +
      shieldBonus +
      dex +
      sizeMod +
      natural +
      deflection +
      dodge +
      other,
    touchAc: 10 + dex + sizeMod + deflection + dodge + other,
    flatFootedAc:
      10 +
      armorBonus +
      shieldBonus +
      ffDex +
      sizeMod +
      natural +
      deflection +
      other,
  }
}
