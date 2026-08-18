import { newId } from '../../../shared/ids'
import { emptyCurrency } from '../../../shared/currency'
import { createStandardSkillEntries } from './standardSkills'
import {
  APP_VERSION,
  type AttributeBlock,
  type Attributes,
  type CharacterDocument,
  type ContentRef,
} from './types'

function blankRef(): ContentRef {
  return { id: null, name: '', rulesetSource: 'custom' }
}

function emptyAttribute(): AttributeBlock {
  return { boosts: [], legacyScore: null, modifierOverride: null }
}

function emptyAttributes(): Attributes {
  return {
    str: emptyAttribute(),
    dex: emptyAttribute(),
    con: emptyAttribute(),
    int: emptyAttribute(),
    wis: emptyAttribute(),
    cha: emptyAttribute(),
  }
}

function nowIso(): string {
  return new Date().toISOString()
}

/** Factory for a new editable sheet with auto-seeded standard skills. */
export function createEmptyCharacter(): CharacterDocument {
  const timestamp = nowIso()
  return {
    schemaVersion: 1,
    system: 'pf2e',
    meta: {
      createdAt: timestamp,
      updatedAt: timestamp,
      preferredRuleset: 'remaster',
      appVersion: APP_VERSION,
      locale: 'en',
      characterId: newId(),
    },
    identity: {
      characterName: '',
      playerName: '',
      level: 1,
      xp: 0,
      ancestry: blankRef(),
      heritage: blankRef(),
      background: blankRef(),
      class: blankRef(),
      subclass: null,
      archetypes: [],
      size: 'medium',
      traits: [],
      languages: [],
      deity: null,
      homeRegion: '',
      alignment: null,
      edicts: '',
      anathema: '',
    },
    attributes: emptyAttributes(),
    proficiencies: {
      perception: { rank: 'trained', attribute: 'wis', modifiers: {} },
      fortitude: { rank: 'trained', attribute: 'con', modifiers: {} },
      reflex: { rank: 'trained', attribute: 'dex', modifiers: {} },
      will: { rank: 'trained', attribute: 'wis', modifiers: {} },
      classDC: { rank: 'trained', attribute: 'str', modifiers: {} },
      armor: {
        unarmored: 'trained',
        light: 'untrained',
        medium: 'untrained',
        heavy: 'untrained',
      },
      weapons: {
        unarmed: 'trained',
        simple: 'trained',
        martial: 'untrained',
        advanced: 'untrained',
        specific: [],
      },
    },
    vitals: {
      ancestryHp: 0,
      classHpPerLevel: 0,
      bonuses: [],
      currentHp: 0,
      temporaryHp: 0,
      dying: 0,
      wounded: 0,
      doomed: 0,
      resistances: [],
      immunities: [],
      weaknesses: [],
      speeds: [{ kind: 'land', feet: 25 }],
      senses: [],
    },
    armorClass: {
      equippedArmorItemId: null,
      equippedShieldItemId: null,
      shieldRaised: false,
      dexCapOverride: null,
      modifiers: {},
      notes: '',
    },
    skills: createStandardSkillEntries(),
    feats: [],
    features: [],
    actions: [],
    strikes: [],
    spellcasting: [],
    inventory: {
      currency: emptyCurrency(),
      items: [],
      bulkBonus: 0,
      notes: '',
    },
    companions: [],
    conditions: [],
    play: {
      heroPoints: 1,
      focusPool: 0,
      focusRemaining: 0,
      initiativeModifier: null,
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
