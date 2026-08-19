import { describe, expect, it } from 'vitest'
import { parseCharacterJson } from '../character/saveLoad'
import { computeCompanion } from './companion'
import { readRepoFile } from '../../../test/readRepoFile'

describe('computeCompanion', () => {
  const character = parseCharacterJson(
    readRepoFile('fixtures/characters/golden/ranger-5.json'),
  )
  const sheet = character.companions[0]!.sheet

  it('still computes when nested proficiencies are omitted', () => {
    const { proficiencies: _ignored, ...rest } = sheet
    const view = computeCompanion(rest)
    expect(view.ac).toBe(12)
    expect(view.maxHp).toBe(50)
  })
})
