import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { APP_DISPLAY_NAME } from '../shared/constants'
import { t } from '../shared/i18n'
import { CharacterSaveError, readTextFile } from '../shared/saveLoad'
import type { SystemId } from '../shared/envelope'
import { pf1eModule } from '../systems/pf1e/module'
import { pf2eModule } from '../systems/pf2e/module'
import { Pf1eWorkspace } from '../systems/pf1e/sheet/Workspace'
import { Pf2eWorkspace } from '../systems/pf2e/sheet/Workspace'
import type { CharacterDocument as Pf1eDocument } from '../systems/pf1e/character'
import type { CharacterDocument as Pf2eDocument } from '../systems/pf2e/character'
import { parseLoadedSheet, type LoadedSheet } from './loadSheet'
import { NewSheetDialog } from './NewSheetDialog'
import { SidebarHost } from './sidebar/SidebarHost'
import './App.css'

function touchMeta<T extends { meta: { updatedAt: string } }>(character: T): T {
  return {
    ...character,
    meta: { ...character.meta, updatedAt: new Date().toISOString() },
  }
}

function Pf1eSession({
  character,
  setCharacter,
  setStatus,
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  character: Pf1eDocument
  setCharacter: (mutator: (c: Pf1eDocument) => Pf1eDocument) => void
  setStatus: (message: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void
}) {
  const derived = useMemo(() => pf1eModule.compute(character), [character])
  const update = (mutator: (c: Pf1eDocument) => Pf1eDocument) => {
    setCharacter((c) => touchMeta(mutator(c)))
  }
  return (
    <>
      <div className="workspace-main">
        <Pf1eWorkspace
          character={character}
          derived={derived}
          update={update}
          setStatus={setStatus}
        />
      </div>
      <SidebarHost
        tools={pf1eModule.sidebarTools}
        context={{
          system: 'pf1e',
          character,
          derived,
          update,
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />
    </>
  )
}

function Pf2eSession({
  character,
  setCharacter,
  setStatus,
  sidebarCollapsed,
  setSidebarCollapsed,
}: {
  character: Pf2eDocument
  setCharacter: (mutator: (c: Pf2eDocument) => Pf2eDocument) => void
  setStatus: (message: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void
}) {
  const derived = useMemo(() => pf2eModule.compute(character), [character])
  const update = (mutator: (c: Pf2eDocument) => Pf2eDocument) => {
    setCharacter((c) => touchMeta(mutator(c)))
  }
  return (
    <>
      <div className="workspace-main">
        <Pf2eWorkspace
          character={character}
          derived={derived}
          update={update}
          setStatus={setStatus}
        />
      </div>
      <SidebarHost
        tools={pf2eModule.sidebarTools}
        context={{
          system: 'pf2e',
          character,
          derived,
          update,
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />
    </>
  )
}

export default function App() {
  const [sheet, setSheet] = useState<LoadedSheet>(() => ({
    system: 'pf2e',
    character: pf2eModule.createEmpty(),
  }))
  const [status, setStatus] = useState(t('shell.newReady'))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [newOpen, setNewOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const module = sheet.system === 'pf1e' ? pf1eModule : pf2eModule

  function onChooseNew(system: SystemId) {
    setNewOpen(false)
    if (system === 'pf1e') {
      setSheet({ system: 'pf1e', character: pf1eModule.createEmpty() })
      setStatus(t('shell.newCreated', { system: t('pf1e.displayName') }))
    } else {
      setSheet({ system: 'pf2e', character: pf2eModule.createEmpty() })
      setStatus(t('shell.newCreated', { system: t('pf2e.displayName') }))
    }
  }

  async function onLoadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const loaded = parseLoadedSheet(await readTextFile(file))
      setSheet(loaded)
      setStatus(t('shell.loaded', { name: file.name, system: loaded.system }))
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t('shell.loadFailed'))
    }
  }

  function onSave() {
    try {
      if (sheet.system === 'pf1e') pf1eModule.download(sheet.character)
      else pf2eModule.download(sheet.character)
      setStatus(t('shell.saved'))
    } catch (err) {
      setStatus(
        err instanceof CharacterSaveError
          ? err.message
          : err instanceof Error
            ? err.message
            : t('shell.saveFailed'),
      )
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{APP_DISPLAY_NAME}</h1>
          <p className="tagline">
            {t('shell.tagline', {
              system: module.displayName,
              version: sheet.character.schemaVersion,
            })}
          </p>
        </div>
        <div className="toolbar">
          <button type="button" onClick={() => setNewOpen(true)}>
            {t('shell.newSheet')}
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            {t('shell.loadSheet')}
          </button>
          <button type="button" className="primary" onClick={onSave}>
            {t('shell.saveSheet')}
          </button>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            {sidebarCollapsed ? t('shell.showTools') : t('shell.hideTools')}
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
        {sheet.system === 'pf1e' ? (
          <Pf1eSession
            character={sheet.character}
            setCharacter={(mutator) =>
              setSheet((prev) =>
                prev.system === 'pf1e'
                  ? { system: 'pf1e', character: mutator(prev.character) }
                  : prev,
              )
            }
            setStatus={setStatus}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
        ) : (
          <Pf2eSession
            character={sheet.character}
            setCharacter={(mutator) =>
              setSheet((prev) =>
                prev.system === 'pf2e'
                  ? { system: 'pf2e', character: mutator(prev.character) }
                  : prev,
              )
            }
            setStatus={setStatus}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />
        )}
      </div>

      <footer className="status">{status}</footer>
      <NewSheetDialog
        open={newOpen}
        onCancel={() => setNewOpen(false)}
        onChoose={onChooseNew}
      />
    </div>
  )
}
