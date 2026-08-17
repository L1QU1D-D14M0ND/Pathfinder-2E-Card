export class CharacterLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CharacterLoadError'
  }
}

export class CharacterSaveError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CharacterSaveError'
  }
}

export const SAVE_FILE_EXTENSION = '.json'

export function suggestedSaveFilename(
  characterName: string,
  extension = SAVE_FILE_EXTENSION,
): string {
  const raw = characterName.trim() || 'character'
  const safe = raw.replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-').slice(0, 64)
  return `${safe || 'character'}${extension}`
}

export function downloadJsonFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () =>
      reject(new CharacterLoadError('Could not read file.'))
    reader.readAsText(file)
  })
}

export function parseJsonObject(text: string): unknown {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new CharacterLoadError('File is not valid JSON.')
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new CharacterLoadError('Character file must be a JSON object.')
  }
  return data
}
