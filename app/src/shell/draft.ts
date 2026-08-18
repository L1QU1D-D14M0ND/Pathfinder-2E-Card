import { pf1eModule } from '../systems/pf1e/module'
import { pf2eModule } from '../systems/pf2e/module'
import { parseLoadedSheet, type LoadedSheet } from './loadSheet'

/** Serialize the in-memory sheet the same way Save does (no `derived`). */
export function serializeSheet(sheet: LoadedSheet): string {
  return sheet.system === 'pf1e'
    ? pf1eModule.serialize(sheet.character)
    : pf2eModule.serialize(sheet.character)
}

/**
 * Parse a draft payload. Invalid JSON or schema → null.
 * Never throws; a bad draft must not block boot.
 */
export function parseDraft(text: string | undefined | null): LoadedSheet | null {
  if (!text || typeof text !== 'string') return null
  try {
    return parseLoadedSheet(text)
  } catch {
    return null
  }
}
