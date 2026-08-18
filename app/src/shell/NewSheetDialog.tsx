import { useEffect } from 'react'
import { useT } from '../shared/i18n'
import type { SystemId } from '../shared/envelope'
import { SYSTEM_IDS, SYSTEM_MODULES } from './registry'

export function NewSheetDialog({
  open,
  onCancel,
  onChoose,
}: {
  open: boolean
  onCancel: () => void
  onChoose: (system: SystemId) => void
}) {
  const t = useT()
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="new-sheet-title">{t('shell.newDialogTitle')}</h2>
        <p>{t('shell.newDialogBody')}</p>
        <div className="dialog-actions">
          {SYSTEM_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              className={index === 0 ? 'primary' : undefined}
              onClick={() => onChoose(id)}
            >
              {t(SYSTEM_MODULES[id].displayNameKey)}
            </button>
          ))}
          <button type="button" onClick={onCancel}>
            {t('shell.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
