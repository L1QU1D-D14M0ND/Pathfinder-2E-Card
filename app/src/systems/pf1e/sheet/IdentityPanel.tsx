import {
  createEmptyClass,
  type CharacterDocument,
} from '../character'
import type { Alignment, Size } from '../character/types'
import { applyCrbClassProgression, CRB_CLASSES } from '../content'
import { characterLevel } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { DerivedView } from '../engine'
import type { SheetUpdate } from './update'

const SIZES: Size[] = [
  'fine',
  'diminutive',
  'tiny',
  'small',
  'medium',
  'large',
  'huge',
  'gargantuan',
  'colossal',
]

const ALIGNMENTS: Array<Alignment | ''> = [
  '',
  'lawful good',
  'neutral good',
  'chaotic good',
  'lawful neutral',
  'neutral',
  'chaotic neutral',
  'lawful evil',
  'neutral evil',
  'chaotic evil',
]

const BAB: Array<CharacterDocument['classes'][number]['babProgression']> = [
  'full',
  'threeQuarter',
  'half',
]

const SAVE: Array<'good' | 'poor'> = ['good', 'poor']

export function IdentityPanel({
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
            <th>Player</th>
            <td>
              <input
                value={character.identity.playerName ?? ''}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: { ...c.identity, playerName: e.target.value },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Race</th>
            <td>
              <input
                value={character.identity.race.name}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: {
                      ...c.identity,
                      race: { ...c.identity.race, name: e.target.value },
                    },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Size</th>
            <td>
              <select
                value={character.identity.size}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: { ...c.identity, size: e.target.value as Size },
                  }))
                }
              >
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Alignment</th>
            <td>
              <select
                value={character.identity.alignment ?? ''}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: {
                      ...c.identity,
                      alignment: (e.target.value || null) as Alignment | null,
                    },
                  }))
                }
              >
                {ALIGNMENTS.map((value) => (
                  <option key={value || 'none'} value={value}>
                    {value || '(none)'}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Deity</th>
            <td>
              <input
                value={character.identity.deity ?? ''}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: { ...c.identity, deity: e.target.value },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>XP</th>
            <td>
              <input
                type="number"
                min={0}
                value={character.identity.xp ?? 0}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    identity: {
                      ...c.identity,
                      xp: Math.max(0, Number(e.target.value) || 0),
                    },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Level (derived)</th>
            <td>
              <DerivedCell
                value={derived.level}
                overridden={derived.overriddenPaths.includes('derived.level')}
              />
              <span className="muted">
                {' '}
                sum of class levels ({characterLevel(character.classes)})
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Classes</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              classes: [...c.classes, createEmptyClass()],
            }))
          }
        >
          Add class
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Class</th>
            <th>Levels</th>
            <th>HD</th>
            <th>BAB</th>
            <th>Fort</th>
            <th>Ref</th>
            <th>Will</th>
            <th>Favored HP</th>
            <th>Favored ranks</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.classes.length === 0 ? (
            <tr>
              <td colSpan={10} className="muted">
                No class rows. Add one, then pick Fighter or Wizard from the
                CRB list (fills HD / BAB / saves).
              </td>
            </tr>
          ) : (
            character.classes.map((row, index) => (
              <tr key={row.id}>
                <td className="class-cell">
                  <select
                    aria-label="CRB class"
                    value={row.class.id ?? ''}
                    onChange={(e) => {
                      const id = e.target.value || null
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = applyCrbClassProgression(
                          classes[index],
                          id,
                        )
                        return { ...c, classes }
                      })
                    }}
                  >
                    <option value="">Custom</option>
                    {CRB_CLASSES.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label="Class name"
                    value={row.class.name}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          class: {
                            ...classes[index].class,
                            name: e.target.value,
                          },
                        }
                        return { ...c, classes }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={row.levels}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          levels: Math.max(1, Number(e.target.value) || 1),
                        }
                        return { ...c, classes }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={row.hitDie}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          hitDie: Math.max(1, Number(e.target.value) || 8),
                        }
                        return { ...c, classes }
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={row.babProgression}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          babProgression: e.target
                            .value as (typeof BAB)[number],
                        }
                        return { ...c, classes }
                      })
                    }
                  >
                    {BAB.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                {(['fort', 'ref', 'will'] as const).map((save) => (
                  <td key={save}>
                    <select
                      value={row.saves[save]}
                      onChange={(e) =>
                        update((c) => {
                          const classes = [...c.classes]
                          classes[index] = {
                            ...classes[index],
                            saves: {
                              ...classes[index].saves,
                              [save]: e.target.value as 'good' | 'poor',
                            },
                          }
                          return { ...c, classes }
                        })
                      }
                    >
                      {SAVE.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td>
                  <input
                    type="number"
                    min={0}
                    value={row.favored?.hp ?? 0}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          favored: {
                            hp: Math.max(0, Number(e.target.value) || 0),
                            skillRanks: classes[index].favored?.skillRanks ?? 0,
                          },
                        }
                        return { ...c, classes }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={row.favored?.skillRanks ?? 0}
                    onChange={(e) =>
                      update((c) => {
                        const classes = [...c.classes]
                        classes[index] = {
                          ...classes[index],
                          favored: {
                            hp: classes[index].favored?.hp ?? 0,
                            skillRanks: Math.max(
                              0,
                              Number(e.target.value) || 0,
                            ),
                          },
                        }
                        return { ...c, classes }
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
                        classes: c.classes.filter((item) => item.id !== row.id),
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
