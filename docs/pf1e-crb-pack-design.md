# PF1e Core Rulebook pack (Phase 3c)

**Status:** Started (2026-08-17). Batch 1 of a slow, two-mechanics-at-a-time review.  
**Parent:** [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md) §7, [ADR 0003](adr/0003-multi-system-product-direction.md)  
**On disk:** [`../content/pf1e/crb/`](../content/pf1e/crb/)  
**Code:** `app/src/systems/pf1e/content/` (lookup only; unknown ids do not fail Load)

This is not a dump of the Core Rulebook. Each batch takes **two character-creation / core-math mechanics**, checks the CRB procedure, maps it onto the sheet (or records the intended implementation), and only then adds the smallest catalog slice those mechanics need.

No class flavor text, no spell descriptions, no Product Identity. This batch ships **numeric progression metadata** and **engine formulas**.

---

## 1. How a batch works

For each mechanic:

1. **CRB rule** — what the Core Rulebook tells a player to do (procedure and table), in our own words.
2. **App today** — schema field, `compute()` helper, UI control, golden coverage.
3. **Gaps** — missing, approximated, or easy to misuse. 0.9 vs later.
4. **Pack slice** — catalog ids / tables to add *now*, or “engine-owned, no catalog row.”
5. **Tests** — Vitest against published table numbers, not against a second copy of the formula alone.

Do **not** add the next two mechanics in the same PR unless they are required to test this batch.

Resolver rule (locked): missing catalog id → treat as **custom**; isolate to that row; never reject the whole sheet.

---

## 2. Mechanic queue (character basics)

Order is CRB character-build order, not encyclopedia order. Sidebar tools stay out.

| Batch | Mechanics | Status |
| --- | --- | --- |
| **1** | Ability scores → modifiers; BAB + save progressions (and how they stack) | **This document** |
| 2 | Hit points (HD + Con + favored); iterative attacks from BAB | Next |
| 3 | AC / touch / flat-footed; CMB / CMD | |
| 4 | Skills (ranks, class +3, ACP, max ranks) | |
| 5 | Size (AC/attack vs CMB/CMD vs carry) | |
| 6 | Encumbrance (Strength table, light/medium/heavy) | |
| 7 | Spell DC; bonus spells from ability | Already in engine; pack review later |
| 8 | Race (Human first — golden) | Catalog |
| 9 | Class skills + skill points per level (Fighter, Wizard) | Catalog |
| 10 | Weapons / armor on the three goldens | Catalog |
| … | Feats, spells metadata, remaining 9 CRB classes | After goldens can be rebuilt from ids |

---

## 3. Pack layout

```text
content/pf1e/crb/
  README.md          # license / what is in this folder
  pack.json          # manifest + which batches have landed
  classes.json       # progression metadata only (batch 1: fighter, wizard)
```

A class catalog row in this phase is **not** a class description. It is:

| Field | Why |
| --- | --- |
| `id` | `class.fighter`, `class.wizard` |
| `name` | Display label |
| `hitDie` | d10 / d6 / … (HP batch will use this; stored now because it is on the class table) |
| `babProgression` | `full` / `threeQuarter` / `half` |
| `saves.fort/ref/will` | `good` / `poor` |
| `source.book` | `"CRB"` — page omitted until we cite without copying tables as images |

Class skills, features, spells/day, and proficiency lists wait for later batches.

---

## 4. License (this folder)

- **App code:** MIT.
- **This pack:** curated **game mechanics numbers** (formulas and class HD/BAB/save tags). No Paizo logos, no setting names beyond the mechanical class names already used as catalog ids, no copied prose.
- Do not scrape d20pfsrd / Archives of Nethys / Hero Lab as the ship pack.
- Full OGL 1.0a Section 15 / Product Identity review happens before any **rules text** or **spell summaries** land. Batch 1 does not need that text.

---

## Batch 1 — two mechanics

### 4.1 Ability scores and modifiers

**CRB (player-facing):** Each character has six ability scores: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma. The **ability modifier** for a score is read from the Ability Modifiers table, which is exactly:

`modifier = floor((score − 10) / 2)`

Examples: 1 → −5; 8–9 → −1; 10–11 → 0; 12–13 → +1; 18–19 → +4; 20–21 → +5. Odd and even scores in a pair share a modifier. There is **no maximum score** in the table (magic items and spells can raise scores past 18).

How the score is *generated* (4d6 drop lowest, point-buy, elite array) is a campaign choice. The sheet stores the **final score after racial adjustments**.

Temporary bonuses that **increase the score** (belt of giant strength, *bull’s strength*) change the score, then the modifier is recomputed. Bonuses that apply to **checks** but not the score are a different layer (later typed-bonus work).

**App today:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `abilities.{str…cha}.score` | Integer; no schema max |
| Extra | `tempModifier` | **Added to the modifier after** `floor((score−10)/2)` — not added to the score |
| Engine | `abilityModifierFromScore`, `abilityModifiers` in `engine/abilities.ts` | Used by AC, CMB, skills, saves, spell DC, attacks, load (Strength **score**, not modifier, for encumbrance) |
| UI | Abilities tab: Score, Temp mod, derived Modifier | |
| Goldens | Fighter 5, Wizard 5, Fighter 2 / Wizard 3 | Assert the six modifiers |

**Verdict:** The **formula is correct** and matches the CRB table. Encumberance correctly uses the **score**, not the modifier.

**Gaps (do not fix in this batch unless they block goldens):**

| Gap | Why it waits |
| --- | --- |
| `tempModifier` is a modifier addend, not a score increase | A +4 belt should be entered as score 18→22 (modifier +6), not temp +4 (which would yield modifier +8 on a 18). Documented on the Abilities tab. A later “ability score bonus” field could exist; do not silently treat temp as a score bump. |
| No point-buy / 4d6 helper | User types the final score. Out of 0.9 core calc. |
| No racial ability adjustments as catalog | Human +2 any is entered in the score. Race pack is batch 8. |
| Score 0 / negative | Formula still applies (`0` → −5). CON 0 as “dead” is play-state later, not this formula. |
| Ability damage / drain | CRB lowers the score. User lowers `score`. No separate track in 0.9. |

**Pack slice:** none. This table is **engine-owned** (small, closed formula). Do not duplicate it as a JSON lookup of every score.

**Tests:** CRB sample scores including odd values, 1, 20, and a high score (45). `tempModifier` adds to the modifier only.

---

### 4.2 Base attack bonus and saving throws

**CRB (player-facing):** Each class has a **base attack bonus** progression and three **base save** progressions (Fortitude, Reflex, Will), each **good** or **poor**.

Published class tables (levels 1–20) match these formulas:

| Progression | Formula | Level 1 | Level 5 | Level 20 |
| --- | --- | --- | --- | --- |
| BAB full (Fighter, Barbarian, Paladin, Ranger) | `levels` | +1 | +5 | +20 |
| BAB ¾ (Cleric, Druid, Rogue, Bard, Monk) | `floor(levels × 3 / 4)` | +0 | +3 | +15 |
| BAB ½ (Wizard, Sorcerer) | `floor(levels / 2)` | +0 | +2 | +10 |
| Save good | `2 + floor(levels / 2)` | +2 | +4 | +12 |
| Save poor | `floor(levels / 3)` | +0 | +1 | +6 |

**Multiclass (CRB):** Add the **integer** BAB from each class, and the **integer** base save from each class. Do **not** add all class levels together and then look up one table. Do **not** use the optional “fractional BAB/saves” house rule in 0.9.

Example (golden): Fighter 2 (full BAB +2, Fort good +3, Ref poor +0, Will poor +0) + Wizard 3 (half BAB +1, Fort poor +1, Ref poor +1, Will good +3) → BAB **+3**, base Fort **+4**, base Ref **+1**, base Will **+3**. Ability modifiers are applied **after** that stack (Fort + Con, etc.).

**Iterative attacks** (extra attacks at BAB +6 / +11 / +16, −5 steps) are a **use of BAB**, not the BAB table itself. They are **batch 2**. Already coded; not expanded in this batch.

**App today:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `classes[].babProgression`, `classes[].saves`, `classes[].levels` | User-entered per row |
| Engine | `babFromProgression`, `saveFromProgression`, `stackedBab`, `stackedSave` | Per-row then sum |
| Derived | `derived.bab`, `fortitude` / `reflex` / `will` (base + ability + misc) | Combat tab |
| UI | Identity class table: HD, BAB, Fort/Ref/Will selects | Catalog did not fill these |
| Goldens | Fighter 5 BAB 5; Wizard 5 BAB 2; F2/W3 BAB 3 | Spot checks, not 1–20 tables |

**Verdict:** Formulas and **per-class stacking** match CRB. Empty sheet (no class rows) yields BAB 0 and base saves 0, which is correct for “no class.”

**Gaps:**

| Gap | Why it waits / this batch |
| --- | --- |
| Identity did not stamp HD/BAB/saves from `class.fighter` | **This batch:** catalog + apply when the player picks a CRB class. Custom rows stay fully manual. |
| Only Fighter and Wizard in the pack | Other 9 CRB classes use the same three BAB tags; add them when we review those classes, not all at once. |
| Fractional BAB/saves | Optional variant. Out. |
| Prestige class tables | Out of 0.9 goldens. |
| Saves include ability + misc in `derived.fortitude` | Correct CRB total; base-only is not a separate derived field. Goldens assert the **total**. |

**Pack slice:** `classes.json` with **Fighter** and **Wizard** progression tags only.

**Tests:** Full 1–20 BAB (all three tags) and save (good/poor) tables; catalog rows match those tags; unknown id resolves to miss; applying `class.fighter` onto an empty class row yields d10 / full / good Fort.

---

## 5. Resolver (batch 1)

```ts
lookupCrbClass(id) → CrbClassProgression | null
applyCrbClassProgression(classRow, id) → ClassEntry
```

- Known id → fill `class` ref, `hitDie`, `babProgression`, `saves`. Leave `levels` and favored-class totals alone.
- Unknown or empty id → `null` / custom (`class.id` cleared). Do not throw.
- Load of an existing sheet **does not** re-apply the catalog (the saved row is authoritative). Apply is a UI action when the player picks a class.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Phase 3c opened. Batch 1: ability modifiers + BAB/save progressions; Fighter/Wizard catalog tags |
