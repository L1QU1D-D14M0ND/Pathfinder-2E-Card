import { describe, expect, it } from 'vitest'
import { createEmptyCharacter } from '../character/createEmptyCharacter'
import type { Size } from '../character/types'
import { parseCharacterJson } from '../character/saveLoad'
import {
  sizeAcAttackModifier,
  sizeCarryMultiplier,
  sizeCmbModifier,
} from './abilities'
import { compute } from './compute'
import { loadThresholds } from './encumbrance'
import { readRepoFile } from '../../../test/readRepoFile'

/** CRB size modifier to AC and attack rolls. */
const AC_ATTACK_BY_SIZE: Record<Size, number> = {
  fine: 8,
  diminutive: 4,
  tiny: 2,
  small: 1,
  medium: 0,
  large: -1,
  huge: -2,
  gargantuan: -4,
  colossal: -8,
}

/** CRB carrying-capacity multiplier vs a Medium creature. */
const CARRY_BY_SIZE: Record<Size, number> = {
  fine: 1 / 8,
  diminutive: 1 / 4,
  tiny: 1 / 2,
  small: 3 / 4,
  medium: 1,
  large: 2,
  huge: 4,
  gargantuan: 8,
  colossal: 16,
}

const ALL_SIZES = Object.keys(AC_ATTACK_BY_SIZE) as Size[]

describe('CRB batch 5: size modifier to AC and attack', () => {
  it('matches the CRB AC/attack size table', () => {
    for (const size of ALL_SIZES) {
      expect(sizeAcAttackModifier(size)).toBe(AC_ATTACK_BY_SIZE[size])
    }
  })

  it('uses the opposite sign as the special CMB/CMD size modifier', () => {
    for (const size of ALL_SIZES) {
      expect(sizeCmbModifier(size)).toBe(-sizeAcAttackModifier(size))
      expect(sizeCmbModifier(size)).toBe(-AC_ATTACK_BY_SIZE[size])
    }
  })

  it('adds +1 AC/attack and −1 CMB/CMD when Small; Large is the inverse', () => {
    const medium = compute(createEmptyCharacter())
    const smallSheet = createEmptyCharacter()
    smallSheet.identity.size = 'small'
    const largeSheet = createEmptyCharacter()
    largeSheet.identity.size = 'large'
    const small = compute(smallSheet)
    const large = compute(largeSheet)

    expect(medium.ac).toBe(10)
    expect(medium.touchAc).toBe(10)
    expect(medium.flatFootedAc).toBe(10)
    expect(medium.meleeAttack).toBe(0)
    expect(medium.rangedAttack).toBe(0)
    expect(medium.cmb).toBe(0)
    expect(medium.cmd).toBe(10)

    expect(small.ac).toBe(11)
    expect(small.touchAc).toBe(11)
    expect(small.flatFootedAc).toBe(11)
    expect(small.meleeAttack).toBe(1)
    expect(small.rangedAttack).toBe(1)
    expect(small.cmb).toBe(-1)
    expect(small.cmd).toBe(9)

    expect(large.ac).toBe(9)
    expect(large.touchAc).toBe(9)
    expect(large.flatFootedAc).toBe(9)
    expect(large.meleeAttack).toBe(-1)
    expect(large.rangedAttack).toBe(-1)
    expect(large.cmb).toBe(1)
    expect(large.cmd).toBe(11)
  })

  it('leaves the Medium goldens at size modifier 0', () => {
    const fighter = parseCharacterJson(
      readRepoFile('fixtures/characters/golden/pf1e/fighter-5.json'),
    )
    expect(fighter.identity.size).toBe('medium')
    const view = compute(fighter)
    expect(view.ac).toBe(18)
    expect(view.meleeAttack).toBe(view.bab + view.abilityModifiers.str)
    expect(view.cmb).toBe(view.bab + view.abilityModifiers.str)
  })
})

describe('CRB batch 5: carrying-capacity size multiplier', () => {
  it('matches the CRB Medium-relative carry table', () => {
    for (const size of ALL_SIZES) {
      expect(sizeCarryMultiplier(size)).toBe(CARRY_BY_SIZE[size])
    }
  })

  it('scales heavy load ×3/4 when Small and ×2 when Large', () => {
    const medium = loadThresholds(10, 'medium')
    const small = loadThresholds(10, 'small')
    const large = loadThresholds(10, 'large')
    expect(small.heavy).toBe(Math.floor(medium.heavy * (3 / 4)))
    expect(large.heavy).toBe(medium.heavy * 2)
  })
})
