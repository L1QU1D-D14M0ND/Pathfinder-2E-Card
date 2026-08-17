import { t } from '../../shared/i18n'
import type { SidebarTool, SidebarToolContext } from '../types'

export function SidebarHost<Doc, Derived>({
  tools,
  context,
  collapsed,
  onToggle,
}: {
  tools: SidebarTool<Doc, Derived>[]
  context: SidebarToolContext<Doc, Derived>
  collapsed: boolean
  onToggle: () => void
}) {
  const available = tools.filter(
    (tool) => !tool.systems || tool.systems.includes(context.system),
  )

  if (collapsed) {
    return (
      <aside className="sidebar-host collapsed" aria-label={t('shell.toolsAria')}>
        <button type="button" onClick={onToggle}>
          {t('shell.tools')}
        </button>
      </aside>
    )
  }

  return (
    <aside className="sidebar-host" aria-label={t('shell.toolsAria')}>
      <div className="sidebar-header">
        <strong>{t('shell.tools')}</strong>
        <button type="button" onClick={onToggle}>
          {t('shell.hide')}
        </button>
      </div>
      {available.length === 0 ? (
        <p className="muted sidebar-empty">{t('shell.toolsEmpty')}</p>
      ) : (
        <ul className="sidebar-tool-list">
          {available.map((tool) => (
            <li key={tool.id}>{tool.render(context)}</li>
          ))}
        </ul>
      )}
    </aside>
  )
}
