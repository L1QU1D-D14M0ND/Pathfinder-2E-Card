import { newId } from '../../../shared/ids'
import { APP_VERSION } from '../../../shared/constants'
import { PF1E_SYSTEM_ID } from '../../../shared/envelope'
import { createStandardSkillEntries } from './standardSkills'
import type { Abilities, AbilityBlock, CharacterDocument, ContentRef } from './types'

function blankRef(): ContentRef {
  return { id: null, name: '' }
}

function emptyAbility(): AbilityBlock {
  return { score: 10, tempModifier: 0 }
}

function emptyAbilities(): Abilities {
  return {
    str: emptyAbility(),
    dex: emptyAbility(),
    con: emptyAbility(),
    int: emptyAbility(),
    wis: emptyAbility(),
    cha: emptyAbility(),
  }
}

function nowIso(): string {
  return new Date().toISOString()
}

/** Factory for a new editable PF1e sheet with auto-seeded CRB skills. */
export function createEmptyCharacter(): CharacterDocument {
  const timestamp = nowIso()
  return {
    schemaVersion: 1,
    system: PF1E_SYSTEM_ID,
    meta: {
      createdAt: timestamp,
      updatedAt: timestamp,
      appVersion: APP_VERSION,
      locale: 'en',
      characterId: newId(),
    },
    identity: {
      characterName: '',
      playerName: '',
      race: blankRef(),
      size: 'medium',
      alignment: null,
      deity: '',
      xp: 0,
      languages: [],
    },
    classes: [],
    abilities: emptyAbilities(),
    vitals: {
      hpRolled: [],
      currentHp: 0,
      tempHp: 0,
      nonlethal: 0,
      resistances: [],
      immunities: [],
      weaknesses: [],
      speeds: [{ kind: 'land', feet: 30 }],
      senses: [],
    },
    armorClass: {
      armorBonus: 0,
      shieldBonus: 0,
      natural: 0,
      deflection: 0,
      dodge: 0,
      other: 0,
      maxDex: null,
      armorCheckPenalty: 0,
      notes: '',
    },
    combat: {
      initiativeMisc: 0,
      meleeAttackMisc: 0,
      rangedAttackMisc: 0,
      cmbMisc: 0,
      cmdMisc: 0,
      fortMisc: 0,
      refMisc: 0,
      willMisc: 0,
    },
    skills: createStandardSkillEntries(),
    feats: [],
    features: [],
    attacks: [],
    spellcasting: [],
    inventory: {
      currency: { cp: 0, sp: 0, gp: 0, pp: 0 },
      items: [],
      notes: '',
    },
    companions: [],
    conditions: [],
    play: {
      dailyResources: [],
    },
    notes: {
      appearance: '',
      personality: '',
      campaign: '',
      other: '',
    },
    overrides: {},
    extensions: {},
  }
}
