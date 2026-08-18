# Roadmap

Operational tracker for **TTRPG Character Sheet** (working title). Product decisions live in [ADR 0003](adr/0003-multi-system-product-direction.md) and the [umbrella design](ttrpg-character-sheet-design.md). Reuse boundaries: [ADR 0004](adr/0004-shared-kernel.md), [`shared-kernel-design.md`](shared-kernel-design.md). Sidebar host: [ADR 0005](adr/0005-sidebar-host.md), [`sidebar-host-design.md`](sidebar-host-design.md). Content licensing: [ADR 0007](adr/0007-content-licensing.md), [`content-licensing.md`](content-licensing.md). PF1e system spec: [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md). PF2e system spec: [`pf2e-dynamic-character-sheet-design.md`](pf2e-dynamic-character-sheet-design.md) (ADR 0001 superseded; [ADR 0002](adr/0002-character-schema.md) still governs PF2e documents). Sequencing: [multi-system next increment](next-increment-multi-system.md). Historical PF2e sequencing: [continuation design](continuation-design.md) (S1/S4 executed), [next increment (PF2e)](next-increment-design.md) (T1/T3 executed; leftover goldens deprioritized).

**Status date:** 2026-08-18  
**Current phase:** **OGL / Product Identity review landed** (mechanics-only pack; no rules text). **Next: 1.0** (Spanish **and** playable APG Synthesist Summoner). Sidebar **tools** wait until the character sheet is ~90% done. Named later: Attack Helper, Actions List, Budget Calculator.  
**0.9 estimate:** shared shell ~80% of a PF2e-shaped PWA; **PF1e 0.9 bar ~martial + prepared caster + multiclass**. Overall ~55% of the new 0.9 definition.

---

## Target milestones

**0.9** — installable English PWA; spreadsheet Build + Play; **PF1e** core calcs + editors for Fighter 5, Wizard 5, and one multiclass golden; **PF2e** existing slice (Fighter 5, Wizard 5, current editors) still loads and computes; Save/Load one sheet with a `system` discriminator; **sidebar host** may be empty or collapsed (no named tools required).

**1.0** — Spanish locale; same 0.9 bar, called stable; **PF1e player can build and play an APG Synthesist Summoner** (fused eidolon). Still core calcs; no in-app dice.

**Later** — remaining PF2e goldens, companion editor, Remaster/legacy packs; PF1e CRB pack fill-out beyond goldens; **sidebar tools after the sheet is ~90% done** (Attack Helper, Actions List, and Budget Calculator specified; encyclopedia is a candidate); typed `effects[]`; optional card play surfaces; additional systems.

---

## Phase 0 — Original PF2e design lock

**Status:** Done (historical)

- [x] PF2e-only product decisions ([ADR 0001](adr/0001-product-direction.md), superseded)
- [x] PF2e character JSON schema v1 ([`schemas/character.schema.json`](../schemas/character.schema.json), [ADR 0002](adr/0002-character-schema.md))
- [x] PF2e design doc v1.0 lock

---

## Phase 0b — Multi-system product lock

**Status:** Done (this documentation change)

- [x] Pivot to a multi-system player sheet; **PF1e development priority**; PF2e slice preserved ([ADR 0003](adr/0003-multi-system-product-direction.md))
- [x] Umbrella design ([`ttrpg-character-sheet-design.md`](ttrpg-character-sheet-design.md))
- [x] PF1e system spec + schema target notes
- [x] Roadmap and next-increment retargeted
- [x] Shared kernel vs per-system inventory ([ADR 0004](adr/0004-shared-kernel.md))
- [x] Loaded-sheet sidebar host; tools TBD ([ADR 0005](adr/0005-sidebar-host.md))
- [x] Working display name in PWA chrome (deferred to Phase M)

---

## Phase M — Multi-system refactor

**Status:** Done (2026-08-17)

- [x] Add `system` to saved documents (`pf2e` on Save; missing on Load → `pf2e`)
- [x] Extract shared kernel (`newId`, strip-derived, Ajv helper, Save/Load wiring, `DerivedCell`) and `SystemModule` registry ([ADR 0004](adr/0004-shared-kernel.md))
- [x] Isolate PF2e types/engine/panels so a second system can sit beside them (no cross-imports)
- [x] New sheet still produces a valid PF2e document until PF1e factory exists
- [x] Existing PF2e goldens and unit tests stay green
- [x] Leave shell layout room for a sidebar rail (empty/collapsed aside OK)
- [x] Optional: extract English chrome (`en.json`) so PF1e UI does not add literals (T4′)

Working display name in chrome is **TTRPG Character Sheet**.

---

## Phase 1e — PF1e schema + martial core

**Status:** Done (2026-08-17)

- [x] PF1e JSON Schema + schema ADR (analog of ADR 0002) — [ADR 0006](adr/0006-pf1e-character-schema.md)
- [x] TypeScript types; empty-sheet factory (seeded PF1e skills)
- [x] Ajv validate Load/Save for `system: "pf1e"`
- [x] Core calc: ability modifiers, BAB, saves, HP, AC/touch/FF, CMB/CMD, iteratives, skills, pounds/load
- [x] Overrides last; unknown `effects[]` ignored
- [x] Golden: PF1e Fighter 5
- [x] New sheet: user can choose PF1e
- [x] Editors enough to enter that Fighter (identity/classes, abilities, skills, combat, inventory subset)

---

## Phase 2e — PF1e prepared caster

**Status:** Done (2026-08-17)

- [x] Spell DC + bonus spells from ability in `compute()`
- [x] Spellcasting entry editor (slots, lists)
- [x] Golden: PF1e Wizard 5

---

## Phase 3e — PF1e multiclass

**Status:** Done (2026-08-17)

- [x] Two (or more) class rows in UI; stacked BAB/saves/HD
- [x] Golden: Fighter 2 / Wizard 3 (or equivalent mixed BAB)

---

## Phase 3c — PF1e content pack

**Status:** Mechanic batches done (1–13, including Batch 7). OGL / PI review landed.

- [x] Batch 1 review: ability modifiers; BAB + save progressions — [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md)
- [x] Pack scaffold `content/pf1e/crb/` + Fighter / Wizard progression tags
- [x] Lookup: catalog id → custom; unknown id does not throw
- [x] Batch 2: HP breakdown dialog (manual HD rolls) + iterative attacks (CRB slash line)
- [x] **Batch 3:** AC / touch / FF + CMB / CMD — CRB procedure + table tests; UI honesty already landed; no new catalog; no typed-bonus stacker
- [x] **Batch 4:** skills (ranks, class +3, ACP) + max ranks = level; warn/blank already landed; class-skill lists wait for 9
- [x] **Batch 5:** size tables (AC/attack vs CMB/CMD vs carry) — goldens stay Medium
- [x] **Batch 6:** encumbrance (Strength heavy-load table; light / medium / heavy) — Ignore weight opt-out; penalties not auto-written
- [x] **Batch 8:** Human race catalog id — +2 stays typed into scores
- [x] **Batch 9:** Fighter/Wizard class skills + skill points — stamp checkboxes; ranks not auto-spent
- [x] **Batch 10:** weapons/armor ids on the three goldens — documentary stamp only; AC/attacks stay typed
- [x] **Batch 11:** remaining 9 CRB classes — same catalog row / apply / stamp / pool as Fighter and Wizard
- [x] **Batch 12:** feat catalog ids on the three goldens — documentary stamp only; Combat math stays typed
- [x] **Batch 13:** spell catalog ids on the Wizard / multiclass goldens — documentary stamp only; slots/DCs stay typed
- [x] **Batch 7:** spell DC / bonus slots — CRB table tests; slots stay user-entered; Spell Focus does not change DC
- [x] OGL / Product Identity review — pack stays mechanics-only; no OGL notice until rules text ([ADR 0007](adr/0007-content-licensing.md))

Until later batches land, goldens still store numeric inputs on the sheet (catalog stamps HD/BAB/saves/class skills when the player picks a CRB class, race id/name when they pick Human, documentary item fields when they pick a catalog weapon or armor, feat name/category when they pick a catalog feat, and spell name/level when they pick a catalog spell).

---

## Phase Sb — Sidebar host

**Status:** Done (thin host, 2026-08-17). Named tools not started.

- [x] Collapsible rail on the loaded sheet (New or Load)
- [x] Tool registry + empty state; `SidebarToolContext` (`character`, `derived`, `update`)
- [x] Mobile collapsed by default (and desktop starts collapsed while the registry is empty)
- [x] No named tools required (list specified later)
- [ ] **Attack Helper** (later — after the sheet is ~90% done) — [`sidebar-tools-attack-helper.md`](sidebar-tools-attack-helper.md)
- [ ] **Actions List** (later — after the sheet is ~90% done) — [`sidebar-tools-actions-list.md`](sidebar-tools-actions-list.md)
- [ ] **Budget Calculator** (later — after the sheet is ~90% done) — [`sidebar-tools-budget-calculator.md`](sidebar-tools-budget-calculator.md)

See [ADR 0005](adr/0005-sidebar-host.md), [`sidebar-host-design.md`](sidebar-host-design.md).

---

## Phase 1–2 leftover (PF2e) — deprioritized

**Status:** Frozen relative to 0.9. Do not schedule ahead of Phase 1e–3e unless the product lock changes.

Already in the repo (kept):

- [x] PF2e schema v1, types, factory, Ajv, `compute()` (HP, AC, skills, strikes, spell attack/DC, bulk, investiture, overrides)
- [x] Goldens: PF2e Fighter 5; Wizard 5
- [x] Spreadsheet editors except companions
- [x] Vitest + CI

Not started (after PF1e 0.9):

- [ ] PF2e goldens: Bard or Sorcerer 5; Cleric 5; companion user; one Player Core 2 class
- [ ] Companion nested-sheet editor
- [ ] Override UI (engine works; no cell editor)
- [ ] English message catalogs (may land earlier as T4′ during M/1e)
- [x] IndexedDB draft buffer
- [x] PWA install + offline verification (needed once before calling **app** 0.9 done; not PF2e-specific)
- [ ] Remaster + legacy content packs

---

## Phase 3 (PF2e content) — deprioritized

**Status:** Not started (0%). Sequenced **after** PF1e 0.9.

- [ ] Curated Remaster Player Core player catalog
- [ ] Player Core 2 player catalog
- [ ] Legacy fallback rows; `rulesetSource` stamp

---

## Phase 4 — 1.0

**Status:** Not started (0%)

- [ ] Spanish (`es`) locale catalog
- [ ] Stability pass on the 0.9 bar (PF1e CRB goldens + PF2e slice); still core calcs only
- [ ] **Playable APG Synthesist Summoner** — fused eidolon as a transformation (separate APG pack; do not add Summoner to the CRB catalog). Player can build and play at the table: pilot vs fused physical scores, costume HP, evolution rows, Summoner spells. Not a nested second PC sheet. Not auto-applied evolutions.

---

## Phase 5 — Post-1.0

**Status:** Deferred by design (0%)

- [ ] Remaining PF2e 0.9 leftovers if not already done
- [ ] Sidebar **tools** (Attack Helper + Actions List + Budget Calculator specified). Sequence: after the character sheet is ~90% done, dynamic and functional. Candidate also: Spells / Afflictions / Actions **encyclopedia** (rules text, not the PC action menu)
- [ ] Typed `effects[]` automation
- [ ] Optional card-oriented play surfaces
- [ ] Additional systems behind `system`

Out of scope for 0.9/1.0: dice roller, cloud, VTT interop, house-rule flags, GM-exclusive content, multi-character library, a third implemented game system.

---

## Domain coverage

### PF1e (target)

| Domain | Schema | UI editor | Derived calcs |
| --- | --- | --- | --- |
| Identity / race / alignment / `classes[]` | Yes | Yes | Level from class sum |
| Ability scores | Yes | Yes | Modifiers |
| BAB, saves, iteratives | Yes | Yes (derived) | Yes |
| AC / touch / FF, CMB / CMD | Yes | Yes | Yes |
| HP (HD + Con) | Yes | Yes | Yes |
| Skills (ranks) | Yes | Yes | Yes |
| Feats / features | Yes | Yes | n/a (effects ignored) |
| Inventory (pounds) | Yes | Yes | Weight + load; Ignore weight |
| Spellcasting | Yes | Yes | DC + bonus slots |
| Play (negative HP, conditions) | Yes | Yes | Dead-at threshold |
| Overrides + Save/Load | Yes | Save/Load yes | Overrides applied |

### PF2e (in repo)

| Domain | Schema | UI editor | Derived calcs |
| --- | --- | --- | --- |
| Identity / level / XP / ancestry / class | Yes | Yes | n/a |
| Attributes + boost history | Yes | Boost total | Yes (modifiers) |
| Perception, saves, class DC | Yes | Yes | Yes |
| AC + armor + shield | Yes | Yes | Yes |
| HP max/current/temp + dying | Yes | Yes | Max HP yes |
| Speeds, senses, languages, traits | Yes | Yes | n/a |
| Skills + lore + armor/weapon prof | Yes | Yes | Skills yes |
| Strikes | Yes | Yes | Attack/damage |
| Feats / features / actions | Yes | Yes | n/a (effects ignored) |
| Inventory, bulk, investment, wealth | Yes | Yes | Bulk/invest |
| Spellcasting / slots / focus | Yes | Yes | Spell attack/DC |
| Companions | Yes | No | No |
| Conditions, hero points, daily resources | Yes | Yes | n/a |
| Notes | Yes | Yes | n/a |
| Overrides + Save/Load | Yes | Save/Load yes; override UI no | Overrides applied |
| i18n catalogs (`en` → `es`) | n/a | Chrome `en.json`; PF2e panel literals remain | n/a |

---

## Recommended next work (in order)

1. **1.0 (next code)** — Spanish locale **and** playable APG Synthesist Summoner (fused eidolon). Keep CRB pack CRB-only; first APG slice is mechanics-only until an OGL increment adds rules text.
2. **Only then** leftover PF2e goldens / companion / Remaster packs.
3. **Sidebar tools** when the character sheet is ~90% done (**Attack Helper**, **Actions List**, and **Budget Calculator** are the named tools). Do not start tools during schema/engine work.

Housekeeping (not a product increment): local `main` is ahead of `origin/main`. Push when ready. Do not merge `cursor/setup-cloud-agent-env-2c8f` or `cursor/multi-system-docs-990b` (superseded / would regress).

---

## Merged branch history

| Branch | Objective | Outcome |
| --- | --- | --- |
| `cursor/s1-s4-prelude-5edf` | Vitest + Ajv + Fighter 5 calc/UI slice | Merged (ancestor of tip) |
| `cursor/continuation-design-options-5edf` | Phase 1 sequencing options | Merged; marked executed |
| `cursor/merge-next-steps-5edf` | Next-increment options after S1/S4 | Merged |
| `cursor/t1-t3-wizard-editors-5edf` | Wizard 5 + form editors (T1/T3) | Merged into `main` |
| `cursor/setup-cloud-agent-env-2c8f` | Cloud Agent `environment.json` | Already on `main` via #2 (same content). Do not merge the old tip. |
| `cursor/multi-system-docs-990b` | Parallel Phase M–3e rewrite | Superseded by #7/#8. Do not merge (conflicts; missing CRB 1–2). |
| `cursor/pf1e-multiclass-budget-990b` | CRB batches 1–2 + batch 3–10 annotations | Same tree as #8; histories joined on local `main` |
| `cursor/audit-docs-code-cad8` | Wizard 5 slots, engine honesty, 1A–10B | Merged on local `main` (2026-08-18) |

---

## Document history

| Date | Change |
| --- | --- |
| 2026-08-13 | First operational roadmap, audited against the repo and PF2e design doc §11 |
| 2026-08-15 | Refresh after merging S1/S4/T1/T3 into `main` |
| 2026-08-17 | Retarget to multi-system / PF1e-first (ADR 0003). PF2e leftover 0.9 work deprioritized |
| 2026-08-17 | Shared kernel inventory (ADR 0004); Phase M extracts it |
| 2026-08-17 | Sidebar host (ADR 0005); tools TBD; Phase Sb |
| 2026-08-17 | Reserve Attack Helper as a later sidebar tool (no in-app dice) |
| 2026-08-17 | Phase M kernel/shell + thin sidebar host landed |
| 2026-08-17 | Phase 1e: PF1e schema (ADR 0006), martial compute, Fighter 5, New→PF1e. Tools deferred until sheet ~90% done |
| 2026-08-17 | Phase 2e: spell DC + bonus slots + Wizard 5. Reserve Actions List tool |
| 2026-08-17 | Phase 3e: Fighter 2 / Wizard 3 golden. Reserve Budget Calculator tool |
| 2026-08-17 | Phase 3c batch 1: CRB ability modifiers + BAB/save progressions; Fighter/Wizard catalog tags |
| 2026-08-17 | Phase 3c batch 2: HP breakdown dialog (manual HD rolls) + iterative attack slash notation |
| 2026-08-17 | Annotate CRB batches 3–10; next recommended PR is AC/touch/FF + CMB/CMD |
| 2026-08-17 | Audit: Wizard 5 slots corrected to CRB 4/4/3/2; remaining issues in next-increment §9 |
| 2026-08-17 | Design decisions 1A–10B: new-sheet picker, tempScore, en.json chrome, shared kernel types |
| 2026-08-18 | Local `main` absorbed the audit branch; next code is still CRB batch 3 table tests |
| 2026-08-18 | Phase 3c batch 3: AC/touch/FF + CMB/CMD table tests; next is skills |
| 2026-08-18 | Phase 3c batch 4: skill totals + max ranks; next is size tables |
| 2026-08-18 | Phase 3c batch 5: size AC/attack/CMB/CMD + carry multiplier; next is encumbrance |
| 2026-08-18 | Phase 3c batch 6: Strength heavy-load + load category; Ignore weight; next is Human catalog |
| 2026-08-18 | Phase 3c batch 8: Human race catalog; next is class skills |
| 2026-08-18 | Phase 3c batch 9: class skills + skill-point pool; next is weapons/armor ids |
| 2026-08-18 | Phase 3c batch 10: documentary weapons/armor ids; next is remaining 9 CRB classes |
| 2026-08-18 | Phase 3c batch 11: remaining 9 CRB classes reuse the Fighter/Wizard catalog; next is feat ids |
| 2026-08-18 | Phase 3c batch 12: documentary feat ids; 1.0 bar includes playable Synthesist Summoner |
| 2026-08-18 | Phase 3c batch 13: documentary spell ids; slots/DCs stay typed; next is Batch 7 pack review |
| 2026-08-18 | Phase 3c batch 7: spell DC + bonus-spells table tests; next is PWA proof |
| 2026-08-18 | IndexedDB one-key draft + PWA build verify; next is OGL review then 1.0 |
| 2026-08-18 | OGL / PI review landed (ADR 0007); pack stays mechanics-only; next is 1.0 |
