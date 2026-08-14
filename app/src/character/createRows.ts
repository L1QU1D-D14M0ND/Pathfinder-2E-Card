import type {
  ActionEntry,
  ConditionEntry,
  ContentRef,
  FeatEntry,
  FeatureEntry,
  ItemEntry,
  SpellListEntry,
  SpellcastingEntry,
  StrikeEntry,
} from './types'

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function blankRef(): ContentRef {
  return { id: null, name: '', rulesetSource: 'custom' }
}

export function createEmptyItem(): ItemEntry {
  return {
    id: newId(),
    item: blankRef(),
    quantity: 1,
    bulk: 0,
    location: 'stowed',
    invested: false,
    equipped: false,
    containerId: null,
  }
}

export function createEmptyStrike(): StrikeEntry {
  return {
    id: newId(),
    name: '',
    strikeType: 'melee',
    weaponCategory: 'martial',
    itemId: null,
    attackAttribute: 'str',
    damageAttribute: 'str',
    damageDice: '1d8',
    damageType: 'slashing',
    traits: [],
    rangeFeet: null,
    modifiers: {},
  }
}

export function createEmptySpellListEntry(rank = 0): SpellListEntry {
  return {
    id: newId(),
    spell: blankRef(),
    rank,
    prepared: false,
    signature: false,
    usesPerDay: null,
    usesRemaining: null,
    traits: [],
    summary: '',
  }
}

export function createEmptySpellcasting(): SpellcastingEntry {
  return {
    id: newId(),
    name: 'Spellcasting',
    tradition: 'arcane',
    castType: 'prepared',
    attribute: 'int',
    proficiency: { rank: 'trained', attribute: 'int', modifiers: {} },
    slots: Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      max: 0,
      remaining: 0,
    })),
    cantrips: [],
    spells: [],
    focusSpells: [],
    innateSpells: [],
    rituals: [],
  }
}

export function createEmptyFeat(): FeatEntry {
  return {
    id: newId(),
    category: 'class',
    feat: blankRef(),
    levelGained: 1,
    traits: [],
    summary: '',
  }
}

export function createEmptyFeature(): FeatureEntry {
  return {
    id: newId(),
    feature: blankRef(),
    levelGained: 1,
    summary: '',
  }
}

export function createEmptyAction(): ActionEntry {
  return {
    id: newId(),
    name: '',
    actionType: 'action',
    actionCost: 1,
    traits: [],
    frequency: '',
    summary: '',
    sourceFeatId: null,
  }
}

export function createEmptyCondition(): ConditionEntry {
  return {
    id: newId(),
    condition: blankRef(),
    value: null,
    duration: '',
    notes: '',
  }
}

export function createEmptyDailyResource(): {
  id: string
  name: string
  max: number
  remaining: number
  resetsOn: 'daily' | 'encounter' | 'refocus' | 'other'
} {
  return {
    id: newId(),
    name: '',
    max: 1,
    remaining: 1,
    resetsOn: 'daily',
  }
}

export const DEFAULT_ARMOR = {
  category: 'medium' as const,
  acBonus: 0,
  dexCap: null,
  checkPenalty: 0,
  speedPenalty: 0,
  strength: null,
  potencyRune: 0,
  resilientRune: 'none' as const,
  propertyRunes: [] as string[],
}

export const DEFAULT_WEAPON = {
  category: 'martial' as const,
  group: '',
  damageDice: '1d8',
  damageType: 'slashing',
  potencyRune: 0,
  strikingRune: 'none' as const,
  propertyRunes: [] as string[],
}

export const DEFAULT_SHIELD = {
  acBonus: 2,
  speedPenalty: 0,
  hardness: 5,
  maxHp: 20,
  brokenThreshold: 10,
  hp: 20,
}
