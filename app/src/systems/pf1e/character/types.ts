/**
 * Character document types aligned with schemas/pf1e/character.schema.json
 * (schemaVersion 1). Do not import PF2e character types here.
 */

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'
export type Size =
  | 'fine'
  | 'diminutive'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan'
  | 'colossal'
export type BabProgression = 'full' | 'threeQuarter' | 'half'
export type SaveQuality = 'good' | 'poor'
export type Alignment =
  | 'lawful good'
  | 'neutral good'
  | 'chaotic good'
  | 'lawful neutral'
  | 'neutral'
  | 'chaotic neutral'
  | 'lawful evil'
  | 'neutral evil'
  | 'chaotic evil'
export type ItemLocation = 'equipped' | 'carried' | 'stowed' | 'dropped'
export type LoadCategory = 'light' | 'medium' | 'heavy' | 'overloaded'

export interface PublicationRef {
  book?: string
  page?: number | null
}

export interface ContentRef {
  id: string | null
  name: string
  source?: PublicationRef
}

export interface Effect {
  type: string
  selector?: string
  mode?: 'add' | 'override' | 'downgrade' | 'upgrade' | 'remove' | 'note'
  value?: unknown
  predicate?: unknown[]
  label?: string
  [key: string]: unknown
}

export interface OverrideValue {
  value: unknown
  reason?: string
  updatedAt?: string
}

export interface Meta {
  createdAt: string
  updatedAt: string
  appVersion: string
  locale: string
  characterId?: string
}

export interface Identity {
  characterName: string
  playerName?: string
  race: ContentRef
  size: Size
  alignment?: Alignment | null
  deity?: string
  xp?: number
  languages?: ContentRef[]
}

export interface FavoredClassBonus {
  hp?: number
  skillRanks?: number
}

export interface ClassSaves {
  fort: SaveQuality
  ref: SaveQuality
  will: SaveQuality
}

export interface ClassEntry {
  id: string
  class: ContentRef
  levels: number
  hitDie: number
  babProgression: BabProgression
  saves: ClassSaves
  favored?: FavoredClassBonus
  prestige?: boolean
  notes?: string
  effects?: Effect[]
}

export interface AbilityBlock {
  score: number
  tempModifier?: number
}

export type Abilities = Record<AbilityKey, AbilityBlock>

export interface Vitals {
  hpRolled: number[]
  currentHp: number
  tempHp: number
  nonlethal?: number
  resistances?: Array<{ type: string; value: number; notes?: string }>
  immunities?: string[]
  weaknesses?: Array<{ type: string; value: number; notes?: string }>
  speeds?: Array<{ kind: string; feet: number; notes?: string }>
  senses?: Array<{ name: string; rangeFeet?: number | null; notes?: string }>
}

export interface ArmorClassInputs {
  armorBonus: number
  shieldBonus: number
  natural: number
  deflection: number
  dodge: number
  other: number
  maxDex: number | null
  armorCheckPenalty: number
  notes?: string
}

export interface CombatInputs {
  initiativeMisc: number
  meleeAttackMisc: number
  rangedAttackMisc: number
  cmbMisc: number
  cmdMisc: number
  fortMisc: number
  refMisc: number
  willMisc: number
}

export interface SkillEntry {
  key: string
  name: string
  ability: AbilityKey
  ranks: number
  classSkill: boolean
  armorPenaltyApplies: boolean
  misc?: number
  notes?: string
  effects?: Effect[]
}

export interface FeatEntry {
  id: string
  category: 'general' | 'combat' | 'metamagic' | 'itemCreation' | 'other'
  feat: ContentRef
  levelGained: number
  summary?: string
  effects?: Effect[]
}

export interface FeatureEntry {
  id: string
  feature: ContentRef
  levelGained: number
  summary?: string
  effects?: Effect[]
}

export interface AttackEntry {
  id: string
  name: string
  attackType: 'melee' | 'ranged'
  itemId?: string | null
  attackAbility?: AbilityKey
  damageAbility?: AbilityKey | null
  damageDice: string
  damageType: string
  critRange?: number
  critMultiplier?: number
  miscAttack?: number
  miscDamage?: number
  rangeFeet?: number | null
  notes?: string
  effects?: Effect[]
}

export interface SpellSlotLevel {
  spellLevel: number
  max: number
  remaining: number
}

export interface SpellListEntry {
  id: string
  spell: ContentRef
  spellLevel: number
  prepared?: boolean
  usesPerDay?: number | null
  usesRemaining?: number | null
  summary?: string
  effects?: Effect[]
}

export interface SpellcastingEntry {
  id: string
  name: string
  ability: AbilityKey
  classRowId?: string | null
  casterLevelOverride?: number | null
  slots: SpellSlotLevel[]
  cantrips: SpellListEntry[]
  spells: SpellListEntry[]
  notes?: string
  effects?: Effect[]
}

export interface Currency {
  cp: number
  sp: number
  gp: number
  pp: number
}

export interface ArmorItemStats {
  acBonus?: number
  maxDex?: number | null
  armorCheckPenalty?: number
  spellFailurePercent?: number
}

export interface WeaponItemStats {
  damageDice?: string
  damageType?: string
  critRange?: number
  critMultiplier?: number
  rangeFeet?: number | null
}

export interface ShieldItemStats {
  acBonus?: number
  armorCheckPenalty?: number
}

export interface ItemEntry {
  id: string
  item: ContentRef
  quantity: number
  pounds: number
  location: ItemLocation
  priceGp?: number | null
  armor?: ArmorItemStats
  weapon?: WeaponItemStats
  shield?: ShieldItemStats
  notes?: string
  effects?: Effect[]
}

export interface Inventory {
  currency: Currency
  items: ItemEntry[]
  notes?: string
}

export interface CompanionStub {
  id: string
  kind: 'animalCompanion' | 'familiar' | 'other'
  name: string
  notes?: string
}

export interface ConditionEntry {
  id: string
  condition: ContentRef
  value?: number | null
  duration?: string | null
  notes?: string
  effects?: Effect[]
}

export interface PlayState {
  dailyResources: Array<{
    id: string
    name: string
    max: number
    remaining: number
    resetsOn?: 'daily' | 'encounter' | 'other'
  }>
}

export interface Notes {
  appearance?: string
  personality?: string
  campaign?: string
  other?: string
}

export interface DerivedCache {
  level?: number
  abilityModifiers?: Partial<Record<AbilityKey, number>>
  bab?: number
  maxHp?: number
  ac?: number
  touchAc?: number
  flatFootedAc?: number
  cmb?: number
  cmd?: number
  initiative?: number
  fortitude?: number
  reflex?: number
  will?: number
  skillTotals?: Record<string, number>
  weightUsed?: number
  computedAt?: string
  [key: string]: unknown
}

export interface CharacterDocument {
  schemaVersion: 1
  system: 'pf1e'
  meta: Meta
  identity: Identity
  classes: ClassEntry[]
  abilities: Abilities
  vitals: Vitals
  armorClass: ArmorClassInputs
  combat: CombatInputs
  skills: SkillEntry[]
  feats: FeatEntry[]
  features: FeatureEntry[]
  attacks: AttackEntry[]
  spellcasting: SpellcastingEntry[]
  inventory: Inventory
  companions: CompanionStub[]
  conditions: ConditionEntry[]
  play: PlayState
  notes: Notes
  overrides: Record<string, OverrideValue>
  extensions: Record<string, unknown>
  derived?: DerivedCache
}
