# ADR 0001 — Product direction for PF2e character sheet

**Status:** Accepted (amended)  
**Date:** 2026-08-13  
**Context:** Stakeholder answered product questions across two rounds.

## Decision

Build a **lightweight installable PWA** Pathfinder Second Edition **player** character sheet with a **spreadsheet-style** UI, **Build + Play**, and **TypeScript**.

| Area | Choice |
| --- | --- |
| Platform | Installable PWA; offline after install; mobile-compatible |
| UI | Excel-like tables/tabs; no fancy UI or animations |
| Ruleset | Remaster-first; legacy fallback on missing data or errors |
| Content books | Player Core + Player Core 2 (player-facing only; no GM exclusives) |
| Later reference UI | Sidebar with Spells / Afflictions / Actions (e.g. combat maneuvers) |
| 0.9/1.0 calcs | Core math only |
| Extensibility | Schema/resolver allow later complex feat/spell/mechanic effects |
| Persistence | One active sheet; Save sheet / Load sheet (local JSON); optional single draft buffer |
| Character types | All player character types in the data model |
| Modes | Build and Play |
| Dice | No dice roller |
| i18n | English in 0.9; Spanish in 1.0 (strings externalized from the start) |
| Language | TypeScript |
| Interop | No Pathbuilder/Foundry integration for now |
| License | Open source (exact SPDX pending final pick) |

## Consequences

- No multi-character in-app library; file Save/Load is the source of truth between sessions/devices.
- Content pipeline limited to player-facing PC1/PC2 (+ legacy fallback), not GM Core exclusives.
- i18n infrastructure required before 0.9 even though Spanish ships at 1.0.
- Card-centric UX and reference sidebar stay post-placeholder.

## Still open (see design doc §12)

- Content acquisition: hand-maintained vs open-data vs hybrid  
- Campaign option stubs (e.g. Free Archetype)  
- Golden-test reference characters  
- Exact open-source license (MIT recommended)

## References

- [`../pf2e-dynamic-character-sheet-design.md`](../pf2e-dynamic-character-sheet-design.md)
