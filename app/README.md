# Pathfinder 2E Character sheet (app)

React + TypeScript + Vite PWA for a local PF2e player character sheet.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Features in this scaffold

- Spreadsheet-style UI with identity, feats, spells, combat, inventory, and play editors
- New / Load / Save sheet (`.json`), validated against `character.schema.json`
- Auto-seeded standard skills
- Core calc engine (`compute`) for attributes, proficiency, HP, AC, skills, strikes, spell attack/DC, bulk, investiture
- Save export strips `derived`
- PWA manifest + service worker configured via `vite-plugin-pwa` (not separately runtime-tested)
- UI strings are hardcoded English; message catalogs are not started

Schema: `../schemas/character.schema.json`

Golden fixtures: `../fixtures/characters/golden/fighter-5.json`, `../fixtures/characters/golden/wizard-5.json`
