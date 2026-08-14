import Ajv, { type ErrorObject } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import characterSchema from '../../../schemas/character.schema.json'
import type { CharacterDocument } from './types'

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  allowUnionTypes: true,
})
addFormats(ajv)

const validateFn = ajv.compile(characterSchema)

export class CharacterValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CharacterValidationError'
  }
}

export function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return 'Document failed JSON Schema validation.'
  return errors
    .slice(0, 8)
    .map((err) => {
      const where = err.instancePath || '/'
      const extra =
        typeof err.params?.additionalProperty === 'string'
          ? ` '${err.params.additionalProperty}'`
          : ''
      return `${where}${extra} ${err.message ?? 'is invalid'}`
    })
    .join('; ')
}

/** Validate an unknown value against character.schema.json (schemaVersion 1). */
export function validateCharacterDocument(data: unknown): CharacterDocument {
  if (validateFn(data)) {
    return data as unknown as CharacterDocument
  }
  throw new CharacterValidationError(formatAjvErrors(validateFn.errors))
}
