import {
  createEmptySpellListEntry,
  createEmptySpellcasting,
  type CharacterDocument,
} from '../character'
import type {
  AttributeKey,
  ProficiencyRank,
  SpellListEntry,
  SpellcastingEntry,
} from '../character/types'
import { signed, type DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { SheetUpdate } from './update'

const ATTRS: AttributeKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const RANKS: ProficiencyRank[] = [
  'untrained',
  'trained',
  'expert',
  'master',
  'legendary',
]
const TRADITIONS = [
  'arcane',
  'divine',
  'occult',
  'primal',
  'none',
  'other',
] as const
const CAST_TYPES = [
  'prepared',
  'spontaneous',
  'innate',
  'focus',
  'other',
] as const

type ListKey = 'cantrips' | 'spells' | 'focusSpells' | 'innateSpells' | 'rituals'

export function SpellsPanel({
  character,
  derived,
  update,
}: {
  character: CharacterDocument
  derived: DerivedView
  update: SheetUpdate
}) {
  function patchEntry(
    index: number,
    patch: Partial<SpellcastingEntry> | ((entry: SpellcastingEntry) => SpellcastingEntry),
  ) {
    update((c) => {
      const spellcasting = [...c.spellcasting]
      const current = spellcasting[index]
      spellcasting[index] =
        typeof patch === 'function' ? patch(current) : { ...current, ...patch }
      return { ...c, spellcasting }
    })
  }

  return (
    <div className="panel-stack">
      <table className="sheet-table">
        <tbody>
          <tr>
            <th>Focus pool</th>
            <td>
              <input
                type="number"
                min={0}
                max={3}
                value={character.play.focusPool}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    play: {
                      ...c.play,
                      focusPool: Math.min(
                        3,
                        Math.max(0, Number(e.target.value) || 0),
                      ),
                    },
                  }))
                }
              />
            </td>
          </tr>
          <tr>
            <th>Focus remaining</th>
            <td>
              <input
                type="number"
                min={0}
                max={3}
                value={character.play.focusRemaining}
                onChange={(e) =>
                  update((c) => ({
                    ...c,
                    play: {
                      ...c.play,
                      focusRemaining: Math.min(
                        3,
                        Math.max(0, Number(e.target.value) || 0),
                      ),
                    },
                  }))
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Spellcasting entries</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              spellcasting: [...c.spellcasting, createEmptySpellcasting()],
            }))
          }
        >
          Add spellcasting
        </button>
      </div>

      {character.spellcasting.length === 0 ? (
        <p className="placeholder">No spellcasting entries yet.</p>
      ) : (
        character.spellcasting.map((entry, index) => (
          <SpellcastingBlock
            key={entry.id}
            entry={entry}
            derived={derived.spellcasting[entry.id]}
            overriddenAttack={derived.overriddenPaths.includes(
              `derived.spellcasting.${entry.id}.attack`,
            )}
            overriddenDc={derived.overriddenPaths.includes(
              `derived.spellcasting.${entry.id}.dc`,
            )}
            onPatch={(patch) => patchEntry(index, patch)}
            onRemove={() =>
              update((c) => ({
                ...c,
                spellcasting: c.spellcasting.filter((row) => row.id !== entry.id),
              }))
            }
          />
        ))
      )}
    </div>
  )
}

function SpellcastingBlock({
  entry,
  derived,
  overriddenAttack,
  overriddenDc,
  onPatch,
  onRemove,
}: {
  entry: SpellcastingEntry
  derived: { attack: number; dc: number } | undefined
  overriddenAttack: boolean
  overriddenDc: boolean
  onPatch: (
    patch: Partial<SpellcastingEntry> | ((current: SpellcastingEntry) => SpellcastingEntry),
  ) => void
  onRemove: () => void
}) {
  function patchList(listKey: ListKey, list: SpellListEntry[]) {
    onPatch({ [listKey]: list })
  }

  return (
    <section className="spell-block">
      <div className="table-toolbar">
        <input
          value={entry.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          aria-label="Spellcasting name"
        />
        <button type="button" onClick={onRemove}>
          Remove entry
        </button>
      </div>
      <table className="sheet-table">
        <tbody>
          <tr>
            <th>Tradition</th>
            <td>
              <select
                value={entry.tradition}
                onChange={(e) =>
                  onPatch({
                    tradition: e.target.value as SpellcastingEntry['tradition'],
                  })
                }
              >
                {TRADITIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Cast type</th>
            <td>
              <select
                value={entry.castType}
                onChange={(e) =>
                  onPatch({
                    castType: e.target.value as SpellcastingEntry['castType'],
                  })
                }
              >
                {CAST_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Attribute / rank</th>
            <td className="inline-triple">
              <select
                value={entry.attribute ?? 'int'}
                onChange={(e) => {
                  const attribute = e.target.value as AttributeKey
                  onPatch({
                    attribute,
                    proficiency: { ...entry.proficiency, attribute },
                  })
                }}
              >
                {ATTRS.map((a) => (
                  <option key={a} value={a}>
                    {a.toUpperCase()}
                  </option>
                ))}
              </select>
              <select
                value={entry.proficiency.rank}
                onChange={(e) =>
                  onPatch({
                    proficiency: {
                      ...entry.proficiency,
                      rank: e.target.value as ProficiencyRank,
                    },
                  })
                }
              >
                {RANKS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Spell attack / DC</th>
            <td className="inline-triple">
              <DerivedCell
                value={derived ? signed(derived.attack) : '—'}
                overridden={overriddenAttack}
              />
              <DerivedCell
                value={derived ? derived.dc : '—'}
                overridden={overriddenDc}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Rank</th>
            {entry.slots.map((slot) => (
              <th key={slot.rank}>{slot.rank}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Max</th>
            {entry.slots.map((slot, slotIndex) => (
              <td key={`max-${slot.rank}`}>
                <input
                  type="number"
                  min={0}
                  value={slot.max}
                  onChange={(e) => {
                    const max = Math.max(0, Number(e.target.value) || 0)
                    const slots = [...entry.slots]
                    slots[slotIndex] = { ...slots[slotIndex], max }
                    onPatch({ slots })
                  }}
                />
              </td>
            ))}
          </tr>
          <tr>
            <th>Left</th>
            {entry.slots.map((slot, slotIndex) => (
              <td key={`left-${slot.rank}`}>
                <input
                  type="number"
                  min={0}
                  value={slot.remaining}
                  onChange={(e) => {
                    const remaining = Math.max(0, Number(e.target.value) || 0)
                    const slots = [...entry.slots]
                    slots[slotIndex] = { ...slots[slotIndex], remaining }
                    onPatch({ slots })
                  }}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {(
        [
          ['Cantrips', 'cantrips', 0],
          ['Spells', 'spells', 1],
          ['Focus', 'focusSpells', 0],
          ['Innate', 'innateSpells', 0],
          ['Rituals', 'rituals', 1],
        ] as const
      ).map(([label, listKey, defaultRank]) => (
        <SpellListTable
          key={listKey}
          label={label}
          rows={entry[listKey]}
          showPrepared={entry.castType === 'prepared'}
          showSignature={entry.castType === 'spontaneous'}
          onAdd={() =>
            patchList(listKey, [
              ...entry[listKey],
              createEmptySpellListEntry(defaultRank),
            ])
          }
          onChange={(rows) => patchList(listKey, rows)}
        />
      ))}
    </section>
  )
}

function SpellListTable({
  label,
  rows,
  showPrepared,
  showSignature,
  onAdd,
  onChange,
}: {
  label: string
  rows: SpellListEntry[]
  showPrepared: boolean
  showSignature: boolean
  onAdd: () => void
  onChange: (rows: SpellListEntry[]) => void
}) {
  return (
    <>
      <div className="table-toolbar">
        <strong>{label}</strong>
        <button type="button" onClick={onAdd}>
          Add
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rank</th>
            {showPrepared ? <th>Prep</th> : null}
            {showSignature ? <th>Sig</th> : null}
            <th>Uses / left</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="muted">
                None.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    value={row.spell.name}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = {
                        ...next[index],
                        spell: { ...next[index].spell, name: e.target.value },
                      }
                      onChange(next)
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={row.rank}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = {
                        ...next[index],
                        rank: Math.min(10, Math.max(0, Number(e.target.value) || 0)),
                      }
                      onChange(next)
                    }}
                  />
                </td>
                {showPrepared ? (
                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(row.prepared)}
                      onChange={(e) => {
                        const next = [...rows]
                        next[index] = {
                          ...next[index],
                          prepared: e.target.checked,
                        }
                        onChange(next)
                      }}
                    />
                  </td>
                ) : null}
                {showSignature ? (
                  <td>
                    <input
                      type="checkbox"
                      checked={Boolean(row.signature)}
                      onChange={(e) => {
                        const next = [...rows]
                        next[index] = {
                          ...next[index],
                          signature: e.target.checked,
                        }
                        onChange(next)
                      }}
                    />
                  </td>
                ) : null}
                <td className="inline-triple">
                  <input
                    type="number"
                    min={0}
                    value={row.usesPerDay ?? ''}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = {
                        ...next[index],
                        usesPerDay:
                          e.target.value === ''
                            ? null
                            : Math.max(0, Number(e.target.value) || 0),
                      }
                      onChange(next)
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    value={row.usesRemaining ?? ''}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = {
                        ...next[index],
                        usesRemaining:
                          e.target.value === ''
                            ? null
                            : Math.max(0, Number(e.target.value) || 0),
                      }
                      onChange(next)
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => onChange(rows.filter((item) => item.id !== row.id))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  )
}
