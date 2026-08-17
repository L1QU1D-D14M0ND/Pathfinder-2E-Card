import { createEmptyItem, type CharacterDocument } from '../character'
import type { ItemLocation } from '../character/types'
import type { DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { SheetUpdate } from './update'

const LOCATIONS: ItemLocation[] = ['equipped', 'carried', 'stowed', 'dropped']

export function InventoryPanel({
  character,
  derived,
  update,
}: {
  character: CharacterDocument
  derived: DerivedView
  update: SheetUpdate
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
                  min={0}
                  value={character.inventory.currency[coin]}
                  onChange={(e) =>
                    update((c) => ({
                      ...c,
                      inventory: {
                        ...c.inventory,
                        currency: {
                          ...c.inventory.currency,
                          [coin]: Math.max(0, Number(e.target.value) || 0),
                        },
                      },
                    }))
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <th>Weight / load</th>
            <td>
              <DerivedCell
                value={`${derived.weightUsed} lb · ${derived.loadCategory} (L ${derived.lightLoad} / M ${derived.mediumLoad} / H ${derived.heavyLoad})`}
                overridden={derived.overriddenPaths.includes(
                  'derived.weightUsed',
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
            <th>Lb</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.inventory.items.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                No items. Pounds count unless location is dropped.
              </td>
            </tr>
          ) : (
            character.inventory.items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    value={item.item.name}
                    onChange={(e) =>
                      update((c) => {
                        const items = [...c.inventory.items]
                        items[index] = {
                          ...items[index],
                          item: { ...items[index].item, name: e.target.value },
                        }
                        return {
                          ...c,
                          inventory: { ...c.inventory, items },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      update((c) => {
                        const items = [...c.inventory.items]
                        items[index] = {
                          ...items[index],
                          quantity: Math.max(0, Number(e.target.value) || 0),
                        }
                        return {
                          ...c,
                          inventory: { ...c.inventory, items },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={item.pounds}
                    onChange={(e) =>
                      update((c) => {
                        const items = [...c.inventory.items]
                        items[index] = {
                          ...items[index],
                          pounds: Math.max(0, Number(e.target.value) || 0),
                        }
                        return {
                          ...c,
                          inventory: { ...c.inventory, items },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={item.location}
                    onChange={(e) =>
                      update((c) => {
                        const items = [...c.inventory.items]
                        items[index] = {
                          ...items[index],
                          location: e.target.value as ItemLocation,
                        }
                        return {
                          ...c,
                          inventory: { ...c.inventory, items },
                        }
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
                  <button
                    type="button"
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        inventory: {
                          ...c.inventory,
                          items: c.inventory.items.filter(
                            (row) => row.id !== item.id,
                          ),
                        },
                      }))
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
