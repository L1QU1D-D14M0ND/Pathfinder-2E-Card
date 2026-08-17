# Pathfinder-2E-Card

**TTRPG Character Sheet** (working title) — installable local PWA for **player** characters. **Pathfinder First Edition** is the development priority; **Pathfinder Second Edition** is the system that currently computes (Build + Play).

**Current phase:** M + sidebar host done. Next code work is PF1e schema + Fighter 5. See the [roadmap](docs/ROADMAP.md), [ADR 0003](docs/adr/0003-multi-system-product-direction.md), and [Attack Helper](docs/sidebar-tools-attack-helper.md) (later tool, no dice roller).

The GitHub repository name is unchanged.

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` (Ajv). Missing `system` loads as PF2e; Save writes `"system": "pf2e"`
- Layout: `app/src/shared` kernel, `app/src/shell` (chrome + empty Tools sidebar), `app/src/systems/pf2e`
- PF2e core calc engine (Fighter 5 and Wizard 5 goldens)
- Spreadsheet editors for identity, feats, spells, combat, inventory, and play
- **Planned:** PF1e engine; **Attack Helper** sidebar tool (weapon + feats preview; physical dice only)

## Docs

- [Roadmap](docs/ROADMAP.md)
- [ADR 0003 — Multi-system product direction](docs/adr/0003-multi-system-product-direction.md) (current lock)
- [ADR 0004 — Shared kernel vs per-system modules](docs/adr/0004-shared-kernel.md)
- [ADR 0005 — Loaded-sheet sidebar host](docs/adr/0005-sidebar-host.md)
- [Umbrella design](docs/ttrpg-character-sheet-design.md)
- [Shared kernel — reuse between editions](docs/shared-kernel-design.md)
- [Sidebar host](docs/sidebar-host-design.md)
- [Attack Helper (later tool)](docs/sidebar-tools-attack-helper.md)
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

- [`schemas/character.schema.json`](schemas/character.schema.json) — PF2e document (`schemaVersion` 1; optional `system: "pf2e"`)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json)
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json)
- [`fixtures/characters/golden/fighter-5.json`](fixtures/characters/golden/fighter-5.json) — PF2e Fighter 5
- [`fixtures/characters/golden/wizard-5.json`](fixtures/characters/golden/wizard-5.json) — PF2e Wizard 5

PF1e schema and goldens are not in the repo yet.

## License

[MIT](LICENSE)
