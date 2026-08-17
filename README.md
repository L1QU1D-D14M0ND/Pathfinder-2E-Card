# Pathfinder-2E-Card

**TTRPG Character Sheet** (working title) — installable local PWA for **player** characters. **Pathfinder First Edition** is the development priority; **Pathfinder Second Edition** remains a supported system and the current code is still the PF2e slice (Build + Play).

**Current phase:** 0b of the [roadmap](docs/ROADMAP.md) (product lock). Next **code** work is the multi-system refactor, then a PF1e schema/engine. See [ADR 0003](docs/adr/0003-multi-system-product-direction.md) and the [umbrella design](docs/ttrpg-character-sheet-design.md).

The GitHub repository name is unchanged.

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` character sheets (JSON Schema validation on Load and Save)
- **Today:** PF2e core calc engine for HP, AC, skills, strikes, spell attack/DC, bulk (Fighter 5 and Wizard 5 golden fixtures)
- Spreadsheet-style UI with derived cells and editors for identity, feats, spells, combat, inventory, and play
- **Planned:** `system` discriminator; PF1e engine (ability scores, BAB/saves, three ACs, multiclass) without removing the PF2e slice

## Docs

- [Roadmap](docs/ROADMAP.md)
- [ADR 0003 — Multi-system product direction](docs/adr/0003-multi-system-product-direction.md) (current lock)
- [ADR 0004 — Shared kernel vs per-system modules](docs/adr/0004-shared-kernel.md)
- [Umbrella design](docs/ttrpg-character-sheet-design.md)
- [Shared kernel — reuse between editions](docs/shared-kernel-design.md)
- [PF1e system design](docs/pf1e-character-sheet-design.md)
- [PF2e system design](docs/pf2e-dynamic-character-sheet-design.md) (still valid for PF2e documents)
- [Next increment — multi-system / PF1e](docs/next-increment-multi-system.md)
- [Next increment — historical PF2e T1/T3](docs/next-increment-design.md)
- [Continuation design — S1/S4 (executed)](docs/continuation-design.md)
- [ADR 0001 — PF2e-only product direction (superseded)](docs/adr/0001-product-direction.md)
- [ADR 0002 — PF2e character JSON schema](docs/adr/0002-character-schema.md)
- [PF2e schema design notes](docs/schema-design-notes.md)
- [PF1e schema design notes](docs/pf1e-schema-design-notes.md) (no schema file yet)

## Schema

- [`schemas/character.schema.json`](schemas/character.schema.json) — PF2e document (`schemaVersion` 1)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json)
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json)
- [`fixtures/characters/golden/fighter-5.json`](fixtures/characters/golden/fighter-5.json) — PF2e Fighter 5
- [`fixtures/characters/golden/wizard-5.json`](fixtures/characters/golden/wizard-5.json) — PF2e Wizard 5

PF1e schema and goldens are not in the repo yet.

## License

[MIT](LICENSE)
