export interface PublicationRef {
  book?: string
  page?: number | null
  rarity?: 'common' | 'uncommon' | 'rare' | 'unique'
}

/** Core catalog pointer. Systems may extend (PF2e adds rulesetSource / legacyId). */
export interface ContentRef {
  id: string | null
  name: string
  source?: PublicationRef
}
