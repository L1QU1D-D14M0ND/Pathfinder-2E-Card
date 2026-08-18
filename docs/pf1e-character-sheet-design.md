# Pathfinder First Edition — Character sheet (system spec)

**Status:** System specification locked for 0.9 sequencing (ADR 0003) — 2026-08-17  
**Parent:** [`ttrpg-character-sheet-design.md`](ttrpg-character-sheet-design.md)  
**Schema:** [ADR 0006](adr/0006-pf1e-character-schema.md), [`pf1e-schema-design-notes.md`](pf1e-schema-design-notes.md), [`../schemas/pf1e/character.schema.json`](../schemas/pf1e/character.schema.json)  
**Priority:** **First** system to take to a playable 0.9 bar (ahead of remaining PF2e work)

This is the PF1e analog of the PF2e design doc. It does not replace the umbrella product lock.

---

## 1. Purpose

Let a player **build and play** a Pathfinder First Edition character on the shared spreadsheet PWA: identity (including multiclass), abilities, skills, combat (BAB, saves, AC/touch/FF, CMB/CMD, iteratives), feats, spells, inventory (pounds), and session state (HP, conditions, daily resources).

Ruleset target: **Core Rulebook**, player-facing. No GM-exclusive bestiary/adventure text. Advanced Player’s Guide (traits, extra classes) is **out of 0.9** unless a later ADR pulls it in; extra traits can be custom feat/feature rows.

---

## 2. Locked decisions (PF1e)

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Ability model | Six **ability scores** (3–… no schema max). Modifier = `floor((score + tempScore − 10) / 2)` + `tempModifier`. `tempScore` is a score bump; `tempModifier` is a check/DC addend |
| 2 | Classes | `classes[]` rows: class id/name, levels, favored flag, optional prestige. **Free multiclass.** Total level = sum of class levels |
| 3 | BAB / saves / HD | Engine tables for the **11 CRB classes**. Custom/prestige rows pick a progression (full / ¾ / ½ BAB; good/poor saves; HD) |
| 4 | Skills | Rank-based. Class-skill +3 when trained. Armor check penalty on listed skills. Knowledge/Craft/Perform/Profession as addable rows (Knowledge subtypes auto-seeded) |
| 5 | AC | Normal, **touch**, **flat-footed**. Size and Dex (or lack of Dex) as in CRB |
| 6 | Maneuvers | **CMB** and **CMD** derived |
| 7 | Attacks | Iterative attacks from BAB (−5 steps). MAP is a PF2e concept — do not reuse |
| 8 | HP | Max at level 1 HD + Con; later levels user-entered rolled/fixed HD + Con (+ favored class HP if chosen). Engine sums; does not roll |
| 9 | Spell DC | `10 + spell level + ability mod` per spellcasting class entry. Caster level from class levels in that class |
| 10 | Spells per day | **User-entered** max + remaining in 0.9; bonus spells from ability **are** derived (table). Domain/school slots are extra rows, not auto-granted until content packs |
| 11 | Encumbrance | Item **pounds**; total weight derived. Light/medium/heavy from Strength table (engine). No PF2e bulk |
| 12 | Play / dying | Negative HP allowed; dead at −Con (display threshold). **No** PF2e dying/wounded/doomed track, **no** hero points in 0.9 (optional later as a custom resource) |
| 13 | Alignment | First-class identity field (nine alignments + optional deity) |
| 14 | Size / race | Race (not ancestry/heritage). Size affects AC, attack, CMB/CMD, and carrying capacity as in the CRB size table. Stealth/Fly size skill modifiers are not auto-applied in 0.9 |
| 15 | Feats | Structured rows (type: general, combat, metamagic, item creation, …). No auto-application of feat text in 0.9 |
| 16 | Companions / familiars | Schema hook allowed; **no nested editor in PF1e 0.9** (same deferral as PF2e companions) |
| 17 | Goldens | Fighter 5; Wizard 5; multiclass Fighter 2 / Wizard 3 (or equivalent mixed BAB) |
| 18 | House rules | No ABP, no Mythic, no Elephant in the Room in 0.9. Custom rows if a table uses them |
| 19 | Content ids | Kebab-case paths (`class.fighter`, `feat.power-attack`, `spell.fireball`, `skill.perception`, `race.human`) |

---

## 3. What “complete” means (PF1e domains)

Save **inputs** and **session state**; **derived** is optional cache and omitted on Save.

### 3.1 Identity

Name, player name, race, size, alignment, deity, total level (derived), XP, appearance/personality notes, languages, speed(s).

`classes[]`: each row has class ref, levels, hit die, BAB progression, Fort/Ref/Will progression, favored class (HP vs skill vs none — user pick per level or a running total).

### 3.2 Abilities

STR DEX CON INT WIS CHA scores. Temp modifiers as optional breakdown. Derived modifiers.

### 3.3 Offense / defense

- BAB (stacked), melee/ranged attack extras (user + derived from ability/size).
- Iterative attack bonuses list.
- Fort / Ref / Will (stacked class + ability + user modifiers).
- AC, touch, flat-footed.
- CMB, CMD.
- Initiative (Dex + user).
- HP max / current / temp; nonlethal (optional field).

### 3.4 Skills

Per-skill: ranks, class-skill flag, ability, ACP applies, misc. Derived total. Max ranks = character level (CRB); engine may warn in a later UI, not a schema max.

### 3.5 Feats, features, special abilities

Rows with name, type, level taken, summary text, empty `effects[]`. Class features as feature rows (user-entered in 0.9).

### 3.6 Magic

One `spellcasting[]` entry per casting class (wizard, cleric, …). Ability key, caster level (default: levels in that class), spell DCs by level or a DC-for-level function in derived, slots max/remaining, spell list rows (cantrips/orisons, prepared or known), arcane spell failure as an inventory-derived or user field.

**0.9 does not** auto-prepare a spellbook from the Core list. User types or picks ids when a pack exists.

### 3.7 Inventory & wealth

Items with pounds, equipped/carried, weapon/armor/shield subfields (enhancement bonus, armor bonus, max Dex, ACP, spell failure). Currency (pp/gp/sp/cp). Derived weight and load category.

### 3.8 Play

Current HP, conditions (name, value, duration text), daily resources (generic rows: channel, rage, …). No hero-point strip required.

---

## 4. Calculation architecture (0.9 core)

```
Class rows → BAB, saves, HD contribution
Ability scores → modifiers
Armor/shield/size/Dex → AC, touch, FF
BAB + STR/DEX + size → CMB, attack extras
BAB → iterative list
Skill ranks + ability + class + ACP → skill totals
Spell level + ability → DC
Weight vs STR → load
Overrides last
Unknown effects[] ignored
```

### 4.1 In scope for PF1e 0.9

- Ability modifiers from scores.
- Stacked BAB and saves from class progressions.
- HP max from recorded HD rolls + Con + favored HP. Click the max HP number to type each physical HD roll and review the tally.
- AC / touch / FF from armor, shield, Dex (capped), size, natural/deflection/dodge/other as **user modifier buckets** (full 1E bonus-type engine is post-0.9; 0.9 uses named buckets that **sum dodge** and **max enhancement/deflection/natural** if those fields are present — keep the implementation small: prefer explicit fields on AC rather than a 12-type general stacker in the first increment).
- CMB / CMD.
- Iterative attacks from BAB.
- Skill totals including class-skill +3 and ACP.
- Spell DC; bonus spells from ability score.
- Total weight; load category.
- Initiative.

### 4.2 Explicitly later

- Full typed-bonus graph (every CRB bonus type on every check).
- Automatic feat math (Power Attack, Combat Expertise, Weapon Finesse toggling).
- Spellbook legality, domain spell slots auto-granted, school opposition.
- Magic item generation, charging wands as encyclopedia.
- Prestige prereq checking.
- Familiars / animal companions / eidolons as nested sheets.
- Mythic, path of war, 3PP.

### 4.3 Stacking (pragmatic 0.9)

Do **not** port `engine/stacking.ts` item/status/circumstance. For 0.9, AC uses explicit inputs (armor bonus, shield, Dex, size, natural, deflection, dodge, other) with CRB-ish combination: dodge and “other” sum; armor/shield/natural/deflection take the field as given (user responsible for not stacking two enhancement bonuses until a later stacker exists). Document this in the schema notes so goldens are honest.

---

## 5. UI (PF1e-specific)

Fork or parameterize vs PF2e:

- **Identity:** classes table (add class, levels), alignment, race, size. No heritage/background/edicts required (background can be notes).
- **Abilities:** six scores, not boost totals.
- **Combat:** BAB, saves, three ACs, CMB/CMD, iteratives — not proficiency ranks or MAP.
- **Skills:** ranks + class checkbox, not untrained/trained/expert/master/legendary.
- **Spells:** per-class entry; DC by spell level; no focus pool / hero points.
- **Play:** current HP (can be negative); conditions; daily resources. No dying track.
- **Inventory:** lb, not bulk/invested.

Shared: Notes, generic feat/feature row tables, Save/Load, derived-cell look, **sidebar host** (PF1e may register edition tools later; none required for 0.9).

---

## 6. Golden-test characters

Engineering fixtures. Assert core outputs. Until catalog batches 8–10 land, goldens keep numeric combat/skill inputs on the sheet (PF1e ContentRef has no `rulesetSource`; that field is PF2e-only).

1. **Fighter 5** — full BAB, heavy armor, **one** attack at +5 (iteratives start at BAB +6), Fort good, skill ACP, HP from d10s.
2. **Wizard 5** — ½ BAB, prepared arcane, INT DCs, bonus spells, cantrips, light load, poor Fort/Ref good Will.
3. **Multiclass** — **Fighter 2 / Wizard 3** (or same level split). Assert **stacked** BAB and mixed saves. This is the fixture that proves `classes[]` is not a single-class afterthought.

Exact ability scores, feats, and spell picks are chosen when writing the fixture. Roles above stay covered.

Optional later (not 0.9): Cleric 5 (domains/channel as daily resources), Ranger 5 + companion, prestige smoke test.

---

## 7. Content pack (Phase 3c)

Curated CRB player catalog under [`content/pf1e/crb/`](../content/pf1e/crb/). Review process: [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) — **two mechanics per batch**.

Batch 1 (landed): ability-modifier formula (engine-owned) + BAB/save progression tags for Fighter and Wizard. Identity can apply those tags from a class picker.

Batch 2 (landed): click **max HP** to open a per-HD breakdown; the player types physical HD rolls (the app does not roll). BAB and each attack show CRB iterative slash notation (`+6/+1`). Fighter 5 stays a single +5.

**Next (batch 3):** AC / touch / FF + CMB / CMD — engine review of formulas already in `compute()`, no new catalog, no typed-bonus stacker. Then batch 4 skills, 5 size, 6 encumbrance. Catalog (Human, Fighter/Wizard class skills + skill points, weapons/armor ids) is batches 8–10 after those math reviews. Annotated queue: [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §6.

Remaining CRB classes, feats, and spell metadata wait until the three goldens can be rebuilt from ids.

Enough catalog to rebuild the three goldens is the 0.9 content bar. Full CRB spell list can trail.

---

## 8. Relationship to PF2e

Reuse is the **kernel**, not the rules. See [`shared-kernel-design.md`](shared-kernel-design.md): PWA, Ajv Load/Save, `ContentRef` core, `Effect` stub, coins, notes, `DerivedCell`, golden helper, **sidebar host**. Do not share proficiency math, bulk, hero points, `ProficiencyRank`, or a single character TypeScript type.

PF2e Dual Class (campaign option) stays out of PF2e 0.9; it is **not** the same as PF1e multiclass. PF1e multiclass is in scope here.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Initial PF1e system spec under ADR 0003 |
| 2026-08-17 | Share sidebar host with PF2e; PF1e tools optional later |
| 2026-08-17 | Schema v1 (ADR 0006). Fighter 5 golden uses a single +5 iterative (CRB). |
| 2026-08-17 | Phase 3e: Fighter 2 / Wizard 3 golden proves stacked BAB/saves. |
| 2026-08-17 | Phase 3c batch 1: CRB pack process; ability modifiers + BAB/saves. |
| 2026-08-17 | Phase 3c batch 2: HP breakdown dialog (manual HD rolls) + iterative slash notation. |
| 2026-08-17 | Annotate upcoming CRB batches 3–10; next is AC/touch/FF + CMB/CMD. |
| 2026-08-17 | Size lock is AC/attack/CMB/CMD/carry, not skill size mods. PF1e goldens have no `rulesetSource`. |
| 2026-08-17 | Ability modifier uses `tempScore` (score bump) plus `tempModifier` (check/DC addend). |
| 2026-08-18 | Audit 1A–10B on local `main`. Next pack work is still batch 3 table tests. |
