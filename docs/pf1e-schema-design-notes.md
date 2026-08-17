# PF1e character JSON schema — design notes

**Status:** Implemented. Contract: [ADR 0006](adr/0006-pf1e-character-schema.md), [`schemas/pf1e/character.schema.json`](../schemas/pf1e/character.schema.json).  
**Parent lock:** [ADR 0003](adr/0003-multi-system-product-direction.md), [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md)  
**Shared envelope / refs:** [`shared-kernel-design.md`](shared-kernel-design.md)  
**PF2e schema (unchanged):** [`character.schema.json`](../schemas/character.schema.json), [ADR 0002](adr/0002-character-schema.md)

Do not extend the PF2e schema with optional 1E fields. PF1e has its own document type.

---

## Envelope

```json
{
  "schemaVersion": 1,
  "system": "pf1e",
  "meta": { "createdAt": "", "updatedAt": "", "appVersion": "", "locale": "en" }
}
```

- `system` is required `"pf1e"`.
- `schemaVersion` is the **PF1e** document version (starts at 1). Independent of PF2e’s `schemaVersion`.
- Save omits `derived`.
- `overrides` map for manual totals; `extensions` bag for experiments.

---

## Design principles

1. **One file = one PC.** Familiars/companions are a stub array (not in 0.9 UI).
2. **Inputs + play state are authoritative.**
3. **Multiclass is normal.** Identity is `classes[]`, not a single `identity.class`. `identity.level` is **not stored**; level is derived from the class sum.
4. **User-entered where tables are large** (spells per day, HD rolled). **Engine-owned where tables are small** (BAB/save/HD types, ability modifiers, iterative steps, encumbrance thresholds).
5. **`effects[]` on rows** for later automation; unknown `type` ignored.
6. **No campaign-options block** in 0.9.

---

## Locked field names (schema v1)

See the JSON Schema for types. Summary:

| Area | Fields |
| --- | --- |
| Identity | `characterName`, `playerName`, `race`, `size` (includes Fine/Diminutive/Colossal), `alignment`, `deity` (string), `xp`, `languages` |
| Classes | `id`, `class` ContentRef, `levels`, `hitDie`, `babProgression` (`full` / `threeQuarter` / `half`), `saves` good/poor, `favored.hp` / `favored.skillRanks` |
| Abilities | `score` + optional `tempModifier` per key |
| Vitals | `hpRolled[]` (before Con), `currentHp` (may be negative), `tempHp`, `nonlethal`, speeds/senses |
| AC | explicit `armorBonus`, `shieldBonus`, `natural`, `deflection`, `dodge`, `other`, `maxDex` (null = no cap), `armorCheckPenalty` (≤ 0) |
| Combat misc | initiative / melee / ranged / CMB / CMD / save misc |
| Skills | `key` kebab **without dots**, `ranks`, `classSkill`, `armorPenaltyApplies`, `misc` |
| Attacks | snapshot rows; engine adds BAB + ability + size |
| Inventory | `pounds`, location `equipped\|carried\|stowed\|dropped` (dropped excluded from weight) |
| Play | `dailyResources` only — no hero points, no dying track |

ContentRef is `{ id, name }` plus optional `source`. No Remaster/legacy fields.

Skill keys must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` so `derived.skillTotals.<key>` overrides parse (use `knowledge-arcana`, not `knowledge.arcana`).

---

## Auto-seed skills (factory)

Seed CRB skills that are not wildcard Craft/Perform/Profession:

`acrobatics`, `appraise`, `bluff`, `climb`, `diplomacy`, `disable-device`, `disguise`, `escape-artist`, `fly`, `handle-animal`, `heal`, `intimidate`, `linguistics`, `perception`, `ride`, `sense-motive`, `sleight-of-hand`, `spellcraft`, `stealth`, `survival`, `swim`, `use-magic-device`, plus Knowledge (`arcana`, `dungeoneering`, `engineering`, `geography`, `history`, `local`, `nature`, `nobility`, `planes`, `religion`).

User adds `craft-*`, `perform-*`, `profession-*` like PF2e lore.

---

## Engine notes (0.9 martial)

- Modifier = `floor((score − 10) / 2)` + `tempModifier`.
- BAB/saves stack **per class row** (do not add levels then apply one table).
- Iteratives: extra attacks when BAB ≥ 6, −5 steps, max four from BAB. **Fighter 5 is +5 only**, not +5/+0.
- HP: each `hpRolled` entry contributes `max(1, roll + Con mod)`, plus favored-class HP totals.
- AC: Dex bonus capped by `maxDex`; Dex **penalties** still apply when flat-footed; dodge is lost when flat-footed.
- Load: CRB Strength heavy-load table × size multiplier; light/medium = floor(heavy/3) and floor(2×heavy/3).
- Item armor/weapon subfields are documentary in 0.9; combat numbers come from `armorClass` / `attacks`.
- Unknown `effects[]` are ignored (not read).

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

## Next implementation steps

1. ~~Schema ADR + `schemas/pf1e/character.schema.json` + TypeScript types.~~
2. ~~Empty-sheet factory with seeded skills.~~
3. ~~`compute()` for abilities, BAB, saves, HP, AC trio, CMB/CMD, iteratives, skills, weight.~~
4. ~~Fighter 5 golden.~~
5. ~~Spell DC + slots editor + Wizard 5 golden (Phase 2e).~~
6. Multiclass golden (Phase 3e).

Sidebar **tools** (Attack Helper, Actions List) wait until the character sheet is ~90% done (dynamic and functional). They are not part of schema/engine work.

---

## Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Initial target notes (no on-disk schema yet) |
| 2026-08-17 | ADR 0006 + on-disk schema; field names locked |
| 2026-08-17 | Phase 2e: spell DC + bonus slots in compute |
