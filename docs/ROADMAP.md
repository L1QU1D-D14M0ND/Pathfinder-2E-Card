# Roadmap

Operational tracker for **TTRPG Character Sheet** (working title). Product decisions live in [ADR 0003](adr/0003-multi-system-product-direction.md) and the [umbrella design](ttrpg-character-sheet-design.md). Reuse boundaries: [ADR 0004](adr/0004-shared-kernel.md), [`shared-kernel-design.md`](shared-kernel-design.md). Sidebar host: [ADR 0005](adr/0005-sidebar-host.md), [`sidebar-host-design.md`](sidebar-host-design.md). Content licensing: [ADR 0007](adr/0007-content-licensing.md), [`content-licensing.md`](content-licensing.md). PF1e system spec: [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md). PF2e system spec: [`pf2e-dynamic-character-sheet-design.md`](pf2e-dynamic-character-sheet-design.md) (ADR 0001 superseded; [ADR 0002](adr/0002-character-schema.md) still governs PF2e documents). Sequencing: [multi-system next increment](next-increment-multi-system.md). Historical PF2e sequencing: [continuation design](continuation-design.md) (S1/S4 executed), [next increment (PF2e)](next-increment-design.md) (T1/T3 executed; leftover goldens deprioritized).

**Status date:** 2026-09-01  
**Current phase:** **Finish First Edition.** 1.0 landed (Spanish + playable Synthesist). Class spells-per-day tables landed (hybrid Max). CRB simple, martial, and exotic weapons are packed (batches 16–19); W1–W7 landed `reach`, `brace`, `trip`, `disarm`, `monk`, `nonlethal`, and `double` on an N-tag `weapon.properties` list (one tag is valid; many are valid). Double weapons also stamp a documentary second head. Next catalog is remaining armor 20–21. Magic gear waits. The PF2e slice stays in the app and must not regress. Remaining PF2e work waits for a **later release** (PC2 golden, companion editor, Remaster packs, PF2e panel i18n). Sidebar **tools** wait until the PF1e sheet is ~90% done. Named later: Attack Helper, Actions List, Budget Calculator.  

**0.9 bar:** landed (English PWA, PF1e Fighter 5 / Wizard 5 / multiclass, PF2e slice, Save/Load, empty Tools sidebar). **1.0** is Spanish + playable APG Synthesist.

---

## Target milestones

**0.9** — installable English PWA; spreadsheet Build + Play; **PF1e** core calcs + editors for Fighter 5, Wizard 5, and one multiclass golden; **PF2e** existing slice (Fighter 5, Wizard 5, current editors) still loads and computes; Save/Load one sheet with a `system` discriminator; **sidebar host** may be empty or collapsed (no named tools required).

**1.0** — Spanish locale; same 0.9 bar, called stable; **PF1e player can build and play an APG Synthesist Summoner** (fused eidolon). Still core calcs; no in-app dice.

**Finish First Edition (current release)** — take PF1e past the 1.0 goldens: CRB pack fill-out, APG follow-through, optional extra PF1e goldens, OGL when rules text ships. Then sidebar tools when that sheet is ~90% done.

**Later release — Second Edition** — leftover PF2e goldens (PC2 class), companion nested editor, Remaster/legacy packs, PF2e panel i18n. Do not start that work in this release.

**Later still** — typed `effects[]`; optional card play surfaces; additional systems.

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
- [x] Locale runtime (`I18nProvider` / `useT()`, `es.json` stub falling back to English). Chrome + PF1e panels extracted; PF2e panel literals remain (T4′)

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

**Status:** Mechanic batches done (1–15, including Batch 7). OGL / PI review landed.

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
- [x] **Batch 14:** remaining CRB player races + size stamp — ability adjustments stay typed; Human extra skill rank stays `race.human` only
- [x] **Batch 15:** class spells-per-day tables + hybrid Max — click to customize, empty resets; remaining stays play state
- [x] OGL / Product Identity review — pack stays mechanics-only; no OGL notice until rules text ([ADR 0007](adr/0007-content-licensing.md))

Until later batches land, goldens still store numeric inputs on the sheet (catalog stamps HD/BAB/saves/class skills when the player picks a CRB class, race id/name/size when they pick a CRB race, documentary item fields when they pick a catalog weapon or armor, feat name/category when they pick a catalog feat, and spell name/level when they pick a catalog spell).

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

## Phase 1–2 leftover (PF2e) — later release

**Status:** Frozen for this release. Bard 5, Cleric 5, and Ranger 5 goldens already in the tree; remaining §12 golden is the PC2 smoke test. Do not continue that set until a later PF2e *release*.

Already in the repo (kept; must not regress):

- [x] PF2e schema v1, types, factory, Ajv, `compute()` (HP, AC, skills, strikes, spell attack/DC, bulk, investiture, overrides)
- [x] Goldens: PF2e Fighter 5; Wizard 5; Bard 5; Cleric 5; Ranger 5
- [x] Spreadsheet editors except companions
- [x] Vitest + CI
- [x] English catalogs for chrome + PF1e panels; locale runtime exists; `es.json` covers those keys. PF2e panel literals remain
- [x] IndexedDB draft buffer
- [x] PWA dist artifacts (`verify:pwa` after build). Runtime install/offline stays a manual [`app/README.md`](../app/README.md) step

Not started (later PF2e release):

- [ ] PF2e goldens: one Player Core 2 class
- [ ] Companion nested-sheet editor
- [ ] Override UI (engine works; no cell editor)
- [ ] Remaster + legacy content packs
- [ ] PF2e panel i18n catalogs

---

## Phase 3 (PF2e content) — later release

**Status:** Not started (0%). Sequenced with the later PF2e *release*, not this First Edition finish.

- [ ] Curated Remaster Player Core player catalog
- [ ] Player Core 2 player catalog
- [ ] Legacy fallback rows; `rulesetSource` stamp

---

## Phase 4 — 1.0

**Status:** Done (2026-08-19)

- [x] Spanish (`es`) locale catalog
- [x] Stability pass on the 0.9 bar (PF1e CRB goldens + PF2e slice); still core calcs only
- [x] APG pack scaffold + Summoner class catalog (HD/BAB/saves/class skills) — [`pf1e-apg-pack-design.md`](pf1e-apg-pack-design.md)
- [x] Synthesist documentary archetype stamp (name only; no fused math)
- [x] Documentary evolution names
- [x] Fused STR/DEX/CON overlay + costume HP (not auto-applied evolutions)
- [x] Synthesist Summoner golden (Half-Elf Radiant Striker)
- [x] **Playable APG Synthesist Summoner** — fused eidolon as a transformation (separate APG pack; do not add Summoner to the CRB catalog). Player can build and play at the table: pilot vs fused physical scores, costume HP, evolution rows, Summoner spells. Not a nested second PC sheet. Not auto-applied evolutions.

---

## Phase 1x — Finish First Edition (current release)

**Status:** In progress. PF2e leftover waits for a later *release*.

Bar: a player can build and play PF1e from catalog beyond the four goldens, still core calcs, still mechanics-only until rules text. Keep Summoner out of the CRB pack. Existing PF1e and PF2e goldens must stay green.

Recommended order:

- [x] **CRB Batch 14** — remaining player races + size stamp (ability adjustments stay typed)
- [x] **CRB Batch 15** — class spells-per-day tables + hybrid Max (click to customize, empty resets)
- [x] **CRB Batch 16** — remaining simple melee + simple ranged (and simple ammo)
- [x] **CRB Batch 17** — martial light + remaining martial one-handed
- [x] **CRB Batch 18** — martial two-handed + martial ranged (and arrows)
- [x] **CRB Batch 19** — exotic melee + exotic ranged
- [x] **CRB weapon properties W1** — `reach` on a `weapon.properties` array of N tags (one or many). [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §7.6
- [x] **CRB weapon properties W2** — `brace` appended on the same list (longspear keeps reach).
- [x] **CRB weapon properties W3** — `trip` appended on the same list (guisarme keeps reach; kama is N = 1).
- [x] **CRB weapon properties W4** — `disarm` appended on the same list (nunchaku is N = 1; whip keeps reach and trip).
- [x] **CRB weapon properties W5** — `monk` appended on the same list (siangham is N = 1; kama keeps trip; nunchaku/sai keep disarm). [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §7.6
- [x] **CRB weapon properties W6** — `nonlethal` appended on the same list (sap is N = 1; bolas keeps trip; whip keeps reach, trip, and disarm).
- [x] **CRB weapon properties W7** — `double` appended on the same list, plus a documentary `secondHead` (two-bladed sword is N = 1; quarterstaff keeps monk). Primary dice stay a single string.
- [ ] **CRB Batch 20** — remaining light + medium armor
- [ ] **CRB Batch 21** — heavy armor + shields
- [ ] **CRB magic weapons / armor** — reserved later. Overlay on mundane ids; no plus-N catalog rows. Do not start in 16–21. [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §7.5
- [ ] **CRB pack fill-out** remainder — remaining feats/spells and other catalog tags. Combat/spell math stays typed unless a batch says otherwise. [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md)
- [ ] **APG follow-through** — Summoner spell catalog (mechanics-only); other APG classes as separate slices (Magical Child, etc.). Auto-applied evolutions only if a later slice says so. [`pf1e-apg-pack-design.md`](pf1e-apg-pack-design.md)
- [ ] **Optional PF1e goldens** (system spec §6) — Cleric 5 (domains/channel as daily resources); prestige smoke test; PF1e familiar/companion table fixture if the stub needs one
- [ ] **OGL notice + Section 15** — same change as the first pack **rules text** ([ADR 0007](adr/0007-content-licensing.md))
- [ ] **Sidebar tools** when the PF1e sheet is ~90% done — Attack Helper, Actions List, Budget Calculator

Do **not** start PF2e companion editor, PC2 golden, Remaster packs, or PF2e panel i18n in this phase.

---

## Phase 5 — After the PF1e sheet (and later PF2e release)

**Status:** Deferred. Tools wait until the PF1e sheet is ~90% done (Phase 1x). Remaining PF2e leftovers wait for the later PF2e *release*.

- [ ] Sidebar **tools** (Attack Helper + Actions List + Budget Calculator specified). Candidate also: Spells / Afflictions / Actions **encyclopedia** (rules text, not the PC action menu)
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
| i18n catalogs (`en` → `es`) | n/a | Chrome + PF1e `es.json`; PF2e panel literals remain | n/a |

---

## Recommended next work (in order)

1. **Finish First Edition** (Phase 1x) — remaining CRB catalog, then APG follow-through. Keep Summoner out of the CRB pack.
2. **Sidebar tools** when the PF1e sheet is ~90% done (**Attack Helper**, **Actions List**, and **Budget Calculator** are the named tools). Do not start tools during pack/schema work.
3. **Later release** — leftover PF2e (PC2 golden, companion editor, Remaster packs, PF2e panel i18n).

Housekeeping (not a product increment): do **not** merge `cursor/setup-cloud-agent-env-2c8f` or `cursor/multi-system-docs-990b` (superseded / would regress).

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
| 2026-08-18 | 1.0 APG slice 1: Summoner catalog + Synthesist name; next is evolutions + fused overlay |
| 2026-08-18 | Progress snapshot: PF1e 0.9 bar landed; local `main` published to origin |
| 2026-08-19 | Pre-1.0 architecture: locale runtime, system registry, pack schemas, override maps, PF1e extract + a11y, jsdom tests. Next code is again evolutions + fused overlay |
| 2026-08-19 | APG slice 2: documentary evolution names + fused overlay; next is Synthesist golden |
| 2026-08-19 | Synthesist golden (Half-Elf Radiant Striker); next is Spanish |
| 2026-08-19 | Spanish catalog (`es.json`) for chrome + PF1e panels; PF2e panel literals remain |
| 2026-08-19 | 1.0 stability: locale stamped on Save; all goldens still compute |
| 2026-08-19 | PF2e Bard 5 golden (spontaneous occult); next is Cleric 5 |
| 2026-08-19 | PF2e Cleric 5 golden (prepared divine); next is a companion user |
| 2026-08-19 | PF2e Ranger 5 golden (nested wolf companion); next is a PC2 class |
| 2026-08-19 | Finish First Edition this release; leftover PF2e waits for a later release |
| 2026-08-19 | Phase 1x batch 14: remaining CRB player races + size stamp; next is spells-per-day tables |
| 2026-08-27 | Phase 1x batch 15: class spells-per-day + hybrid Max; next is remaining catalog rows |
| 2026-08-27 | Locked remaining mundane CRB weapons/armor into batches 16–21; magic weapons/armor reserved later |
| 2026-08-27 | Phase 1x batch 16: remaining simple melee + simple ranged; next mundane equipment is martial weapons |
| 2026-08-27 | Phase 1x batch 17: martial light + remaining martial one-handed; next is martial two-handed + bows |
| 2026-08-27 | Weapon Special tags queued one type per PR after all weapon ids (not in 16–19); `weapon.properties` is an array (2+ tags; later magic uses the same list) |
| 2026-08-27 | Phase 1x batch 18: martial two-handed + martial ranged and arrows; next is exotic weapons |
| 2026-08-27 | Phase 1x batch 19: exotic melee + exotic ranged and repeating bolts; next catalog is W1 reach |
| 2026-08-27 | Phase 1x W1: reach as N-tag `weapon.properties` (one or many); next is W2 brace |
| 2026-08-27 | Phase 1x W2: brace appended (N = 1 or 2); next is W3 trip |
| 2026-08-27 | Phase 1x W3: trip appended (N = 1 or 2); next is W4 disarm |
| 2026-08-28 | Phase 1x W4: disarm appended (N = 1, 2, or 3); next is W5 monk |
| 2026-09-01 | Phase 1x W5: monk appended (N = 1 or 2); next is W6 nonlethal |
| 2026-09-01 | Phase 1x W6: nonlethal appended (N = 1, 2, or 4); next is W7 double |
| 2026-09-01 | Phase 1x W7: double appended plus documentary secondHead; next is Batch 20 armor |
