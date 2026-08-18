# PF1e Advanced Player’s Guide pack (1.0 Synthesist)

**Status:** Slice 1 landed (Summoner catalog + Synthesist name). **Next:** documentary evolution names + fused overlay (not auto-applied). Spanish is a separate 1.0 track.  
**Parent:** [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md) decisions 16 and 20, [ADR 0007](adr/0007-content-licensing.md)  
**On disk:** [`../content/pf1e/apg/`](../content/pf1e/apg/)  
**Code:** `app/src/systems/pf1e/content/apgPack.ts` (apply reuses the CRB class path)

This pack is **not** the CRB folder. **Never** add `class.summoner` to `content/pf1e/crb/`.

---

## License

Mechanics-only until rules text ([ADR 0007](adr/0007-content-licensing.md), [`content-licensing.md`](content-licensing.md)).

- Ids, names, HD / BAB / save tags, class-skill keys, skill points per level.
- No class flavor, eidolon prose, evolution **text**, or spell descriptions.
- `pack.json` has `contentKind: mechanics-only` and `oglNoticeRequired: false`.
- Vitest [`licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts) scans this folder with the CRB pack.

---

## Slice 1 — Summoner class + Synthesist name

**Pairing:** Catalog id for Summoner using the same row shape as CRB classes. Documentary Synthesist archetype (id + name).

**Already in the app:** Identity class select, `applyCrbClassProgression`, class-skill stamp, skill-rank pool, stacked BAB/saves. Unknown ids still resolve to custom.

**In this slice:**

| Piece | What landed |
| --- | --- |
| Pack | `content/pf1e/apg/classes.json` one row: `class.summoner` / Summoner / d8 / ¾ BAB / poor Fort, poor Ref, good Will / 2 skill points / APG class skills (no Craft/Profession wildcards) |
| Pack | `archetypes.json` one row: `archetype.synthesist` / Synthesist / `classId: class.summoner` |
| Apply | Picking Summoner stamps HD/BAB/saves/skill points and class-skill checkboxes. Does **not** add a spellcasting entry, features, or fused scores |
| Archetype | Optional `classes[].archetype` ContentRef. Stamps name only. Leaving Summoner clears it |
| Lookup | `lookupCrbClass('class.summoner')` stays null. `lookupApgClass` finds it |

**Out:** Fused STR/DEX/CON overlay, costume HP, evolution rows, Summoner spell list, Magical Child / other APG classes, a Synthesist golden, Spanish.

---

## Later slices (not this change)

1. Documentary evolution **names** (same honesty as CRB feats).
2. Fused overlay on the same sheet (pilot vs fused physical scores; costume HP). Evolutions stay typed — not auto-applied.
3. Synthesist golden (Half-Elf Radiant Striker is the intended first table character when that increment starts).
4. Spanish (`es`) catalog — 1.0, independent of remaining Synthesist math.

---

## Document history

| Date | Change |
| --- | --- |
| 2026-08-18 | Slice 1: Summoner catalog + Synthesist name stamp; fused overlay waits |
