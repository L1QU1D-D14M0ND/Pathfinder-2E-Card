import type { CharacterDocument } from './types'
import { APP_VERSION, SAVE_FILE_EXTENSION } from './types'

export class CharacterLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CharacterLoadError'
  }
}

/** Strip recomputed cache before Save sheet (per schema decision). */
export function stripDerivedForSave(
  character: CharacterDocument,
): CharacterDocument {
  const { derived: _derived, ...rest } = character
  return {
    ...rest,
    meta: {
      ...rest.meta,
      updatedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
    },
  }
}

export function serializeCharacter(character: CharacterDocument): string {
  return `${JSON.stringify(stripDerivedForSave(character), null, 2)}\n`
}

export function parseCharacterJson(text: string): CharacterDocument {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new CharacterLoadError('File is not valid JSON.')
  }
  if (!data || typeof data !== 'object') {
    throw new CharacterLoadError('Character file must be a JSON object.')
  }
  const doc = data as Partial<CharacterDocument>
  if (doc.schemaVersion !== 1) {
    throw new CharacterLoadError(
      `Unsupported schemaVersion: ${String(doc.schemaVersion)} (expected 1).`,
    )
  }
  if (!doc.identity || !doc.meta || !doc.attributes) {
    throw new CharacterLoadError('Character file is missing required sections.')
  }
  return doc as CharacterDocument
}

export function suggestedSaveFilename(character: CharacterDocument): string {
  const raw = character.identity.characterName.trim() || 'character'
  const safe = raw.replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-').slice(0, 64)
  return `${safe || 'character'}${SAVE_FILE_EXTENSION}`
}

/** Trigger a browser download of the Save sheet `.json` file. */
export function downloadCharacterJson(character: CharacterDocument): void {
  const blob = new Blob([serializeCharacter(character)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedSaveFilename(character)
  a.click()
  URL.revokeObjectURL(url)
}

export function readCharacterFile(file: File): Promise<CharacterDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(parseCharacterJson(String(reader.result ?? '')))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new CharacterLoadError('Could not read file.'))
    reader.readAsText(file)
  })
}
