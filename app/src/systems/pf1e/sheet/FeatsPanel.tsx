import {
  createEmptyFeat,
  createEmptyFeature,
  type CharacterDocument,
} from '../character'
import type { FeatEntry } from '../character/types'
import { applyCrbFeat, CRB_FEATS } from '../content'
import { useT } from '../../../shared/i18n'
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
  const t = useT()
  return (
    <div className="panel-stack">
      <div className="table-toolbar">
        <strong>{t('pf1e.feats.feats')}</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({ ...c, feats: [...c.feats, createEmptyFeat()] }))
          }
        >
          {t('pf1e.feats.addFeat')}
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>{t('pf1e.feats.name')}</th>
            <th>{t('pf1e.feats.category')}</th>
            <th>{t('pf1e.feats.level')}</th>
            <th>{t('pf1e.feats.summary')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.feats.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                {t('pf1e.feats.emptyFeats')}
              </td>
            </tr>
          ) : (
            character.feats.map((feat, index) => (
              <tr key={feat.id}>
                <td className="feat-cell">
                  <select
                    aria-label={t('pf1e.feats.catalog')}
                    value={feat.feat.id ?? ''}
                    onChange={(e) => {
                      const id = e.target.value || null
                      update((c) => {
                        const feats = [...c.feats]
                        feats[index] = applyCrbFeat(feats[index], id)
                        return { ...c, feats }
                      })
                    }}
                  >
                    <option value="">{t('pf1e.common.custom')}</option>
                    {CRB_FEATS.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label={t('pf1e.feats.featName')}
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
                    aria-label={t('pf1e.feats.category')}
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
                        {t(`pf1e.feats.categories.${category}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={1}
                    aria-label={t('pf1e.feats.level')}
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
                    aria-label={t('pf1e.feats.summary')}
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
                    {t('pf1e.common.remove')}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="table-toolbar">
        <strong>{t('pf1e.feats.features')}</strong>
        <button
          type="button"
          onClick={() =>
            update((c) => ({
              ...c,
              features: [...c.features, createEmptyFeature()],
            }))
          }
        >
          {t('pf1e.feats.addFeature')}
        </button>
      </div>
      <table className="sheet-table wide">
        <thead>
          <tr>
            <th>{t('pf1e.feats.name')}</th>
            <th>{t('pf1e.feats.level')}</th>
            <th>{t('pf1e.feats.summary')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {character.features.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                {t('pf1e.feats.emptyFeatures')}
              </td>
            </tr>
          ) : (
            character.features.map((feature, index) => (
              <tr key={feature.id}>
                <td>
                  <input
                    aria-label={t('pf1e.feats.featureName')}
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
                    aria-label={t('pf1e.feats.level')}
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
                    aria-label={t('pf1e.feats.summary')}
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
                    {t('pf1e.common.remove')}
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
