import { useEffect } from 'react'
import { t } from '../shared/i18n'

export function RestoreDraftDialog({
  open,
  onRestore,
  onDiscard,
}: {
  open: boolean
  onRestore: () => void
  onDiscard: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onDiscard()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onDiscard])

  if (!open) return null
  return (
    <div className="dialog-backdrop" role="presentation" onClick={onDiscard}>
      <div
        className="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-draft-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="restore-draft-title">{t('shell.draftRestoreTitle')}</h2>
        <p>{t('shell.draftRestoreBody')}</p>
        <div className="dialog-actions">
          <button type="button" className="primary" onClick={onRestore}>
            {t('shell.draftRestore')}
          </button>
          <button type="button" onClick={onDiscard}>
            {t('shell.draftDiscard')}
          </button>
        </div>
      </div>
    </div>
  )
}
