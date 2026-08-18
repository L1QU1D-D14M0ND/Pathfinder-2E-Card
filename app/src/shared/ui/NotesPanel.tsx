import { NOTE_KEYS, type Notes } from '../notes'
import { useT } from '../i18n'

export function NotesPanel({
  notes,
  onChange,
}: {
  notes: Notes
  onChange: (key: (typeof NOTE_KEYS)[number], value: string) => void
}) {
  const t = useT()
  return (
    <table className="sheet-table">
      <tbody>
        {NOTE_KEYS.map((key) => (
          <tr key={key}>
            <th>{t(`notes.${key}`)}</th>
            <td>
              <textarea
                rows={3}
                value={notes[key] ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
