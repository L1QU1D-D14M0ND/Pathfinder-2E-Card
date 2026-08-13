# Character JSON schema — design notes, issues, and questions

**Schema:** [`../schemas/character.schema.json`](../schemas/character.schema.json)  
**Example:** [`../fixtures/characters/minimal.example.json`](../fixtures/characters/minimal.example.json)  
**schemaVersion:** `1`

This document flags ambiguities and decisions discovered while drafting the save format. Items marked **QUESTION** need a stakeholder call; **ISSUE** are technical risks to track; **DECISION (proposed)** are defaults already encoded in the schema pending objection.

---

## Design principles encoded

1. **One file = one PC.** Companions are nested subsets, not separate top-level files.
2. **Inputs + play state are authoritative.** Optional `derived` cache may be stripped and recomputed.
3. **Remaster-first refs** via `ContentRef` (`id`, `name`, `rulesetSource`, optional `legacyId`).
4. **`effects[]` on most rows** for post-1.0 automation; empty in 0.9 is fine; unknown `type` values must be ignored.
5. **`overrides`** map for manual totals without destroying inputs.
6. **`extensions`** bag for experimental fields without bumping `schemaVersion` every time.
7. **No `campaignOptions`** (Free Archetype omitted per product lock).

---

## QUESTIONS

### Q1 — Bulk encoding for light items (L)

PF2e uses **Bulk** integers plus **L** (light) items where 10L = 1 Bulk.

**Schema currently:** `ItemEntry.bulk` is a `number` (comment suggests `0.1` ≈ 1L).

**Options:**

| Option | Example | Pros | Cons |
| --- | --- | --- | --- |
| A. Decimal bulk | `0.1` per L | Simple math | Float noise |
| B. Integer light-counts | store `bulk` + `lightCount` | Exact | More fields |
| C. Integer “tenths” | `1` = 1L, `10` = 1 Bulk | Exact, one field | Non-obvious UX |

**QUESTION:** Prefer A, B, or C?

### Q2 — Attribute partial boosts

Remaster uses **partial boosts** that become a full boost when paired.

**Schema currently:** boost `kind: "partial"` with `amount` left app-defined.

**QUESTION:** Should 0.9 engine implement partial-boost pairing rules, or treat partials as notes until later (user enters final boosts only)?

### Q3 — Skill list seeding

**Schema currently:** `skills` is an open array (standard skills + lore).

**QUESTION:** On new character, should the app auto-insert the 16 standard skills as empty rows, or leave `skills: []` until the user/class setup fills them?

### Q4 — Strike vs weapon item duplication

Strikes can link to `itemId` **and** copy damage/traits onto `StrikeEntry`.

**QUESTION:** Is the strike row a **resolved snapshot** (survives if item changes until refreshed), or always **derived from the item** when `itemId` is set?

**Proposed default:** snapshot with `itemId` link; changing the item does not auto-mutate the strike until a “refresh from item” action (keeps Save/Load stable).

### Q5 — Spellcasting for non-casters

**Schema currently:** `spellcasting: []` allowed.

Innate ancestry spells still need an entry (likely `castType: "innate"`).

**QUESTION:** Any objection to representing ancestry innates as a spellcasting entry rather than a separate top-level list?

### Q6 — Focus pool ownership

Focus pool sits under `play` (character-wide). Some characters have multiple focus traditions.

**QUESTION:** Confirm **one shared focus pool** on the PC (PF2e default) vs per-`spellcasting` entry pools?

**Proposed default:** one shared pool on `play` (current schema).

### Q7 — Companion sheet depth

`CompanionSheet` is a **subset**, not a full recursive character document (no nested companions, limited identity).

**QUESTION:** Is that enough for animal companion / familiar / eidolon in 0.9? Eidolons especially share/link aspects with the PC — do we need an explicit `linkToPC: string[]` field now?

### Q8 — Content id namespace

**Proposed convention (not enforced by schema yet):**

```text
ancestry.human
heritage.skilled-human
class.fighter
feat.power-attack
spell.heal
condition.frightened
weapon.longsword
armor.chain-mail
skill.athletics
lore.warfare
```

**QUESTION:** OK to adopt kebab-case path ids like above for the curated pack?

### Q9 — `level` maximum 20

Schema caps `level` at **20**.

**QUESTION:** Keep hard cap at 20 for 0.9/1.0 (no mythic/post-20), or allow higher for homebrew via `extensions` only?

### Q10 — Saving `derived`

**QUESTION:** Should Save sheet **omit** `derived` always, **include** it for faster load, or make it a user toggle?

**Proposed default:** omit on Save sheet; allow draft autosave to keep it.

---

## ISSUES / RISKS

### I1 — Required empty strings vs optional fields

Many identity fields are required (including empty `ContentRef.name: ""` in the minimal fixture). Blank drafts are schema-valid by design (`name` allows empty string). That weakens validation for “finished” characters.

**Mitigation:** keep schema permissive for empty drafts; add a separate `character.complete.schema.json` or runtime “ready to play” checklist later.

### I2 — Float bulk (related to Q1)

If we keep decimal bulk, golden tests should use integer math via tenths internally.

### I3 — Override path grammar

`overrides` keys are free-form strings today (e.g. `derived.ac.total`).

**Risk:** typos; no schema enum of paths.

**Mitigation:** document a path convention in code; optionally validate known paths in the app (not in JSON Schema).

### I4 — Effect type openness vs safety

`Effect.additionalProperties: true` and free `type` string are intentional for expansion, but bad payloads won’t fail schema validation.

**Mitigation:** engine ignores unknown types; add unit tests for ignore behavior.

### I5 — Multiclass / dual-class

No first-class dual-class model. Extra classes would be custom features/feats or `extensions`.

**Risk:** uncommon; out of scope unless requested.

### I6 — Class-specific resources

Kineticist impulses, inventor innovations, gunslinger deeds, etc. are modeled only as `play.dailyResources`, feats/features, or `extensions`.

**Risk:** spreadsheet UX may feel generic for those classes until specialized tabs exist.

### I7 — Remaster rune naming

Armor/weapon rune enums use Remaster-ish names (`resilient`, `striking`, …). Legacy names may need mapping in the content fallback layer, not alternate schema enums.

### I8 — Companion recursion / file size

Deep companion sheets can bloat Save files. Acceptable for 0.9; watch eidolon + inventory duplication.

### I9 — Locale on sheet vs app

`meta.locale` is a hint on the file. App UI language might differ from sheet locale.

**Mitigation:** treat as preferred display language for catalog names if we ever store localized names; UI chrome follows app setting.

### I10 — Validation of cross-references

`equippedArmorItemId` → `inventory.items[].id` is not enforceable in pure JSON Schema without custom keywords.

**Mitigation:** app-level referential integrity checks on Load/Save.

---

## Deferred (intentionally not in schema v1)

- Campaign flags (Free Archetype, etc.)
- Card-layout metadata
- Sidebar-only reference caches (spells/afflictions encyclopedia)
- Foundry/Pathbuilder import mappings
- Dice roller state
- Multi-character libraries
- Mythic / level > 20 first-class support

---

## Next steps after questions answered

1. Freeze bulk encoding + content id convention.
2. Generate TypeScript types from the schema (or hand-maintain mirrored types).
3. Implement migrate(`schemaVersion`) stub.
4. Build empty-sheet factory matching `minimal.example.json`.
5. Start golden fixtures (Fighter 5, …) against core calc outputs.
