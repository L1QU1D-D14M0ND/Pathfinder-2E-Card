# Next increment — multi-system refactor, then PF1e

**Status:** Active sequencing document (2026-08-17)  
**Depends on:** [ADR 0003](adr/0003-multi-system-product-direction.md), [`ttrpg-character-sheet-design.md`](ttrpg-character-sheet-design.md), [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md)  
**Historical PF2e increment (T1/T3 executed, leftover goldens deprioritized):** [`next-increment-design.md`](next-increment-design.md)

This document **does** change product sequencing: PF1e is first; remaining PF2e 0.9 work waits. It does **not** reopen PF2e schema math (ADR 0002) or authorize deleting the PF2e slice.

---

## 1. Purpose

The repo is a working PF2e sheet (schema, `compute()`, Fighter 5, Wizard 5, spreadsheet editors). The new product is a **multi-system** sheet with **PF1e as the next playable system**.

The next **code** question is not “which PF2e golden is next?” It is: **make the shell multi-system without breaking PF2e, then start the PF1e schema/engine.**

---

## 2. Locked constraints

| Constraint | Source |
| --- | --- |
| Multi-system PWA, spreadsheet, React + TypeScript, MIT | ADR 0003 |
| PF1e development priority; PF2e slice must not regress | ADR 0003 |
| Existing Load files without `system` are PF2e | ADR 0003 |
| One sheet; Save/Load `.json`; no library, dice, VTT, house-rule flags | ADR 0003 |
| English 0.9 / Spanish 1.0; externalize strings | ADR 0003 (still not done) |
| PF2e documents still validate against `schemas/character.schema.json` until a dedicated move is part of Phase M | ADR 0002 |
| Core calcs only; unknown `effects[]` ignored | ADR 0003 |

Settled PF2e engineering (keep through the refactor): Vitest, Ajv 2020-12 reject-on-invalid, `compute(doc) → DerivedView`, override allow-list, Fighter 5 + Wizard 5 goldens.

---

## 3. Current snapshot (repo at the pivot)

| Area | What exists |
| --- | --- |
| Product docs | ADR 0003 + umbrella/PF1e designs (this change). Code still PF2e-titled |
| Schema | PF2e `character.schema.json` only |
| Engine | PF2e `app/src/engine` — proficiency ranks, typed stacking, one AC, MAP strikes, bulk, spell attack/DC |
| UI | PF2e spreadsheet tabs; hardcoded English |
| Goldens | `fighter-5.json`, `wizard-5.json` (PF2e) |
| Content | No packs |
| PF1e | Docs only |

---

## 4. Sequencing

Pick **one** primary path. Default is **M then 1e**.

### Option M — Multi-system refactor (required first)

Move today’s PF2e `character/` + `engine/` (+ sheet panels as needed) behind a `system` switch. Add `system: "pf2e"` on Save; default missing `system` to `pf2e` on Load. New sheet still creates PF2e until PF1e factory exists — or New offers PF2e only until Phase 1e.

**Done when:** all existing Vitest tests pass; Load of current goldens works; Save of those characters includes `system: "pf2e"` (fixtures updated if the schema requires the field).

### Option 1e — PF1e schema + Fighter 5 (after M)

Schema file, types, factory, `compute()` for martial core, Identity/Abilities/Skills/Combat editors enough to enter the Fighter 5 golden, Vitest.

### Option 2e — PF1e Wizard 5 + spells editor

Spell DC, slots, list rows; Wizard 5 golden.

### Option 3e — Multiclass golden

Fighter 2 / Wizard 3 (or equivalent); proves stacked BAB/saves. May be a thin engine+fixture increment if editors already allow two class rows.

### Option T4′ — i18n prelude

Extract current chrome to `en.json` **before** a large PF1e UI wave. Same rationale as the skipped T4. Recommended as a **thin prelude or parallel** to M/1e, not instead of them.

### Not next

- PF2e Cleric/Bard/Champion/Ranger goldens
- PF2e companion nested sheet
- PF2e Remaster content pack
- Spanish
- A third game system
- Full 1E bonus-type stacker or feat automation

### Recommendation

**M → 1e → 2e → 3e**, with T4′ as soon as new PF1e strings would otherwise land as literals. Content pack 3c after (or with) 3e, not before Fighter 5.

---

## 5. Work packages

### WP-M — Shell / discriminator

| Option | Notes |
| --- | --- |
| **M1. Folder move + `system` field** (recommended) | `app/src/systems/pf2e/…`; thin `app/src/shell`. Schema: add optional `system` enum to PF2e schema (`pf2e` only) so current files remain valid; Save writes `system` |
| M2. Wrapper envelope `{ system, character }` | Breaks every fixture; do not |
| M3. Parallel app / route | Two PWAs; rejects the product |

**Action:** keep `schemas/character.schema.json` path for PF2e in this increment (less churn). Add `system` as optional with default documentation; factory writes it.

### WP-1e — PF1e martial slice

Schema ADR + JSON Schema + types + factory + compute (abilities, BAB, saves, HP, AC trio, CMB/CMD, iteratives, skills, pounds) + Fighter 5 golden + enough UI to enter that character.

### WP-2e — PF1e caster slice

Spellcasting entry editor; DC; slots; Wizard 5 golden.

### WP-3e — Multiclass

Second class row; stacked progressions; multiclass golden.

### WP-F — i18n

`en.json` + `t(key)`; `character.meta.locale`; no `es` yet.

### WP-3c — PF1e CRB pack

After goldens can be typed by hand. Minimal ids for the three goldens.

---

## 6. Recommended default plan

| Step | Package | Deliverable |
| --- | --- | --- |
| 1 | Docs (this PR) | ADR 0003, umbrella + PF1e designs, roadmap |
| 2 | WP-M | Multi-system shell; PF2e goldens green; `system` on Save |
| 3 | WP-F (thin) | Extract existing English chrome |
| 4 | WP-1e | PF1e schema + martial `compute()` + Fighter 5 + New→PF1e |
| 5 | WP-2e | Wizard 5 + spells UI |
| 6 | WP-3e | Multiclass golden |
| 7 | WP-3c | Minimal CRB pack for golden ids |
| 8 | Platform | IndexedDB draft; PWA install/offline proof |
| 9 | 0.9 | English; PF1e bar; PF2e slice still works |
| 10 | Phase 4 | `es`; stability = 1.0 |
| 11 | Later | Leftover PF2e goldens/content; sidebar; more systems |

Steps 2–4 are the **next development increments** after this documentation change.

---

## 7. Definitions of done

### This documentation increment

- [x] ADR 0003 accepted in-repo; ADR 0001 marked superseded
- [x] Umbrella + PF1e system spec + PF1e schema notes
- [x] Roadmap tracks PF1e-first phases
- [x] PF2e design/schema docs labeled as system specs, not the app 0.9 bar

### Phase M

- [ ] `system` on saved PF2e documents
- [ ] Load without `system` still works (current goldens)
- [ ] PF2e unit + golden tests pass
- [ ] Code layout does not import PF2e math from a PF1e module (or vice versa)

### Phase 1e

- [ ] PF1e schema validates Load/Save
- [ ] `compute()` for martial core
- [ ] Fighter 5 golden
- [ ] New sheet can create PF1e

### PF1e 0.9 bar

- [ ] Fighter 5, Wizard 5, multiclass goldens
- [ ] Editors for those domains (no familiar nested sheet)
- [ ] `en` catalog (no new hardcoded chrome)
- [ ] PWA install + offline proven once
- [ ] PF2e Fighter 5 / Wizard 5 still pass

---

## 8. Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| M1 | Refactor breaks PF2e goldens | Move first, no math changes; keep tests green |
| M2 | One shared `CharacterDocument` type grows `#ifdef` fields | Separate types; union at the shell |
| P2 | 1E bonus-type rabbit hole | Explicit AC fields in 0.9 ([PF1e design §4.3](pf1e-character-sheet-design.md)) |
| N3 | UI strings proliferate | T4′ before PF1e editor wave |
| N2 | Content licensing | No scrape; curated CRB; OGL review before shipping text |
| S1 | Repo still named Pathfinder-2E-Card | Working title in docs/chrome; rename is a later decision |

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | First multi-system / PF1e-first increment plan |
