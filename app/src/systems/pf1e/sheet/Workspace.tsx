import { useState } from 'react'
import {
  skillKeyFromName,
  type CharacterDocument,
} from '../character'
import type { AbilityKey } from '../character/types'
import { signed } from '../../../shared/format'
import type { DerivedView } from '../engine'
import { DerivedCell } from '../../../shared/ui/DerivedCell'
import { CombatPanel } from './CombatPanel'
import { FeatsPanel } from './FeatsPanel'
import { IdentityPanel } from './IdentityPanel'
import { InventoryPanel } from './InventoryPanel'
import { PlayPanel } from './PlayPanel'
import { SpellsPanel } from './SpellsPanel'
import type { SheetUpdate } from './update'

type TabId =
  | 'identity'
  | 'abilities'
  | 'skills'
  | 'combat'
  | 'feats'
  | 'spells'
  | 'inventory'
  | 'play'
  | 'notes'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'identity', label: 'Identity' },
  { id: 'abilities', label: 'Abilities' },
  { id: 'skills', label: 'Skills' },
  { id: 'combat', label: 'Combat' },
  { id: 'feats', label: 'Feats' },
  { id: 'spells', label: 'Spells' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'play', label: 'Play' },
  { id: 'notes', label: 'Notes' },
]

const ATTRS: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

function classSummary(character: CharacterDocument): string {
  if (character.classes.length === 0) return '(no class)'
  return character.classes
    .map((row) => `${row.class.name || 'Class'} ${row.levels}`)
    .join(' / ')
}

export function Pf1eWorkspace({
  character,
  derived,
  update,
  setStatus,
}: {
  character: CharacterDocument
  derived: DerivedView
  update: SheetUpdate
  setStatus: (message: string) => void
}) {
  const [tab, setTab] = useState<TabId>('identity')

  function addWildcardSkill(kind: 'craft' | 'perform' | 'profession') {
    const raw = window.prompt(`${kind} specialty (e.g. weapons)`)
    if (!raw?.trim()) return
    const topic = raw.trim()
    const key = skillKeyFromName(topic, kind)
    if (character.skills.some((skill) => skill.key === key)) {
      setStatus(`Skill already exists: ${key}`)
      return
    }
    const ability: AbilityKey =
      kind === 'perform' ? 'cha' : kind === 'profession' ? 'wis' : 'int'
    update((c) => ({
      ...c,
      skills: [
        ...c.skills,
        {
          key,
          name: `${kind[0].toUpperCase()}${kind.slice(1)} (${topic})`,
          ability,
          ranks: 0,
          classSkill: false,
          armorPenaltyApplies: false,
          misc: 0,
          notes: '',
          effects: [],
        },
      ],
    }))
  }

  return (
    <div className="pf1e-workspace">
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
          <DerivedCell
            value={derived.level}
            overridden={derived.overriddenPaths.includes('derived.level')}
          />
        </label>
        <label>
          Class
          <span className="derived">{classSummary(character)}</span>
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
          BAB
          <DerivedCell
            value={signed(derived.bab)}
            overridden={derived.overriddenPaths.includes('derived.bab')}
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
          <IdentityPanel
            character={character}
            derived={derived}
            update={update}
          />
        )}

        {tab === 'abilities' && (
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Ability</th>
                <th>Score</th>
                <th>Temp mod</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              {ATTRS.map((key) => {
                const block = character.abilities[key]
                return (
                  <tr key={key}>
                    <th>{key.toUpperCase()}</th>
                    <td>
                      <input
                        type="number"
                        value={block.score}
                        onChange={(e) =>
                          update((c) => ({
                            ...c,
                            abilities: {
                              ...c.abilities,
                              [key]: {
                                ...c.abilities[key],
                                score: Number(e.target.value) || 0,
                              },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={block.tempModifier ?? 0}
                        onChange={(e) =>
                          update((c) => ({
                            ...c,
                            abilities: {
                              ...c.abilities,
                              [key]: {
                                ...c.abilities[key],
                                tempModifier: Number(e.target.value) || 0,
                              },
                            },
                          }))
                        }
                      />
                    </td>
                    <td>
                      <DerivedCell
                        value={signed(derived.abilityModifiers[key])}
                        overridden={derived.overriddenPaths.includes(
                          `derived.abilityModifiers.${key}`,
                        )}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {tab === 'skills' && (
          <>
            <div className="table-toolbar">
              <button type="button" onClick={() => addWildcardSkill('craft')}>
                Add Craft
              </button>
              <button type="button" onClick={() => addWildcardSkill('perform')}>
                Add Perform
              </button>
              <button
                type="button"
                onClick={() => addWildcardSkill('profession')}
              >
                Add Profession
              </button>
            </div>
            <table className="sheet-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Ability</th>
                  <th>Ranks</th>
                  <th>Class</th>
                  <th>Misc</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {character.skills.map((skill, index) => (
                  <tr key={skill.key}>
                    <th>{skill.name}</th>
                    <td>{skill.ability.toUpperCase()}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        value={skill.ranks}
                        onChange={(e) =>
                          update((c) => {
                            const skills = [...c.skills]
                            skills[index] = {
                              ...skills[index],
                              ranks: Math.max(0, Number(e.target.value) || 0),
                            }
                            return { ...c, skills }
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={skill.classSkill}
                        onChange={(e) =>
                          update((c) => {
                            const skills = [...c.skills]
                            skills[index] = {
                              ...skills[index],
                              classSkill: e.target.checked,
                            }
                            return { ...c, skills }
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={skill.misc ?? 0}
                        onChange={(e) =>
                          update((c) => {
                            const skills = [...c.skills]
                            skills[index] = {
                              ...skills[index],
                              misc: Number(e.target.value) || 0,
                            }
                            return { ...c, skills }
                          })
                        }
                      />
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
          <FeatsPanel character={character} update={update} />
        )}

        {tab === 'spells' && (
          <SpellsPanel
            character={character}
            derived={derived}
            update={update}
          />
        )}

        {tab === 'inventory' && (
          <InventoryPanel
            character={character}
            derived={derived}
            update={update}
          />
        )}

        {tab === 'play' && (
          <PlayPanel
            character={character}
            derived={derived}
            update={update}
          />
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
    </div>
  )
}
