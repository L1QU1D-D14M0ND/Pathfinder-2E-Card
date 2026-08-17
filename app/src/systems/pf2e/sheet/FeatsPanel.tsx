import {
  createEmptyAction,
  createEmptyFeat,
  createEmptyFeature,
  type CharacterDocument,
} from '../character'
import type { FeatEntry } from '../character/types'
import type { SheetUpdate } from './update'

const FEAT_CATEGORIES: FeatEntry['category'][] = [
  'ancestry',
  'heritage',
  'background',
  'class',
  'skill',
  'general',
  'archetype',
  'bonus',
  'other',
]

const ACTION_TYPES = [
  'action',
  'reaction',
  'free',
  'exploration',
  'downtime',
] as const

export function FeatsPanel({
  character,
  update,
}: {
  character: CharacterDocument
  update: SheetUpdate
}) {
  return (
    <div className="panel-stack">
      <div className="table-toolbar">
        <strong>Feats</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({ ...c, feats: [...c.feats, createEmptyFeat()] }))
          }
        >
          Add feat
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Summary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.feats.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                No feats yet.
              </td>
            </tr>
          ) : (
            character.feats.map((feat, index) => (
              <tr key={feat.id}>
                <td>
                  <input
                    value={feat.feat.name}
                    onChange={(e) =>
                      update((c) => {
                        const feats = [...c.feats]
                        feats[index] = {
                          ...feats[index],
                          feat: { ...feats[index].feat, name: e.target.value },
                        }
                        return { ...c, feats }
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={feat.category}
                    onChange={(e) =>
                      update((c) => {
                        const feats = [...c.feats]
                        feats[index] = {
                          ...feats[index],
                          category: e.target.value as FeatEntry['category'],
                        }
                        return { ...c, feats }
                      })
                    }
                  >
                    {FEAT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={feat.levelGained}
                    onChange={(e) =>
                      update((c) => {
                        const feats = [...c.feats]
                        feats[index] = {
                          ...feats[index],
                          levelGained: Math.max(1, Number(e.target.value) || 1),
                        }
                        return { ...c, feats }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    value={feat.summary ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const feats = [...c.feats]
                        feats[index] = {
                          ...feats[index],
                          summary: e.target.value,
                        }
                        return { ...c, feats }
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        feats: c.feats.filter((row) => row.id !== feat.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Features</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              features: [...c.features, createEmptyFeature()],
            }))
          }
        >
          Add feature
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Summary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.features.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No class features yet.
              </td>
            </tr>
          ) : (
            character.features.map((feature, index) => (
              <tr key={feature.id}>
                <td>
                  <input
                    value={feature.feature.name}
                    onChange={(e) =>
                      update((c) => {
                        const features = [...c.features]
                        features[index] = {
                          ...features[index],
                          feature: {
                            ...features[index].feature,
                            name: e.target.value,
                          },
                        }
                        return { ...c, features }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    value={feature.levelGained}
                    onChange={(e) =>
                      update((c) => {
                        const features = [...c.features]
                        features[index] = {
                          ...features[index],
                          levelGained: Math.max(1, Number(e.target.value) || 1),
                        }
                        return { ...c, features }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    value={feature.summary ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const features = [...c.features]
                        features[index] = {
                          ...features[index],
                          summary: e.target.value,
                        }
                        return { ...c, features }
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        features: c.features.filter((row) => row.id !== feature.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>Actions</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              actions: [...c.actions, createEmptyAction()],
            }))
          }
        >
          Add action
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Cost</th>
            <th>Summary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.actions.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                No granted actions yet.
              </td>
            </tr>
          ) : (
            character.actions.map((action, index) => (
              <tr key={action.id}>
                <td>
                  <input
                    value={action.name}
                    onChange={(e) =>
                      update((c) => {
                        const actions = [...c.actions]
                        actions[index] = {
                          ...actions[index],
                          name: e.target.value,
                        }
                        return { ...c, actions }
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={action.actionType}
                    onChange={(e) =>
                      update((c) => {
                        const actions = [...c.actions]
                        actions[index] = {
                          ...actions[index],
                          actionType: e.target
                            .value as (typeof ACTION_TYPES)[number],
                        }
                        return { ...c, actions }
                      })
                    }
                  >
                    {ACTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={action.actionCost ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const actions = [...c.actions]
                        actions[index] = {
                          ...actions[index],
                          actionCost:
                            e.target.value === ''
                              ? null
                              : Math.min(3, Math.max(0, Number(e.target.value) || 0)),
                        }
                        return { ...c, actions }
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    value={action.summary ?? ''}
                    onChange={(e) =>
                      update((c) => {
                        const actions = [...c.actions]
                        actions[index] = {
                          ...actions[index],
                          summary: e.target.value,
                        }
                        return { ...c, actions }
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      update((c) => ({
                        ...c,
                        actions: c.actions.filter((row) => row.id !== action.id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
