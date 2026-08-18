import {
  CharacterValidationError,
  createSchemaValidator,
  formatAjvErrors,
} from '../../../shared/validate'

export function loadCatalog<T>(
  schema: object,
  data: unknown,
  label: string,
): T {
  const validate = createSchemaValidator(schema)
  if (!validate(data)) {
    throw new CharacterValidationError(
      `${label}: ${formatAjvErrors(validate.errors)}`,
    )
  }
  return data as T
}
