import { useRef, useState, type ChangeEvent } from 'react'
import {
  APP_DISPLAY_NAME,
  createEmptyCharacter,
  downloadCharacterJson,
  readCharacterFile,
  type CharacterDocument,
} from './character'
import type { AttributeKey, ProficiencyRank } from './character/types'
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
    downloadCharacterJson(character)
    setStatus('Save sheet downloaded (.json).')
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
            </tbody>
          </table>
        )}

        {tab === 'attributes' && (
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Boost count (user-entered)</th>
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
                    <td className="muted">Final boosts only (no partial pairing)</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {tab === 'skills' && (
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Attr</th>
                <th>Rank</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'combat' && (
          <table className="sheet-table">
            <tbody>
              <tr>
                <th>Perception rank</th>
                <td>
                  <select
                    value={character.proficiencies.perception.rank}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        proficiencies: {
                          ...c.proficiencies,
                          perception: {
                            ...c.proficiencies.perception,
                            rank: e.target.value as ProficiencyRank,
                          },
                        },
                      }))
                    }
                  >
                    {RANKS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Class DC attr</th>
                <td>
                  <select
                    value={character.proficiencies.classDC.attribute ?? 'str'}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        proficiencies: {
                          ...c.proficiencies,
                          classDC: {
                            ...c.proficiencies.classDC,
                            attribute: e.target.value as AttributeKey,
                          },
                        },
                      }))
                    }
                  >
                    {ATTRS.map((a) => (
                      <option key={a} value={a}>
                        {a.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th>Strikes</th>
                <td className="muted">
                  {character.strikes.length} (editor coming with calc engine)
                </td>
              </tr>
              <tr>
                <th>Shield raised</th>
                <td>
                  <input
                    type="checkbox"
                    checked={character.armorClass.shieldRaised}
                    onChange={(e) =>
                      update((c) => ({
                        ...c,
                        armorClass: {
                          ...c.armorClass,
                          shieldRaised: e.target.checked,
                        },
                      }))
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
          <table className="sheet-table">
            <tbody>
              {(['cp', 'sp', 'gp', 'pp'] as const).map((coin) => (
                <tr key={coin}>
                  <th>{coin.toUpperCase()}</th>
                  <td>
                    <input
                      type="number"
                      value={character.inventory.currency[coin]}
                      onChange={(e) =>
                        update((c) => ({
                          ...c,
                          inventory: {
                            ...c.inventory,
                            currency: {
                              ...c.inventory.currency,
                              [coin]: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <th>Items</th>
                <td className="muted">
                  {character.inventory.items.length} (bulk uses decimals; 0.1 =
                  1L)
                </td>
              </tr>
            </tbody>
          </table>
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
