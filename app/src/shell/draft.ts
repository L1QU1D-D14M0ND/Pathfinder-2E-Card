import { parseLoadedSheet, type LoadedSheet } from './loadSheet'

export { serializeSheet } from './registry'

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
