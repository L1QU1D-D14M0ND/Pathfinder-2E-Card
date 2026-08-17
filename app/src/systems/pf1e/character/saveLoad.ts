import type { CharacterDocument } from './types'
import { APP_VERSION } from '../../../shared/constants'
import {
  CharacterLoadError,
  CharacterSaveError,
  downloadJsonFile,
  parseJsonObject,
  readTextFile,
  suggestedSaveFilename as suggestedName,
} from '../../../shared/saveLoad'
import { CharacterValidationError } from '../../../shared/validate'
import { PF1E_SYSTEM_ID } from '../../../shared/envelope'
import { normalizeLoadedDocument, validateCharacterDocument } from './validate'

export { CharacterLoadError, CharacterSaveError }

export function stripDerivedForSave(
  character: CharacterDocument,
): CharacterDocument {
  const { derived: _derived, ...rest } = character
  return {
    ...rest,
    system: PF1E_SYSTEM_ID,
    meta: {
      ...rest.meta,
      updatedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
    },
  }
}

export function serializeCharacter(character: CharacterDocument): string {
  const stripped = stripDerivedForSave(character)
  try {
    validateCharacterDocument(stripped)
  } catch (err) {
    const detail =
      err instanceof CharacterValidationError ? err.message : 'invalid document'
    throw new CharacterSaveError(`Cannot save sheet: ${detail}`)
  }
  return `${JSON.stringify(stripped, null, 2)}\n`
}

export function parseCharacterJson(text: string): CharacterDocument {
  try {
    return normalizeLoadedDocument(parseJsonObject(text))
  } catch (err) {
    if (err instanceof CharacterValidationError) {
      throw new CharacterLoadError(`Invalid character sheet: ${err.message}`)
    }
    throw err
  }
}

export function suggestedSaveFilename(character: CharacterDocument): string {
  return suggestedName(character.identity.characterName)
}

export function downloadCharacterJson(character: CharacterDocument): void {
  downloadJsonFile(
    suggestedSaveFilename(character),
    serializeCharacter(character),
  )
}

export async function readCharacterFile(
  file: File,
): Promise<CharacterDocument> {
  return parseCharacterJson(await readTextFile(file))
}
