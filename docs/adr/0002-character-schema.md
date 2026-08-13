# ADR 0002 — Character document JSON schema v1

**Status:** Proposed (pending answers in schema-design-notes §QUESTIONS)  
**Date:** 2026-08-13  
**Context:** Product direction locked in ADR 0001; need a Save/Load document format before calc engine and UI.

## Decision

Introduce `schemas/character.schema.json` as **schemaVersion 1** for a single PC sheet:

- Authoritative **inputs** + **play state**
- Optional **`derived`** cache
- **`ContentRef`** with Remaster→legacy→custom provenance
- Open **`effects[]`** hooks and **`extensions`**
- Nested **`CompanionSheet`** subset (not full recursive documents)
- **`overrides`** map for manual totals
- No campaign-option block

## Consequences

- TypeScript app should validate on Load and before Save.
- Migrations required when `schemaVersion` increments.
- Cross-reference integrity (equipped item ids, etc.) enforced in app code.
- Open questions (bulk encoding, partial boosts, strike snapshots, etc.) tracked in [`../schema-design-notes.md`](../schema-design-notes.md).

## References

- [`../../schemas/character.schema.json`](../../schemas/character.schema.json)
- [`../../fixtures/characters/minimal.example.json`](../../fixtures/characters/minimal.example.json)
- [`../pf2e-dynamic-character-sheet-design.md`](../pf2e-dynamic-character-sheet-design.md)
- [`0001-product-direction.md`](0001-product-direction.md)
