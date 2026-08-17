# Schemas

JSON Schema definitions for TTRPG Character Sheet save formats (repo: Pathfinder-2E-Card).

| File | Purpose |
| --- | --- |
| [`character.schema.json`](character.schema.json) | One **PF2e** PC character sheet document (`schemaVersion` 1). [ADR 0002](../docs/adr/0002-character-schema.md). |

A PF1e schema is planned under a later ADR ([target notes](../docs/pf1e-schema-design-notes.md)). Do not add First Edition fields to `character.schema.json`. Optional `system` is `"pf2e"`; files without it still load as PF2e. Save always writes `system`.

Design notes: [`../docs/schema-design-notes.md`](../docs/schema-design-notes.md) (PF2e).

Examples (all PF2e):

- [`../fixtures/characters/minimal.example.json`](../fixtures/characters/minimal.example.json) — minimal valid document
- [`../fixtures/characters/new-sheet.example.json`](../fixtures/characters/new-sheet.example.json) — factory-style sheet with auto-seeded skills
- [`../fixtures/characters/golden/fighter-5.json`](../fixtures/characters/golden/fighter-5.json) — Fighter 5 golden test character
- [`../fixtures/characters/golden/wizard-5.json`](../fixtures/characters/golden/wizard-5.json) — Wizard 5 golden test character
