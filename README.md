# Pathfinder-2E-Card

Installable PWA (planned) for a dynamic Pathfinder Second Edition **player** character sheet — spreadsheet-style Build + Play UI, local Save/Load, TypeScript, MIT licensed.

Product decisions are locked; see the design doc and ADR before implementing.

## Docs

- [PF2e Dynamic Character Sheet — Design](docs/pf2e-dynamic-character-sheet-design.md)
- [ADR 0001 — Product direction](docs/adr/0001-product-direction.md)
- [ADR 0002 — Character JSON schema](docs/adr/0002-character-schema.md)
- [Schema design notes / open questions](docs/schema-design-notes.md)

## Schema

- [`schemas/character.schema.json`](schemas/character.schema.json) — Save/Load document (`schemaVersion` 1)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json) — minimal valid sheet
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json) — auto-seeded skills example

## License

[MIT](LICENSE)
