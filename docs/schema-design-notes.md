# Character JSON schema — design notes

**Schema:** [`../schemas/character.schema.json`](../schemas/character.schema.json)  
**Example:** [`../fixtures/characters/minimal.example.json`](../fixtures/characters/minimal.example.json)  
**schemaVersion:** `1`  
**Status:** Schema decisions locked (v1.1 amendments; still `schemaVersion: 1` — not yet released)

---

## Design principles

1. **One file = one PC.** Companions are nested subsets, not separate top-level files.
2. **Inputs + play state are authoritative.** `derived` is optional cache and **must be omitted from Save sheet**.
3. **Remaster-first refs** via `ContentRef` (`id`, `name`, `rulesetSource`, optional `legacyId`).
4. **`effects[]` on most rows** for post-1.0 automation; empty in 0.9 is fine; unknown `type` values must be ignored.
5. **`overrides`** map for manual totals without destroying inputs.
6. **`extensions`** bag for experimental fields without bumping `schemaVersion` every time.
7. **No `campaignOptions`** (Free Archetype omitted per product lock).

---

## Locked schema decisions

| Topic | Decision |
| --- | --- |
| Bulk / light items | **Decimals** — `1` = 1 Bulk, `0.1` = 1L |
| Attribute boosts | **User enters final boosts** — no automatic partial-boost pairing in 0.9/1.0 (`kind: "partial"` reserved) |
| Skills on new sheet | **Auto-seed** the standard skills; later auto-fill ranks from class/feats/etc. |
| Strikes vs items | **Snapshot** from item at link/refresh time; `itemId` retained; no live auto-mutate |
| Spellcasting entries | Used for class spellcasting (including class innate/focus as applicable) |
| Focus pool | **One shared pool** on `play` |
| Companions | **Subset sheet** is enough for 0.9/1.0 |
| Content ids | Kebab-case path ids (see below) |
| Level | **No hard upper cap** (`minimum: 1` only) |
| `derived` on Save | **Omit** from Save sheet exports |

### Content id convention

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

### Standard skills to auto-seed

`acrobatics`, `arcana`, `athletics`, `crafting`, `deception`, `diplomacy`, `intimidation`, `medicine`, `nature`, `occultism`, `performance`, `religion`, `society`, `stealth`, `survival`, `thievery`  
(plus user-added `lore:*` rows)

---

## Remaining non-blocking choices (scaffold-time)

Schema work does not need these answered to proceed, but scaffolding will pick defaults if unspecified:

1. **UI framework** — Preact / Svelte / React / vanilla TypeScript DOM?
2. **Save file extension** — `.json` vs `.pf2e.json`?
3. **App display name** — keep repo name `Pathfinder-2E-Card` or a player-facing title?

### Soft follow-up (not blocking)

- **Ancestry-only innate spells** (no class spellcasting): same `spellcasting[]` entry pattern is available when needed; not required for every ancestry at seed time.
- Decimal bulk float noise: engine should round/compare carefully (e.g. work in tenths internally).

---

## Known issues / risks

### I1 — Blank drafts vs complete characters

Empty `ContentRef.name` values are schema-valid for new sheets. “Ready to play” checks belong in app logic (or a future stricter schema).

### I2 — Decimal bulk float noise

Prefer internal integer tenths when summing; persist decimals per decision.

### I3 — Override path grammar

`overrides` keys are free-form (`derived.ac.total`, etc.). Document paths in code; optionally validate known paths in-app.

### I4 — Open `effects` types

Unknown `type` values must be ignored by the resolver.

### I5 — No dual-class model

Out of scope; use feats/features/`extensions` if needed.

### I6 — Class-specific resources

Kineticist / inventor / etc. use `play.dailyResources`, feats/features, or `extensions` until specialized UI exists.

### I7 — Remaster rune names in item stats

Legacy rune names map in content fallback, not alternate schema enums.

### I8 — Cross-references

`equippedArmorItemId` → `inventory.items[].id` enforced in app, not JSON Schema.

---

## Deferred

- Campaign flags, card UI metadata, sidebar encyclopedia caches  
- Foundry/Pathbuilder mappings, dice roller, multi-character library  
- Automatic partial-boost pairing, live strike sync from items  

---

## Next implementation steps

1. TypeScript types mirrored from (or generated from) the schema.  
2. Empty-sheet factory: auto-seed 16 skills; `schemaVersion: 1`.  
3. Save sheet serializer that strips `derived`.  
4. Core calc engine + golden fixtures (Fighter 5, …).  
5. PWA spreadsheet shell.
