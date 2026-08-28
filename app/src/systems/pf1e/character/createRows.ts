import { newId } from '../../../shared/ids'
import type {
  AttackEntry,
  ClassEntry,
  CompanionStub,
  ConditionEntry,
  ContentRef,
  EvolutionEntry,
  FeatEntry,
  FeatureEntry,
  ItemEntry,
  SpellListEntry,
  SpellcastingEntry,
} from './types'

export { newId }

export function blankRef(): ContentRef {
  return { id: null, name: '' }
}

export function createEmptyClass(): ClassEntry {
  return {
    id: newId(),
    class: blankRef(),
    levels: 1,
    hitDie: 8,
    babProgression: 'threeQuarter',
    saves: { fort: 'poor', ref: 'poor', will: 'poor' },
    favored: { hp: 0, skillRanks: 0 },
  }
}

export function createEmptyItem(): ItemEntry {
  return {
    id: newId(),
    item: blankRef(),
    quantity: 1,
    pounds: 0,
    location: 'carried',
  }
}

export function createEmptyAttack(): AttackEntry {
  return {
    id: newId(),
    name: '',
    attackType: 'melee',
    itemId: null,
    attackAbility: 'str',
    damageAbility: 'str',
    damageDice: '1d8',
    damageType: 'slashing',
    critRange: 20,
    critMultiplier: 2,
    miscAttack: 0,
    miscDamage: 0,
    rangeFeet: null,
  }
}

export function createEmptyFeat(): FeatEntry {
  return {
    id: newId(),
    category: 'combat',
    feat: blankRef(),
    levelGained: 1,
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

export function createEmptyCondition(): ConditionEntry {
  return {
    id: newId(),
    condition: blankRef(),
    value: null,
    duration: null,
    notes: '',
  }
}

export function createEmptyEvolution(): EvolutionEntry {
  return {
    id: newId(),
    evolution: blankRef(),
  }
}

export function createEmptyEidolon(): CompanionStub {
  return {
    id: newId(),
    kind: 'eidolon',
    name: '',
    fused: {
      active: false,
      str: 10,
      dex: 10,
      con: 10,
      costumeHp: 0,
    },
    evolutions: [],
  }
}

export function ensureEidolonCompanion(
  companions: CompanionStub[],
): CompanionStub[] {
  if (companions.some((row) => row.kind === 'eidolon')) return companions
  return [...companions, createEmptyEidolon()]
}

export function createEmptyDailyResource() {
  return {
    id: newId(),
    name: '',
    max: 0,
    remaining: 0,
    resetsOn: 'daily' as const,
  }
}

export function createEmptySpellListEntry(spellLevel = 0): SpellListEntry {
  return {
    id: newId(),
    spell: blankRef(),
    spellLevel,
    prepared: false,
    usesPerDay: null,
    usesRemaining: null,
    summary: '',
  }
}

export function createEmptySpellcasting(): SpellcastingEntry {
  return {
    id: newId(),
    name: 'Spellcasting',
    ability: 'int',
    classRowId: null,
    casterLevelOverride: null,
    slots: Array.from({ length: 10 }, (_, i) => ({
      spellLevel: i,
      max: null,
      remaining: 0,
    })),
    cantrips: [],
    spells: [],
  }
}

export function skillKeyFromName(name: string, prefix: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${prefix}-${slug || 'custom'}`
}
