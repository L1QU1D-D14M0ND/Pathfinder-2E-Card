import {
  createEmptyCharacter,
  downloadCharacterJson,
  parseCharacterJson,
  readCharacterFile,
  serializeCharacter,
  suggestedSaveFilename,
  validateCharacterDocument,
  type CharacterDocument,
} from './character'
import { compute, type DerivedView } from './engine'
import type { SystemModule } from '../../shell/types'

export const pf2eModule: SystemModule<CharacterDocument, DerivedView> = {
  id: 'pf2e',
  displayName: 'Pathfinder Second Edition',
  validate: validateCharacterDocument,
  createEmpty: createEmptyCharacter,
  compute,
  parse: parseCharacterJson,
  serialize: serializeCharacter,
  download: downloadCharacterJson,
  readFile: readCharacterFile,
  suggestedFilename: suggestedSaveFilename,
  sidebarTools: [],
}

export type { CharacterDocument, DerivedView }
