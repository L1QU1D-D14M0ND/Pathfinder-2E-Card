import {
  createEmptyItem,
  DEFAULT_ARMOR,
  DEFAULT_SHIELD,
  DEFAULT_WEAPON,
  type CharacterDocument,
} from '../character'
import type { DerivedView } from '../engine'
import { DerivedCell } from './DerivedCell'

const LOCATIONS = ['worn', 'readied', 'stowed', 'other'] as const
const ARMOR_CATS = ['unarmored', 'light', 'medium', 'heavy'] as const
const WEAPON_CATS = ['unarmed', 'simple', 'martial', 'advanced', 'other'] as const

type Update = (mutator: (c: CharacterDocument) => CharacterDocument) => void

export function InventoryPanel({
  character,
  derived,
  update,
}: {
  character: CharacterDocument
  derived: DerivedView
  update: Update
}) {
  return (
    <div className="panel-stack">
      <table className="sheet-table">
        <tbody>
          {(['cp', 'sp', 'gp', 'pp'] as const).map((coin) => (
            <tr key={coin}>
              <th>{coin.toUpperCase()}</th>
              <td>
                <input
                  type="number"
                  value={character.inventory.currency[coin]}
                  onChange={(e) =>
                    update((c) => ({
                      ...c,
                      inventory: {
                        ...c.inventory,
                        currency: {
                          ...c.inventory.currency,
                          [coin]: Number(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <th>Bulk used / capacity</th>
            <td>
              <DerivedCell
                value={`${derived.bulkUsed} / ${derived.bulkCapacity} (max ${derived.bulkMaximum})`}
                overridden={
                  derived.overriddenPaths.includes('derived.bulkUsed') ||
                  derived.overriddenPaths.includes('derived.bulkCapacity')
                }
              />
            </td>
          </tr>
          <tr>
            <th>Invested</th>
            <td>
              <DerivedCell
                value={`${derived.investedCount} / 10`}
                overridden={derived.overriddenPaths.includes(
                  'derived.investedCount',
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Items</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              inventory: {
                ...c.inventory,
                items: [...c.inventory.items, createEmptyItem()],
              },
            }))
          }
        >
          Add item
        </button>
      </div>

      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Bulk</th>
            <th>Location</th>
            <th>Eq</th>
            <th>Inv</th>
            <th>Armor</th>
            <th>Weapon</th>
            <th>Shield</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.inventory.items.length === 0 ? (
            <tr>
              <td colSpan={10} className="muted">
                No items yet. Bulk uses decimals (0.1 = 1L).
              </td>
            </tr>
          ) : (
            character.inventory.items.map((item, index) => (
              <ItemRows
                key={item.id}
                character={character}
                index={index}
                update={update}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function ItemRows({
  character,
  index,
  update,
}: {
  character: CharacterDocument
  index: number
  update: Update
}) {
  const item = character.inventory.items[index]

  function patchItem(patch: Partial<typeof item>) {
    update((c) => {
      const items = [...c.inventory.items]
      const next = { ...items[index], ...patch }
      items[index] = next
      let armorClass = c.armorClass
      if (patch.equipped === true && next.armor) {
        armorClass = { ...armorClass, equippedArmorItemId: next.id }
      }
      if (patch.equipped === false && c.armorClass.equippedArmorItemId === next.id) {
        armorClass = { ...armorClass, equippedArmorItemId: null }
      }
      if (patch.equipped === true && next.shield) {
        armorClass = { ...armorClass, equippedShieldItemId: next.id }
      }
      if (patch.equipped === false && c.armorClass.equippedShieldItemId === next.id) {
        armorClass = { ...armorClass, equippedShieldItemId: null }
      }
      return {
        ...c,
        armorClass,
        inventory: { ...c.inventory, items },
      }
    })
  }

  return (
    <>
      <tr>
        <td>
          <input
            value={item.item.name}
            onChange={(e) =>
              patchItem({ item: { ...item.item, name: e.target.value } })
            }
          />
        </td>
        <td>
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) =>
              patchItem({ quantity: Math.max(0, Number(e.target.value) || 0) })
            }
          />
        </td>
        <td>
          <input
            type="number"
            step={0.1}
            value={item.bulk}
            onChange={(e) => patchItem({ bulk: Number(e.target.value) || 0 })}
          />
        </td>
        <td>
          <select
            value={item.location}
            onChange={(e) =>
              patchItem({
                location: e.target.value as (typeof LOCATIONS)[number],
              })
            }
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="checkbox"
            checked={item.equipped}
            onChange={(e) => patchItem({ equipped: e.target.checked })}
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={item.invested}
            onChange={(e) => patchItem({ invested: e.target.checked })}
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={Boolean(item.armor)}
            onChange={(e) =>
              patchItem({ armor: e.target.checked ? { ...DEFAULT_ARMOR } : undefined })
            }
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={Boolean(item.weapon)}
            onChange={(e) =>
              patchItem({
                weapon: e.target.checked ? { ...DEFAULT_WEAPON } : undefined,
              })
            }
          />
        </td>
        <td>
          <input
            type="checkbox"
            checked={Boolean(item.shield)}
            onChange={(e) =>
              patchItem({
                shield: e.target.checked ? { ...DEFAULT_SHIELD } : undefined,
              })
            }
          />
        </td>
        <td>
          <button
            type="button"
            onClick={() =>
              update((c) => ({
                ...c,
                armorClass: {
                  ...c.armorClass,
                  equippedArmorItemId:
                    c.armorClass.equippedArmorItemId === item.id
                      ? null
                      : c.armorClass.equippedArmorItemId,
                  equippedShieldItemId:
                    c.armorClass.equippedShieldItemId === item.id
                      ? null
                      : c.armorClass.equippedShieldItemId,
                },
                inventory: {
                  ...c.inventory,
                  items: c.inventory.items.filter((row) => row.id !== item.id),
                },
              }))
            }
          >
            Remove
          </button>
        </td>
      </tr>
      {item.armor ? (
        <tr>
          <td colSpan={10} className="nested-stats">
            Armor:
            <label>
              Cat
              <select
                value={item.armor.category}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      category: e.target.value as (typeof ARMOR_CATS)[number],
                    },
                  })
                }
              >
                {ARMOR_CATS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label>
              AC
              <input
                type="number"
                value={item.armor.acBonus}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      acBonus: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </label>
            <label>
              Dex cap
              <input
                type="number"
                value={item.armor.dexCap ?? ''}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      dexCap:
                        e.target.value === '' ? null : Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label>
              Str
              <input
                type="number"
                value={item.armor.strength ?? ''}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      strength:
                        e.target.value === '' ? null : Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label>
              Check
              <input
                type="number"
                value={item.armor.checkPenalty}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      checkPenalty: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </label>
            <label>
              Potency
              <input
                type="number"
                min={0}
                value={item.armor.potencyRune ?? 0}
                onChange={(e) =>
                  patchItem({
                    armor: {
                      ...item.armor!,
                      potencyRune: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
              />
            </label>
          </td>
        </tr>
      ) : null}
      {item.weapon ? (
        <tr>
          <td colSpan={10} className="nested-stats">
            Weapon:
            <label>
              Cat
              <select
                value={item.weapon.category}
                onChange={(e) =>
                  patchItem({
                    weapon: {
                      ...item.weapon!,
                      category: e.target.value as (typeof WEAPON_CATS)[number],
                    },
                  })
                }
              >
                {WEAPON_CATS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Dice
              <input
                value={item.weapon.damageDice}
                onChange={(e) =>
                  patchItem({
                    weapon: { ...item.weapon!, damageDice: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Type
              <input
                value={item.weapon.damageType}
                onChange={(e) =>
                  patchItem({
                    weapon: { ...item.weapon!, damageType: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Potency
              <input
                type="number"
                min={0}
                value={item.weapon.potencyRune ?? 0}
                onChange={(e) =>
                  patchItem({
                    weapon: {
                      ...item.weapon!,
                      potencyRune: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
              />
            </label>
          </td>
        </tr>
      ) : null}
      {item.shield ? (
        <tr>
          <td colSpan={10} className="nested-stats">
            Shield:
            <label>
              AC
              <input
                type="number"
                value={item.shield.acBonus}
                onChange={(e) =>
                  patchItem({
                    shield: {
                      ...item.shield!,
                      acBonus: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </label>
            <label>
              HP
              <input
                type="number"
                min={0}
                value={item.shield.hp}
                onChange={(e) =>
                  patchItem({
                    shield: {
                      ...item.shield!,
                      hp: Math.max(0, Number(e.target.value) || 0),
                    },
                  })
                }
              />
            </label>
          </td>
        </tr>
      ) : null}
    </>
  )
}
