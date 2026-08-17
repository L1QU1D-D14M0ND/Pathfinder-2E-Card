# PF1e character JSON schema — design notes

**Status:** Target notes for the future PF1e schema ADR. **No** `schemas/pf1e/` file in the repo yet.  
**Parent lock:** [ADR 0003](adr/0003-multi-system-product-direction.md), [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md)  
**Shared envelope / refs:** [`shared-kernel-design.md`](shared-kernel-design.md)  
**PF2e schema (current on-disk contract):** [`character.schema.json`](../schemas/character.schema.json), [ADR 0002](adr/0002-character-schema.md)

Do not extend the PF2e schema with optional 1E fields. PF1e gets its own document type.

---

## Envelope (shared with PF2e after refactor)

```json
{
  "schemaVersion": 1,
  "system": "pf1e",
  "meta": { "createdAt": "", "updatedAt": "", "appVersion": "", "locale": "en" }
}
```

- `system` is `"pf1e"`.
- `schemaVersion` is the **PF1e** document version (starts at 1). Independent of PF2e’s `schemaVersion`.
- Save omits `derived`.
- `overrides` map for manual totals; `extensions` bag for experiments.

---

## Design principles

1. **One file = one PC.** Familiars/companions later as nested subsets (not in 0.9 UI).
2. **Inputs + play state are authoritative.**
3. **Multiclass is normal.** Identity is `classes[]`, not a single `identity.class`.
4. **User-entered where tables are large** (spells per day, HD rolled). **Engine-owned where tables are small** (11 CRB BAB/save/HD types, ability modifiers, iterative steps, bonus-spells-from-ability, encumbrance thresholds).
5. **`effects[]` on rows** for later automation; unknown `type` ignored.
6. **No campaign-options block** in 0.9.

---

## Sketch (not a schema)

Illustrative only; field names will be locked in the schema ADR.

```json
{
  "schemaVersion": 1,
  "system": "pf1e",
  "identity": {
    "name": "",
    "race": { "id": "race.human", "name": "Human" },
    "size": "medium",
    "alignment": "lawful good",
    "deity": "",
    "xp": 0
  },
  "classes": [
    {
      "id": "row-1",
      "class": { "id": "class.fighter", "name": "Fighter" },
      "levels": 2,
      "hitDie": 10,
      "babProgression": "full",
      "saves": { "fort": "good", "ref": "poor", "will": "poor" },
      "favored": { "hp": 2, "skillRanks": 0 }
    },
    {
      "id": "row-2",
      "class": { "id": "class.wizard", "name": "Wizard" },
      "levels": 3,
      "hitDie": 6,
      "babProgression": "half",
      "saves": { "fort": "poor", "ref": "poor", "will": "good" }
    }
  ],
  "abilities": {
    "str": { "score": 16 },
    "dex": { "score": 12 },
    "con": { "score": 14 },
    "int": { "score": 16 },
    "wis": { "score": 10 },
    "cha": { "score": 8 }
  },
  "vitals": { "hpRolled": [10, 6, 4, 5, 3], "currentHp": 28, "tempHp": 0 },
  "armorClass": {
    "armorBonus": 6,
    "shieldBonus": 0,
    "natural": 0,
    "deflection": 0,
    "dodge": 0,
    "other": 0
  },
  "skills": [],
  "feats": [],
  "features": [],
  "attacks": [],
  "spellcasting": [],
  "inventory": { "items": [], "currency": { "gp": 0 } },
  "conditions": [],
  "play": { "dailyResources": [] },
  "notes": {},
  "overrides": {},
  "extensions": {}
}
```

`identity.level` is **derived** (sum of `classes[].levels`), not a competing input. If a document also stores a display level, the engine trusts the class sum unless overridden.

---

## Auto-seed skills (factory)

Seed CRB skills that are not wildcard Craft/Perform/Profession:

`acrobatics`, `appraise`, `bluff`, `climb`, `diplomacy`, `disable-device`, `disguise`, `escape-artist`, `fly`, `handle-animal`, `heal`, `intimidate`, `linguistics`, `perception`, `ride`, `sense-motive`, `sleight-of-hand`, `spellcraft`, `stealth`, `survival`, `swim`, `use-magic-device`, plus Knowledge (`arcana`, `dungeoneering`, `engineering`, `geography`, `history`, `local`, `nature`, `nobility`, `planes`, `religion`).

User adds `craft:*`, `perform:*`, `profession:*` (and extra Knowledges if needed) like PF2e lore.

---

## Content id convention

```text
race.human
class.fighter
class.wizard
feat.power-attack
spell.fireball
skill.perception
knowledge.arcana
weapon.longsword
armor.chainmail
condition.sickened
```

---

## Locked-for-now schema choices

| Topic | Decision |
| --- | --- |
| Weight | Pounds as numbers (allow 0.5 for light items). No bulk |
| Ability input | Final **score**, not PF2e boosts |
| BAB | Derived from class progressions; not a user total unless override |
| Spell slots | User-entered max/remaining |
| Focus / hero points | Omit from 0.9 PF1e document |
| Dying track | Omit; `currentHp` may be negative |
| Dual schema | Never store a PF1e character inside the PF2e schema |
| Level cap | No hard maximum in schema |

---

## Risks

| ID | Risk | Mitigation |
| --- | --- | --- |
| P1 | Copying PF2e field names that mean different math | Separate types; do not reuse `ProficiencyRank` |
| P2 | Under-specified bonus types | Explicit AC fields for 0.9; full stacker later |
| P3 | Prestige / custom classes | User-picked progressions on the class row |
| P4 | HD vs average vs max | Store the number that went into HP; engine sums |
| P5 | OGL / Product Identity | Curated pack; license review before shipping text |

---

## Next implementation steps (after Phase M)

1. Schema ADR + `schemas/pf1e/character.schema.json` + TypeScript types.
2. Empty-sheet factory with seeded skills and zero class rows (or one empty class row).
3. `compute()` for abilities, BAB, saves, HP, AC trio, CMB/CMD, iteratives, skills, weight.
4. Fighter 5 golden.
5. Spell DC + slots editor + Wizard 5 golden.
6. Multiclass golden.

---

## Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Initial target notes (no on-disk schema yet) |
