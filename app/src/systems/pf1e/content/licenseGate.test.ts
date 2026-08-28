import { describe, expect, it } from 'vitest'
import { listRepoFiles, readRepoFile, readRepoJson } from '../../../test/readRepoFile'

// Globbed, not enumerated: ADR 0007 is a hard rule, so a pack file added later
// must be scanned automatically rather than when someone remembers a list.
const ALL_PACK_JSON = listRepoFiles('content/pf1e')
const PACK_FILES = ALL_PACK_JSON.filter((file) => file.endsWith('/pack.json'))
const ENTITY_FILES = ALL_PACK_JSON.filter(
  (file) => !file.endsWith('/pack.json'),
)

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

/** Tripwire, not a gazetteer. Goldens and UI chrome are out of scope. */
const PRODUCT_IDENTITY = [
  /golarion/i,
  /absalom/i,
  /cheliax/i,
  /varisia/i,
  /sandpoint/i,
  /paizo/i,
  /pathfinder society/i,
  /inner sea/i,
  /aldori/i,
  /korvosa/i,
  /osirion/i,
  /runelord/i,
  /abadar/i,
  /asmodeus/i,
  /calistria/i,
  /cayden/i,
  /desna/i,
  /erastil/i,
  /gorum/i,
  /gozreh/i,
  /iomedae/i,
  /irori/i,
  /lamashtu/i,
  /nethys/i,
  /norgorber/i,
  /pharasma/i,
  /rovagug/i,
  /sarenrae/i,
  /shelyn/i,
  /torag/i,
  /urgathoa/i,
  /zon.?kuthon/i,
]

const SCRAPE_SOURCES = [
  /d20pfsrd/i,
  /aonprd/i,
  /archives\s*of\s*nethys/i,
  /archivesofnethys/i,
  /hero\s*lab/i,
  /herolab/i,
  /foundryvtt/i,
  /foundry\.vtt/i,
  /foundry-vtt/i,
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

function collectPageKeys(value: unknown, trail: string): string[] {
  const hits: string[] = []
  walk(
    value,
    trail,
    (key, parent) => {
      if (key.toLowerCase() === 'page') hits.push(`${parent}.${key}`)
    },
    () => {},
  )
  return hits
}

function collectPatternHits(
  value: unknown,
  trail: string,
  patterns: readonly RegExp[],
): string[] {
  const hits: string[] = []
  walk(
    value,
    trail,
    () => {},
    (text, at) => {
      for (const pattern of patterns) {
        if (pattern.test(text)) hits.push(`${at}: ${pattern}`)
      }
    },
  )
  return hits
}

function collectForbiddenKeys(value: unknown, trail: string): string[] {
  const hits: string[] = []
  walk(
    value,
    trail,
    (key, parent) => {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) hits.push(`${parent}.${key}`)
    },
    () => {},
  )
  return hits
}

describe('pack license gate (ADR 0007)', () => {
  it('actually found pack files to scan', () => {
    // Without this the globbed suites below would pass vacuously if the
    // content tree were moved or renamed.
    expect(PACK_FILES.length).toBeGreaterThanOrEqual(2)
    expect(ENTITY_FILES.length).toBeGreaterThanOrEqual(8)
  })

  it('marks pack.json mechanics-only with no OGL notice required', () => {
    for (const file of PACK_FILES) {
      const pack = readRepoJson(file) as {
        contentKind?: unknown
        oglNoticeRequired?: unknown
      }
      expect(pack.contentKind, file).toBe('mechanics-only')
      expect(pack.oglNoticeRequired, file).toBe(false)
    }
  })

  it('keeps pack JSON free of rules-text keys', () => {
    const hits: string[] = []
    for (const file of ALL_PACK_JSON) {
      hits.push(...collectForbiddenKeys(readRepoJson(file), file))
    }
    expect(hits).toEqual([])
  })

  it('omits source.page (and any page key) from pack JSON', () => {
    const hits: string[] = []
    for (const file of ALL_PACK_JSON) {
      hits.push(...collectPageKeys(readRepoJson(file), file))
    }
    expect(hits).toEqual([])
  })

  it('keeps Product Identity terms out of pack JSON including pack.json notes', () => {
    const hits: string[] = []
    for (const file of ALL_PACK_JSON) {
      hits.push(...collectPatternHits(readRepoJson(file), file, PRODUCT_IDENTITY))
    }
    expect(hits).toEqual([])
  })

  it('rejects third-party SRD scrape URLs in pack JSON', () => {
    const hits: string[] = []
    for (const file of ALL_PACK_JSON) {
      hits.push(...collectPatternHits(readRepoJson(file), file, SCRAPE_SOURCES))
    }
    expect(hits).toEqual([])
  })

  it('flags page keys, scrape URLs, and PI in a sample object', () => {
    const sample = {
      source: { book: 'CRB', page: 142 },
      notes: 'copied from https://www.d20pfsrd.com/',
      name: 'Aldori dueling sword of Iomedae',
    }
    expect(collectPageKeys(sample, 'sample')).toEqual(['sample.source.page'])
    expect(collectPatternHits(sample, 'sample', SCRAPE_SOURCES)).toEqual([
      'sample.notes: /d20pfsrd/i',
    ])
    expect(collectPatternHits(sample, 'sample', PRODUCT_IDENTITY)).toEqual([
      'sample.name: /aldori/i',
      'sample.name: /iomedae/i',
    ])
  })

  it('keeps the app LICENSE as stock MIT without catalog prose', () => {
    const license = readRepoFile('LICENSE')
    expect(license.startsWith('MIT License\n')).toBe(true)
    expect(license).toMatch(/Copyright \(c\) 2026 L1QU1D-D14M0ND/)
    expect(license).not.toMatch(/Pathfinder/i)
    expect(license).not.toMatch(/content\//)
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

  it('puts Summoner only in the APG class catalog', () => {
    const classes = readRepoJson('content/pf1e/apg/classes.json') as Array<{
      id?: unknown
    }>
    expect(classes.map((row) => row.id)).toEqual(['class.summoner'])
  })
})
