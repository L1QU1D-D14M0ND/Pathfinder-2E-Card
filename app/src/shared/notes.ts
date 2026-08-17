export interface Notes {
  appearance?: string
  personality?: string
  campaign?: string
  other?: string
}

export const NOTE_KEYS = [
  'appearance',
  'personality',
  'campaign',
  'other',
] as const satisfies ReadonlyArray<keyof Notes>
