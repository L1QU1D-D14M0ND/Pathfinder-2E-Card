# Pathfinder Second Edition — Dynamic Character Sheet Design

**Status:** Product decisions complete (v1.0 design lock)  
**Repo context:** `Pathfinder-2E-Card`  
**Audience:** Product / engineering  
**Ruleset target:** Pathfinder Second Edition — **Remaster-first**, legacy fallback when Remaster data is missing or errors

---

## 1. Purpose

Build a **dynamic character sheet** for **players** that can create, edit, recalculate, and **persist all information needed to play** Pathfinder Second Edition (PF2e) locally on desktop and mobile.

“Dynamic” means dependent values update when inputs change (level, attributes, proficiency, gear, etc.). “Complete” means the saved character covers player-facing sheet domains needed at the table.

---

## 2. Locked decisions

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Platform | **Installable PWA** — runs locally/offline after install; mobile-compatible |
| 2 | UI (placeholder) | **Spreadsheet / Excel-like** — dense grids, tabs/sheets, plain inputs |
| 3 | Ruleset | **Remaster when possible**; **legacy fallback** on missing data or errors |
| 4 | Calc depth (1.0) | **Core calculations only**; architecture expandable to complex feat/spell/mechanic effects |
| 5 | Content books | **Player Core + Player Core 2** only (player-facing). **No GM-exclusive** content |
| 5a | Content acquisition | **Hybrid** — curated hand-maintained pack first; optional attributed open/ORC import pipeline later |
| 5b | Spells UI (later) | Sidebar (post-placeholder) with tabs for **spells**, **afflictions**, and **actions** (e.g. combat maneuvers) |
| 6 | Persistence | **One sheet at a time** + **Save sheet** / **Load sheet** (local files). No multi-character library, no cloud |
| 7 | Character types | **All** player character types in the data model |
| 8 | Modes | **Build and Play** |
| 9 | UX polish | **Lightweight** — no fancy UI or animations |
| 10 | Interop | **No** Pathbuilder / Foundry import-export for now |
| 11 | Dice | **No** dice roller |
| 12 | Language | **English for 0.9**; **Spanish for 1.0** (i18n-ready strings from the start) |
| 13 | Stack | **TypeScript** (lightweight UI layer TBD) |
| 14 | License | **MIT** |
| 15 | Campaign / house rules | **Omit** optional flags (e.g. Free Archetype) in 0.9/1.0 — extra feats entered as custom rows if needed |
| 16 | Golden tests | **Accepted proposed set** (see §12) |

See also: [`adr/0001-product-direction.md`](adr/0001-product-direction.md).

---

## 3. Goals and non-goals

### Goals by milestone

**0.9**

- Installable PWA; English UI.
- Spreadsheet UI with Save sheet / Load sheet (one active character).
- Remaster-first / legacy fallback.
- Core calcs + full player data model (PC1 + PC2 catalog enough to build).
- Build + Play resource tracking.

**1.0**

- Spanish localization.
- Same functional bar as 0.9, polished enough to call stable.
- Still core calcs only (complex automation remains post-1.0 unless pulled forward).

**Later (design must not block)**

- Reference sidebar: Spells / Afflictions / Actions (combat maneuvers, etc.).
- Typed `effects[]` automation for feats/spells/items.
- Optional card-oriented play surfaces.

### Non-goals

- GM-only tools, encounter building, secret NPC stat blocks, or GM Core–exclusive data.
- Cloud sync, accounts, VTT replacement, dice roller.
- Fancy UI / animations in the placeholder phase.

---

## 4. What “complete character data” means

Save **inputs** and **session state**; **derived** fields may be cached but must be recomputable.

### 4.1 Identity & campaign

| Field | Notes |
| --- | --- |
| Character name, player name | |
| Level, XP | |
| Ancestry, heritage, background, class, subclass/doctrine/etc. | Remaster IDs preferred; legacy IDs as fallback |
| Size, traits, languages, deity (if any) | |
| Edicts/anathema or legacy alignment (table-optional) | Configurable |
| Campaign notes, appearance, personality | Free text |

### 4.2 Attributes

- Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma.
- Boost/flaw **sources** stored for auditability.
- Remaster attribute model primary; legacy score display optional for fallback characters.

### 4.3 Proficiencies

- Perception; Fortitude / Reflex / Will.
- Class DC; spell attack & spell DC (multiple traditions/sources allowed).
- Armor & weapon category proficiencies.
- All skills + dynamic Lore list.
- Ranks: Untrained / Trained / Expert / Master / Legendary.
- Slots for item / status / circumstance modifiers (1.0 sums simple cases).

### 4.4 Defenses & vitality

- Max HP, current HP, temporary HP, dying / wounded / doomed.
- AC breakdown (armor, Dex cap, proficiency, item, etc.).
- Resistances, immunities, weaknesses (player-facing).
- Speeds, senses.

### 4.5 Offense

- Melee / ranged / unarmed strikes.
- Spell attack rolls and save DCs.
- Class DC for class abilities.

### 4.6 Feats, features, actions

- Ancestry, heritage, background, class, skill, general, archetype feats.
- Class features by level.
- Granted actions/reactions (summary text in 0.9/1.0).
- Focus spells & focus pool.

**0.9/1.0:** structured records + free-text effects; no auto-application of arbitrary mechanical text.  
**Later:** optional typed `effects[]` on the same records.

### 4.7 Magic

- Tradition(s); prepared / spontaneous / innate / focus.
- Slots per rank + remaining (Play).
- Cantrips, repertoire / spellbook / prepared lists.
- Innate spells, rituals; simple charge trackers.

**Later UI:** sidebar browser for spell / affliction / action reference (not required for sheet save format).

### 4.8 Inventory & wealth

- Worn / readied / stowed; invested; bulk.
- Currency; formulas; notes.
- Equipped flags feeding core calcs.

### 4.9 Companions / extras

- Animal companion, familiar, eidolon, etc. as nested character-like records.
- 0.9/1.0: editable nested sheets; limited auto-linkage.

### 4.10 Session / Play state

- Current HP, conditions, hero points.
- Focus remaining; spell slots remaining; daily abilities used.

**Coverage checklist:** Appendix A.

---

## 5. Platform

**Primary:** Installable **PWA** (service worker, web app manifest, offline app shell + content packs).

| Capability | Requirement |
| --- | --- |
| Install on desktop & mobile | Yes |
| Offline after install | Yes |
| Mandatory cloud/server | No |
| Active characters | **One** loaded sheet |
| Persistence UX | **Save sheet** (download/export JSON) and **Load sheet** (open JSON); optional in-browser draft autosave while editing is OK if it does not become a multi-sheet library |

---

## 6. Calculation architecture (core now, expandable later)

```
Content catalog (Remaster → legacy fallback)
        ↓
Character document (choices, gear, session state, overrides, optional campaign flags)
        ↓
Modifier providers (0.9/1.0: attributes, prof, items, simple conditions)
        ↓
Resolver (bonus types, stacking rules)
        ↓
Derived view model → spreadsheet UI cells
```

### 6.1 In scope for 0.9/1.0

- Attribute modifiers from boosts/flaws.
- Proficiency bonus = rank + level (Untrained special-case).
- Perception, saves, skills, Class DC.
- HP max from ancestry/class/Con (+ simple encoded bonuses).
- AC from armor + Dex (capped) + proficiency + item.
- Basic strike attack/damage.
- Spell attack / spell DC from key attribute + proficiency.
- Bulk totals; investiture count.
- Spell slot / focus / hero point tracking.

### 6.2 Expansion hooks

- Feat/spell/item/feature records may include optional `effects: Effect[]`.
- Unknown effect types ignored safely (forward compatible).
- Manual **overrides** always win and are visibly marked.

### 6.3 Remaster → legacy fallback

1. Resolve by Remaster id/name.  
2. On miss or validation error, try legacy catalog.  
3. Stamp `rulesetSource: "remaster" | "legacy" | "custom"`.  
4. Isolate failures to row/cell — never fail whole sheet load for one bad entry.

---

## 7. Content strategy

**Books:** Remaster **Player Core** + **Player Core 2** (player-facing entities only).

Include as needed for players: ancestries, heritages, backgrounds, classes, class features, feats, skills, weapons/armor, conditions, spell metadata for sheet structure, etc.

**Exclude:** GM-exclusive material (e.g. GM-only guidance, NPC building exclusives, hazard design content that players do not need on a sheet).

**Later reference sidebar (not 0.9 blocker):** browsable Spells, Afflictions, Actions (combat maneuvers, etc.) fed from the same catalog where licensing allows.

**Acquisition:** **Hybrid** — ship a curated hand-maintained PC1/PC2 player pack for 0.9; keep schema compatible with a later attributed open/ORC dataset import after license review.

---

## 8. Persistence

| Mechanism | Role |
| --- | --- |
| Save sheet | Export current character to a local `.json` (or `.pf2e.json`) file |
| Load sheet | Replace the active sheet by opening a saved file |
| Optional draft autosave | Single in-progress buffer in IndexedDB so refresh does not wipe work — **not** a character library |
| `schemaVersion` | Migrations as the model grows |

### Top-level document sketch

```json
{
  "schemaVersion": 1,
  "meta": {
    "createdAt": "",
    "updatedAt": "",
    "preferredRuleset": "remaster",
    "appVersion": "",
    "locale": "en"
  },
  "identity": {},
  "attributes": {},
  "proficiencies": {},
  "vitals": {},
  "armorClass": {},
  "skills": [],
  "feats": [],
  "features": [],
  "actions": [],
  "strikes": [],
  "spellcasting": [],
  "inventory": { "items": [], "currency": {} },
  "companions": [],
  "conditions": [],
  "play": { "heroPoints": 0, "focusRemaining": 0 },
  "notes": {},
  "overrides": {},
  "extensions": {}
}
```

---

## 9. UI direction

**Spreadsheet metaphor (0.9 placeholder):**

- Identity strip: name, level, class, HP, hero points.
- Tabs: `Identity`, `Attributes`, `Skills`, `Combat`, `Feats`, `Spells`, `Inventory`, `Play`, `Notes` (names may adjust).
- Plain inputs; derived cells read-only and visually distinct.
- Prominent **Save sheet** / **Load sheet** controls.
- Mobile: wide-table horizontal scroll; Play tab thumb-friendly.
- No cards, no decorative motion.

**Later:** side panel/drawer for reference tabs (Spells / Afflictions / Actions) without abandoning the sheet grid.

**i18n:** All user-visible strings via message catalogs. Ship `en` in 0.9; add `es` for 1.0.

---

## 10. Technical approach

| Concern | Choice |
| --- | --- |
| Language | **TypeScript** |
| UI | Lightweight framework or minimal TS DOM layer (final pick during scaffold) |
| Styling | Minimal CSS tables/grids; system fonts OK for placeholder |
| State | One character document in memory; Save/Load files; optional single draft buffer |
| Calcs | Pure functions + golden tests |
| Content | Static JSON under `/content/remaster` and `/content/legacy` |
| Offline | Service worker caches app shell + content packs |
| Telemetry | None |

---

## 11. Phased delivery

### Phase 0 — Design lock (done)

- Product decisions complete; ADR accepted.
- Next: character JSON schema draft + TypeScript project scaffold.

### Phase 1 — Schema + core calc engine (TypeScript)

- Character JSON schema; Remaster/legacy stubs for PC1/PC2 player content.
- Core math + overrides + golden tests.

### Phase 2 — PWA spreadsheet shell (0.9 track)

- Tabs/tables; Save/Load; optional draft buffer; English UI strings externalized.
- Build + Play tracking.

### Phase 3 — Content fill-out

- PC1 + PC2 player catalog; legacy fallback rows for renames/replacements.

### Phase 4 — 1.0

- Spanish (`es`) locale.
- Stability pass; still core calcs unless scope expands.

### Phase 5 — Post-1.0

- Reference sidebar (spells / afflictions / actions).
- Complex `effects[]` automation.

---

## 12. Accepted golden-test characters

Engineering fixtures (not necessarily shipped as player samples). Assert core outputs (HP, AC, skills, strikes, spell DC, etc.):

1. Martial — **Fighter 5** (armor + multiple strikes)
2. Prepared caster — **Wizard 5** or **Witch 5**
3. Spontaneous caster — **Bard 5** or **Sorcerer 5**
4. Divine prepared — **Cleric 5**
5. Companion user — **Ranger 5** with animal companion **or** Druid with companion
6. PC2 smoke test — one **Player Core 2** class at level 3 or 5

Exact subclass/spell picks can be chosen during implementation as long as the roles above stay covered.

---

## 13. Working product summary

- **Installable PWA**, spreadsheet UI, **TypeScript**, **MIT** license.
- **One character** loaded; **Save sheet** / **Load sheet**.
- **Player Core + Player Core 2** (hybrid content acquisition); no GM exclusives.
- **Remaster-first / legacy fallback**; **core calcs** for 0.9/1.0 with expansion hooks.
- **No** campaign house-rule flags in 0.9/1.0.
- **English in 0.9**, **Spanish in 1.0**.
- **No** dice roller, cloud, or VTT interop.
- Golden tests use the accepted reference set in §12.
- Later: reference sidebar for spells / afflictions / actions.

---

## Appendix A — Coverage checklist

- [ ] Identity / level / XP / ancestry / heritage / background / class
- [ ] Attributes + boost history
- [ ] Perception, saves, class DC
- [ ] AC + armor + shield
- [ ] HP max/current/temp + dying track
- [ ] Speeds, senses, languages, traits
- [ ] All skills + lore + armor/weapon proficiencies
- [ ] Strikes (melee/ranged/unarmed)
- [ ] Feats by category + class features (+ optional `effects` stubs)
- [ ] Inventory, bulk, investment, wealth
- [ ] Spell tradition, slots, cantrips, repertoire/prepared, focus, innate, rituals
- [ ] Companions nested records
- [ ] Conditions, hero points, daily/encounter resources
- [ ] Notes / roleplay free text
- [ ] Overrides + schemaVersion + Save/Load
- [ ] i18n message catalogs (`en` → `es`)

## Appendix B — Document history

| Date | Change |
| --- | --- |
| 2026-08-13 | Initial options document |
| 2026-08-13 | First decision lock (local/mobile, spreadsheet, Remaster+legacy) |
| 2026-08-13 | PWA; PC1+PC2; Save/Load one sheet; i18n plan; TypeScript; elaborations for content source, house rules, golden tests, license |
| 2026-08-13 | Final lock: hybrid content, omit house-rule flags, accepted golden-test set, MIT |
