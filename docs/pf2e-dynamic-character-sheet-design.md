# Pathfinder Second Edition — Dynamic Character Sheet Design

**Status:** Decisions locked (v0.2) — remaining questions in §12  
**Repo context:** `Pathfinder-2E-Card`  
**Audience:** Product / engineering  
**Ruleset target:** Pathfinder Second Edition — **Remaster-first**, legacy fallback when Remaster data is missing or errors

---

## 1. Purpose

Build a **dynamic character sheet** that can create, edit, recalculate, and **persist all information a player needs to play** Pathfinder Second Edition (PF2e) locally on desktop and mobile.

“Dynamic” means dependent values update when inputs change (level, attributes, proficiency, gear, etc.). “Complete” means the saved character covers official sheet domains needed at the table (identity through spells, inventory, and session state).

---

## 2. Locked decisions (from stakeholder answers)

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Platform | **Local-running** app/site that is **mobile-compatible** (usable on phones/tablets without a required server) |
| 2 | UI (placeholder) | **Spreadsheet / Excel-like** layout for now — dense grids, tabs/sheets, plain inputs — not card-first yet |
| 3 | Ruleset | **Remaster when possible**; **legacy fallback** if Remaster content/calc path fails or is unavailable |
| 4 | Calc depth (1.0) | **Core calculations only**; architecture must **allow expansion** to complex feat/spell/mechanic effects later |
| 5 | Content | **Core content** for now (see §7 for scope clarification still open) |
| 6 | Persistence | **Local save only** (no cloud sync for now) |
| 7 | Character types | **All** playable types in scope for data model (martials, prepared/spontaneous casters, focus casters, companions as nested records where needed) |
| 8 | Modes | **Build and Play** both required |
| 9 | UX polish | **Lightweight** — no fancy UI or animations |
| 10 | Interop | **No** Pathbuilder / Foundry import-export for now |

See also: [`adr/0001-product-direction.md`](adr/0001-product-direction.md).

---

## 3. Goals and non-goals

### Goals (1.0)

- Complete playable PF2e character data model (all character types).
- Remaster-first lookups/calcs with legacy fallback.
- Core derived math: attributes, proficiencies, HP, AC, saves, Perception, skills, Class DC, strikes (basic), spell attack/DC & slots tracking.
- Local persistence (reload without data loss) + export/import of the character file for backup.
- Build mode (level-up / choices) and Play mode (HP, slots, conditions, daily resources).
- Runs locally; usable on mobile browsers / installable local web (PWA or equivalent).
- Spreadsheet-style placeholder UI: tabs, tables, cells — minimal chrome.

### Explicitly deferred (post-1.0, but design must not block)

- Automated complex feat/spell/condition interaction graphs.
- Fancy or card-based UI (repo name retained; cards may return later).
- Cloud sync, accounts, share links.
- Foundry / Pathbuilder interchange.
- Rich animations / heavy design systems.

### Non-goals

- Replacing a VTT.
- Shipping copyrighted Paizo full rules text beyond allowed open/core packaging.
- Perfect automation of every edge-case archetype interaction in 1.0.

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
- Boost/flaw **sources** stored for auditability (ancestry, background, class, free, apex, …).
- Remaster attribute model primary; legacy score display optional if needed for fallback characters.

### 4.3 Proficiencies

- Perception; Fortitude / Reflex / Will.
- Class DC; spell attack & spell DC (support multiple traditions / sources).
- Armor & weapon category proficiencies.
- All skills + dynamic Lore list.
- Ranks: Untrained / Trained / Expert / Master / Legendary.
- Slots for item / status / circumstance modifiers (even if 1.0 only sums simple cases).

### 4.4 Defenses & vitality

- Max HP, current HP, temporary HP, dying / wounded / doomed.
- AC breakdown (armor, Dex cap, proficiency, item, etc.).
- Resistances, immunities, weaknesses.
- Speeds, senses.

### 4.5 Offense

- Melee / ranged / unarmed strikes (weapon, attack bonus parts, damage, traits, range/reload).
- Spell attack rolls and save DCs.
- Class DC for class abilities.

### 4.6 Feats, features, actions

- Ancestry, heritage, background, class, skill, general, archetype feats.
- Class features by level.
- Granted actions/reactions (name, traits, frequency, effect summary text).
- Focus spells & focus pool.

**1.0:** store as structured records + free-text effects; **do not** auto-apply arbitrary mechanical text.  
**Later:** attach typed `effects[]` / modifiers to the same records without schema breakage.

### 4.7 Magic

- Tradition(s); prepared / spontaneous / innate / focus.
- Slots per rank + remaining (Play).
- Cantrips, repertoire / spellbook / prepared lists.
- Innate spells, rituals; simple charge trackers for staves/wands.

### 4.8 Inventory & wealth

- Worn / readied / stowed; invested; bulk.
- Currency; formulas; notes.
- Equipped flags that feed core calcs (armor, weapon, item bonus).

### 4.9 Companions / extras

- Animal companion, familiar, eidolon, etc. as **nested character-like records** (same schema subset).
- In 1.0: editable nested sheets; limited auto-linkage.

### 4.10 Session / Play state

- Current HP, conditions, hero points.
- Focus remaining; spell slots remaining; daily abilities used.
- Optional initiative modifier.

**Coverage checklist:** Appendix A.

---

## 5. Platform options (filtered by decision #1)

Must run **locally** and work on **mobile**.

| Option | Fits? | Notes |
| --- | --- | --- |
| **Static web app + PWA** (service worker, IndexedDB) | **Yes — recommended** | Open `localhost` or installed PWA; works offline; phones/tablets supported |
| **Single-page static files** opened via local static server | **Yes** | `file://` often breaks modules/storage; prefer tiny local server or PWA install |
| **Tauri / Capacitor wrapper** | Optional later | Native install shells around the same web UI |
| **Electron** | Possible but heavy | Conflicts with “lightweight” preference |
| **Native Swift/Kotlin** | No for 1.0 | Duplicate work; not needed |

**Recommendation:** Lightweight **static frontend (PWA)** with IndexedDB autosave + JSON file export/import. Same codebase on desktop and mobile browsers.

---

## 6. Calculation architecture (1.0 core, expandable)

### 6.1 Layers

```
Content catalog (Remaster → legacy fallback)
        ↓
Character document (choices, gear, session state, overrides)
        ↓
Modifier providers (1.0: attributes, prof, items, simple conditions)
        ↓
Resolver (bonus types, stacking rules)
        ↓
Derived view model → spreadsheet UI cells
```

### 6.2 1.0 core calcs (in scope)

- Attribute modifiers from boosts/flaws.
- Proficiency bonus = rank + level (Untrained special-case).
- Perception, saves, skills, Class DC.
- HP max from ancestry/class/Con (+ simple listed bonuses if encoded).
- AC from armor + Dex (capped) + proficiency + item.
- Strike attack/damage from attribute + proficiency + weapon dice + item (basic).
- Spell attack / spell DC from key attribute + proficiency.
- Bulk totals; investiture count.
- Spell slot / focus / hero point **tracking** (not full spell automation).

### 6.3 Expansion hooks (required in design, not fully implemented in 1.0)

- Every feat/spell/item/feature record may include optional `effects: Effect[]`.
- `Effect` is typed (e.g. flat modifier, grant proficiency, adjust HP formula) with selector/predicates.
- Resolver ignores unknown effect types safely (forward compatible).
- Manual **overrides** map always wins and is visually marked in the sheet.

### 6.4 Remaster → legacy fallback

1. Resolve content by Remaster id/name.  
2. On miss or validation error, try legacy catalog entry.  
3. Record `rulesetSource: "remaster" | "legacy" | "custom"` on the field.  
4. Never fail the whole sheet load for one bad row — isolate errors to the cell/row.

---

## 7. Content strategy

**Decision:** core content for now.

**Working interpretation (confirm in §12):**

- Ship a **bundled catalog** of Remaster **Player Core** (and clearly licensed open/core equivalents) entities needed to build: ancestries, heritages, backgrounds, classes, skills, weapons/armor basics, conditions, spell *names/ranks/traditions* as needed for sheet structure.
- User can still add **custom** rows (homebrew / missing legacy).
- Full rules text optional/minimal; prefer name + short reference + mechanical numbers needed for core calcs.

Legacy pack loaded as fallback layer, not the default browse list.

---

## 8. Persistence

| Mechanism | Role |
| --- | --- |
| IndexedDB (or equivalent local DB) | Autosave active characters |
| Export / Import `.json` | Backup, move between devices manually |
| `schemaVersion` | Migrations as model grows |

No accounts, no cloud. Multi-device = user exports JSON on one device and imports on another.

### Top-level document sketch

```json
{
  "schemaVersion": 1,
  "meta": {
    "createdAt": "",
    "updatedAt": "",
    "preferredRuleset": "remaster",
    "appVersion": ""
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

`effects` on entries and `extensions` keep the door open for complex automation without breaking 1.0 files.

---

## 9. UI direction (placeholder)

**Spreadsheet metaphor:**

- Top: character identity strip (name, level, class, HP, hero points) — compact, not animated.
- Main: **tabs as sheets** — e.g. `Identity`, `Attributes`, `Skills`, `Combat`, `Feats`, `Spells`, `Inventory`, `Play`, `Notes`.
- Cells: plain inputs, selects, checkboxes; read-only derived cells visually distinct.
- Mobile: horizontal scroll for wide tables OK; sticky first column for labels; Play tab optimized for thumb use (HP, conditions, slots).
- **No** card masonry, **no** decorative motion, **no** heavy design system.

Build vs Play can be two tabs or a simple mode toggle that shows/hides encounter controls.

---

## 10. Suggested technical approach (lightweight)

| Concern | Suggestion |
| --- | --- |
| UI | Small SPA or even multi-tab DOM app; prefer **one lightweight framework or none** |
| Styling | Minimal CSS grid/tables; system fonts acceptable for placeholder |
| State | Character document in memory → debounce write to IndexedDB |
| Calcs | Pure functions + golden tests (known characters → expected numbers) |
| Content | Static JSON packs in `/content/remaster` and `/content/legacy` |
| Offline | Service worker caching app shell + content packs |

Exact framework is still open (§12) but must stay lean.

---

## 11. Phased delivery

### Phase 0 — Design lock (current)

- Decisions in §2 recorded; remaining questions answered.
- ADR + schema draft.

### Phase 1 — Schema + core calc engine

- Character JSON schema; Remaster/legacy content stubs.
- Core math with tests; override support.

### Phase 2 — Spreadsheet UI shell

- Tabs/tables for all data domains; local autosave; export/import.
- Build entry + Play resource tracking.

### Phase 3 — Core content pack fill-out

- Populate Remaster core catalog enough to build common characters without custom rows.
- Legacy fallback entries for renamed/replaced content.

### Phase 4 — Expansion readiness demo

- One sample `effects[]` pipeline (e.g. item bonus to a skill) proving post-1.0 path — still optional for 1.0 ship.

---

## 12. Remaining questions

Most product direction is set. These still affect implementation choices:

### Content & licensing

1. **What exactly is “core content”?**  
   Player Core only? Player Core + Player Core 2? GM Core conditions/items? Remaster spell lists by name only?
2. **Licensing comfort:** OK to bundle community ORC/open datasets with attribution, or only hand-maintained minimal tables?

### Platform specifics

3. **Distribution preference for “runs locally”:**  
   - (A) Installable PWA in browser  
   - (B) Download folder + `npm start` / static server  
   - (C) Future wrapped app (Tauri/Capacitor)  
   Multiple OK — which is primary?
4. **Offline required on first load after install?** (Recommended: yes)

### Product details

5. **Multi-character library** on one device (list of sheets) in 1.0, or one active file at a time?
6. **Dice roller** in Play tab for 1.0? (Default proposal: **no**)
7. **House-rule toggles** (e.g. free archetype) as first-class flags in 1.0?
8. **Languages/i18n** needed, or English-only?

### Technical preference

9. **Language/tooling preference:** TypeScript + small framework (e.g. Svelte/React/Preact) vs plain HTML/JS?
10. **Any forbidden dependencies** (telemetry, cloud SDKs, large UI kits)?

### Acceptance

11. **Reference characters** for golden tests — any specific builds you want (e.g. Fighter 5, Wizard 5, Cleric 5, Kineticist if in core packs)?
12. **Project license** for this repo (MIT, Apache-2.0, etc.)?

---

## 13. Working MVP summary

- Local **PWA-style** spreadsheet character sheet for PF2e.  
- **Remaster-first / legacy fallback** content resolution.  
- **All character types** in the data model; **core calcs** only in 1.0.  
- Extensible `effects` / resolver design for later complex automation.  
- **Build + Play**, **local save**, **lightweight** UI, **no** VTT interop yet.

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
- [ ] Overrides + schemaVersion + export/import

## Appendix B — Document history

| Date | Change |
| --- | --- |
| 2026-08-13 | Initial options document |
| 2026-08-13 | Locked stakeholder decisions; spreadsheet UI; Remaster+legacy; remaining questions narrowed |
