# Pathfinder 2E Character sheet (app)

React + TypeScript + Vite PWA for a local PF2e player character sheet.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Features in this scaffold

- Spreadsheet-style placeholder UI (several tabs are counts or placeholders)
- New / Load / Save sheet (`.json`)
- Auto-seeded standard skills
- Save export strips `derived`
- Load checks `schemaVersion === 1` and a few required keys; it does **not** validate against `character.schema.json` yet
- PWA manifest + service worker configured via `vite-plugin-pwa` (not separately runtime-tested)
- UI strings are hardcoded English; message catalogs are not started

Schema: `../schemas/character.schema.json`
