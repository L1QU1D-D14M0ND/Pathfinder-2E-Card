# Pathfinder-2E-Card

**Pathfinder 2E Character sheet** — installable local PWA for Pathfinder Second Edition player characters (Build + Play).

**Current phase:** 1 of 5 — character schema v1 and a React spreadsheet scaffold are in the repo. Core calc engine, Player Core content packs, golden tests, and i18n catalogs are not started. See [design doc §11](docs/pf2e-dynamic-character-sheet-design.md#11-phased-delivery).

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` character sheets (Load does not yet JSON-Schema-validate)
- Spreadsheet-style placeholder UI

## Docs

- [PF2e Dynamic Character Sheet — Design](docs/pf2e-dynamic-character-sheet-design.md)
- [ADR 0001 — Product direction](docs/adr/0001-product-direction.md)
- [ADR 0002 — Character JSON schema](docs/adr/0002-character-schema.md)
- [Schema design notes](docs/schema-design-notes.md)

## Schema

- [`schemas/character.schema.json`](schemas/character.schema.json)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json)
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json)

## License

[MIT](LICENSE)
