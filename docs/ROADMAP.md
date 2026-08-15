# Roadmap

Operational tracker for Pathfinder 2E Character sheet. Product decisions live in [ADR 0001](adr/0001-product-direction.md) and the [design doc](pf2e-dynamic-character-sheet-design.md). Schema decisions live in [ADR 0002](adr/0002-character-schema.md). Sequencing history: [continuation design](continuation-design.md) (S1/S4 executed), [next increment](next-increment-design.md) (T1/T3 executed).

**Status date:** 2026-08-15  
**Current phase:** 1–2 of 5 — schema, validation, core calcs, Fighter/Wizard goldens, and spreadsheet editors (except companions) are in. Remaining goldens, i18n catalogs, content packs, and companion UI are not started.  
**0.9 estimate:** ~55% (martial + prepared-caster vertical slices work; full golden set and content packs do not).

---

## Target milestones

**0.9** — installable English PWA; spreadsheet Build + Play; Remaster-first / legacy fallback; core calcs; Player Core + Player Core 2 catalog; Save/Load one sheet.

**1.0** — Spanish locale; same functional bar as 0.9, called stable.

**Later** — reference sidebar (Spells / Afflictions / Actions); typed `effects[]` automation; optional card play surfaces.

---

## Phase 0 — Design lock

**Status:** Done

- [x] Product decisions locked ([ADR 0001](adr/0001-product-direction.md))
- [x] Character JSON schema v1 ([`schemas/character.schema.json`](../schemas/character.schema.json), [ADR 0002](adr/0002-character-schema.md))
- [x] Design doc v1.0 lock ([design doc](pf2e-dynamic-character-sheet-design.md))

---

## Phase 1 — Schema + core calc engine

**Status:** Mostly done (~75%)

Done (S4 + S1 + T1):

- [x] Schema v1 covering identity, attributes, proficiencies, vitals, AC, skills, feats, features, actions, strikes, spellcasting, inventory, companions, conditions, play, notes, overrides, extensions, optional `derived`
- [x] TypeScript types mirrored from the schema (`app/src/character/types.ts`)
- [x] Empty-sheet factory with 16 auto-seeded standard skills
- [x] Save serializer strips `derived`
- [x] Example fixtures (`minimal.example.json`, `new-sheet.example.json`)
- [x] Validate Load and Save against `schemas/character.schema.json` (Ajv 2020-12)
- [x] Core calc engine: attribute modifiers, proficiency bonus, Perception / saves / skills / Class DC, max HP, AC, strike attack/damage, spell attack/DC, bulk, investiture
- [x] Overrides win and are applied last (engine allow-list)
- [x] Unknown `effects[].type` ignored safely
- [x] Golden tests: Fighter 5; Wizard 5
- [x] Vitest + CI (`.github/workflows/ci.yml`)

Remaining (blocks 0.9):

- [ ] Golden tests: Bard or Sorcerer 5; Cleric 5; companion user (Ranger or Druid); one Player Core 2 class at 3 or 5
- [ ] Override UI (engine works; no cell editor yet)

---

## Phase 2 — PWA spreadsheet shell

**Status:** Strong progress (~70%)

Done (scaffold + S1 editors + T3):

- [x] React + Vite app with spreadsheet tab chrome
- [x] Identity strip: name, level, class, current HP, hero points
- [x] New / Load / Save sheet (`.json`) with schema validation
- [x] Derived cells read-only and visually distinct
- [x] Identity leftovers: XP, subclass, languages, traits, deity, edicts/anathema, speeds, senses, HP bonuses
- [x] Attributes, skills (+ lore), perception, saves inputs, class DC, armor/weapon proficiencies, AC/armor/shield, strikes
- [x] Feats / features / actions row editors
- [x] Spellcasting entry editor (slots, lists, focus)
- [x] Inventory items (armor/weapon/shield subfields), currency, bulk/invested derived
- [x] Play: dying track, conditions, daily resources
- [x] PWA manifest + `vite-plugin-pwa` configured (not separately runtime-tested)

Remaining (blocks 0.9):

- [ ] Companion nested-sheet editor
- [ ] Externalize English UI strings into message catalogs (currently hardcoded)
- [ ] Optional IndexedDB single draft buffer (refresh safety; not a character library)
- [ ] Confirm install + offline after install on desktop and mobile

---

## Phase 3 — Content fill-out

**Status:** Not started (0%)

- [ ] Curated Remaster Player Core player catalog under `content/remaster` (directories do not exist yet)
- [ ] Player Core 2 player catalog (same pack or sibling)
- [ ] Legacy fallback rows for renames/replacements under `content/legacy`
- [ ] Content resolver: Remaster id → legacy → stamp `rulesetSource`; isolate failures to the row, never fail whole-sheet load
- [ ] Enough catalog to build the six golden-test characters

---

## Phase 4 — 1.0

**Status:** Not started (0%)

- [ ] Spanish (`es`) locale catalog
- [ ] Stability pass; still core calcs only unless scope expands

---

## Phase 5 — Post-1.0

**Status:** Deferred by design (0%)

- [ ] Reference sidebar: Spells / Afflictions / Actions
- [ ] Typed `effects[]` automation for feats/spells/items
- [ ] Optional card-oriented play surfaces

Out of scope for 0.9/1.0 (do not pull forward unless product lock changes): dice roller, cloud, VTT interop, house-rule flags (e.g. Free Archetype), GM-exclusive content, multi-character library.

---

## Domain coverage (schema vs UI vs calcs)

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

1. **Remaining goldens** — Cleric 5, Bard (or Sorcerer) 5, then Champion (PC2) and Ranger+companion (needs companion editor).
2. **Companion nested-sheet editor** — unblocks the companion golden.
3. **English message catalogs** — required before 0.9 even though Spanish is 1.0 (T4 was skipped).
4. **Content packs** (Phase 3) once ids and calcs have a stable consumer.
5. **IndexedDB draft buffer** and **PWA install/offline verification**.

---

## Merged branch history (2026-08-15)

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
| 2026-08-13 | First operational roadmap, audited against the repo and design doc §11 |
| 2026-08-15 | Refresh after merging S1/S4/T1/T3 into `main` |
