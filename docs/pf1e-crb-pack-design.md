# PF1e Core Rulebook pack (Phase 3c)

**Status:** In progress (2026-08-17). Batches 1–2 landed. **Next PR: batch 3** (AC / touch / FF + CMB / CMD).  
**Parent:** [`pf1e-character-sheet-design.md`](pf1e-character-sheet-design.md) §7, [ADR 0003](adr/0003-multi-system-product-direction.md)  
**On disk:** [`../content/pf1e/crb/`](../content/pf1e/crb/)  
**Code:** `app/src/systems/pf1e/content/` (lookup only; unknown ids do not fail Load)

This is not a dump of the Core Rulebook. Each batch takes **two character-creation / core-math mechanics**, checks the CRB procedure, maps it onto the sheet (or records the intended implementation), and only then adds the smallest catalog slice those mechanics need.

No class flavor text, no spell descriptions, no Product Identity. Landed batches ship **engine formulas** and, when needed, **numeric catalog tags** (Fighter/Wizard HD/BAB/saves).

---

## 1. How a batch works

For each mechanic:

1. **CRB rule** — what the Core Rulebook tells a player to do (procedure and table), in our own words.
2. **App today** — schema field, `compute()` helper, UI control, golden coverage.
3. **Gaps** — missing, approximated, or easy to misuse. 0.9 vs later.
4. **Pack slice** — catalog ids / tables to add *now*, or “engine-owned, no catalog row.”
5. **Tests** — Vitest against published table numbers, not against a second copy of the formula alone.

Do **not** add the next two mechanics in the same PR unless they are required to test this batch.

Resolver rule (locked): missing catalog id → treat as **custom**; isolate to that row; never reject the whole sheet.

---

## 2. Mechanic queue (character basics)

Order is CRB character-build order, not encyclopedia order. Sidebar tools stay out. **Two mechanics per PR** — do not start the following pair in the same change.

**How to pick the next PR:** take the first row whose status is **Next**. Engine-owned rows review formulas and UI honesty; catalog rows add ids. Goldens must stay green. Do not start Attack Helper / Actions List / Budget Calculator here.

| Batch | Mechanics | Why this pair | Kind | Status |
| --- | --- | --- | --- | --- |
| **1** | Ability scores → modifiers; BAB + save progressions (and how they stack) | Scores feed every later total; BAB/saves are the class-table core | Engine + Fighter/Wizard tags | Done |
| **2** | Hit points (HD + Con + favored); iterative attacks from BAB | HD uses class hit die from batch 1; iteratives are a use of BAB | Engine + HP dialog / slash line | Done |
| **3** | AC / touch / flat-footed; CMB / CMD | Same Combat block; Dex, size, dodge, and deflection are shared | Engine review (no new catalog) | **Next** |
| **4** | Skills (ranks, class +3, ACP); max ranks = character level | Skill total vs rank cap; ACP already lives on AC inputs | Engine review (class-skill list waits for 9) | After 3 |
| **5** | Size (AC/attack vs CMB/CMD vs carry) | One CRB size table, three consumers (AC/attack, CMB/CMD, carry) | Engine review (table tests; goldens stay Medium) | After 3 |
| **6** | Encumbrance (Strength heavy-load table; light / medium / heavy) | Carry multiplier comes from size (batch 5) | Engine review | After 5 |
| **7** | Spell DC; bonus spells from ability | Already computed in Phase 2e | Engine already; pack review later | Later |
| **8** | Race (Human first — golden) | Golden `race.human`; ability adjustments stay typed into scores | Catalog | After math 3–6 |
| **9** | Class skills + skill points per level (Fighter, Wizard) | Needs skill math from batch 4 | Catalog | After 4 |
| **10** | Weapons / armor on the three goldens | Documentary item ids; combat numbers stay on `armorClass` / `attacks` | Catalog | After 3; recommended after 3–6 |
| … | Feats, spells metadata, remaining 9 CRB classes | After the three goldens can be rebuilt from ids | Catalog | After 8–10 |

Annotations for batches 3–10 (intent, already in the app, in/out, tests) are in [§6](#6-recommended-upcoming-batches). Full CRB write-ups like §4.1–4.4 are written **when that batch lands**, not ahead of time.

---

## 3. Pack layout

```text
content/pf1e/crb/
  README.md          # license / what is in this folder
  pack.json          # manifest + which batches have landed
  classes.json       # progression metadata only (batch 1: fighter, wizard)
```

A class catalog row in this phase is **not** a class description. It is:

| Field | Why |
| --- | --- |
| `id` | `class.fighter`, `class.wizard` |
| `name` | Display label |
| `hitDie` | d10 / d6 / … (HP batch will use this; stored now because it is on the class table) |
| `babProgression` | `full` / `threeQuarter` / `half` |
| `saves.fort/ref/will` | `good` / `poor` |
| `source.book` | `"CRB"` — page omitted until we cite without copying tables as images |

Class skills, features, spells/day, and proficiency lists wait for later batches.

---

## 4. License (this folder)

- **App code:** MIT.
- **This pack:** curated **game mechanics numbers** (formulas and class HD/BAB/save tags). No Paizo logos, no setting names beyond the mechanical class names already used as catalog ids, no copied prose.
- Do not scrape d20pfsrd / Archives of Nethys / Hero Lab as the ship pack.
- Full OGL 1.0a Section 15 / Product Identity review happens before any **rules text** or **spell summaries** land. Batch 1 does not need that text.

---

## Batch 1 — two mechanics

### 4.1 Ability scores and modifiers

**CRB (player-facing):** Each character has six ability scores: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma. The **ability modifier** for a score is read from the Ability Modifiers table, which is exactly:

`modifier = floor((score − 10) / 2)`

Examples: 1 → −5; 8–9 → −1; 10–11 → 0; 12–13 → +1; 18–19 → +4; 20–21 → +5. Odd and even scores in a pair share a modifier. There is **no maximum score** in the table (magic items and spells can raise scores past 18).

How the score is *generated* (4d6 drop lowest, point-buy, elite array) is a campaign choice. The sheet stores the **final score after racial adjustments**.

Temporary bonuses that **increase the score** (belt of giant strength, *bull’s strength*) change the score, then the modifier is recomputed. Bonuses that apply to **checks** but not the score are a different layer (later typed-bonus work).

**App today:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `abilities.{str…cha}.score` | Integer; no schema max |
| Extra | `tempModifier` | **Added to the modifier after** `floor((score−10)/2)` — not added to the score |
| Engine | `abilityModifierFromScore`, `abilityModifiers` in `engine/abilities.ts` | Used by AC, CMB, skills, saves, spell DC, attacks, load (Strength **score**, not modifier, for encumbrance) |
| UI | Abilities tab: Score, Temp mod, derived Modifier | |
| Goldens | Fighter 5, Wizard 5, Fighter 2 / Wizard 3 | Assert the six modifiers |

**Verdict:** The **formula is correct** and matches the CRB table. Encumbrance correctly uses the **score**, not the modifier.

**Gaps (do not fix in this batch unless they block goldens):**

| Gap | Why it waits |
| --- | --- |
| `tempModifier` is a modifier addend, not a score increase | A +4 belt should be entered as score 18→22 (modifier +6), not temp +4 (which would yield modifier +8 on a 18). Documented on the Abilities tab. A later “ability score bonus” field could exist; do not silently treat temp as a score bump. |
| No point-buy / 4d6 helper | User types the final score. Out of 0.9 core calc. |
| No racial ability adjustments as catalog | Human +2 any is entered in the score. Race pack is batch 8. |
| Score 0 / negative | Formula still applies (`0` → −5). CON 0 as “dead” is play-state later, not this formula. |
| Ability damage / drain | CRB lowers the score. User lowers `score`. No separate track in 0.9. |

**Pack slice:** none. This table is **engine-owned** (small, closed formula). Do not duplicate it as a JSON lookup of every score.

**Tests:** CRB sample scores including odd values, 1, 20, and a high score (45). `tempModifier` adds to the modifier only.

---

### 4.2 Base attack bonus and saving throws

**CRB (player-facing):** Each class has a **base attack bonus** progression and three **base save** progressions (Fortitude, Reflex, Will), each **good** or **poor**.

Published class tables (levels 1–20) match these formulas:

| Progression | Formula | Level 1 | Level 5 | Level 20 |
| --- | --- | --- | --- | --- |
| BAB full (Fighter, Barbarian, Paladin, Ranger) | `levels` | +1 | +5 | +20 |
| BAB ¾ (Cleric, Druid, Rogue, Bard, Monk) | `floor(levels × 3 / 4)` | +0 | +3 | +15 |
| BAB ½ (Wizard, Sorcerer) | `floor(levels / 2)` | +0 | +2 | +10 |
| Save good | `2 + floor(levels / 2)` | +2 | +4 | +12 |
| Save poor | `floor(levels / 3)` | +0 | +1 | +6 |

**Multiclass (CRB):** Add the **integer** BAB from each class, and the **integer** base save from each class. Do **not** add all class levels together and then look up one table. Do **not** use the optional “fractional BAB/saves” house rule in 0.9.

Example (golden): Fighter 2 (full BAB +2, Fort good +3, Ref poor +0, Will poor +0) + Wizard 3 (half BAB +1, Fort poor +1, Ref poor +1, Will good +3) → BAB **+3**, base Fort **+4**, base Ref **+1**, base Will **+3**. Ability modifiers are applied **after** that stack (Fort + Con, etc.).

**Iterative attacks** (extra attacks at BAB +6 / +11 / +16, −5 steps) are a **use of BAB**, not the BAB table itself. They are **batch 2**.

**App today:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `classes[].babProgression`, `classes[].saves`, `classes[].levels` | User-entered per row |
| Engine | `babFromProgression`, `saveFromProgression`, `stackedBab`, `stackedSave` | Per-row then sum |
| Derived | `derived.bab`, `fortitude` / `reflex` / `will` (base + ability + misc) | Combat tab |
| UI | Identity class table: HD, BAB, Fort/Ref/Will selects | Catalog did not fill these |
| Goldens | Fighter 5 BAB 5; Wizard 5 BAB 2; F2/W3 BAB 3 | Spot checks, not 1–20 tables |

**Verdict:** Formulas and **per-class stacking** match CRB. Empty sheet (no class rows) yields BAB 0 and base saves 0, which is correct for “no class.”

**Gaps:**

| Gap | Why it waits / this batch |
| --- | --- |
| Identity did not stamp HD/BAB/saves from `class.fighter` | **This batch:** catalog + apply when the player picks a CRB class. Custom rows stay fully manual. |
| Only Fighter and Wizard in the pack | Other 9 CRB classes use the same three BAB tags; add them when we review those classes, not all at once. |
| Fractional BAB/saves | Optional variant. Out. |
| Prestige class tables | Out of 0.9 goldens. |
| Saves include ability + misc in `derived.fortitude` | Correct CRB total; base-only is not a separate derived field. Goldens assert the **total**. |

**Pack slice:** `classes.json` with **Fighter** and **Wizard** progression tags only.

**Tests:** Full 1–20 BAB (all three tags) and save (good/poor) tables; catalog rows match those tags; unknown id resolves to miss; applying `class.fighter` onto an empty class row yields d10 / full / good Fort.

---

## 5. Resolver (batch 1)

```ts
lookupCrbClass(id) → CrbClassProgression | null
applyCrbClassProgression(classRow, id) → ClassEntry
```

- Known id → fill `class` ref, `hitDie`, `babProgression`, `saves`. Leave `levels` and favored-class totals alone.
- Unknown or empty id → `null` / custom (`class.id` cleared). Do not throw.
- Load of an existing sheet **does not** re-apply the catalog (the saved row is authoritative). Apply is a UI action when the player picks a class.

---

## Batch 2 — two mechanics

### 4.3 Hit points (HD + Con + favored)

**CRB (player-facing):** Each class level grants one **hit die**. At **1st character level**, the die is usually taken as **maximum** (d10 fighter → 10). At later levels the player **rolls** that class’s hit die at the table. Constitution modifier is added to **each** HD. A level never grants fewer than **1** HP. **Favored class** may add +1 HP per level in that class (instead of +1 skill rank). The sheet does **not** roll.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `vitals.hpRolled[]` | Die results **before** Con, in class-row order |
| Engine | `hpFromHitDie` = `max(1, roll + Con)`; `maxHp`; `hpBreakdown` | Missing rolls contribute 0 |
| Favored | `classes[].favored.hp` | Summed after dice |
| UI | Click **max HP** (`/ 40`) or Play → Max HP / Enter HD rolls | Dialog: one row per HD, type the physical roll, Con and from-HD, favored lines, total |
| Goldens | Fighter 5 = 49; Wizard 5 = 37; F2/W3 = 40 | Unchanged |

**Verdict:** The formula matches CRB. 1st-level max is **not auto-written** (the player types 10 or clicks **Max 1st**). HD slots follow `classes[]` order (Fighter 2 then Wizard 3 → two d10 then three d6).

**Gaps:** Toughness and other HP feats are still user-entered favored/misc later, not auto. Temp HP is play-state, not in max. Average-HP optional rule is “type 6 on a d10,” not a second engine.

**Pack slice:** none new (hit die size already on the class catalog from batch 1).

**Tests:** Golden breakdowns; min 1 HP; `setHitDieRoll` fills in order.

### 4.4 Iterative attacks

**CRB (player-facing):** When making a **full-round attack** with a manufactured weapon, extra attacks come from BAB: a second attack at **BAB +6** (at BAB−5), a third at **+11**, a fourth at **+16**. Maximum **four** from BAB. **Fighter 5 is a single +5**, not +5/+0. Haste, two-weapon fighting, and natural attacks are separate (not this batch). No in-app dice.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Engine | `iterativeAttacks(bab)` | `[bab]` then −5 while the next bonus is ≥ +1, max four |
| Display | Identity BAB; Combat “Iterative attacks”; each attack’s Attack cell | CRB slash line: `+6/+1` |
| Goldens | Fighter 5 `[5]` / longsword `+9`; Wizard `[2]`; F2/W3 `[3]` | Unchanged |

**Verdict:** Matches the CRB extra-attack table for BAB 1–20.

**Gaps:** Full-round vs standard action is a reminder, not an encounter tracker. Rapid Shot / TWF wait with feat automation.

**Pack slice:** none (pure BAB math).

**Tests:** Full BAB 1–20 iterative lists; `formatIteratives`; Fighter 5 is not +5/+0.

---

## 6. Recommended upcoming batches

These are **annotations**, not landed reviews. Each future PR still follows §1 (CRB procedure → app today → gaps → pack slice → tests) and stops after **two** mechanics.

### Batch 3 — AC / touch / FF + CMB / CMD (**next**)

**Pairing:** Both are Combat-tab derived totals. They share Dex (capped by `maxDex`), size (AC/attack modifier vs special CMB size), dodge, and deflection. Reviewing them together keeps the three ACs honest against CMD.

**Already in the app (do not rewrite from scratch):**

| Total | Formula in `engine/ac.ts` / `compute.ts` |
| --- | --- |
| AC | `10 + armor + shield + cappedDex + size + natural + deflection + dodge + other` |
| Touch | `10 + cappedDex + size + deflection + dodge + other` (no armor, shield, or natural) |
| Flat-footed | Like AC, but Dex **bonus** and dodge drop; Dex **penalties** still apply |
| CMB | `BAB + STR + special size + cmbMisc` |
| CMD | `10 + BAB + STR + DEX + special size + dodge + deflection + cmdMisc` |

Special size for CMB/CMD is the negation of the AC/attack size modifier (`engine/abilities.ts`). Goldens are Medium (size 0): Fighter 5 AC 18 / touch 12 / FF 16, CMB +9, CMD 21.

Armor **max Dex** caps Dex on AC and touch, **not** on CMD (CMD uses the full Dex modifier). Do not “fix” CMD to use `cappedDexBonus`.

**In this batch:** CRB procedure in our own words; table tests beyond the three goldens (Dex cap, negative Dex on FF, touch omits armor); Combat UI labels if a total is easy to misread; document that armor/shield/natural/deflection fields are **user-responsible** (no typed-bonus stacker — risk P2).

UI honesty already noticed (partially landed; remaining work is formula table tests):

- AC / touch / FF derived cell flags any of the three override paths.
- Combat shows BAB (flags `derived.bab`) and iteratives (flags `derived.babIteratives`) separately. Overriding BAB does not rewrite the slash line.
- `armorClass.other` applies to touch and flat-footed (dodge does not apply to FF). Combat tab states this. User-responsible.
- CMD uses **uncapped** Dex; AC/touch use `maxDex`. No extra copy (decision 8C).

**Out:** Item-granted AC from inventory; max Dex from an armor catalog (batch 10); size table expansion (batch 5 — already applied, Medium-only in goldens); Combat Expertise / fighting defensively; shield bash; CMD vs specific maneuvers.

**Pack slice:** none (engine-owned).

**Tests:** Golden AC trio + CMB/CMD stay; add Dex-cap and FF-penalty cases. Do **not** start batch 4 in the same PR.

### Batch 4 — Skills (ranks, class +3, ACP) + max ranks

**Pairing:** The skill total and the rank cap are the two player-facing skill rules on the sheet. Class-skill *lists* and skill points per level are catalog (batch 9).

**Already in the app:** `skillTotal` = ranks + ability + (trained and class skill → +3) + ACP (if the skill flags it) + misc. Factory seeds the CRB skill list. Favored-class **skill ranks** are stored on the class row but not auto-applied to a skill.

**In this batch:** Confirm +3 only when ranks ≥ 1; ACP only on flagged skills (Climb, not Diplomacy); max ranks = **character level** (CRB; no 3.5 cross-class half ranks). UI warns when ranks exceed level (no clamp). Disable Device, Use Magic Device, and Handle Animal show **—** at 0 ranks; Fly shows **—** without a fly speed.

**Out:** Stamping Fighter/Wizard class-skill checkboxes from the pack (batch 9); armor-load penalties stacking on top of typed ACP (batch 6); Craft/Perform/Profession catalogs.

**Pack slice:** none.

**Depends on:** batch 3 only in the sense of “Combat ACP field already exists.” May follow 3 immediately.

### Batch 5 — Size (AC/attack vs CMB/CMD vs carry)

**Pairing:** One CRB size row drives three modifiers already wired: AC/attack, special CMB/CMD (opposite sign), carrying-capacity multiplier.

**Already in the app:** Fine … Colossal tables in `sizeAcAttackModifier`, `sizeCmbModifier`, `sizeCarryMultiplier`. Identity size select. Goldens are Medium.

**In this batch:** Publish the three tables as tests (not a JSON copy of every size). Confirm Small is +1 AC/attack, −1 CMB/CMD, ×3/4 carry; Large is the inverse on combat and ×2 carry.

**Out:** Race catalog (batch 8); quadruped carry; swallow-whole / grapple size special cases.

**Pack slice:** none.

**Depends on:** batch 3 so AC/CMB consumers are already reviewed. Do not wait for 4.

### Batch 6 — Encumbrance (Strength table; light / medium / heavy)

**Pairing:** Heavy load from the Strength table, then light = floor(heavy/3) and medium = floor(2×heavy/3), is one CRB procedure. Load *category* is the second mechanic (thresholds vs carried pounds).

**Already in the app:** `mediumBipedHeavyLoad`, `loadThresholds` (× size multiplier), `weightUsed` (dropped items excluded), `loadCategory` including overloaded.

**In this batch:** Strength 1–29 (or the published Medium biped column) as tests; Medium STR 14 / 18 spot checks; document that medium/heavy **penalties** (max Dex, ACP, speed) are **not** auto-written onto `armorClass` in 0.9 — the player types ACP / max Dex.

**Out:** Quadruped / powerful build; inventory auto-sum from armor catalog (batch 10).

**Pack slice:** none.

**Depends on:** batch 5 (size multiplier).

### Batch 7 — Spell DC + bonus spells (review later)

Already in Phase 2e (`spellDc` = 10 + spell level + ability; bonus slots from the ability table; slots user-entered). Wizard 5 golden covers it. **Do not insert this before batches 3–6.** Pack review when spell metadata lands.

### Batches 8–10 — catalog (after the math reviews)

| Batch | Add | Do not add |
| --- | --- | --- |
| **8** Race | `race.human` id + name; Human +2 any stays typed into the score | Full racial trait text; other races |
| **9** Class skills + skill points | Fighter/Wizard class-skill flags and skill points per level; Identity or Skills can stamp checkboxes | All 11 CRB classes; auto-spend favored skill ranks |
| **10** Weapons / armor | Ids for the three goldens (longsword, chainmail, …); still documentary — AC and attack numbers stay on sheet fields | Auto-fill AC from equipped items; priced treasure; magic weapons |

**After 8–10:** remaining 9 CRB classes, feats, spell metadata. OGL / Product Identity review before any **rules text**. Sidebar tools still wait until the sheet is ~90% done.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Phase 3c opened. Batch 1: ability modifiers + BAB/save progressions; Fighter/Wizard catalog tags |
| 2026-08-17 | Batch 2: HP breakdown dialog (manual HD rolls) + iterative attacks |
| 2026-08-17 | Annotated upcoming batches 3–10 (next PR is AC/touch/FF + CMB/CMD) |
| 2026-08-17 | Batch 3 UI-honesty notes; typo Encumberance → Encumbrance |
| 2026-08-17 | Skill warn/blank and Combat honesty landed early; batch 3 formula table tests still next |
