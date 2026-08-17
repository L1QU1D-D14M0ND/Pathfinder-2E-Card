import type { CharacterDocument } from '../character/types'
import { abilityModifiers, sizeAcAttackModifier, sizeCmbModifier } from './abilities'
import { armorClassValues } from './ac'
import { loadCategory, loadThresholds, weightUsed } from './encumbrance'
import { applyOverrides } from './overrides'
import {
  characterLevel,
  iterativeAttacks,
  stackedBab,
  stackedSave,
} from './progressions'
import { spellcastingDerived } from './spellcasting'
import type { ComputeInput, DerivedView } from './types'
import {
  deadAtThreshold,
  defaultAttackAbility,
  maxHp,
  skillTotal,
} from './vitals'

export function compute(character: ComputeInput): DerivedView {
  const mods = abilityModifiers(character.abilities)
  const level = characterLevel(character.classes)
  const bab = stackedBab(character.classes)
  const size = character.identity.size
  const sizeAttack = sizeAcAttackModifier(size)
  const sizeCmb = sizeCmbModifier(size)
  const ac = armorClassValues(character.armorClass, mods.dex, size)
  const thresholds = loadThresholds(character.abilities.str.score, size)
  const carried = weightUsed(character.inventory.items)

  const skillTotals: Record<string, number> = {}
  for (const skill of character.skills) {
    skillTotals[skill.key] = skillTotal({
      ranks: skill.ranks,
      abilityMod: mods[skill.ability],
      classSkill: skill.classSkill,
      armorPenaltyApplies: skill.armorPenaltyApplies,
      armorCheckPenalty: character.armorClass.armorCheckPenalty,
      misc: skill.misc ?? 0,
    })
  }

  const meleeAttack = bab + mods.str + sizeAttack + character.combat.meleeAttackMisc
  const rangedAttack = bab + mods.dex + sizeAttack + character.combat.rangedAttackMisc
  const babIteratives = iterativeAttacks(bab)

  const attacks: DerivedView['attacks'] = {}
  for (const attack of character.attacks) {
    const atkKey = attack.attackAbility ?? defaultAttackAbility(attack.attackType)
    const dmgKey = attack.damageAbility === undefined
      ? defaultAttackAbility(attack.attackType)
      : attack.damageAbility
    const attackBonus =
      bab +
      mods[atkKey] +
      sizeAttack +
      (attack.miscAttack ?? 0) +
      (attack.attackType === 'melee'
        ? character.combat.meleeAttackMisc
        : character.combat.rangedAttackMisc)
    const abilityDamage = dmgKey === null ? 0 : mods[dmgKey]
    const dmgMod = abilityDamage + (attack.miscDamage ?? 0)
    const dmgSign = dmgMod === 0 ? '' : dmgMod > 0 ? `+${dmgMod}` : `${dmgMod}`
    attacks[attack.id] = {
      attack: attackBonus,
      damage: `${attack.damageDice}${dmgSign}`,
      iteratives: babIteratives.map((step) => step + attackBonus - bab),
    }
  }

  const base: DerivedView = {
    level,
    abilityModifiers: mods,
    bab,
    babIteratives,
    maxHp: maxHp(character.vitals, character.classes, mods.con),
    deadAt: deadAtThreshold(character.abilities.con.score),
    ac: ac.ac,
    touchAc: ac.touchAc,
    flatFootedAc: ac.flatFootedAc,
    cmb: bab + mods.str + sizeCmb + character.combat.cmbMisc,
    cmd:
      10 +
      bab +
      mods.str +
      mods.dex +
      sizeCmb +
      character.armorClass.dodge +
      character.armorClass.deflection +
      character.combat.cmdMisc,
    initiative: mods.dex + character.combat.initiativeMisc,
    fortitude: stackedSave(character.classes, 'fort') + mods.con + character.combat.fortMisc,
    reflex: stackedSave(character.classes, 'ref') + mods.dex + character.combat.refMisc,
    will: stackedSave(character.classes, 'will') + mods.wis + character.combat.willMisc,
    meleeAttack,
    rangedAttack,
    skillTotals,
    weightUsed: carried,
    lightLoad: thresholds.light,
    mediumLoad: thresholds.medium,
    heavyLoad: thresholds.heavy,
    loadCategory: loadCategory(carried, thresholds),
    attacks,
    spellcasting: spellcastingDerived(
      character.spellcasting,
      character.classes,
      {
        str: character.abilities.str.score,
        dex: character.abilities.dex.score,
        con: character.abilities.con.score,
        int: character.abilities.int.score,
        wis: character.abilities.wis.score,
        cha: character.abilities.cha.score,
      },
      mods,
    ),
    overriddenPaths: [],
    ignoredOverridePaths: [],
  }

  return applyOverrides(base, character.overrides)
}

export function computeCharacter(character: CharacterDocument): DerivedView {
  return compute(character)
}
