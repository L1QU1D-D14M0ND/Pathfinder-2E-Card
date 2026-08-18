# PF1e Advanced Player’s Guide pack (1.0 Synthesist)

**Status:** Slice 2 landed (documentary evolution names + fused overlay). **Next:** Synthesist golden. Spanish is a separate 1.0 track.  
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

## Slice 2 — documentary evolutions + fused overlay

**Pairing:** Evolution catalog ids (name stamp only) plus a fused STR/DEX/CON overlay and costume HP on the same sheet.

**In this slice:**

| Piece | What landed |
| --- | --- |
| Pack | `evolutions.json` — ids and names only (Bite, Claws, …). No point costs, no evolution text |
| Schema | `companions[]` may use `kind: eidolon` with optional `fused` and `evolutions[]`. No `schemaVersion` bump |
| Apply | Picking an evolution stamps id/name. Does **not** write fused scores, costume HP, natural armor, or attacks |
| Compute | While `fused.active`, physical ability mods, Fort, carry, dead-at, and `maxHp` use the overlay. Pilot scores stay on `abilities`. HD max stays on `derived.pilotMaxHp` |
| UI | Identity shows the overlay when Synthesist is selected. Abilities inputs remain the pilot |

**Out:** Auto-applied evolutions, Summoner spell list, Magical Child, a Synthesist golden, Spanish.

---

## Later slices (not this change)

1. Synthesist golden (Half-Elf Radiant Striker is the intended first table character when that increment starts).
2. Spanish (`es`) catalog — 1.0, independent of remaining Synthesist math.

---

## Document history

| Date | Change |
| --- | --- |
| 2026-08-18 | Slice 1: Summoner catalog + Synthesist name stamp; fused overlay waits |
| 2026-08-19 | Slice 2: documentary evolution names + fused STR/DEX/CON overlay and costume HP |
