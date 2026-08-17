import { parseJsonObject } from '../shared/saveLoad'
import { isRecord, resolveSystemId, type SystemId } from '../shared/envelope'
import {
  parseCharacterJson as parsePf1e,
  type CharacterDocument as Pf1eDocument,
} from '../systems/pf1e/character'
import {
  parseCharacterJson as parsePf2e,
  type CharacterDocument as Pf2eDocument,
} from '../systems/pf2e/character'

export type LoadedSheet =
  | { system: 'pf1e'; character: Pf1eDocument }
  | { system: 'pf2e'; character: Pf2eDocument }

export function peekSystemId(text: string): SystemId {
  const data = parseJsonObject(text)
  return resolveSystemId(isRecord(data) ? data.system : undefined)
}

export function parseLoadedSheet(text: string): LoadedSheet {
  const system = peekSystemId(text)
  if (system === 'pf1e') {
    return { system: 'pf1e', character: parsePf1e(text) }
  }
  return { system: 'pf2e', character: parsePf2e(text) }
}
