import type { ReactNode } from 'react'
import type { SystemId } from '../shared/envelope'

export interface SidebarToolContext<Doc, Derived> {
  system: SystemId
  character: Doc
  derived: Derived
  update: (mutator: (c: Doc) => Doc) => void
  focusTab?: (tabId: string) => void
}

export interface SidebarTool<Doc, Derived> {
  id: string
  label: string
  systems?: SystemId[]
  render: (ctx: SidebarToolContext<Doc, Derived>) => ReactNode
}

export interface SystemModule<Doc, Derived> {
  id: SystemId
  displayName: string
  validate(data: unknown): Doc
  createEmpty(): Doc
  compute(doc: Doc): Derived
  parse(text: string): Doc
  serialize(doc: Doc): string
  download(doc: Doc): void
  readFile(file: File): Promise<Doc>
  suggestedFilename(doc: Doc): string
  sidebarTools: SidebarTool<Doc, Derived>[]
}
