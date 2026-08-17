import Ajv, { type ErrorObject } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import type { ValidateFunction } from 'ajv'

export class CharacterValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CharacterValidationError'
  }
}

export function formatAjvErrors(
  errors: ErrorObject[] | null | undefined,
): string {
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

export function createSchemaValidator(
  schema: object,
): ValidateFunction<unknown> {
  const ajv = new Ajv({
    allErrors: true,
    strict: true,
    allowUnionTypes: true,
  })
  addFormats(ajv)
  return ajv.compile(schema)
}
