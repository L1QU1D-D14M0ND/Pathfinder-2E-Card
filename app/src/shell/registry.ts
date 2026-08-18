import type { SystemId } from '../shared/envelope'
import { pf1eModule } from '../systems/pf1e/module'
import type { CharacterDocument as Pf1eDocument } from '../systems/pf1e/character'
import { pf2eModule } from '../systems/pf2e/module'
import type { CharacterDocument as Pf2eDocument } from '../systems/pf2e/character'
import type { LoadedSheet } from './loadSheet'

export const SYSTEM_IDS = ['pf1e', 'pf2e'] as const satisfies readonly SystemId[]

export const SYSTEM_MODULES = {
  pf1e: pf1eModule,
  pf2e: pf2eModule,
} as const

export function matchSheet<T>(
  sheet: LoadedSheet,
  handlers: {
    pf1e: (character: Pf1eDocument, module: typeof pf1eModule) => T
    pf2e: (character: Pf2eDocument, module: typeof pf2eModule) => T
  },
): T {
  if (sheet.system === 'pf1e') {
    return handlers.pf1e(sheet.character, pf1eModule)
  }
  return handlers.pf2e(sheet.character, pf2eModule)
}

export function createSheet(system: SystemId): LoadedSheet {
  if (system === 'pf1e') {
    return { system: 'pf1e', character: pf1eModule.createEmpty() }
  }
  return { system: 'pf2e', character: pf2eModule.createEmpty() }
}

export function serializeSheet(sheet: LoadedSheet): string {
  return matchSheet(sheet, {
    pf1e: (character, module) => module.serialize(character),
    pf2e: (character, module) => module.serialize(character),
  })
}

export function downloadSheet(sheet: LoadedSheet): void {
  matchSheet(sheet, {
    pf1e: (character, module) => {
      module.download(character)
    },
    pf2e: (character, module) => {
      module.download(character)
    },
  })
}

export function parseSheetFor(system: SystemId, text: string): LoadedSheet {
  if (system === 'pf1e') {
    return { system: 'pf1e', character: pf1eModule.parse(text) }
  }
  return { system: 'pf2e', character: pf2eModule.parse(text) }
}
