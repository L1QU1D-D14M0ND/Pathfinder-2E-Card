import type { AttributeBlock, AttributeKey, Attributes } from '../character/types'
import { emptyAttributeModifiers } from './types'

/** Remaster 0.9: modifier is the sum of user-entered boost amounts. */
export function attributeModifierFromBlock(block: AttributeBlock): number {
  if (block.modifierOverride != null) return block.modifierOverride
  return block.boosts.reduce((sum, boost) => sum + boost.amount, 0)
}

export function attributeModifiers(
  attributes: Attributes,
): Record<AttributeKey, number> {
  const result = emptyAttributeModifiers()
  ;(Object.keys(result) as AttributeKey[]).forEach((key) => {
    result[key] = attributeModifierFromBlock(attributes[key])
  })
  return result
}
