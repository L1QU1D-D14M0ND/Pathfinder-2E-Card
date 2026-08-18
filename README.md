# Pathfinder-2E-Card

**TTRPG Character Sheet** (working title) — installable local PWA for **player** characters. **Pathfinder First Edition** is the development priority; **Pathfinder Second Edition** is the system that currently computes (Build + Play).

**Current phase:** OGL / Product Identity review landed. **Next: 1.0** (Spanish + playable APG Synthesist Summoner). Sidebar tools wait until the sheet is ~90% done. See the [roadmap](docs/ROADMAP.md), [ADR 0003](docs/adr/0003-multi-system-product-direction.md), [ADR 0007](docs/adr/0007-content-licensing.md), and [CRB pack](docs/pf1e-crb-pack-design.md).

The GitHub repository name is unchanged.

## App

```bash
cd app
npm install
npm run dev
```

- React + TypeScript + Vite
- Save/Load `.json` (Ajv). Missing `system` loads as PF2e; Save writes `"system": "pf1e"` or `"pf2e"`
- Layout: `app/src/shared` kernel, `app/src/shell` (chrome + empty Tools sidebar), `app/src/systems/pf1e`, `app/src/systems/pf2e`
- PF1e martial + spell calc (Fighter 5, Wizard 5, and Fighter 2 / Wizard 3 goldens) and PF2e core calc engine (Fighter 5 and Wizard 5 goldens)
- Spreadsheet editors per system (PF1e: identity/classes, abilities, skills, combat, spells, inventory, play)
- **Later:** **Attack Helper**, **Actions List**, and **Budget Calculator** sidebar tools after the sheet is ~90% done (no dice roller)

## Docs

- [Roadmap](docs/ROADMAP.md)
- [ADR 0003 — Multi-system product direction](docs/adr/0003-multi-system-product-direction.md) (current lock)
- [ADR 0004 — Shared kernel vs per-system modules](docs/adr/0004-shared-kernel.md)
- [ADR 0005 — Loaded-sheet sidebar host](docs/adr/0005-sidebar-host.md)
- [Umbrella design](docs/ttrpg-character-sheet-design.md)
- [Shared kernel — reuse between editions](docs/shared-kernel-design.md)
- [Sidebar host](docs/sidebar-host-design.md)
- [PF1e CRB pack (Phase 3c, batch reviews)](docs/pf1e-crb-pack-design.md)
- [Attack Helper (later tool)](docs/sidebar-tools-attack-helper.md)
- [Actions List (later tool)](docs/sidebar-tools-actions-list.md)
- [Budget Calculator (later tool)](docs/sidebar-tools-budget-calculator.md)
- [PF1e system design](docs/pf1e-character-sheet-design.md)
- [PF2e system design](docs/pf2e-dynamic-character-sheet-design.md) (still valid for PF2e documents)
- [Next increment — multi-system / PF1e](docs/next-increment-multi-system.md)
- [Next increment — historical PF2e T1/T3](docs/next-increment-design.md)
- [Continuation design — S1/S4 (executed)](docs/continuation-design.md)
- [ADR 0001 — PF2e-only product direction (superseded)](docs/adr/0001-product-direction.md)
- [ADR 0002 — PF2e character JSON schema](docs/adr/0002-character-schema.md)
- [ADR 0006 — PF1e character JSON schema](docs/adr/0006-pf1e-character-schema.md)
- [ADR 0007 — Content licensing (OGL / PI)](docs/adr/0007-content-licensing.md)
- [Content licensing review](docs/content-licensing.md)
- [PF2e schema design notes](docs/schema-design-notes.md)
- [PF1e schema design notes](docs/pf1e-schema-design-notes.md)

## Schema

- [`schemas/character.schema.json`](schemas/character.schema.json) — PF2e document (`schemaVersion` 1; optional `system: "pf2e"`)
- [`schemas/pf1e/character.schema.json`](schemas/pf1e/character.schema.json) — PF1e document (`schemaVersion` 1; required `system: "pf1e"`)
- [`fixtures/characters/minimal.example.json`](fixtures/characters/minimal.example.json)
- [`fixtures/characters/new-sheet.example.json`](fixtures/characters/new-sheet.example.json)
- [`fixtures/characters/golden/fighter-5.json`](fixtures/characters/golden/fighter-5.json) — PF2e Fighter 5
- [`fixtures/characters/golden/wizard-5.json`](fixtures/characters/golden/wizard-5.json) — PF2e Wizard 5
- [`fixtures/characters/golden/pf1e/fighter-5.json`](fixtures/characters/golden/pf1e/fighter-5.json) — PF1e Fighter 5
- [`fixtures/characters/golden/pf1e/wizard-5.json`](fixtures/characters/golden/pf1e/wizard-5.json) — PF1e Wizard 5
- [`fixtures/characters/golden/pf1e/fighter-2-wizard-3.json`](fixtures/characters/golden/pf1e/fighter-2-wizard-3.json) — PF1e Fighter 2 / Wizard 3
- [`content/pf1e/crb/`](content/pf1e/crb/) — PF1e CRB pack (batches 1–2 landed; next review AC/CMB — see pack design §6)

## License

[MIT](LICENSE)
