export interface Effect {
  type: string
  selector?: string
  mode?: 'add' | 'override' | 'downgrade' | 'upgrade' | 'remove' | 'note'
  value?: unknown
  predicate?: unknown[]
  label?: string
  [key: string]: unknown
}
