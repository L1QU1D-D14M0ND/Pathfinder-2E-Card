import type { CharacterDocument } from '../character/types'
import { attributeModifiers } from './attributes'
import { armorClassTotal } from './ac'
import {
  bulkCapacityTenths,
  bulkMaximumTenths,
  bulkUsedTenths,
  investedCount,
  tenthsToBulk,
} from './bulk'
import { rankedBonus, classDcValue } from './checks'
import { maxHp } from './hp'
import { applyOverrides } from './overrides'
import { skillTotals } from './skills'
import { allStrikeDerived } from './strikes'
import { spellcastingDerived } from './spellcasting'
import type { ComputeInput, DerivedView } from './types'

export function compute(character: ComputeInput): DerivedView {
  const attrs = attributeModifiers(character.attributes)
  const level = character.identity.level
  const bulkBonus = character.inventory.bulkBonus ?? 0

  const base: DerivedView = {
    attributeModifiers: attrs,
    maxHp: maxHp(character, attrs.con),
    ac: armorClassTotal(character, attrs.dex),
    perception: rankedBonus(character.proficiencies.perception, level, attrs),
    fortitude: rankedBonus(character.proficiencies.fortitude, level, attrs),
    reflex: rankedBonus(character.proficiencies.reflex, level, attrs),
    will: rankedBonus(character.proficiencies.will, level, attrs),
    classDC: classDcValue(character.proficiencies.classDC, level, attrs),
    skillTotals: skillTotals(character, attrs),
    bulkUsed: tenthsToBulk(bulkUsedTenths(character.inventory.items)),
    bulkCapacity: tenthsToBulk(bulkCapacityTenths(attrs.str, bulkBonus)),
    bulkMaximum: tenthsToBulk(bulkMaximumTenths(attrs.str, bulkBonus)),
    investedCount: investedCount(character.inventory.items),
    strikes: allStrikeDerived(character, attrs),
    spellcasting: spellcastingDerived(character.spellcasting, level, attrs),
    overriddenPaths: [],
    ignoredOverridePaths: [],
  }

  return applyOverrides(base, character.overrides)
}

export function computeCharacter(character: CharacterDocument): DerivedView {
  return compute(character)
}
