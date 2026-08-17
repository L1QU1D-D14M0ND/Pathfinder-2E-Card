import type { CharacterDocument } from '../character'

export type SheetUpdate = (
  mutator: (c: CharacterDocument) => CharacterDocument,
) => void
