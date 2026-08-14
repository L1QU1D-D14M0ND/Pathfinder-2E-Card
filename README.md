# Pathfinder-2E-Card

**Pathfinder 2E Character sheet** — installable local PWA for Pathfinder Second Edition player characters (Build + Play).

**Current phase:** 1 of 5 — S1 Fighter 5 slice and S4 validation prelude are in the repo. Remaining goldens, spell/companion editors, content packs, and i18n catalogs are not started. See [design doc §11](docs/pf2e-dynamic-character-sheet-design.md#11-phased-delivery) and [next increment options](docs/next-increment-design.md).

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` character sheets (JSON Schema validation on Load and Save)
- Core calc engine for HP, AC, skills, strikes, bulk (Fighter 5 golden fixture)
- Spreadsheet-style placeholder UI with derived cells

## Docs

- [PF2e Dynamic Character Sheet — Design](docs/pf2e-dynamic-character-sheet-design.md)
- [Next increment — options after S1/S4](docs/next-increment-design.md)
- [Continuation design — S1/S4 options (executed)](docs/continuation-design.md)
- [ADR 0001 — Product direction](docs/adr/0001-product-direction.md)
- [ADR 0002 — Character JSON schema](docs/adr/0002-character-schema.md)
- [Schema design notes](docs/schema-design-notes.md)

## Schema

- [`schemas/character.schema.json`](schemas/character.schema.json)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json)
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json)
- [`fixtures/characters/golden/fighter-5.json`](fixtures/characters/golden/fighter-5.json)

## License

[MIT](LICENSE)
