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

- Spreadsheet-style placeholder UI (Feats / Spells tabs are still counts or placeholders)
- New / Load / Save sheet (`.json`), validated against `character.schema.json`
- Auto-seeded standard skills
- Core calc engine (`compute`) for attributes, proficiency, HP, AC, skills, strikes, bulk, investiture
- Save export strips `derived`
- PWA manifest + service worker configured via `vite-plugin-pwa` (not separately runtime-tested)
- UI strings are hardcoded English; message catalogs are not started

Schema: `../schemas/character.schema.json`

Golden fixture: `../fixtures/characters/golden/fighter-5.json`
