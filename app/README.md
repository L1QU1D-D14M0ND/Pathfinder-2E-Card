# TTRPG Character Sheet (app)

React + TypeScript + Vite PWA. Working product title: **TTRPG Character Sheet**.

Layout:

- `src/shared` — ids, signed, Ajv helper, file IO, `DerivedCell`
- `src/shell` — chrome, Save/Load dispatch by `system`, empty Tools sidebar
- `src/systems/pf1e` — PF1e schema types, martial `compute()`, spreadsheet workspace
- `src/systems/pf2e` — PF2e schema types, `compute()`, spreadsheet workspace

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Features

- Spreadsheet-style UI per system (PF1e: classes/abilities/skills/combat; PF2e: existing editors)
- New / Load / Save sheet (`.json`). New sheet asks PF1e vs PF2e. Load dispatches on `system`
- `system: "pf2e"` written on PF2e Save; files without `system` still load as PF2e
- `system: "pf1e"` required on PF1e documents
- Auto-seeded standard skills per system
- PF1e martial + spell calc (Fighter 5, Wizard 5, and Fighter 2 / Wizard 3 goldens) and PF2e core calc
- CRB pack batch 1: Fighter/Wizard HD/BAB/save tags; ability modifier formula reviewed against CRB
- Save export strips `derived`
- Collapsible Tools sidebar (empty registry; Attack Helper, Actions List, and Budget Calculator wait until the sheet is ~90% done)
- PWA manifest + service worker configured via `vite-plugin-pwa` (not separately runtime-tested)
- UI strings are hardcoded English; message catalogs are not started

Product lock: [`../docs/adr/0003-multi-system-product-direction.md`](../docs/adr/0003-multi-system-product-direction.md). PF1e schema: [`../docs/adr/0006-pf1e-character-schema.md`](../docs/adr/0006-pf1e-character-schema.md).

Schemas: `../schemas/character.schema.json` (PF2e), `../schemas/pf1e/character.schema.json` (PF1e)

Golden fixtures: `../fixtures/characters/golden/fighter-5.json` (PF2e), `../fixtures/characters/golden/wizard-5.json` (PF2e), `../fixtures/characters/golden/pf1e/fighter-5.json` (PF1e), `../fixtures/characters/golden/pf1e/wizard-5.json` (PF1e), `../fixtures/characters/golden/pf1e/fighter-2-wizard-3.json` (PF1e)
