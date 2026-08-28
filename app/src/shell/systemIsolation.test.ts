import { describe, expect, it } from 'vitest'
import { listRepoFiles, readRepoFile } from '../test/readRepoFile'

/**
 * ADR 0004: PF1e and PF2e are two engines, not one model with edition flags.
 * The rule is stated in bold in CLAUDE.md but was previously convention only —
 * oxlint has no `no-restricted-imports`, so this test is the enforcement.
 */
const SYSTEMS = ['pf1e', 'pf2e'] as const

const IMPORT_SOURCE = /(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g

function sourceFiles(system: string): string[] {
  return [
    ...listRepoFiles(`app/src/systems/${system}`, '.ts'),
    ...listRepoFiles(`app/src/systems/${system}`, '.tsx'),
  ].sort()
}

describe('system module isolation (ADR 0004)', () => {
  it.each(SYSTEMS)('found %s source files to scan', (system) => {
    expect(sourceFiles(system).length).toBeGreaterThan(10)
  })

  it.each(SYSTEMS)('systems/%s does not import the other system', (system) => {
    const other = system === 'pf1e' ? 'pf2e' : 'pf1e'
    const violations: string[] = []

    for (const file of sourceFiles(system)) {
      const text = readRepoFile(file)
      for (const [, specifier] of text.matchAll(IMPORT_SOURCE)) {
        // Catches both `../../pf2e/...` and `@/systems/pf2e/...` styles.
        if (
          specifier.includes(`systems/${other}`) ||
          new RegExp(`(^|/)${other}/`).test(specifier)
        ) {
          violations.push(`${file} -> ${specifier}`)
        }
      }
    }

    expect(
      violations,
      `systems/${system} must not import systems/${other}; put shared code in src/shared/`,
    ).toEqual([])
  })
})
