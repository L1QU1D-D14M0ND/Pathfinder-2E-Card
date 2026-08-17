import {
  createEmptyAttack,
  type CharacterDocument,
} from '../character'
import { signed, type DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { SheetUpdate } from './update'

export function CombatPanel({
  character,
  derived,
  update,
}: {
  character: CharacterDocument
  derived: DerivedView
  update: SheetUpdate
}) {
  const ac = character.armorClass
  const combat = character.combat

  function setAc<K extends keyof typeof ac>(key: K, value: (typeof ac)[K]) {
    update((c) => ({
      ...c,
      armorClass: { ...c.armorClass, [key]: value },
    }))
  }

  function setCombat<K extends keyof typeof combat>(
    key: K,
    value: (typeof combat)[K],
  ) {
    update((c) => ({
      ...c,
      combat: { ...c.combat, [key]: value },
    }))
  }

  return (
    <div className="panel-stack">
      <table className="sheet-table">
        <tbody>
          <tr>
            <th>BAB / iteratives</th>
            <td>
              <DerivedCell
                value={`${signed(derived.bab)} (${derived.babIteratives
                  .map(signed)
                  .join('/')})`}
                overridden={derived.overriddenPaths.includes('derived.bab')}
              />
            </td>
          </tr>
          <tr>
            <th>Melee / ranged</th>
            <td>
              <DerivedCell
                value={`${signed(derived.meleeAttack)} / ${signed(derived.rangedAttack)}`}
                overridden={
                  derived.overriddenPaths.includes('derived.meleeAttack') ||
                  derived.overriddenPaths.includes('derived.rangedAttack')
                }
              />
            </td>
          </tr>
          <tr>
            <th>AC / touch / FF</th>
            <td>
              <DerivedCell
                value={`${derived.ac} / ${derived.touchAc} / ${derived.flatFootedAc}`}
                overridden={derived.overriddenPaths.includes('derived.ac')}
              />
            </td>
          </tr>
          <tr>
            <th>CMB / CMD</th>
            <td>
              <DerivedCell
                value={`${signed(derived.cmb)} / ${derived.cmd}`}
                overridden={
                  derived.overriddenPaths.includes('derived.cmb') ||
                  derived.overriddenPaths.includes('derived.cmd')
                }
              />
            </td>
          </tr>
          <tr>
            <th>Fort / Ref / Will</th>
            <td>
              <DerivedCell
                value={`${signed(derived.fortitude)} / ${signed(derived.reflex)} / ${signed(derived.will)}`}
                overridden={derived.overriddenPaths.includes('derived.fortitude')}
              />
            </td>
          </tr>
          <tr>
            <th>Initiative</th>
            <td>
              <DerivedCell
                value={signed(derived.initiative)}
                overridden={derived.overriddenPaths.includes(
                  'derived.initiative',
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="sheet-table">
        <thead>
          <tr>
            <th>AC inputs</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {(
            [
              ['Armor bonus', 'armorBonus'],
              ['Shield bonus', 'shieldBonus'],
              ['Natural', 'natural'],
              ['Deflection', 'deflection'],
              ['Dodge', 'dodge'],
              ['Other', 'other'],
              ['ACP (≤ 0)', 'armorCheckPenalty'],
            ] as const
          ).map(([label, key]) => (
            <tr key={key}>
              <th>{label}</th>
              <td>
                <input
                  type="number"
                  value={ac[key]}
                  onChange={(e) =>
                    setAc(
                      key,
                      key === 'armorCheckPenalty'
                        ? Math.min(0, Number(e.target.value) || 0)
                        : Number(e.target.value) || 0,
                    )
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <th>Max Dex (blank = none)</th>
            <td>
              <input
                type="number"
                value={ac.maxDex ?? ''}
                onChange={(e) =>
                  setAc(
                    'maxDex',
                    e.target.value === '' ? null : Number(e.target.value) || 0,
                  )
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="sheet-table">
        <thead>
          <tr>
            <th>Misc combat</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {(
            [
              ['Initiative misc', 'initiativeMisc'],
              ['Melee misc', 'meleeAttackMisc'],
              ['Ranged misc', 'rangedAttackMisc'],
              ['CMB misc', 'cmbMisc'],
              ['CMD misc', 'cmdMisc'],
              ['Fort misc', 'fortMisc'],
              ['Ref misc', 'refMisc'],
              ['Will misc', 'willMisc'],
            ] as const
          ).map(([label, key]) => (
            <tr key={key}>
              <th>{label}</th>
              <td>
                <input
                  type="number"
                  value={combat[key]}
                  onChange={(e) =>
                    setCombat(key, Number(e.target.value) || 0)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Attacks</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              attacks: [...c.attacks, createEmptyAttack()],
            }))
          }
        >
          Add attack
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Dice</th>
            <th>Type</th>
            <th>Misc atk</th>
            <th>Attack</th>
            <th>Damage</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.attacks.length === 0 ? (
            <tr>
              <td colSpan={8} className="muted">
                No attacks. Add a longsword snapshot to match the Fighter golden.
              </td>
            </tr>
          ) : (
            character.attacks.map((row, index) => {
              const derivedAttack = derived.attacks[row.id]
              return (
                <tr key={row.id}>
                  <td>
                    <input
                      value={row.name}
                      onChange={(e) =>
                        update((c) => {
                          const attacks = [...c.attacks]
                          attacks[index] = {
                            ...attacks[index],
                            name: e.target.value,
                          }
                          return { ...c, attacks }
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={row.attackType}
                      onChange={(e) =>
                        update((c) => {
                          const attacks = [...c.attacks]
                          attacks[index] = {
                            ...attacks[index],
                            attackType: e.target.value as 'melee' | 'ranged',
                          }
                          return { ...c, attacks }
                        })
                      }
                    >
                      <option value="melee">melee</option>
                      <option value="ranged">ranged</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={row.damageDice}
                      onChange={(e) =>
                        update((c) => {
                          const attacks = [...c.attacks]
                          attacks[index] = {
                            ...attacks[index],
                            damageDice: e.target.value,
                          }
                          return { ...c, attacks }
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.damageType}
                      onChange={(e) =>
                        update((c) => {
                          const attacks = [...c.attacks]
                          attacks[index] = {
                            ...attacks[index],
                            damageType: e.target.value,
                          }
                          return { ...c, attacks }
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.miscAttack ?? 0}
                      onChange={(e) =>
                        update((c) => {
                          const attacks = [...c.attacks]
                          attacks[index] = {
                            ...attacks[index],
                            miscAttack: Number(e.target.value) || 0,
                          }
                          return { ...c, attacks }
                        })
                      }
                    />
                  </td>
                  <td>
                    <DerivedCell
                      value={
                        derivedAttack
                          ? signed(derivedAttack.attack)
                          : '—'
                      }
                      overridden={derived.overriddenPaths.includes(
                        `derived.attacks.${row.id}.attack`,
                      )}
                    />
                  </td>
                  <td>
                    <DerivedCell value={derivedAttack?.damage ?? '—'} />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        update((c) => ({
                          ...c,
                          attacks: c.attacks.filter((item) => item.id !== row.id),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
