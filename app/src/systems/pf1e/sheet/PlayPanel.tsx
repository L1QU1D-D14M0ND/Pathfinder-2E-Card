import {
  createEmptyCondition,
  createEmptyDailyResource,
  type CharacterDocument,
} from '../character'
import type { DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { SheetUpdate } from './update'

const RESETS = ['daily', 'encounter', 'other'] as const

export function PlayPanel({
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
          <tr>
            <th>Current HP</th>
            <td>
              <input
                type="number"
                value={character.vitals.currentHp}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    vitals: {
                      ...c.vitals,
                      currentHp: Number(e.target.value) || 0,
                    },
                  }))
                }
              />
              <span className="muted"> may be negative</span>
            </td>
          </tr>
          <tr>
            <th>Max HP</th>
            <td>
              <DerivedCell
                value={derived.maxHp}
                overridden={derived.overriddenPaths.includes('derived.maxHp')}
              />
            </td>
          </tr>
          <tr>
            <th>Temp HP</th>
            <td>
              <input
                type="number"
                min={0}
                value={character.vitals.tempHp}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    vitals: {
                      ...c.vitals,
                      tempHp: Math.max(0, Number(e.target.value) || 0),
                    },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Nonlethal</th>
            <td>
              <input
                type="number"
                min={0}
                value={character.vitals.nonlethal ?? 0}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    vitals: {
                      ...c.vitals,
                      nonlethal: Math.max(0, Number(e.target.value) || 0),
                    },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Dead at</th>
            <td>
              <DerivedCell
                value={derived.deadAt}
                overridden={derived.overriddenPaths.includes('derived.deadAt')}
              />
              <span className="muted"> −Constitution score</span>
            </td>
          </tr>
          <tr>
            <th>HD rolls</th>
            <td>
              <input
                value={character.vitals.hpRolled.join(', ')}
                onChange={(e) => {
                  const hpRolled = e.target.value
                    .split(/[,\s]+/)
                    .map((part) => part.trim())
                    .filter((part) => part.length > 0)
                    .map((part) => Number(part))
                    .filter((n) => Number.isFinite(n))
                  update((c) => ({
                    ...c,
                    vitals: { ...c.vitals, hpRolled },
                  }))
                }}
              />
              <div className="muted">
                Comma-separated die results before Con (e.g. 10, 6, 6, 6, 6)
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Conditions</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              conditions: [...c.conditions, createEmptyCondition()],
            }))
          }
        >
          Add condition
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.conditions.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No conditions.
              </td>
            </tr>
          ) : (
            character.conditions.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    value={row.condition.name}
                    onChange={(e) =>
                      update((c) => {
                        const conditions = [...c.conditions]
                        conditions[index] = {
                          ...conditions[index],
                          condition: {
                            ...conditions[index].condition,
                            name: e.target.value,
                          },
                        }
                        return { ...c, conditions }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.value ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const conditions = [...c.conditions]
                        conditions[index] = {
                          ...conditions[index],
                          value:
                            e.target.value === ''
                              ? null
                              : Number(e.target.value) || 0,
                        }
                        return { ...c, conditions }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    value={row.duration ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const conditions = [...c.conditions]
                        conditions[index] = {
                          ...conditions[index],
                          duration: e.target.value,
                        }
                        return { ...c, conditions }
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
                        conditions: c.conditions.filter(
                          (item) => item.id !== row.id,
                        ),
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

      <div className="table-toolbar">
        <strong>Daily resources</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              play: {
                ...c.play,
                dailyResources: [
                  ...c.play.dailyResources,
                  createEmptyDailyResource(),
                ],
              },
            }))
          }
        >
          Add resource
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Max</th>
            <th>Left</th>
            <th>Resets</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.play.dailyResources.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                Rage, channel, and similar trackers.
              </td>
            </tr>
          ) : (
            character.play.dailyResources.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    value={row.name}
                    onChange={(e) =>
                      update((c) => {
                        const dailyResources = [...c.play.dailyResources]
                        dailyResources[index] = {
                          ...dailyResources[index],
                          name: e.target.value,
                        }
                        return {
                          ...c,
                          play: { ...c.play, dailyResources },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={row.max}
                    onChange={(e) =>
                      update((c) => {
                        const dailyResources = [...c.play.dailyResources]
                        dailyResources[index] = {
                          ...dailyResources[index],
                          max: Math.max(0, Number(e.target.value) || 0),
                        }
                        return {
                          ...c,
                          play: { ...c.play, dailyResources },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={row.remaining}
                    onChange={(e) =>
                      update((c) => {
                        const dailyResources = [...c.play.dailyResources]
                        dailyResources[index] = {
                          ...dailyResources[index],
                          remaining: Math.max(0, Number(e.target.value) || 0),
                        }
                        return {
                          ...c,
                          play: { ...c.play, dailyResources },
                        }
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={row.resetsOn ?? 'daily'}
                    onChange={(e) =>
                      update((c) => {
                        const dailyResources = [...c.play.dailyResources]
                        dailyResources[index] = {
                          ...dailyResources[index],
                          resetsOn: e.target.value as (typeof RESETS)[number],
                        }
                        return {
                          ...c,
                          play: { ...c.play, dailyResources },
                        }
                      })
                    }
                  >
                    {RESETS.map((value) => (
                      <option key={value} value={value}>
                        {value}
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
                        play: {
                          ...c.play,
                          dailyResources: c.play.dailyResources.filter(
                            (item) => item.id !== row.id,
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
