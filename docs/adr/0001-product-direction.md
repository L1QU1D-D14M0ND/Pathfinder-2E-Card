# ADR 0001 — Product direction for PF2e character sheet

**Status:** Accepted  
**Date:** 2026-08-13  
**Context:** Initial design options discussed; stakeholder answered priority questions.

## Decision

Build a **lightweight, locally running, mobile-compatible** Pathfinder Second Edition character sheet with a **spreadsheet-style placeholder UI**, supporting **Build and Play**.

| Area | Choice |
| --- | --- |
| Platform | Local (PWA / static web primary); mobile browsers supported |
| UI | Excel-like tables/tabs; no fancy UI or animations |
| Ruleset | Remaster-first; legacy fallback on missing data or errors |
| 1.0 calcs | Core math only |
| Extensibility | Schema and resolver must allow later complex feat/spell/mechanic effects |
| Content | Core content pack(s) for now |
| Save | Local only (autosave + JSON export/import) |
| Scope | All character types in the data model |
| Modes | Build and Play |
| Interop | No Pathbuilder/Foundry integration for now |

## Consequences

- Prefer a static/PWA frontend over a mandatory cloud backend.
- Invest in character JSON schema, modifier resolver hooks, and Remaster/legacy content layers early.
- Defer card-centric UX (repo name notwithstanding) until after functional spreadsheet MVP.
- 1.0 success is measured by complete data coverage + correct core calcs + reliable local save, not by automation completeness.

## References

- [`../pf2e-dynamic-character-sheet-design.md`](../pf2e-dynamic-character-sheet-design.md)
