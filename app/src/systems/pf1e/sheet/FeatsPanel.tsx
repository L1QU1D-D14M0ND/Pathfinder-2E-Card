import {
  createEmptyFeat,
  createEmptyFeature,
  type CharacterDocument,
} from '../character'
import type { FeatEntry } from '../character/types'
import type { SheetUpdate } from './update'

const FEAT_CATEGORIES: FeatEntry['category'][] = [
  'general',
  'combat',
  'metamagic',
  'itemCreation',
  'other',
]

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
                No feats yet. Effects are stored but not applied.
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
                    {FEAT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                        feats: c.feats.filter((item) => item.id !== feat.id),
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
                Class features as user-entered rows.
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
                        features: c.features.filter(
                          (item) => item.id !== feature.id,
                        ),
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
