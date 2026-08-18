import type { Abilities, CompanionStub, FusedOverlay } from '../character/types'

export function activeFusedOverlay(
  companions: CompanionStub[] | undefined,
): FusedOverlay | null {
  const row = companions?.find(
    (companion) => companion.kind === 'eidolon' && companion.fused?.active,
  )
  return row?.fused ?? null
}

/** Pilot scores stay on the sheet. While fused, physical mods use overlay scores. */
export function abilitiesForCompute(
  abilities: Abilities,
  companions: CompanionStub[] | undefined,
): Abilities {
  const fused = activeFusedOverlay(companions)
  if (!fused) return abilities
  return {
    ...abilities,
    str: { score: fused.str, tempScore: 0, tempModifier: 0 },
    dex: { score: fused.dex, tempScore: 0, tempModifier: 0 },
    con: { score: fused.con, tempScore: 0, tempModifier: 0 },
  }
}
