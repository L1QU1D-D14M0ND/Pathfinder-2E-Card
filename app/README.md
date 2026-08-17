# TTRPG Character Sheet (app)

React + TypeScript + Vite PWA. Working product title: **TTRPG Character Sheet**. Current chrome and package name are still Pathfinder 2E until Phase M.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Features in this scaffold (PF2e)

- Spreadsheet-style UI with identity, feats, spells, combat, inventory, and play editors
- New / Load / Save sheet (`.json`), validated against `character.schema.json`
- Auto-seeded standard PF2e skills
- Core calc engine (`compute`) for attributes, proficiency, HP, AC, skills, strikes, spell attack/DC, bulk, investiture
- Save export strips `derived`
- PWA manifest + service worker configured via `vite-plugin-pwa` (not separately runtime-tested)
- UI strings are hardcoded English; message catalogs are not started

PF1e types/engine/UI are not in this package yet. Product lock: [`../docs/adr/0003-multi-system-product-direction.md`](../docs/adr/0003-multi-system-product-direction.md).

Schema: `../schemas/character.schema.json` (PF2e)

Golden fixtures: `../fixtures/characters/golden/fighter-5.json`, `../fixtures/characters/golden/wizard-5.json` (PF2e)
