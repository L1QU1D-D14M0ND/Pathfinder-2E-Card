import { useEffect } from 'react'
import { t } from '../shared/i18n'
import type { SystemId } from '../shared/envelope'

export function NewSheetDialog({
  open,
  onCancel,
  onChoose,
}: {
  open: boolean
  onCancel: () => void
  onChoose: (system: SystemId) => void
}) {
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
          <button
            type="button"
            className="primary"
            onClick={() => onChoose('pf1e')}
          >
            {t('shell.newPf1e')}
          </button>
          <button type="button" onClick={() => onChoose('pf2e')}>
            {t('shell.newPf2e')}
          </button>
          <button type="button" onClick={onCancel}>
            {t('shell.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
