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
      <aside className="sidebar-host collapsed" aria-label="Sheet tools">
        <button type="button" onClick={onToggle}>
          Tools
        </button>
      </aside>
    )
  }

  return (
    <aside className="sidebar-host" aria-label="Sheet tools">
      <div className="sidebar-header">
        <strong>Tools</strong>
        <button type="button" onClick={onToggle}>
          Hide
        </button>
      </div>
      {available.length === 0 ? (
        <p className="muted sidebar-empty">
          No tools yet. Later: Attack Helper, Actions List, Budget
          Calculator (no dice roller).
        </p>
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
