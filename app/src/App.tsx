import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  APP_DISPLAY_NAME,
  CharacterSaveError,
  createEmptyCharacter,
  downloadCharacterJson,
  readCharacterFile,
  type CharacterDocument,
} from './character'
import type { AttributeKey, ProficiencyRank } from './character/types'
import { compute, signed } from './engine'
import { CombatPanel } from './sheet/CombatPanel'
import { DerivedCell } from './sheet/DerivedCell'
import { InventoryPanel } from './sheet/InventoryPanel'
import './App.css'

type TabId =
  | 'identity'
  | 'attributes'
  | 'skills'
  | 'combat'
  | 'feats'
  | 'spells'
  | 'inventory'
  | 'play'
  | 'notes'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'identity', label: 'Identity' },
  { id: 'attributes', label: 'Attributes' },
  { id: 'skills', label: 'Skills' },
  { id: 'combat', label: 'Combat' },
  { id: 'feats', label: 'Feats' },
  { id: 'spells', label: 'Spells' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'play', label: 'Play' },
  { id: 'notes', label: 'Notes' },
]

const ATTRS: AttributeKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const RANKS: ProficiencyRank[] = [
  'untrained',
  'trained',
  'expert',
  'master',
  'legendary',
]

function touch(character: CharacterDocument): CharacterDocument {
  return {
    ...character,
    meta: { ...character.meta, updatedAt: new Date().toISOString() },
  }
}

export default function App() {
  const [character, setCharacter] = useState<CharacterDocument>(() =>
    createEmptyCharacter(),
  )
  const [tab, setTab] = useState<TabId>('identity')
  const [status, setStatus] = useState('New sheet ready.')
  const fileRef = useRef<HTMLInputElement>(null)
  const derived = useMemo(() => compute(character), [character])

  function update(mutator: (c: CharacterDocument) => CharacterDocument) {
    setCharacter((prev) => touch(mutator(prev)))
  }

  async function onLoadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const loaded = await readCharacterFile(file)
      setCharacter(loaded)
      setTab('identity')
      setStatus(`Loaded ${file.name}`)
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Load failed.')
    }
  }

  function onSave() {
    try {
      downloadCharacterJson(character)
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
    setCharacter(createEmptyCharacter())
    setTab('identity')
    setStatus('New sheet created.')
  }

  function addLore() {
    const raw = window.prompt('Lore topic (e.g. Warfare)')
    if (!raw?.trim()) return
    const topic = raw.trim()
    const key = `lore:${topic.toLowerCase().replace(/\s+/g, '-')}`
    if (character.skills.some((skill) => skill.key === key)) {
      setStatus(`Lore already exists: ${key}`)
      return
    }
    update((c) => ({
      ...c,
      skills: [
        ...c.skills,
        {
          key,
          name: `${topic} Lore`,
          attribute: 'int',
          rank: 'untrained',
          isLore: true,
          armorPenaltyApplies: false,
          modifiers: {},
          notes: '',
          effects: [],
        },
      ],
    }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{APP_DISPLAY_NAME}</h1>
          <p className="tagline">
            Local Build + Play sheet · Remaster-first · schema v
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
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={onLoadFile}
          />
        </div>
      </header>

      <section className="identity-strip sheet-grid">
        <label>
          Character
          <input
            value={character.identity.characterName}
            onChange={(e) =>
              update((c) => ({
                ...c,
                identity: { ...c.identity, characterName: e.target.value },
              }))
            }
          />
        </label>
        <label>
          Level
          <input
            type="number"
            min={1}
            value={character.identity.level}
            onChange={(e) =>
              update((c) => ({
                ...c,
                identity: {
                  ...c.identity,
                  level: Math.max(1, Number(e.target.value) || 1),
                },
              }))
            }
          />
        </label>
        <label>
          Class
          <input
            value={character.identity.class.name}
            onChange={(e) =>
              update((c) => ({
                ...c,
                identity: {
                  ...c.identity,
                  class: { ...c.identity.class, name: e.target.value },
                },
              }))
            }
          />
        </label>
        <label>
          HP
          <span className="hp-pair">
            <input
              type="number"
              value={character.vitals.currentHp}
              onChange={(e) =>
                update((c) => ({
                  ...c,
                  vitals: {
                    ...c.vitals,
                    currentHp: Number(e.target.value) || 0,
                  },
                }))
              }
            />
            <DerivedCell
              value={`/ ${derived.maxHp}`}
              overridden={derived.overriddenPaths.includes('derived.maxHp')}
            />
          </span>
        </label>
        <label>
          AC
          <DerivedCell
            value={derived.ac}
            overridden={derived.overriddenPaths.includes('derived.ac')}
          />
        </label>
        <label>
          Hero points
          <input
            type="number"
            min={0}
            max={3}
            value={character.play.heroPoints}
            onChange={(e) =>
              update((c) => ({
                ...c,
                play: {
                  ...c.play,
                  heroPoints: Math.min(
                    3,
                    Math.max(0, Number(e.target.value) || 0),
                  ),
                },
              }))
            }
          />
        </label>
      </section>

      <nav className="tabs" aria-label="Sheet tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="sheet-panel">
        {tab === 'identity' && (
          <table className="sheet-table">
            <tbody>
              {(
                [
                  ['Player', 'playerName'],
                  ['Ancestry', 'ancestry'],
                  ['Heritage', 'heritage'],
                  ['Background', 'background'],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <th>{label}</th>
                  <td>
                    {key === 'playerName' ? (
                      <input
                        value={character.identity.playerName ?? ''}
                        onChange={(e) =>
                          update((c) => ({
                            ...c,
                            identity: {
                              ...c.identity,
                              playerName: e.target.value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <input
                        value={character.identity[key].name}
                        onChange={(e) =>
                          update((c) => ({
                            ...c,
                            identity: {
                              ...c.identity,
                              [key]: {
                                ...c.identity[key],
                                name: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <th>Size</th>
                <td>
                  <select
                    value={character.identity.size}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        identity: {
                          ...c.identity,
                          size: e.target.value as CharacterDocument['identity']['size'],
                        },
                      }))
                    }
                  >
                    {(
                      [
                        'tiny',
                        'small',
                        'medium',
                        'large',
                        'huge',
                        'gargantuan',
                      ] as const
                    ).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Ancestry HP</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={character.vitals.ancestryHp}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          ancestryHp: Math.max(0, Number(e.target.value) || 0),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Class HP / level</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={character.vitals.classHpPerLevel}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          classHpPerLevel: Math.max(
                            0,
                            Number(e.target.value) || 0,
                          ),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {tab === 'attributes' && (
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Boost count (user-entered)</th>
                <th>Modifier</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {ATTRS.map((key) => {
                const block = character.attributes[key]
                const boostTotal = block.boosts.reduce(
                  (sum, b) => sum + b.amount,
                  0,
                )
                return (
                  <tr key={key}>
                    <th>{key.toUpperCase()}</th>
                    <td>
                      <input
                        type="number"
                        value={boostTotal}
                        onChange={(e) => {
                          const amount = Number(e.target.value) || 0
                          update((c) => ({
                            ...c,
                            attributes: {
                              ...c.attributes,
                              [key]: {
                                ...c.attributes[key],
                                boosts:
                                  amount === 0
                                    ? []
                                    : [
                                        {
                                          kind: 'free',
                                          attribute: key,
                                          amount,
                                          label: 'User-entered total',
                                        },
                                      ],
                              },
                            },
                          }))
                        }}
                      />
                    </td>
                    <td>
                      <DerivedCell
                        value={signed(derived.attributeModifiers[key])}
                        overridden={derived.overriddenPaths.includes(
                          `derived.attributeModifiers.${key}`,
                        )}
                      />
                    </td>
                    <td className="muted">Final boosts only (no partial pairing)</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {tab === 'skills' && (
          <>
            <div className="table-toolbar">
              <button type="button" onClick={addLore}>
                Add lore
              </button>
            </div>
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Attr</th>
                  <th>Rank</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {character.skills.map((skill, index) => (
                  <tr key={skill.key}>
                    <th>{skill.name}</th>
                    <td>{skill.attribute.toUpperCase()}</td>
                    <td>
                      <select
                        value={skill.rank}
                        onChange={(e) =>
                          update((c) => {
                            const skills = [...c.skills]
                            skills[index] = {
                              ...skills[index],
                              rank: e.target.value as ProficiencyRank,
                            }
                            return { ...c, skills }
                          })
                        }
                      >
                        {RANKS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <DerivedCell
                        value={signed(derived.skillTotals[skill.key] ?? 0)}
                        overridden={derived.overriddenPaths.includes(
                          `derived.skillTotals.${skill.key}`,
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'combat' && (
          <CombatPanel
            character={character}
            derived={derived}
            update={update}
          />
        )}

        {tab === 'feats' && (
          <p className="placeholder">
            Feats / features tables will expand here. Currently{' '}
            {character.feats.length} feats, {character.features.length}{' '}
            features.
          </p>
        )}

        {tab === 'spells' && (
          <table className="sheet-table">
            <tbody>
              <tr>
                <th>Spellcasting entries</th>
                <td>{character.spellcasting.length}</td>
              </tr>
              <tr>
                <th>Focus pool</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={character.play.focusPool}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        play: {
                          ...c.play,
                          focusPool: Math.min(
                            3,
                            Math.max(0, Number(e.target.value) || 0),
                          ),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Focus remaining</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={character.play.focusRemaining}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        play: {
                          ...c.play,
                          focusRemaining: Math.min(
                            3,
                            Math.max(0, Number(e.target.value) || 0),
                          ),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {tab === 'inventory' && (
          <InventoryPanel
            character={character}
            derived={derived}
            update={update}
          />
        )}

        {tab === 'play' && (
          <table className="sheet-table">
            <tbody>
              <tr>
                <th>Current HP</th>
                <td>
                  <input
                    type="number"
                    value={character.vitals.currentHp}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          currentHp: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Max HP</th>
                <td>
                  <DerivedCell
                    value={derived.maxHp}
                    overridden={derived.overriddenPaths.includes('derived.maxHp')}
                  />
                </td>
              </tr>
              <tr>
                <th>Temp HP</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={character.vitals.temporaryHp}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          temporaryHp: Math.max(0, Number(e.target.value) || 0),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Dying / Wounded / Doomed</th>
                <td className="inline-triple">
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={character.vitals.dying}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          dying: Math.max(0, Number(e.target.value) || 0),
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    value={character.vitals.wounded}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          wounded: Math.max(0, Number(e.target.value) || 0),
                        },
                      }))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    value={character.vitals.doomed}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        vitals: {
                          ...c.vitals,
                          doomed: Math.max(0, Number(e.target.value) || 0),
                        },
                      }))
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Conditions</th>
                <td className="muted">{character.conditions.length}</td>
              </tr>
            </tbody>
          </table>
        )}

        {tab === 'notes' && (
          <table className="sheet-table">
            <tbody>
              {(
                [
                  ['Appearance', 'appearance'],
                  ['Personality', 'personality'],
                  ['Campaign', 'campaign'],
                  ['Other', 'other'],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  <th>{label}</th>
                  <td>
                    <textarea
                      rows={3}
                      value={character.notes[key] ?? ''}
                      onChange={(e) =>
                        update((c) => ({
                          ...c,
                          notes: { ...c.notes, [key]: e.target.value },
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      <footer className="status">{status}</footer>
    </div>
  )
}
