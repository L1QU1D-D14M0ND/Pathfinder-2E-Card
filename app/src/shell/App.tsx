import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { APP_DISPLAY_NAME } from '../systems/pf2e/character'
import {
  CharacterSaveError,
  type CharacterDocument,
} from '../systems/pf2e/character'
import { pf2eModule } from '../systems/pf2e/module'
import { Pf2eWorkspace } from '../systems/pf2e/sheet/Workspace'
import { SidebarHost } from './sidebar/SidebarHost'
import './App.css'

function touch(character: CharacterDocument): CharacterDocument {
  return {
    ...character,
    meta: { ...character.meta, updatedAt: new Date().toISOString() },
  }
}

export default function App() {
  const module = pf2eModule
  const [character, setCharacter] = useState<CharacterDocument>(() =>
    module.createEmpty(),
  )
  const [status, setStatus] = useState('New sheet ready.')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)
  const derived = useMemo(
    () => module.compute(character),
    [character, module],
  )

  function update(mutator: (c: CharacterDocument) => CharacterDocument) {
    setCharacter((prev) => touch(mutator(prev)))
  }

  async function onLoadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const loaded = await module.readFile(file)
      setCharacter(loaded)
      setStatus(`Loaded ${file.name}`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Load failed.')
    }
  }

  function onSave() {
    try {
      module.download(character)
      setStatus('Save sheet downloaded (.json).')
    } catch (err) {
      setStatus(
        err instanceof CharacterSaveError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Save failed.',
      )
    }
  }

  function onNew() {
    if (
      !window.confirm(
        'Start a new blank sheet? Unsaved changes in memory will be lost.',
      )
    ) {
      return
    }
    setCharacter(module.createEmpty())
    setStatus('New sheet created.')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{APP_DISPLAY_NAME}</h1>
          <p className="tagline">
            {module.displayName} · local Build + Play · schema v
            {character.schemaVersion}
          </p>
        </div>
        <div className="toolbar">
          <button type="button" onClick={onNew}>
            New sheet
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            Load sheet
          </button>
          <button type="button" className="primary" onClick={onSave}>
            Save sheet
          </button>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? 'Show tools' : 'Hide tools'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={onLoadFile}
          />
        </div>
      </header>

      <div className="workspace-layout">
        <div className="workspace-main">
          <Pf2eWorkspace
            character={character}
            derived={derived}
            update={update}
            setStatus={setStatus}
          />
        </div>
        <SidebarHost
          tools={module.sidebarTools}
          context={{
            system: module.id,
            character,
            derived,
            update,
          }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
      </div>

      <footer className="status">{status}</footer>
    </div>
  )
}
