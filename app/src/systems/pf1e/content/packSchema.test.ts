import { describe, expect, it } from 'vitest'
import { createSchemaValidator, formatAjvErrors } from '../../../shared/validate'
import { readRepoJson } from '../../../test/readRepoFile'
import packSchema from '../../../../../schemas/content/pf1e/pack.schema.json'
import classesSchema from '../../../../../schemas/content/pf1e/classes.schema.json'
import racesSchema from '../../../../../schemas/content/pf1e/races.schema.json'
import itemsSchema from '../../../../../schemas/content/pf1e/items.schema.json'
import featsSchema from '../../../../../schemas/content/pf1e/feats.schema.json'
import spellsSchema from '../../../../../schemas/content/pf1e/spells.schema.json'
import archetypesSchema from '../../../../../schemas/content/pf1e/archetypes.schema.json'
import evolutionsSchema from '../../../../../schemas/content/pf1e/evolutions.schema.json'

const FILES: Array<{ file: string; schema: object }> = [
  { file: 'content/pf1e/crb/pack.json', schema: packSchema },
  { file: 'content/pf1e/apg/pack.json', schema: packSchema },
  { file: 'content/pf1e/crb/classes.json', schema: classesSchema },
  { file: 'content/pf1e/apg/classes.json', schema: classesSchema },
  { file: 'content/pf1e/crb/races.json', schema: racesSchema },
  { file: 'content/pf1e/crb/items.json', schema: itemsSchema },
  { file: 'content/pf1e/crb/feats.json', schema: featsSchema },
  { file: 'content/pf1e/crb/spells.json', schema: spellsSchema },
  { file: 'content/pf1e/apg/archetypes.json', schema: archetypesSchema },
  { file: 'content/pf1e/apg/evolutions.json', schema: evolutionsSchema },
]

describe('PF1e content pack JSON Schema', () => {
  it('accepts every pack file under content/pf1e/', () => {
    const failures: string[] = []
    for (const { file, schema } of FILES) {
      const validate = createSchemaValidator(schema)
      if (!validate(readRepoJson(file))) {
        failures.push(`${file}: ${formatAjvErrors(validate.errors)}`)
      }
    }
    expect(failures).toEqual([])
  })
})
