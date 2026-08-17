# Roadmap

Operational tracker for **TTRPG Character Sheet** (working title). Product decisions live in [ADR 0003](adr/0003-multi-system-product-direction.md) and the [umbrella design](ttrpg-character-sheet-design.md). Reuse boundaries: [ADR 0004](adr/0004-shared-kernel.md), [`shared-kernel-design.md`](shared-kernel-design.md). Sidebar host: [ADR 0005](adr/0005-sidebar-host.md), [`sidebar-host-design.md`](sidebar-host-design.md). PF1e system spec: [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md). PF2e system spec: [`pf2e-dynamic-character-sheet-design.md`](pf2e-dynamic-character-sheet-design.md) (ADR 0001 superseded; [ADR 0002](adr/0002-character-schema.md) still governs PF2e documents). Sequencing: [multi-system next increment](next-increment-multi-system.md). Historical PF2e sequencing: [continuation design](continuation-design.md) (S1/S4 executed), [next increment (PF2e)](next-increment-design.md) (T1/T3 executed; leftover goldens deprioritized).

**Status date:** 2026-08-17  
**Current phase:** **M + Sb host done.** Next **code** phase is **1e** (PF1e schema + Fighter 5). Attack Helper is a later sidebar tool.  
**0.9 estimate:** shared shell ~80% of a PF2e-shaped PWA; **PF1e 0.9 bar ~0%**. Overall ~25% of the new 0.9 definition.

---

## Target milestones

**0.9** — installable English PWA; spreadsheet Build + Play; **PF1e** core calcs + editors for Fighter 5, Wizard 5, and one multiclass golden; **PF2e** existing slice (Fighter 5, Wizard 5, current editors) still loads and computes; Save/Load one sheet with a `system` discriminator; **sidebar host** may be empty or collapsed (no named tools required).

**1.0** — Spanish locale; same functional bar as 0.9, called stable.

**Later** — remaining PF2e goldens, companion editor, Remaster/legacy packs; PF1e CRB pack fill-out beyond goldens; **sidebar tools** (Attack Helper specified; encyclopedia is a candidate); typed `effects[]`; optional card play surfaces; additional systems.

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
- [ ] Optional: extract English chrome (`en.json`) so PF1e UI does not add literals (T4′)

Working display name in chrome is **TTRPG Character Sheet**.

---

## Phase 1e — PF1e schema + martial core

**Status:** Not started (0%)

- [ ] PF1e JSON Schema + schema ADR (analog of ADR 0002)
- [ ] TypeScript types; empty-sheet factory (seeded PF1e skills)
- [ ] Ajv validate Load/Save for `system: "pf1e"`
- [ ] Core calc: ability modifiers, BAB, saves, HP, AC/touch/FF, CMB/CMD, iteratives, skills, pounds/load
- [ ] Overrides last; unknown `effects[]` ignored
- [ ] Golden: PF1e Fighter 5
- [ ] New sheet: user can choose PF1e
- [ ] Editors enough to enter that Fighter (identity/classes, abilities, skills, combat, inventory subset)

---

## Phase 2e — PF1e prepared caster

**Status:** Not started (0%)

- [ ] Spell DC + bonus spells from ability in `compute()`
- [ ] Spellcasting entry editor (slots, lists)
- [ ] Golden: PF1e Wizard 5

---

## Phase 3e — PF1e multiclass

**Status:** Not started (0%)

- [ ] Two (or more) class rows in UI; stacked BAB/saves/HD
- [ ] Golden: Fighter 2 / Wizard 3 (or equivalent mixed BAB)

---

## Phase 3c — PF1e content pack

**Status:** Not started (0%)

- [ ] Curated Core Rulebook player catalog (enough ids to rebuild the three goldens)
- [ ] Resolver: catalog id → custom; isolate row failures
- [ ] OGL / Product Identity review before shipping copyrighted text

Until this pack exists, goldens use `custom` numeric inputs (same as current PF2e goldens).

---

## Phase Sb — Sidebar host

**Status:** Done (thin host, 2026-08-17). Named tools not started.

- [x] Collapsible rail on the loaded sheet (New or Load)
- [x] Tool registry + empty state; `SidebarToolContext` (`character`, `derived`, `update`)
- [x] Mobile collapsed by default (and desktop starts collapsed while the registry is empty)
- [x] No named tools required (list specified later)
- [ ] **Attack Helper** (later) — [`sidebar-tools-attack-helper.md`](sidebar-tools-attack-helper.md)

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
- [ ] IndexedDB draft buffer
- [ ] PWA install + offline verification (needed once before calling **app** 0.9 done; not PF2e-specific)
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
- [ ] Stability pass on the 0.9 bar (PF1e playable + PF2e slice); still core calcs only

---

## Phase 5 — Post-1.0

**Status:** Deferred by design (0%)

- [ ] Remaining PF2e 0.9 leftovers if not already done
- [ ] Sidebar **tools** (list TBD except **Attack Helper**, specified). Candidate also: Spells / Afflictions / Actions reference
- [ ] Typed `effects[]` automation
- [ ] Optional card-oriented play surfaces
- [ ] Additional systems behind `system`

Out of scope for 0.9/1.0: dice roller, cloud, VTT interop, house-rule flags, GM-exclusive content, multi-character library, a third implemented game system.

---

## Domain coverage

### PF1e (target)

| Domain | Schema | UI editor | Derived calcs |
| --- | --- | --- | --- |
| Identity / race / alignment / `classes[]` | Notes only | No | — |
| Ability scores | Notes only | No | — |
| BAB, saves, iteratives | Notes only | No | — |
| AC / touch / FF, CMB / CMD | Notes only | No | — |
| HP (HD + Con) | Notes only | No | — |
| Skills (ranks) | Notes only | No | — |
| Feats / features | Notes only | No | — |
| Inventory (pounds) | Notes only | No | — |
| Spellcasting | Notes only | No | — |
| Play (negative HP, conditions) | Notes only | No | — |
| Overrides + Save/Load | Envelope planned | PF2e Save/Load only | — |

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
| i18n catalogs (`en` → `es`) | n/a | Hardcoded English | n/a |

---

## Recommended next work (in order)

1. **Phase 1e** — PF1e schema + martial `compute()` + Fighter 5 + New→PF1e.
2. **Phase 2e** — Wizard 5 + spell editors.
3. **Phase 3e** — Multiclass golden.
4. **Phase 3c** — Minimal CRB pack.
5. **Draft buffer + PWA proof** — app 0.9 platform.
6. **Spanish** — 1.0.
7. **Only then** leftover PF2e goldens / companion / Remaster packs, and **sidebar tools** when built (**Attack Helper** is the first named tool).

---

## Merged branch history

| Branch | Objective | Outcome |
| --- | --- | --- |
| `cursor/s1-s4-prelude-5edf` | Vitest + Ajv + Fighter 5 calc/UI slice | Merged (ancestor of tip) |
| `cursor/continuation-design-options-5edf` | Phase 1 sequencing options | Merged; marked executed |
| `cursor/merge-next-steps-5edf` | Next-increment options after S1/S4 | Merged |
| `cursor/t1-t3-wizard-editors-5edf` | Wizard 5 + form editors (T1/T3) | Merged into `main` |
| `cursor/setup-cloud-agent-env-2c8f` | Cloud Agent `environment.json` | Already on `main` via #2 (same content) |

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
