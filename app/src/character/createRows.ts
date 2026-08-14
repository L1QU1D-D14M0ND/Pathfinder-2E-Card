import type { ItemEntry, StrikeEntry } from './types'

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createEmptyItem(): ItemEntry {
  return {
    id: newId(),
    item: { id: null, name: '', rulesetSource: 'custom' },
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
