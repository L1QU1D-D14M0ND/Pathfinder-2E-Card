import { useEffect, useRef } from 'react'
import type { CharacterDocument } from '../character'
import { signed } from '../../../shared/format'
import { hpBreakdown, setHitDieRoll } from '../engine/vitals'
import type { SheetUpdate } from './update'

export function HpBreakdownDialog({
  open,
  onClose,
  character,
  update,
}: {
  open: boolean
  onClose: () => void
  character: CharacterDocument
  update: SheetUpdate
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const conMod = Math.floor((character.abilities.con.score - 10) / 2)
  const breakdown = hpBreakdown(character.vitals, character.classes, conMod)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  function writeRoll(index: number, raw: string) {
    if (raw === '') {
      update((c) => ({
        ...c,
        vitals: {
          ...c.vitals,
          hpRolled: setHitDieRoll(c.vitals.hpRolled, index, null),
        },
      }))
      return
    }
    const rolled = Number(raw)
    if (!Number.isFinite(rolled)) return
    update((c) => ({
      ...c,
      vitals: {
        ...c.vitals,
        hpRolled: setHitDieRoll(c.vitals.hpRolled, index, rolled),
      },
    }))
  }

  function writeFavored(classRowId: string, hp: number) {
    update((c) => ({
      ...c,
      classes: c.classes.map((row) =>
        row.id === classRowId
          ? {
              ...row,
              favored: {
                hp,
                skillRanks: row.favored?.skillRanks ?? 0,
              },
            }
          : row,
      ),
    }))
  }

  function dropExtra(index: number) {
    update((c) => ({
      ...c,
      vitals: {
        ...c.vitals,
        hpRolled: c.vitals.hpRolled.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <dialog
      ref={ref}
      className="hp-dialog"
      onClose={onClose}
      aria-labelledby="hp-dialog-title"
    >
      <div className="table-toolbar">
        <strong id="hp-dialog-title">Max HP breakdown</strong>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="muted">
        Roll hit dice at the table (the app does not roll). Type each result
        before Constitution. 1st character level is usually the die maximum;
        later levels you roll. Each HD adds max(1, roll + Con). Favored-class
        HP is a separate +1 per chosen level.
      </p>
      {breakdown.slots.length === 0 ? (
        <p className="muted">Add a class on Identity to create HD slots.</p>
      ) : (
        <table className="sheet-table wide">
          <thead>
            <tr>
              <th>HD</th>
              <th>Class</th>
              <th>Die</th>
              <th>Your roll</th>
              <th>Con</th>
              <th>From this HD</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {breakdown.slots.map((slot) => (
              <tr key={slot.index}>
                <td>{slot.characterLevel}</td>
                <td>
                  {slot.className} {slot.classLevel}
                </td>
                <td>d{slot.hitDie}</td>
                <td>
                  <input
                    type="number"
                    min={1}
                    max={slot.hitDie}
                    disabled={!slot.editable}
                    value={slot.rolled ?? ''}
                    placeholder={slot.editable ? 'roll' : ''}
                    title={
                      slot.editable ? undefined : 'Enter earlier HD first'
                    }
                    aria-label={`HD ${slot.characterLevel} roll`}
                    onChange={(e) => writeRoll(slot.index, e.target.value)}
                  />
                </td>
                <td>{signed(slot.conMod)}</td>
                <td>{slot.rolled == null ? '—' : slot.fromHd}</td>
                <td>
                  {slot.firstLevel ? (
                    <button
                      type="button"
                      disabled={!slot.editable}
                      onClick={() =>
                        writeRoll(slot.index, String(slot.hitDie))
                      }
                    >
                      Max 1st
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {breakdown.extraRolls.length > 0 ? (
        <>
          <p className="muted">
            Extra HD rolls beyond class levels still count until removed.
          </p>
          <table className="sheet-table wide">
            <thead>
              <tr>
                <th>Extra</th>
                <th>Roll</th>
                <th>From HD</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {breakdown.extraRolls.map((row) => (
                <tr key={row.index}>
                  <td>#{row.index + 1}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={row.rolled}
                      aria-label={`Extra HD roll ${row.index + 1}`}
                      onChange={(e) => writeRoll(row.index, e.target.value)}
                    />
                  </td>
                  <td>{row.fromHd}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => dropExtra(row.index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
      {character.classes.length > 0 ? (
        <table className="sheet-table">
          <thead>
            <tr>
              <th>Favored class HP</th>
              <th>Bonus</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.favored.map((line) => (
              <tr key={line.classRowId}>
                <th>{line.className}</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={line.hp}
                    aria-label={`${line.className} favored HP`}
                    onChange={(e) =>
                      writeFavored(
                        line.classRowId,
                        Math.max(0, Number(e.target.value) || 0),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      <table className="sheet-table">
        <tbody>
          <tr>
            <th>From hit dice</th>
            <td>{breakdown.fromDice}</td>
          </tr>
          <tr>
            <th>From favored class</th>
            <td>{breakdown.fromFavored}</td>
          </tr>
          <tr>
            <th>Max HP</th>
            <td>
              <strong>{breakdown.maxHp}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </dialog>
  )
}
