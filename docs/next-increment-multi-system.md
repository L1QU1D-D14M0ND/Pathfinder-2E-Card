# Next increment — multi-system refactor, then PF1e

**Status:** Active sequencing document (2026-08-18)  
**Depends on:** [ADR 0003](adr/0003-multi-system-product-direction.md), [ADR 0004](adr/0004-shared-kernel.md), [ADR 0005](adr/0005-sidebar-host.md), [`ttrpg-character-sheet-design.md`](ttrpg-character-sheet-design.md), [`shared-kernel-design.md`](shared-kernel-design.md), [`sidebar-host-design.md`](sidebar-host-design.md), [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md)  
**Historical PF2e increment (T1/T3 executed, leftover goldens deprioritized):** [`next-increment-design.md`](next-increment-design.md)

This document **does** change product sequencing: PF1e is first; remaining PF2e 0.9 work waits. It does **not** reopen PF2e schema math (ADR 0002) or authorize deleting the PF2e slice.

---

## 1. Purpose

The repo is a working PF2e sheet (schema, `compute()`, Fighter 5, Wizard 5, spreadsheet editors). The new product is a **multi-system** sheet with **PF1e as the next playable system**.

The next **code** increment is **Phase 3c batch 4** (skills: ranks, class +3, ACP). Batches 1–3 are in the repo (batch 3 is AC/CMB table tests). Rank-cap warning and untrained blanks already landed; class-skill lists wait for batch 9. After 4: size (5), encumbrance (6), then catalog Human / class skills / weapons (8–10). Annotated queue: [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §6. Sidebar **tools** wait until the character sheet is ~90% done. Named later: Attack Helper, Actions List, Budget Calculator.

---

## 2. Locked constraints

| Constraint | Source |
| --- | --- |
| Multi-system PWA, spreadsheet, React + TypeScript, MIT | ADR 0003 |
| PF1e development priority; PF2e slice must not regress | ADR 0003 |
| Existing Load files without `system` are PF2e | ADR 0003 |
| One sheet; Save/Load `.json`; no library, dice, VTT, house-rule flags | ADR 0003 |
| English 0.9 / Spanish 1.0; chrome catalog landed | ADR 0003 (T4′) |
| PF2e documents still validate against `schemas/character.schema.json` until a dedicated move is part of Phase M | ADR 0002 |
| Core calcs only; unknown `effects[]` ignored | ADR 0003 |
| Sidebar host when a sheet is loaded; tools TBD; empty host OK for 0.9 | ADR 0005 |

Settled PF2e engineering (keep through the refactor): Vitest, Ajv 2020-12 reject-on-invalid, `compute(doc) → DerivedView`, override allow-list, Fighter 5 + Wizard 5 goldens.

---

## 3. Current snapshot (repo at the pivot)

| Area | What exists |
| --- | --- |
| Product docs | ADR 0003–0006 + umbrella/PF1e/kernel/sidebar + Attack Helper + Actions List + Budget Calculator specs |
| Layout | `app/src/shared`, `shell`, `systems/pf1e`, `systems/pf2e` |
| Schema | PF2e `character.schema.json`; PF1e `schemas/pf1e/character.schema.json` |
| Engine | PF1e martial + spell DC/bonus slots; PF2e under `systems/pf2e/engine` |
| UI | PF1e + PF2e workspaces (PF1e Spells tab); empty Tools sidebar |
| Goldens | PF2e `fighter-5.json`, `wizard-5.json`; PF1e `golden/pf1e/fighter-5.json`, `wizard-5.json`, `fighter-2-wizard-3.json` |
| Content | `content/pf1e/crb/` batches 1–3 landed; upcoming batches annotated in the pack design (§6). Next code: batch 4 skills |

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

### Option Sb — Sidebar host (after M, not instead of 1e)

Wire the collapsible rail + registry + `SidebarToolContext`. Zero tools is a valid empty state. Do **not** invent placeholder widgets.

### Not next

- PF2e Cleric/Bard/Champion/Ranger goldens
- PF2e companion nested sheet
- PF2e Remaster content pack
- Spanish
- A third game system
- Full 1E bonus-type stacker or feat automation
- Named sidebar tools except documenting **Attack Helper**, **Actions List**, and **Budget Calculator** for later (do not implement them in M/Sb/1e/2e/3e)

### Recommendation

**1e → 2e → 3e**, with T4′ before a large remaining-UI wave. Content pack 3c after (or with) 3e. **Attack Helper**, **Actions List**, and **Budget Calculator** wait until the character sheet is ~90% done (not during schema/engine work).

---

## 5. Work packages

### WP-M — Shell / discriminator + kernel

| Option | Notes |
| --- | --- |
| **M1. Kernel + folder move + `system` field** (recommended) | `app/src/shared`, `app/src/shell`, `app/src/systems/pf2e`. Lift IDs, signed, Ajv helper, strip-derived, file IO. Schema: add optional `system` enum to PF2e schema (`pf2e` only); Save writes `system`. Register PF2e as the only `SystemModule`. See [shared kernel §12](shared-kernel-design.md). |
| M2. Wrapper envelope `{ system, character }` | Breaks every fixture; do not |
| M3. Parallel app / route | Two PWAs; rejects the product |
| M4. Shared `CharacterDocument` with optional 1E fields | Forbidden by ADR 0004 |

**Action:** keep `schemas/character.schema.json` path for PF2e in this increment (less churn). Do **not** extract `SheetTable` or a bonus-type library in M. Genericize `applyOverrides` only if PF2e tests stay green with an allow-list callback; otherwise move it with PF2e and genericize in 1e. Leave CSS/layout room for a sidebar rail.

### WP-Sb — Sidebar host

Collapsible `<aside>`, tool registry, empty state, context `{ character, derived, update }`. No named tools. See [`sidebar-host-design.md`](sidebar-host-design.md).

### WP-1e — PF1e martial slice

Schema ADR + JSON Schema + types + factory + compute (abilities, BAB, saves, HP, AC trio, CMB/CMD, iteratives, skills, pounds) + Fighter 5 golden + enough UI to enter that character.

### WP-2e — PF1e caster slice

Spellcasting entry editor; DC; slots; Wizard 5 golden.

### WP-3e — Multiclass

Second class row; stacked progressions; multiclass golden.

### WP-F — i18n

`en.json` + `t(key)`; `character.meta.locale`; no `es` yet.

### WP-3c — PF1e CRB pack

After goldens can be typed by hand. Review CRB character mechanics **two at a time** ([`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §2 and §6). Batch 1: ability modifiers (engine) + BAB/save tags (Fighter, Wizard catalog). Batch 2: HP breakdown (manual HD rolls) + iterative slash notation. **Next: batch 3** AC/touch/FF + CMB/CMD (engine review, no catalog). Then 4 skills, 5 size, 6 encumbrance; catalog 8–10 after that. Resolver: miss → custom; do not fail Load.

---

## 6. Recommended default plan

| Step | Package | Deliverable |
| --- | --- | --- |
| 1 | Docs (this PR) | ADR 0003–0005, umbrella + PF1e + kernel + sidebar host, roadmap |
| 2 | WP-M | Shared kernel + multi-system shell; PF2e goldens green; `system` on Save; layout room for rail |
| 3 | WP-F (thin) | Extract existing English chrome |
| 4 | WP-1e | PF1e schema + martial `compute()` + Fighter 5 + New→PF1e |
| 5 | WP-2e | Wizard 5 + spells UI |
| 6 | WP-3e | Multiclass golden |
| 7 | WP-3c | Minimal CRB pack for golden ids |
| 7b | WP-Sb | Sidebar host (empty registry); after M, not blocking 1e |
| 8 | Platform | IndexedDB draft; PWA install/offline proof |
| 9 | 0.9 | English; PF1e bar; PF2e slice still works; sidebar host may be empty |
| 10 | Phase 4 | `es`; stability = 1.0 |
| 11 | Later | Leftover PF2e goldens/content; **sidebar tools** when specified; more systems |

Steps 2–4 are the **next development increments** after this documentation change.

---

## 7. Definitions of done

### This documentation increment

- [x] ADR 0003 accepted in-repo; ADR 0001 marked superseded
- [x] Umbrella + PF1e system spec + PF1e schema notes
- [x] Roadmap tracks PF1e-first phases
- [x] PF2e design/schema docs labeled as system specs, not the app 0.9 bar
- [x] Shared-kernel inventory ([ADR 0004](adr/0004-shared-kernel.md), [`shared-kernel-design.md`](shared-kernel-design.md))
- [x] Sidebar host lock ([ADR 0005](adr/0005-sidebar-host.md), [`sidebar-host-design.md`](sidebar-host-design.md))

### Phase M

- [x] `system` on saved PF2e documents
- [x] Load without `system` still works (current goldens)
- [x] PF2e unit + golden tests pass
- [x] `shared/` + `shell/` + `systems/pf2e/` (or equivalent); systems do not import each other
- [x] PF2e registered as a `SystemModule`; no edition `if` in math
- [x] Kernel includes at least: `newId`, strip-derived, Ajv error format, file Save/Load wiring, `DerivedCell`
- [x] Shell layout can host a sidebar rail (empty/collapsed OK)

### Phase Sb

- [x] Collapsible rail on a loaded sheet
- [x] Registry + empty state; tools would receive `character`, `derived`, `update`
- [x] No fake placeholder tools
- [ ] Attack Helper implementation (later; spec exists)
- [ ] Actions List implementation (later; spec exists)
- [ ] Budget Calculator implementation (later; spec exists)

### Phase 1e

- [x] PF1e schema validates Load/Save
- [x] `compute()` for martial core
- [x] Fighter 5 golden
- [x] New sheet can create PF1e

### Phase 2e

- [x] Spell DC + bonus spells from ability
- [x] Spellcasting editor
- [x] Wizard 5 golden

### Phase 3e

- [x] Two class rows; stacked BAB/saves
- [x] Fighter 2 / Wizard 3 golden

### Phase 3c (in progress)

- [x] Batch 1: ability modifiers + BAB/save progressions (review + Fighter/Wizard tags)
- [x] Batch 2: HP breakdown dialog (manual HD rolls) + iterative attacks
- [x] Batch 3: AC / touch / FF + CMB / CMD (CRB write-up + table tests)
- [ ] **Batch 4 (next):** skills (ranks, class +3, ACP); warn/blank already landed; class-skill lists wait for 9
- [ ] Batch 5: size tables (AC/attack vs CMB/CMD vs carry)
- [ ] Batch 6: encumbrance (Strength table; light / medium / heavy)
- [ ] Batches 8–10: Human; Fighter/Wizard class skills + skill points; weapons/armor ids
- [ ] Batch 7 (spell DC / bonus slots): already in engine; pack review later
- [ ] Catalog enough to rebuild the three goldens
- [ ] OGL review before rules **text**

### PF1e 0.9 bar

- [x] Fighter 5 golden
- [x] Wizard 5 golden
- [x] Multiclass golden
- [ ] Editors for those domains (no familiar nested sheet)
- [x] `en` catalog for shell chrome + PF1e Combat/Abilities/Skills/tabs (PF2e panel literals remain)
- [ ] PWA install + offline proven once
- [ ] PF2e Fighter 5 / Wizard 5 still pass
- [ ] Sidebar host may be empty; named tools not required

---

## 8. Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| M1 | Refactor breaks PF2e goldens | Move first, no math changes; keep tests green |
| M2 | One shared `CharacterDocument` type grows `#ifdef` fields | Separate types; union at the shell ([ADR 0004](adr/0004-shared-kernel.md)) |
| M4 | Over-extracting SheetTable / bonus stacker in Phase M | Kernel §12: only extract what PF2e already needs; second caller in 1e |
| P2 | 1E bonus-type rabbit hole | Explicit AC fields in 0.9 ([PF1e design §4.3](pf1e-character-sheet-design.md)) |
| N3 | UI strings proliferate | T4′ before PF1e editor wave |
| N2 | Content licensing | No scrape; curated CRB; OGL review before shipping text |
| S1 | Repo still named Pathfinder-2E-Card | Working title in docs/chrome; rename is a later decision |

---

## 9. Audit notes (2026-08-17; merged local `main` 2026-08-18)

Code/docs pass after Phases M–3e and 3c batches 1–2. **First pass:** Wizard 5 slots **4/4/3/2**; `miscDamage` with null damage ability; attack-override slash line.

**Decisions (implemented on local `main`):** 1A New-sheet picker with Cancel abort (boot stays PF2e). 2B `tempScore` + keep `tempModifier`. 3A last-wins BAB; Combat flags BAB vs iteratives separately. 4A one `other` field; Combat states it applies to all three ACs. 5A warn when ranks > level (no clamp). 6B blank Disable Device / UMD / Handle Animal at 0 ranks; blank Fly without a fly speed. 7B full attack-row fields. 8C no extra CMD/max-Dex copy. 9B `en.json` + `t()` for chrome (shell, tabs, PF1e Combat/Abilities/Skills, Notes). 10B shared `ContentRef`/`Effect`/`applyOverrides`/`Notes`/`Currency`.

**Branch audit (2026-08-18):** Ancestors of `origin/main` need no merge. `pf1e-multiclass-budget-990b` had the same tree as #8 (histories joined). `audit-docs-code-cad8` merged. **Do not merge** `setup-cloud-agent-env-2c8f` (old tree) or `multi-system-docs-990b` (parallel rewrite; 17 conflicts; missing CRB 1–2). `origin/main` is still #8 until local `main` is pushed.

**Still sequenced (next code is batch 4 only):**

| Item | Disposition |
| --- | --- |
| Skills ranks / class +3 / ACP formula review | Batch 4 |
| Class-skill lists / skill points catalog | Batch 9 |
| Size tables beyond the Small spot check | Batch 5 |
| Load penalties onto ACP / max Dex | Batch 6 (document only) |
| `SystemModule.tabs`; App still branches to mount workspaces | Fine until a third system |
| Remaining PF2e panel literals | Extract when those panels next change |

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | First multi-system / PF1e-first increment plan |
| 2026-08-17 | Phase M includes shared kernel (ADR 0004) |
| 2026-08-17 | Sidebar host (ADR 0005); tools unspecified |
| 2026-08-17 | Phase M/Sb implemented; Attack Helper reserved as later tool |
| 2026-08-17 | Phase 1e implemented; tools deferred until sheet ~90% done |
| 2026-08-17 | Phase 2e Wizard 5; Actions List reserved as later tool |
| 2026-08-17 | Phase 3e Fighter 2 / Wizard 3; Budget Calculator reserved as later tool |
| 2026-08-17 | Phase 3c batch 1: ability modifiers + BAB/saves; CRB pack scaffold |
| 2026-08-17 | Phase 3c batch 2: HP breakdown dialog + iterative attacks |
| 2026-08-17 | Annotate CRB batches 3–10; next increment is batch 3 only |
| 2026-08-17 | Audit: Wizard 5 slots 4/4/3/2; remaining design notes in §9 |
| 2026-08-17 | Implement audit decisions 1A–10B (picker, tempScore, chrome i18n, kernel types) |
| 2026-08-18 | Local `main` merge of audit + branch audit; next code remains batch 3 table tests |
| 2026-08-18 | Batch 3 AC/CMB table tests landed; next code is batch 4 skills |
