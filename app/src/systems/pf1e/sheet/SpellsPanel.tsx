import {
  createEmptySpellListEntry,
  createEmptySpellcasting,
  type CharacterDocument,
} from '../character'
import type { AbilityKey, SpellListEntry, SpellcastingEntry } from '../character/types'
import { applyCrbSpell, CRB_SPELLS } from '../content'
import type { DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import type { SheetUpdate } from './update'

const ATTRS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

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
      <p className="muted">
        Slots are user-entered. DC is 10 + spell level + ability. Bonus slots
        from ability are derived (add them into max yourself in 0.9). Spell
        Focus does not change DC. Catalog spells stamp name and level only —
        they do not fill slots or a spellbook.
      </p>
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
            classes={character.classes}
            derived={derived.spellcasting[entry.id]}
            overriddenPaths={derived.overriddenPaths}
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
  classes,
  derived,
  overriddenPaths,
  onPatch,
  onRemove,
}: {
  entry: SpellcastingEntry
  classes: CharacterDocument['classes']
  derived: DerivedView['spellcasting'][string] | undefined
  overriddenPaths: string[]
  onPatch: (
    patch: Partial<SpellcastingEntry> | ((current: SpellcastingEntry) => SpellcastingEntry),
  ) => void
  onRemove: () => void
}) {
  function patchList(listKey: 'cantrips' | 'spells', list: SpellListEntry[]) {
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
            <th>Ability</th>
            <td>
              <select
                value={entry.ability}
                onChange={(e) =>
                  onPatch({ ability: e.target.value as AbilityKey })
                }
              >
                {ATTRS.map((key) => (
                  <option key={key} value={key}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Class row</th>
            <td>
              <select
                value={entry.classRowId ?? ''}
                onChange={(e) =>
                  onPatch({ classRowId: e.target.value || null })
                }
              >
                <option value="">(none — set CL override)</option>
                {classes.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.class.name || row.id} {row.levels}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th>Caster level override</th>
            <td>
              <input
                type="number"
                min={0}
                value={entry.casterLevelOverride ?? ''}
                onChange={(e) =>
                  onPatch({
                    casterLevelOverride:
                      e.target.value === ''
                        ? null
                        : Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <th>Caster level</th>
            <td>
              <DerivedCell
                value={derived?.casterLevel ?? 0}
                overridden={overriddenPaths.includes(
                  `derived.spellcasting.${entry.id}.casterLevel`,
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Level</th>
            <th>DC</th>
            <th>Bonus slots</th>
            <th>Max</th>
            <th>Left</th>
          </tr>
        </thead>
        <tbody>
          {SPELL_LEVELS.map((spellLevel) => {
            const slot =
              entry.slots.find((row) => row.spellLevel === spellLevel) ?? {
                spellLevel,
                max: 0,
                remaining: 0,
              }
            return (
              <tr key={spellLevel}>
                <th>{spellLevel === 0 ? '0 (cantrips)' : spellLevel}</th>
                <td>
                  <DerivedCell
                    value={derived?.dcByLevel[spellLevel] ?? 10}
                    overridden={overriddenPaths.includes(
                      `derived.spellcasting.${entry.id}.dcByLevel.${spellLevel}`,
                    )}
                  />
                </td>
                <td>
                  <DerivedCell
                    value={derived?.bonusSlotsByLevel[spellLevel] ?? 0}
                    overridden={overriddenPaths.includes(
                      `derived.spellcasting.${entry.id}.bonusSlotsByLevel.${spellLevel}`,
                    )}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={slot.max}
                    onChange={(e) =>
                      onPatch((current) => ({
                        ...current,
                        slots: upsertSlot(current.slots, spellLevel, {
                          max: Math.max(0, Number(e.target.value) || 0),
                        }),
                      }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={slot.remaining}
                    onChange={(e) =>
                      onPatch((current) => ({
                        ...current,
                        slots: upsertSlot(current.slots, spellLevel, {
                          remaining: Math.max(0, Number(e.target.value) || 0),
                        }),
                      }))
                    }
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <SpellListTable
        title="Cantrips / orisons"
        rows={entry.cantrips}
        onChange={(list) => patchList('cantrips', list)}
        defaultLevel={0}
      />
      <SpellListTable
        title="Spells"
        rows={entry.spells}
        onChange={(list) => patchList('spells', list)}
        defaultLevel={1}
      />
    </section>
  )
}

function upsertSlot(
  slots: SpellcastingEntry['slots'],
  spellLevel: number,
  patch: Partial<{ max: number; remaining: number }>,
): SpellcastingEntry['slots'] {
  const next = [...slots]
  const index = next.findIndex((row) => row.spellLevel === spellLevel)
  if (index === -1) {
    next.push({
      spellLevel,
      max: patch.max ?? 0,
      remaining: patch.remaining ?? 0,
    })
    return next
  }
  next[index] = { ...next[index], ...patch }
  return next
}

function SpellListTable({
  title,
  rows,
  onChange,
  defaultLevel,
}: {
  title: string
  rows: SpellListEntry[]
  onChange: (rows: SpellListEntry[]) => void
  defaultLevel: number
}) {
  return (
    <>
      <div className="table-toolbar">
        <strong>{title}</strong>
        <button
          type="button"
          onClick={() =>
            onChange([...rows, createEmptySpellListEntry(defaultLevel)])
          }
        >
          Add spell
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Prepared</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No spells in this list. Catalog stamps name and level; prepared
                stays typed.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id}>
                <td className="spell-cell">
                  <select
                    aria-label="CRB spell"
                    value={row.spell.id ?? ''}
                    onChange={(e) => {
                      const id = e.target.value || null
                      const next = [...rows]
                      next[index] = applyCrbSpell(next[index], id)
                      onChange(next)
                    }}
                  >
                    <option value="">Custom</option>
                    {CRB_SPELLS.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label="Spell name"
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
                    max={9}
                    value={row.spellLevel}
                    onChange={(e) => {
                      const next = [...rows]
                      next[index] = {
                        ...next[index],
                        spellLevel: Math.min(
                          9,
                          Math.max(0, Number(e.target.value) || 0),
                        ),
                      }
                      onChange(next)
                    }}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={row.prepared ?? false}
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
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(rows.filter((item) => item.id !== row.id))
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
    </>
  )
}
