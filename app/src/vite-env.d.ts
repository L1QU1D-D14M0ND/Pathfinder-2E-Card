/// <reference types="vite/client" />

declare module '@character-schema' {
  const schema: Record<string, unknown>
  export default schema
}

declare module '../../../../../schemas/character.schema.json' {
  const schema: Record<string, unknown>
  export default schema
}

declare module '../../../../../schemas/pf1e/character.schema.json' {
  const schema: Record<string, unknown>
  export default schema
}
