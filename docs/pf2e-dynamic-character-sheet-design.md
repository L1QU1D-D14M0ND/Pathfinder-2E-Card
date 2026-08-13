# Pathfinder Second Edition — Dynamic Character Sheet Design Options

**Status:** Initial design (options + open questions)  
**Repo context:** `Pathfinder-2E-Card`  
**Audience:** Product / engineering decision-making before implementation  
**Ruleset target:** Pathfinder Second Edition (Remaster-aware; see open questions)

---

## 1. Purpose

Define options for building a **dynamic character sheet** that can create, edit, recalculate, and **persist all information a player needs to play** Pathfinder Second Edition (PF2e) at the table (or online).

“Dynamic” means the sheet is not a static form only: when the user changes level, ability boosts, proficiency, gear, feats, or conditions, **dependent values update** (modifiers, AC, HP, skills, attack/damage, spell attack/DC, bulk, etc.).

This document lists **product shapes**, **data scope**, **calculation strategies**, **persistence options**, **UI paradigms** (including card-oriented layouts suggested by the repo name), and **open questions** that should be answered before locking an MVP.

---

## 2. Goals and non-goals

### Goals (MVP-oriented)

- Represent a complete playable PF2e character (Remaster Player Core sheet coverage as baseline).
- Persist character data so it can be reopened later without loss.
- Recalculate derived combat/exploration stats from stored inputs.
- Support level progression (ability boosts, feats, skills, class features, spells).
- Work well on desktop; be usable on tablet/phone for session reference.

### Stretch goals (post-MVP)

- Multi-character / party library.
- Encounter mode (HP, focus points, spell slots remaining, conditions).
- Import/export interchange with Foundry / Pathbuilder / JSON.
- Offline-first / PWA.
- GM-readable share links.
- Dice roller integration.

### Non-goals (for this design phase)

- Replacing a VTT (Foundry/Roll20).
- Hosting Paizo proprietary full text beyond what licensing allows.
- Automating every edge-case archetype/feat interaction in v1.

---

## 3. What “complete character data” means

A playable PF2e character needs **inputs** (choices & equipment), **derived outputs** (modifiers & totals), and **session state** (current HP, slots used). The sheet should **save inputs and session state**; derived fields can be stored as cache or recomputed on load.

### 3.1 Identity & campaign

| Field | Notes |
| --- | --- |
| Character name, player name | |
| Level, XP | |
| Ancestry, heritage, background, class, subclass/doctrine/etc. | Remaster naming may differ from legacy |
| Size, traits, languages, deity (if any), home region | |
| Alignment / edicts & anathema (if used at table) | Remaster reduced alignment emphasis — configurable |
| Campaign notes, appearance, personality | Free text |

### 3.2 Ability scores / attributes

- Six attributes: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma.
- Track **boosts/flaws sources** (ancestry, background, class, free, apex, etc.) so recalculation is auditable.
- Store modifiers and (optionally) legacy-style scores if supporting pre-Remaster tables.

### 3.3 Proficiencies

- Perception; Fortitude / Reflex / Will.
- Class DC; spell attack & spell DC (per tradition if multiclass/dual).
- Armor categories; weapon categories (+ specific weapons if needed).
- All skills + lore skills (dynamic list).
- Proficiency ranks: Untrained / Trained / Expert / Master / Legendary.
- Item bonuses, circumstance/status bonuses/penalties, conditional modifiers.

### 3.4 Defenses & vitality

- Max HP (ancestry + class + Con + feats/items), current HP, temporary HP, dying/wounded/doomed.
- AC breakdown (Dex capped by armor, proficiency, item, etc.).
- Resistances, immunities, weaknesses.
- Speed(s), movement types, special senses.

### 3.5 Offense

- Melee / ranged strikes (weapon, attack bonus breakdown, damage dice + modifiers, traits, reload, range, ammo).
- Unarmed attacks from ancestry/class.
- Spell attack rolls and save DCs.
- Class DC for class abilities.

### 3.6 Feats, features, actions

- Ancestry feats, heritage features, background feat.
- Class feats & class features (by level gained).
- Skill feats, general feats, archetype dedication/feats.
- Free actions / reactions / activities granted (name, traits, frequency, effects summary).
- Focus spells & focus pool.

### 3.7 Magic

- Tradition(s), prepared vs spontaneous vs innate.
- Spell slots per rank; slots remaining (session).
- Cantrips, repertoire / spellbook / prepared list.
- Innate spells, rituals, staff charges / wand uses (as custom consumable trackers).

### 3.8 Inventory & wealth

- Worn / readied / stowed items; invested items; bulk & encumbered thresholds.
- Containers; formulas; crafting materials.
- Currency (cp/sp/gp/pp) and valuables.
- Item bonuses that feed AC/skills/attacks (linked to equipped state).

### 3.9 Companions / extras (optional but common)

- Animal companion, familiar, eidolon, construct, etc.
- Separate mini-sheet or nested character record.

### 3.10 Session / encounter state

- Current HP, conditions list with values/durations.
- Hero points.
- Focus points remaining; spell slots remaining; daily abilities used.
- Initiative modifier / current initiative (if desired).

**Persistence rule of thumb:** save everything the player would write on the official multi-page sheet, plus enough source metadata to recompute safely.

---

## 4. Product form options

| Option | Description | Pros | Cons | Fit |
| --- | --- | --- | --- | --- |
| **A. Web app (SPA/PWA)** | Browser character builder + live sheet | Fast iteration, shareable, offline via PWA | Needs hosting; mobile keyboard UX care | **Strong MVP candidate** |
| **B. Local-first desktop (Tauri/Electron)** | Installable app, files on disk | Offline, privacy, no server | Distribution, updates | Good if privacy-first |
| **C. Fillable PDF + JSON sidecar** | Classic sheet UX, export JSON | Familiar print layout | Weak “dynamic” recalculation | Weak alone |
| **D. Card deck UI** | Character as modular cards (ancestry, class, feats, spells, gear) | Matches repo name `Pathfinder-2E-Card`; tactile; great for feats/spells | Needs summary “combat strip” too | **Strong UX differentiator** |
| **E. Hybrid: summary sheet + card library** | Compact play view + browsable cards for features/spells | Best of both: glanceable math + rich text | More UI surface | **Recommended direction** |
| **F. Document-only (Markdown/YAML)** | Human-editable files in git | Simple, no runtime | Poor live calc / mobile | Design notes only |

**Recommendation for this repo:** **Option E** (hybrid summary + cards), delivered first as a **web PWA (A)** with local save, optionally later packaged as desktop (B).

---

## 5. Architecture options

### 5.1 Calculation model

| Approach | How it works | Pros | Cons |
| --- | --- | --- | --- |
| **1. Manual totals** | User types final numbers | Simple | Error-prone; not dynamic |
| **2. Formula fields** | Each output = expression over inputs | Transparent | Complex PF2e edge cases |
| **3. Rules engine + effect graph** | Choices apply typed modifiers (item/status/circumstance); engine resolves | Correct stacking; Foundry-like | Highest build cost |
| **4. Hybrid** | Engine for core math; free-text overrides for rare cases | Pragmatic | Need clear “override” UX |

**Recommendation:** **Hybrid (4)** for MVP — compute attributes, proficiencies, AC, HP, skills, strikes, spell stats; allow manual overrides with a badge when overridden.

### 5.2 Content / rules data

| Approach | Pros | Cons |
| --- | --- | --- |
| **User-entered free text only** | No licensing risk; ships fast | No auto-fill; typos |
| **Bundled open data (community SRD/ORC)** | Autocomplete ancestries/feats/spells | Must track Remaster vs legacy; licensing diligence |
| **Remote API (e.g. community databases)** | Always current | Offline/legal/rate-limit issues |
| **Import packs (JSON)** | User supplies content | Support burden |

**Recommendation:** MVP = structured schema + free-text entry + optional curated JSON packs; do **not** scrape proprietary Paizo text.

### 5.3 Application stack (illustrative)

| Layer | Option set |
| --- | --- |
| UI | React / Svelte / Vue; card components + sticky combat header |
| State | Local store (Zustand/Pinia/Svelte stores) + optional effect graph |
| Persistence | See §6 |
| Validation | Zod / TypeBox schema for character JSON |
| Testing | Golden tests: known characters → expected modifiers |

Stack choice is secondary to **schema + calculation correctness**.

---

## 6. Persistence / save options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| **LocalStorage / IndexedDB** | Browser save | Zero backend | Device-bound; easy to wipe |
| **Download/upload JSON** | Portable `.pf2e.json` | Simple backup/share | Manual |
| **File System Access API** | Edit a real file on disk | Feels like documents | Browser support varies |
| **Cloud sync (auth)** | Accounts + multi-device | Convenience | Privacy, cost, complexity |
| **SQLite (desktop/PWA wasm)** | Structured query | Strong local-first | More moving parts |

**MVP recommendation:** Character as versioned JSON document + IndexedDB autosave + explicit Export/Import. Schema version field (`schemaVersion`) for migrations.

### 6.1 Suggested top-level JSON shape (sketch)

```json
{
  "schemaVersion": 1,
  "meta": { "createdAt": "", "updatedAt": "", "ruleset": "remaster" },
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
  "conditions": [],
  "notes": {},
  "overrides": {}
}
```

Exact field list should be expanded into a formal schema once product options are chosen.

---

## 7. UI / UX options

### 7.1 Layout paradigms

1. **Classic multipage sheet** — mirrors Paizo PDF; lowest learning curve.
2. **Tabbed builder** — Identity → Attributes → Skills → Feats → Magic → Gear → Play.
3. **Card board** — each feat/spell/item is a card; filters by type/traits; pin favorites to “Play” tray.
4. **Play mode vs Build mode** — Build for leveling; Play for HP, slots, conditions, strikes.

**Recommended:** Build mode (guided) + Play mode (dense summary + cards for abilities/spells).

### 7.2 Dynamic behaviors to prioritize

- Level change proposes feat/skill/boost slots still empty.
- Equipping armor recalculates AC and speed penalties.
- Condition badges apply mapped penalties (frightened, clumsy, etc.) when enabled.
- Spell slot / focus / daily checkbox toggles for session tracking.
- Bulk and investiture warnings.

### 7.3 Accessibility & print

- Keyboard-navigable cards; sufficient contrast.
- Print stylesheet or “export printable PDF” of current totals.
- Reduced-motion option for card animations.

---

## 8. Legal / content considerations

- Paizo character sheet layout and Pathfinder branding are protected; avoid copying official PDF art/layout verbatim.
- Prefer **ORC / Community Use / open Remaster content** sources with attribution.
- Store **references** (name + source book/page or open ID) rather than pasting full copyrighted rules text when unsure.
- Product name should avoid implying official Paizo affiliation unless licensed.

---

## 9. Phased delivery options

### Phase 0 — Design lock

- Answer open questions (§11).
- Freeze MVP feature list and JSON schema v1.

### Phase 1 — Data + calc core

- Schema, persistence, attribute/proficiency/HP/AC/skills engine.
- Manual feat/spell/item entry.

### Phase 2 — Playable sheet UI

- Play mode summary + card views for feats/spells/items.
- Session state (HP, slots, conditions, hero points).

### Phase 3 — Builder assist

- Ancestry/class/background templates from open data packs.
- Level-up wizard.

### Phase 4 — Interop & polish

- Import/export, PWA offline, optional cloud, companion sheets.

---

## 10. Comparison to existing tools (context only)

| Tool | Role | Implication for this project |
| --- | --- | --- |
| Pathbuilder 2e | Mobile builder | High bar for builder UX; differentiate with cards / local-first web |
| Foundry PF2e | VTT + actors | Different problem space; optional JSON export compatibility later |
| Official PDF | Print/reference | Use as **coverage checklist**, not visual clone |
| Wanderer’s Guide / others | Web builders | Validate feature checklist against what players expect |

Differentiation ideas aligned with this repo: **card-centric play surface**, transparent modifier breakdowns, portable JSON, Remaster-first.

---

## 11. Open questions (please answer)

These decisions unblock architecture. Defaults in parentheses are suggestions only.

### Product

1. **Primary platform?** (Web PWA first)
2. **Primary use case?** Build at home / play at table / both? (Both, with Play mode emphasized)
3. **Single player local app, or multi-user/cloud?** (Local-first MVP)
4. **Should the UI be card-first** given `Pathfinder-2E-Card`? (Hybrid summary + cards)
5. **Printable / PDF export required for MVP?** (Nice-to-have, not MVP)

### Ruleset

6. **Remaster-only, legacy-only, or dual support?** (Remaster-first, legacy import later)
7. **How complete must automation be for feats that alter math?** (Core math + manual overrides)
8. **Companions/familiars/eidolons in MVP?** (No — schema stub only)
9. **Free archetype / dual-class / uncommon-rare content?** (Support fields; limited automation)

### Content & licensing

10. **Bundle open content packs, or user-typed only at first?** (User-typed + small sample pack)
11. **Any requirement to avoid all Paizo trademarks in UI?** (Use “unofficial fan project” framing)

### Persistence & privacy

12. **Must data stay on-device only?** (Yes for MVP)
13. **Need encrypted backups / password?** (Optional later)
14. **Multi-device sync priority?** (Post-MVP)

### Technical preferences

15. **Preferred frontend stack?** (No preference yet — pick for velocity)
16. **Must support offline from day one?** (Yes if Play-at-table matters)
17. **Import from Pathbuilder/Foundry desired?** (Post-MVP)

### Success criteria

18. **What character archetypes must MVP support end-to-end?** e.g. martials only vs prepared caster vs spontaneous vs kineticist-like?
19. **Target devices?** Desktop only vs tablet play?
20. **Who is the primary user?** New players, veterans, GMs?

---

## 12. Proposed MVP (pending answers)

Until questions are answered, the working proposal is:

- **Hybrid Play/Build web app** with a **card library** for feats, features, spells, and items.
- **Versioned JSON** character documents, autosaved locally, with export/import.
- **Dynamic core math** for attributes, proficiencies, HP, AC, skills, strikes, spell attack/DC.
- **Manual entry** for content text; overrides allowed.
- **Session trackers** for HP, conditions, hero points, focus, and spell slots.
- Explicit **Remaster-first** labeling; no claim of Paizo endorsement.

---

## 13. Next steps after decisions

1. Freeze answers to §11 into an ADR (`docs/adr/0001-product-direction.md`).
2. Author `character.schema.json` covering §3.
3. Prototype one martial + one spontaneous caster on the schema.
4. Spike UI: Play summary strip + feat/spell cards.
5. Implement calc engine with golden-test characters.

---

## Appendix A — Coverage checklist (official sheet mapping)

Use as acceptance criteria for “can save everything needed to play”:

- [ ] Identity / level / XP / ancestry / heritage / background / class
- [ ] Attributes + boost history
- [ ] Perception, saves, class DC
- [ ] AC + armor + shield
- [ ] HP max/current/temp + dying track
- [ ] Speeds, senses, languages, traits
- [ ] All skills + lore + armor/weapon proficiencies
- [ ] Strikes (melee/ranged/unarmed)
- [ ] Feats by category + class features
- [ ] Inventory, bulk, investment, wealth
- [ ] Spell tradition, slots, cantrips, repertoire/prepared, focus, innate, rituals
- [ ] Conditions, hero points, daily/encounter resources
- [ ] Notes / roleplay / campaign free text

## Appendix B — Document history

| Date | Change |
| --- | --- |
| 2026-08-13 | Initial options document created |
