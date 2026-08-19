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
- One IndexedDB draft (refresh restore). Not a character library
- `system: "pf2e"` written on PF2e Save; files without `system` still load as PF2e
- `system: "pf1e"` required on PF1e documents
- Auto-seeded standard skills per system
- PF1e martial + spell calc (Fighter 5, Wizard 5, and Fighter 2 / Wizard 3 goldens) and PF2e core calc
- CRB pack batches 1–13 landed (including Batch 7). Mechanics-only ([ADR 0007](../docs/adr/0007-content-licensing.md)). APG slice 2: evolution names + fused overlay ([`../docs/pf1e-apg-pack-design.md`](../docs/pf1e-apg-pack-design.md)). Next is a Synthesist golden, not more CRB encyclopedia rows.
- Save export strips `derived`
- Collapsible Tools sidebar (empty registry; Attack Helper, Actions List, and Budget Calculator wait until the sheet is ~90% done)
- PWA: `npm run build` emits a Workbox service worker + standalone manifest (CI `verify:pwa`). Install/offline checklist below
- Locale runtime (`I18nProvider` / `useT()`). Chrome + PF1e panels use `en.json`; `es.json` is a stub that falls back to English. PF2e panel literals remain

## PWA proof (0.9)

CI runs `npm run build` then `npm run verify:pwa` (**dist artifact** check: standalone manifest, 192/512 PNG icons, Workbox SW that precaches `index.html`). Runtime install/offline is the manual checklist below.

Manual once on a preview URL:

```bash
cd app
npm run build && npm run verify:pwa && npm run preview
```

1. Open the preview origin (localhost is treated as secure).
2. Install (browser install / “Add to Home Screen”).
3. Go offline and reload — the app shell should still load.
4. Save/Load `.json` still works; the IndexedDB draft is one sheet, not a library.

Product lock: [`../docs/adr/0003-multi-system-product-direction.md`](../docs/adr/0003-multi-system-product-direction.md). PF1e schema: [`../docs/adr/0006-pf1e-character-schema.md`](../docs/adr/0006-pf1e-character-schema.md).

Schemas: `../schemas/character.schema.json` (PF2e), `../schemas/pf1e/character.schema.json` (PF1e)

Golden fixtures: `../fixtures/characters/golden/fighter-5.json` (PF2e), `../fixtures/characters/golden/wizard-5.json` (PF2e), `../fixtures/characters/golden/pf1e/fighter-5.json` (PF1e), `../fixtures/characters/golden/pf1e/wizard-5.json` (PF1e), `../fixtures/characters/golden/pf1e/fighter-2-wizard-3.json` (PF1e), `../fixtures/characters/golden/pf1e/synthesist-5.json` (PF1e Synthesist)
