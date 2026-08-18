import { describe, expect, it } from 'vitest'
import { readRepoJson } from '../../../test/readRepoFile'

const ENTITY_FILES = [
  'content/pf1e/crb/classes.json',
  'content/pf1e/crb/races.json',
  'content/pf1e/crb/items.json',
  'content/pf1e/crb/feats.json',
  'content/pf1e/crb/spells.json',
] as const

const FORBIDDEN_KEYS = new Set([
  'benefit',
  'body',
  'description',
  'flavor',
  'flavortext',
  'fulltext',
  'prose',
  'rules',
  'special',
  'summary',
  'text',
])

const PRODUCT_IDENTITY = [
  /golarion/i,
  /absalom/i,
  /cheliax/i,
  /varisia/i,
  /sandpoint/i,
  /paizo/i,
  /pathfinder society/i,
  /inner sea/i,
]

function walk(
  value: unknown,
  trail: string,
  onKey: (key: string, trail: string) => void,
  onString: (text: string, trail: string) => void,
): void {
  if (typeof value === 'string') {
    onString(value, trail)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walk(item, `${trail}[${index}]`, onKey, onString)
    })
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      onKey(key, trail)
      walk(child, `${trail}.${key}`, onKey, onString)
    }
  }
}

describe('CRB pack license gate (ADR 0007)', () => {
  it('marks pack.json mechanics-only with no OGL notice required', () => {
    const pack = readRepoJson('content/pf1e/crb/pack.json') as {
      contentKind?: unknown
      oglNoticeRequired?: unknown
    }
    expect(pack.contentKind).toBe('mechanics-only')
    expect(pack.oglNoticeRequired).toBe(false)
  })

  it('keeps entity JSON free of rules-text keys', () => {
    const hits: string[] = []
    for (const file of ENTITY_FILES) {
      walk(
        readRepoJson(file),
        file,
        (key, trail) => {
          if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
            hits.push(`${trail}.${key}`)
          }
        },
        () => {},
      )
    }
    expect(hits).toEqual([])
  })

  it('keeps Product Identity terms out of entity JSON', () => {
    const hits: string[] = []
    for (const file of ENTITY_FILES) {
      walk(
        readRepoJson(file),
        file,
        () => {},
        (text, trail) => {
          for (const pattern of PRODUCT_IDENTITY) {
            if (pattern.test(text)) {
              hits.push(`${trail}: ${pattern}`)
            }
          }
        },
      )
    }
    expect(hits).toEqual([])
  })

  it('does not put Summoner in the CRB class catalog', () => {
    const classes = readRepoJson('content/pf1e/crb/classes.json') as Array<{
      id?: unknown
      name?: unknown
    }>
    const hits = classes.filter((row) => {
      const id = String(row.id ?? '').toLowerCase()
      const name = String(row.name ?? '').toLowerCase()
      return id.includes('summoner') || name.includes('summoner')
    })
    expect(hits).toEqual([])
  })
})
