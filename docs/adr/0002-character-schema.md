# ADR 0002 — Character document JSON schema v1

**Status:** Accepted  
**Date:** 2026-08-13  
**Context:** Product direction locked in ADR 0001; Save/Load format needed before calc engine and UI. Stakeholder answered schema open questions.

## Decision

Use `schemas/character.schema.json` as **schemaVersion 1** for a single PC sheet:

- Authoritative **inputs** + **play state**
- Optional **`derived`** cache — **omitted on Save sheet**
- **`ContentRef`** with Remaster→legacy→custom provenance
- Open **`effects[]`** hooks and **`extensions`**
- Nested **`CompanionSheet`** subset
- **`overrides`** map for manual totals
- No campaign-option block
- **Decimal bulk** (`0.1` = 1L)
- **User-entered final attribute boosts** (no partial pairing automation yet)
- **Auto-seed** standard skills in the app factory
- **Strike snapshots** linked by `itemId`
- **One shared focus pool** on `play`
- **No maximum character level** in schema
- Content ids: kebab-case paths (`class.fighter`, …)

## Consequences

- The app **must** validate documents against `schemas/character.schema.json` on Load and before Save.
- **Current (scaffold):** Load checks `schemaVersion === 1` and that `identity`, `meta`, and `attributes` exist. It does not run JSON Schema validation. Save strips `derived` and does not schema-validate.
- Save serializer strips `derived`.
- New-character factory inserts the 16 standard skills.
- Level-up / proficiency math must not assume a max level of 20.
- Migrations required when `schemaVersion` increments.

## References

- [`../../schemas/character.schema.json`](../../schemas/character.schema.json)
- [`../../fixtures/characters/minimal.example.json`](../../fixtures/characters/minimal.example.json)
- [`../schema-design-notes.md`](../schema-design-notes.md)
- [`0001-product-direction.md`](0001-product-direction.md)
