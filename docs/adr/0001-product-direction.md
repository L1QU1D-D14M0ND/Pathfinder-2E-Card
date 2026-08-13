# ADR 0001 — Product direction for PF2e character sheet

**Status:** Accepted  
**Date:** 2026-08-13  
**Context:** Stakeholder answered product questions across three rounds; design lock complete.

## Decision

Build a **lightweight installable PWA** Pathfinder Second Edition **player** character sheet with a **spreadsheet-style** UI, **Build + Play**, and **TypeScript**, under the **MIT** license.

| Area | Choice |
| --- | --- |
| Platform | Installable PWA; offline after install; mobile-compatible |
| UI | Excel-like tables/tabs; no fancy UI or animations |
| Ruleset | Remaster-first; legacy fallback on missing data or errors |
| Content books | Player Core + Player Core 2 (player-facing only; no GM exclusives) |
| Content acquisition | Hybrid — curated pack first; optional attributed open/ORC import later |
| Later reference UI | Sidebar with Spells / Afflictions / Actions (e.g. combat maneuvers) |
| 0.9/1.0 calcs | Core math only |
| Extensibility | Schema/resolver allow later complex feat/spell/mechanic effects |
| Persistence | One active sheet; Save sheet / Load sheet (local JSON); optional single draft buffer |
| Character types | All player character types in the data model |
| Modes | Build and Play |
| Dice | No dice roller |
| Campaign options | Omit house-rule flags (e.g. Free Archetype) for 0.9/1.0 |
| i18n | English in 0.9; Spanish in 1.0 (strings externalized from the start) |
| Language | TypeScript |
| Interop | No Pathbuilder/Foundry integration for now |
| License | MIT |
| Golden tests | Fighter 5; Wizard/Witch 5; Bard/Sorcerer 5; Cleric 5; companion user; one PC2 class |

## Consequences

- No multi-character in-app library; file Save/Load is the source of truth between sessions/devices.
- Content starts curated; open-data import is optional and license-gated.
- Users on Free Archetype tables add extra feats as custom rows until a later optional feature.
- i18n infrastructure required before 0.9 even though Spanish ships at 1.0.
- Card-centric UX and reference sidebar stay post-placeholder.

## References

- [`../pf2e-dynamic-character-sheet-design.md`](../pf2e-dynamic-character-sheet-design.md)
- [`../../LICENSE`](../../LICENSE)
