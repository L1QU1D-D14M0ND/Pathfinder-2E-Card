# Pathfinder-2E-Card

**Pathfinder 2E Character sheet** — installable local PWA for Pathfinder Second Edition player characters (Build + Play).

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` character sheets
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
