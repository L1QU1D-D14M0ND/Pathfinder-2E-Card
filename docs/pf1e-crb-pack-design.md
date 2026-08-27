# PF1e Core Rulebook pack (Phase 3c)

**Status:** Mechanic batches 1–14 and 16 landed (Batch 16 is 1x simple weapons). OGL / Product Identity review landed ([ADR 0007](adr/0007-content-licensing.md)). APG Synthesist lives in a **separate** pack ([`pf1e-apg-pack-design.md`](pf1e-apg-pack-design.md) slice 1 landed). This CRB folder stays CRB-only.  
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

**How to pick the next PR:** take the first row whose status is **Next**. Engine-owned rows review formulas and UI honesty; catalog rows add ids. Goldens must stay green. Do not start Attack Helper / Actions List / Budget Calculator here. The 0.9 character-basics queue is complete; 1x fill-out continues after that table.

| Batch | Mechanics | Why this pair | Kind | Status |
| --- | --- | --- | --- | --- |
| **1** | Ability scores → modifiers; BAB + save progressions (and how they stack) | Scores feed every later total; BAB/saves are the class-table core | Engine + Fighter/Wizard tags | Done |
| **2** | Hit points (HD + Con + favored); iterative attacks from BAB | HD uses class hit die from batch 1; iteratives are a use of BAB | Engine + HP dialog / slash line | Done |
| **3** | AC / touch / flat-footed; CMB / CMD | Same Combat block; Dex, size, dodge, and deflection are shared | Engine review (no new catalog) | Done |
| **4** | Skills (ranks, class +3, ACP); max ranks = character level | Skill total vs rank cap; ACP already lives on AC inputs | Engine review (class-skill list waits for 9) | Done |
| **5** | Size (AC/attack vs CMB/CMD vs carry) | One CRB size table, three consumers (AC/attack, CMB/CMD, carry) | Engine review (table tests; goldens stay Medium) | Done |
| **6** | Encumbrance (Strength heavy-load table; light / medium / heavy) | Carry multiplier comes from size (batch 5) | Engine review | Done |
| **7** | Spell DC; bonus spells from ability | Already computed in Phase 2e | Engine review (no new catalog) | Done |
| **8** | Race (Human first — golden) | Golden `race.human`; ability adjustments stay typed into scores | Catalog | Done |
| **9** | Class skills + skill points per level (Fighter, Wizard) | Needs skill math from batch 4 | Catalog | Done |
| **10** | Weapons / armor on the three goldens | Documentary item ids; combat numbers stay on `armorClass` / `attacks` | Catalog | Done |
| **11** | Remaining 9 CRB classes (progressions + class skills) | Same catalog row as Fighter/Wizard; Identity select already lists `CRB_CLASSES` | Catalog | Done |
| **12** | Feats on the three goldens | Documentary feat ids; Combat math stays typed | Catalog | Done |
| **13** | Spell metadata on the goldens | Documentary spell ids; slots/DCs/prepared stay typed | Catalog | Done |
| **14** | Remaining CRB player races; stamp catalog size | Identity already lists `CRB_RACES`; Gnome/Halfling are Small; ability adjustments stay typed | Catalog | Done |
| **15** | Class spells-per-day tables; hybrid Max | Bonus-slot math from batch 7 needs the class table to fill Max | Catalog + engine/UI | Next |
| **16** | Remaining simple melee; simple ranged + simple ammo | CRB simple weapon table, two halves. Skip packed dagger/quarterstaff | Catalog | Done |
| **17** | Martial light; remaining martial one-handed | CRB martial melee that is not two-handed. Skip packed longsword | Catalog | Next |
| **18** | Martial two-handed; martial ranged + arrows | Rest of the martial table | Catalog | Queued |
| **19** | Exotic melee; exotic ranged + repeating bolts | CRB exotic table, two halves. Double weapons stay one row / primary head | Catalog | Queued |
| **20** | Remaining light armor; remaining medium armor | Skip packed chain shirt / chainmail | Catalog | Queued |
| **21** | Heavy armor; shields (+ mundane extras) | Finish the CRB armor table. New `kind: shield` stamps `ItemEntry.shield` | Catalog | Queued |
| **later** | Magic weapons; magic armor | Reserved overlay / named items. **Do not start** in 16–21. No `plus-1` catalog ids | Catalog | Later |

The 0.9 character-basics write-ups are in §4. Batch 14 is 1x fill-out. Batch 16 (simple weapons) landed; next mundane equipment is batch 17. Batch 15 (spells-per-day) remains **Next** if that PR is not merged yet. Mundane equipment fill-out is locked in [§7](#7-remaining-mundane-weapons-and-armor) — one pair per PR, never the whole weapon or armor chapter at once.

---

## 3. Pack layout

```text
content/pf1e/crb/
  README.md          # license / what is in this folder
  pack.json          # manifest + which batches have landed
  classes.json       # HD/BAB/saves + class skills + skill points (11 CRB base classes)
  races.json         # race id + name + size (batch 8 Human; batch 14 remaining CRB player races)
  items.json         # weapon/armor/gear ids (batch 10 goldens; 16–21 remaining mundane; magic later)
  feats.json         # feat id + name + category (batch 12: golden rows only)
  spells.json        # spell id + name + spellLevel (batch 13: golden rows only)
```

A class catalog row in this phase is **not** a class description. It is:

| Field | Why |
| --- | --- |
| `id` | `class.fighter`, `class.rogue`, … |
| `name` | Display label |
| `hitDie` | d10 / d6 / … (HP batch will use this; stored now because it is on the class table) |
| `babProgression` | `full` / `threeQuarter` / `half` |
| `saves.fort/ref/will` | `good` / `poor` |
| `skillPointsPerLevel` | Ranks per level before Int (all 11 CRB classes) |
| `classSkills` | Seeded skill keys that stamp checkboxes (batch 9) |
| `source.book` | `"CRB"` — page omitted until we cite without copying tables as images |

Features, spells/day, and proficiency lists wait for later batches. Craft/Perform/Profession wildcards are not in `classSkills`.

---

## 4. License (this folder)

Review landed 2026-08-18: [ADR 0007](adr/0007-content-licensing.md), [`content-licensing.md`](content-licensing.md).

- **App code:** MIT.
- **This pack:** curated **game mechanics numbers** (ids, names, HD/BAB/save tags, pounds, documentary weapon/armor fields, spell level). No Paizo logos, no Golarion gazetteer, no copied feat/spell/class **prose**.
- Do not scrape d20pfsrd / Archives of Nethys / Hero Lab as the ship pack.
- **OGL 1.0a / Section 15 is not in the repo yet.** Add it in the same change that first ships Open Game Content **rules text**. `pack.json` has `contentKind: mechanics-only` and `oglNoticeRequired: false`.
- Vitest [`licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts) scans entity JSON for forbidden prose keys and a short Product Identity word list. `class.summoner` is not in this folder.

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
| No racial ability adjustments as catalog | Human +2 any is entered in the score. Batch 8 stamps `race.human` id/name only. |
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

## 5. Resolver (batch 1; race in batch 8)

```ts
lookupCrbClass(id) → CrbClassProgression | null
applyCrbClassProgression(classRow, id) → ClassEntry
lookupCrbRace(id) → CrbRace | null
applyCrbRace(identity, id) → Identity
```

- Known class id → fill `class` ref, `hitDie`, `babProgression`, `saves`, `skillPointsPerLevel`. Leave `levels` and favored-class totals alone. Identity also **stamps** class-skill checkboxes from the union of catalog lists (`stampClassSkills`). Ranks are not spent.
- Known race id → fill `race` id, name, and source. Stamp `identity.size` when the catalog row has `size` (batch 14). Do **not** rewrite ability scores or languages.
- Unknown or empty id → `null` / custom (`class.id` or `race.id` cleared). Do not throw.
- Load of an existing sheet **does not** re-apply the catalog (the saved row is authoritative). Apply is a UI action when the player picks a class or race.

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

## Batch 3 — two mechanics

### 4.5 Armor class, touch, and flat-footed

**CRB (player-facing):** Armor Class starts at **10**. Add armor bonus, shield bonus, Dexterity modifier (not more than the armor’s **maximum Dex bonus**), size modifier, natural armor, deflection, dodge, and any other AC bonuses the player is tracking. A Dexterity **penalty** is not limited by max Dex.

**Touch** AC is the total without armor, shield, or natural armor (those require hitting the armor, not the creature). Dex, size, deflection, dodge, and similar still apply.

**Flat-footed** AC loses the Dexterity **bonus** and **dodge**. Dexterity **penalties** still apply. Uncanny Dodge and similar exceptions are not this batch.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `armorClass.*` | Armor, shield, natural, deflection, dodge, other, `maxDex` (blank = none), ACP |
| Engine | `cappedDexBonus`, `flatFootedDex`, `armorClassValues` in `engine/ac.ts` | `other` is on all three totals; dodge is not on flat-footed |
| UI | Combat AC inputs + AC / touch / FF derived cell | Override flag lights if any of the three paths is overridden; muted note that Other applies to all three |
| Goldens | Fighter 5 **18 / 12 / 16**; Wizard 5 **12 / 12 / 10**; F2/W3 **15 / 11 / 14** | Unchanged |

**Verdict:** The three formulas match CRB for Medium goldens and the Dex-cap / Dex-penalty cases below. Armor/shield/natural/deflection stacking is **user-responsible** (no typed-bonus stacker — risk P2).

**Gaps:**

| Gap | Why it waits |
| --- | --- |
| Item-granted AC from equipped inventory | Batch 10 documentary ids; numbers stay on `armorClass` |
| Armor Training raising chainmail max Dex | Fighter 5 golden notes it is not auto-applied (`maxDex` 2 with Dex +2) |
| Uncanny Dodge keeping Dex when flat-footed | Feat automation later |
| Size table beyond a Small spot check | Landed in batch 5 |

**Pack slice:** none (engine-owned).

**Tests:** Fighter 5 chainmail snapshot; touch omits armor/shield/natural; other on all three; dodge not on FF; Dex penalty on FF; maxDex caps AC/touch.

### 4.6 CMB and CMD

**CRB (player-facing):** **CMB** is BAB + Strength modifier + the **special size modifier** (opposite sign of the AC/attack size modifier) + miscellaneous. **CMD** is 10 + BAB + Strength + Dexterity + special size + dodge + deflection + miscellaneous. Armor, shield, and natural armor do **not** add to CMD. Armor **max Dex does not cap** the Dexterity used for CMD.

One CMD number in 0.9. Maneuver-specific CMD and being flat-footed for CMD wait.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Engine | `compute.ts`: CMB = BAB + STR + special size + `cmbMisc`; CMD adds uncapped DEX, dodge, deflection, `cmdMisc` | `armorClass.other` is **not** added to CMD (use `cmdMisc`) |
| UI | Combat CMB / CMD cell | No extra “CMD vs max Dex” copy (decision 8C) |
| Goldens | Fighter 5 CMB **+9** / CMD **21**; Wizard 5 **+1** / **13**; F2/W3 **+6** / **17** | Unchanged |

**Verdict:** Matches CRB for the goldens and the maxDex / dodge-deflection cases. Special size vs AC is locked with a Small spot check; full size tables landed in batch 5.

**Gaps:** Ranged CMB (Dex); Combat Expertise; CMD vs trip/grapple separately; load penalties auto-written onto max Dex (batch 6, document only).

**Pack slice:** none.

**Tests:** Empty sheet 0 / 10; Fighter 5 9 / 21; maxDex does not lower CMD; dodge and deflection add to CMD not CMB; `other` stays off CMD; Small AC +1 and CMB −1.

---

## Batch 4 — two mechanics

### 4.7 Skill totals (ranks, class +3, ACP)

**CRB (player-facing):** A skill check is **ranks + ability modifier + miscellaneous**. If the skill is a **class skill** and the character has **at least 1 rank**, add **+3**. Armor check penalty applies to Climb, Swim, and the other Dex/Str skills the CRB marks; it does **not** apply to Diplomacy, Perception, Spellcraft, or Knowledge.

Pathfinder 1st Edition does **not** use 3.5’s cross-class half ranks. Every rank spent is a full rank. Skill points per level and Fighter/Wizard class-skill lists landed in **batch 9**.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `skills[].ranks`, `classSkill`, `misc`, `armorPenaltyApplies` | Factory seeds the CRB list (Knowledge subtypes included; Craft/Perform/Profession added in UI) |
| Engine | `skillTotal`, `classSkillBonus` | +3 only when `ranks ≥ 1` and class skill; ACP only if the row flags it |
| ACP source | `armorClass.armorCheckPenalty` | Typed by the player (load penalties not auto-written — batch 6) |
| UI | Skills tab | Total derived; Disable Device / UMD / Handle Animal show **—** at 0 ranks; Fly **—** without a fly speed |
| Goldens | Fighter 5 Climb **+7**, Intimidate **+7**, Perception **+6**, Swim **−1**; Wizard 5 Spellcraft **+12** | Unchanged |

**Verdict:** The formula matches CRB. Fighter 5 Swim is a class skill at 0 ranks and does **not** get +3 (total −1 from Str +4 and ACP −5).

**Gaps:** Spellcraft and Linguistics are also unusable untrained in the CRB; 0.9 blanks only Disable Device, UMD, Handle Animal, and Fly-without-speed (decision 6B). Favored-class skill ranks are stored on the class row and not auto-spent (batch 9 adds them to the pool). Class-skill checkboxes stamp from the pack when the player picks a CRB class.

**Pack slice:** none.

**Tests:** +3 only when trained and class; ACP on Climb not Diplomacy; factory ACP flags match the CRB armor-check list; Fighter 5 and Wizard 5 golden totals.

### 4.8 Maximum ranks

**CRB (player-facing):** You cannot have more ranks in a skill than your **character level** (total Hit Dice). There is no 3.5 cross-class rank cap of level/2.

**App today / this batch:** `ranksExceedLevel` is true when `ranks > level` and `level > 0`. The Skills tab **warns** and does **not** clamp. `compute()` still adds the typed ranks.

**Gaps:** Skill-point pool display landed in batch 9. No schema maximum. Ranks are not auto-spent.

**Pack slice:** none.

**Tests:** Warn at 6 ranks on a 5th-level character; 5 on 5 is fine; over-cap Climb still totals 9 (6 + class +3) rather than clamping to 5.

---

## Batch 5 — two mechanics

### 4.9 Size modifier to AC, attack, CMB, and CMD

**CRB (player-facing):** A creature’s **size** adds a modifier to Armor Class and attack rolls. Fine is **+8**, then Diminutive +4, Tiny +2, Small +1, Medium +0, Large **−1**, Huge −2, Gargantuan −4, Colossal **−8**.

CMB and CMD use a **special size modifier** with the **opposite sign** of that AC/attack number (Small −1 CMB/CMD; Large +1). Swallow-whole and other grapple special cases are not this batch.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Input | `identity.size` | Fine … Colossal select; factory and goldens are Medium |
| Engine | `sizeAcAttackModifier`, `sizeCmbModifier` | AC/attack uses the table; CMB/CMD uses the negated table |
| Consumers | `armorClassValues`; `compute()` melee/ranged and CMB/CMD | Same modifier on AC, touch, and FF; same special size on CMB and CMD |
| Goldens | All three PF1e goldens | Stay Medium (size modifier 0) |

**Verdict:** The published Fine–Colossal row matches the engine. Empty-sheet Small is AC 11 / attack +1 / CMB −1 / CMD 9; Large is the inverse on those combat numbers.

**Gaps:** Size stays on `identity.size` (Human goldens are Medium; batch 14 stamps catalog size on pick). Stealth/Fly size skill modifiers stay player-typed (PF1e design §14). Quadruped / powerful-build carry is batch 6 out-of-scope.

**Pack slice:** none (engine-owned).

**Tests:** Full AC/attack table; special size is always the opposite sign; Small and Large empty-sheet combat deltas; Fighter 5 remains Medium with size 0 on melee and CMB.

### 4.10 Carrying-capacity size multiplier

**CRB (player-facing):** Carrying capacity is the Medium biped Strength table multiplied by a **size factor**: Fine ×1/8, Diminutive ×1/4, Tiny ×1/2, Small ×3/4, Medium ×1, Large ×2, then ×4 / ×8 / ×16 for Huge / Gargantuan / Colossal.

Light and medium load are still fractions of that heavy load. Strength-table pounds and load *category* are **batch 6**. Quadruped (×1.5) is not this batch.

**App today / this batch:** `sizeCarryMultiplier` feeds `loadThresholds`. Small heavy is `floor(Medium heavy × 3/4)`; Large is Medium ×2.

**Gaps:** Strength 1–29 column and overloaded category review wait for batch 6. Inventory auto-sum from equipped armor stays out of 0.9 (player types Combat).

**Pack slice:** none.

**Tests:** Full Medium-relative multiplier table; STR 10 Small/Large thresholds scale off the Medium heavy without asserting the Strength column.

---

## Batch 6 — two mechanics

### 4.11 Strength heavy-load table

**CRB (player-facing):** A Medium biped’s **heavy load** comes from the Strength table (STR 1 = 10 lb, 10 = 100, 14 = 175, 18 = 300, 29 = 1400). **Light** load is one-third of that heavy value; **medium** load is two-thirds. Size from batch 5 multiplies the Medium heavy number first, then those fractions apply.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Engine | `mediumBipedHeavyLoad`, `loadThresholds` | Heavy from the STR column; light = `floor(heavy/3)`; medium = `floor(2×heavy/3)`; × size multiplier |
| Strength used | `effectiveAbilityScore` of STR | `tempScore` raises carry; `tempModifier` does not |
| Goldens | Fighter 5 STR 18 → heavy **300**, light **100** | Unchanged |

**Verdict:** Strength 1–29 matches the published Medium biped column. STR 14 is 58 / 116 / 175; STR 18 is 100 / 200 / 300.

**Gaps:** Quadruped (×1.5) and powerful build wait. Coins are not auto-converted to pounds. STR ≤ 0 is an engine bound (0 lb), not a CRB row.

**Pack slice:** none.

**Tests:** Full STR 1–29 heavy column; STR 14 and 18 light/medium/heavy fractions.

### 4.12 Load category and Ignore weight

**CRB (player-facing):** Compare carried pounds to those three thresholds. At or below light is a light load; then medium; then heavy. More than a heavy load is beyond what the character can carry as a load (the sheet labels this **overloaded**). Medium and heavy loads impose max Dex, ACP, and speed penalties in the CRB.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Carried | `weightUsed` | Quantity × pounds; **dropped** excluded |
| Category | `loadCategory` / `effectiveLoadCategory` | Thresholds are inclusive; above heavy → `overloaded` |
| Ignore | `inventory.ignoreWeight` (optional boolean, omitted = false) | Load category becomes **`ignored`**. Pounds and L/M/H thresholds still compute. No schemaVersion bump |
| UI | Inventory **Ignore weight** toggle | Pressed state; summary shows `N lb · ignored` without L/M/H |
| Penalties | ACP / max Dex / speed | **Not** auto-written from load. The player types them. Muted note on Inventory |

**Verdict:** Category math matches the inclusive CRB bands. The Ignore weight control is a sheet opt-out of the *category*, not of inventory pounds.

**Gaps:** Auto-applying medium/heavy penalties onto ACP, max Dex, and speed stays out of 0.9 (player types). Inventory auto-sum from equipped armor stays out of 0.9.

**Pack slice:** none.

**Tests:** Inclusive bands at STR 18; dropped items excluded; Fighter 5 45 lb light; ignoreWeight → ignored with pounds unchanged; omitted flag still counts weight.

---

## Batch 8 — two mechanics

### 4.13 Human catalog id

**CRB (player-facing):** Race is chosen at character creation. The three goldens are **Human**.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/races.json` | One row: `race.human` / Human / source CRB |
| Lookup | `lookupCrbRace` | Unknown or empty id → `null` (custom). Never throws |
| Apply | `applyCrbRace` | Stamps `identity.race` id, name, and source. Batch 8 did **not** rewrite size; batch 14 later stamps catalog size |
| UI | Identity Race select | Human or Custom, plus a typed name |
| Goldens | All three PF1e goldens | Already stored `race.human`; Load does not re-apply the catalog |

**Verdict:** The golden id resolves. Custom races stay a free name with `id` cleared.

**Gaps:** Other CRB races and size stamp wait for batch 14; extra feat / extra skill rank / bonus language as catalog traits.

**Pack slice:** Human only.

**Tests:** Catalog lists Human; unknown id is null; goldens resolve `race.human`.

### 4.14 Ability adjustments stay on the score

**CRB (player-facing):** A Human gets **+2 to one ability score** of the player’s choice.

**App today / this batch:** That +2 is **already in the typed score** on the goldens (Fighter STR 18, Wizard INT 18). `applyCrbRace` does not add +2 to any ability. Identity shows a muted note.

**Gaps:** Auto-stamping +2 (which ability?) waits; bonus feat waits with feat catalog. Human extra skill rank per level is in the skill-point **pool** (batch 9) when `race.human`, not auto-spent.

**Pack slice:** none beyond the Human row.

**Tests:** Applying `race.human` leaves ability scores unchanged; unknown apply clears id and keeps the typed name. Size stamp is batch 14.

---

## Batch 9 — two mechanics

### 4.15 Class skills (Fighter, Wizard)

**CRB (player-facing):** Each class has a **class skill** list. If you have at least one level in a class that lists a skill, that skill is a class skill (and the +3 from batch 4 applies once trained). Multiclass **unions** the lists. Craft, Profession (Fighter and Wizard) and Perform are wildcards — not this batch.

**Fighter (seeded skills):** Climb, Handle Animal, Intimidate, Knowledge (dungeoneering), Knowledge (engineering), Ride, Survival, Swim.

**Wizard (seeded skills):** Appraise, Fly, Linguistics, Spellcraft, and all Knowledge skills.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `classes.json` `classSkills` | Keys matching the Skills tab |
| Apply | `stampClassSkills` when Identity picks or removes a CRB class | Standard skills overwritten from the union; Craft/Perform/Profession extras keep their checkbox; **ranks unchanged** |
| Goldens | Fighter 5 / Wizard 5 / F2/W3 flags | Already matched the lists; Load does not re-stamp |

**Verdict:** Catalog lists match the CRB seeded skills. Stamping a Fighter 5 sheet reproduces the golden checkboxes.

**Gaps:** Other 9 CRB classes; Craft/Profession as automatic class skills when the player adds a wildcard row.

**Pack slice:** `classSkills` on Fighter and Wizard.

**Tests:** Lists and 2 skill points; Fighter stamp; F+W union; wildcard extras preserved; golden flags after stamp.

### 4.16 Skill points per level

**CRB (player-facing):** Each class grants a number of skill ranks per level (**Fighter 2**, **Wizard 2**) plus the Intelligence modifier, **minimum 1** per class level. A Human gains **+1 skill rank per character level**. Favored-class skill ranks are extra and chosen by the player. Pathfinder does **not** ×4 ranks at 1st level.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `skillPointsPerLevel` | 2 for Fighter and Wizard; stamped onto the class row on apply |
| Engine | `skillRanksFromClassLevel`, `skillRanksBudget` | Sum of class contributions + favored `skillRanks` + Human +1×level when `race.human` |
| UI | Skills tab | `spent / budget`; warn if over; ranks stay typed |
| Goldens | Fighter 5 **15/15**; Wizard 5 **35/35**; F2/W3 **30/30** | Unchanged |

**Verdict:** The three Human goldens spend exactly the pool. Picking Fighter does not spend ranks.

**Gaps:** Auto-spend of the pool; other classes’ tables (Rogue 8, …). INT tempScore affects the modifier used for the pool (same as other Int-based math).

**Pack slice:** `skillPointsPerLevel` on Fighter/Wizard. Optional `classes[].skillPointsPerLevel` on the sheet (old saves omit; compute falls back to the pack).

**Tests:** Min 1 with Int penalty; Human and favored add to the pool; three golden budgets; stamp does not spend ranks.

---

## Batch 10 — two mechanics

### 4.17 Weapons on the three goldens

**CRB (player-facing):** Equipment tables list a weapon’s **weight, damage dice, type, crit, and range**. The player records those on the sheet. Attack bonuses are a Combat calculation (BAB + ability + misc), not a property that auto-fills from the item.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/items.json` | Golden ids: `weapon.dagger`, `weapon.longsword`, `weapon.quarterstaff` (plus armor and spellbook in 4.18) |
| Lookup | `lookupCrbItem` | Unknown or empty id → `null` (custom). Never throws |
| Apply | `applyCrbItem` | Stamps item id, name, pounds, and `weapon` subobject. Clears `armor`. Does **not** rewrite quantity, location, `armorClass`, or `attacks` |
| UI | Inventory item select | Catalog or Custom, plus a typed name. Muted note: AC and attacks stay on Combat |
| Goldens | Fighter 5 longsword/dagger; Wizard 5 quarterstaff | Already stored those ids; Load does not re-apply the catalog |

**Verdict:** The golden weapon ids resolve. Quarterstaff is stored as a **single 1d6** to match the golden attack row, not the CRB double-weapon listing. The Fighter 5 dagger row has no `weapon` subobject; the catalog still lists 1d4 / 10 ft for a fresh apply.

**Gaps:** Remaining mundane weapons are queued in [§7](#7-remaining-mundane-weapons-and-armor) (batches 16–19). Magic weapons are reserved later (not plus-N catalog rows). Priced treasure and two-weapon / double-weapon attack rows wait.

**Pack slice:** weapon rows needed by the goldens.

**Tests:** Catalog lists golden ids; unknown id is null; goldens resolve.

### 4.18 Armor (and spellbook) on the three goldens

**CRB (player-facing):** Armor tables list **AC bonus, max Dex, ACP, spell failure, and weight**. Those numbers are copied onto Combat (`armorClass`) by the player. Equipping an item does not by itself change AC.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `items.json` | `armor.chainmail`, `armor.chain-shirt`, `item.spellbook` (3 lb, no combat subobject) |
| Apply | `applyCrbItem` | Armor stamps the documentary `armor` subobject and clears `weapon`. Spellbook stamps pounds only |
| Combat | `armorClass` / `attacks` | **Unchanged** when a catalog item is applied or equipped |
| Goldens | Fighter 5 chainmail; F2/W3 chain shirt; Wizard 5 unarmored + spellbook | Already stored those ids |

**Verdict:** Equipping catalog chainmail on an empty sheet leaves **AC 10**. Fighter 5 still computes AC 18 from the typed `armorBonus` 6.

**Gaps:** Remaining mundane armor and shields are queued in [§7](#7-remaining-mundane-weapons-and-armor) (batches 20–21). Magic armor is reserved later. Auto-sum of equipped AC / ACP / max Dex stays **out of 0.9**.

**Pack slice:** armor and gear rows needed by the goldens.

**Tests:** Apply chainmail does not rewrite `armorClass`; empty sheet AC stays 10; Fighter 5 AC 18 still comes from typed Combat.

---

## Batch 11 — two mechanics

### 4.19 Remaining CRB class progression tags

**CRB (player-facing):** Each base class has a **Hit Die**, **BAB** column (full / ¾ / ½), and **Fort / Ref / Will** (good or poor). The eleven CRB classes are Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Wizard.

**App today / this batch:** Those nine missing classes are extra rows in the **same** `classes.json` / `CrbClassProgression` catalog as Fighter and Wizard. `lookupCrbClass`, `applyCrbClassProgression`, and the Identity class select already consume `CRB_CLASSES` — no second apply path. Unknown ids (e.g. Alchemist) still resolve to custom.

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `classes.json` | Chapter order. Same fields as batch 1 |
| Apply | existing `applyCrbClassProgression` | Stamps HD / BAB / saves / skill-point table. Leaves levels and favored totals |
| Engine | existing `babFromProgression` / `stackedBab` | Paladin 2 + Rogue 3 is BAB **+4** |
| Goldens | Fighter / Wizard ids | Unchanged; still resolve |

**Verdict:** Level-5 published numbers match: Rogue BAB +3, Monk all good saves +4, Barbarian d12 / full BAB.

**Gaps:** Class features, weapon/armor proficiencies, spell lists, prestige and APG classes.

**Pack slice:** nine class ids with HD/BAB/saves.

**Tests:** Table of nine tags against CRB HD/BAB/save/skill-point columns; unknown `class.alchemist` is null; goldens still resolve Fighter/Wizard.

### 4.20 Remaining class skills and skill points

**CRB (player-facing):** Skill ranks per level are on the class table (Rogue **8**, Bard/Ranger **6**, Barbarian/Druid/Monk **4**, Cleric/Paladin/Sorcerer **2**, plus Int, min 1). Class-skill lists come from the skill summary table. Craft / Perform / Profession stay wildcards.

**App today / this batch:** The new rows fill `skillPointsPerLevel` and `classSkills` on the **same** catalog type as batch 9. `stampClassSkills` and `skillRanksBudget` are unchanged. Seeded keys are sorted to `STANDARD_SKILLS` order on load.

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `classSkills` / `skillPointsPerLevel` | Seeded keys only; no Craft/Perform/Profession |
| Apply | existing `stampClassSkills` on class pick | Union of whatever classes are on the sheet |
| Pool | existing `skillRanksBudget` | Rogue 5 Human Int 10 → **45 / 0** until the player types ranks |
| Honesty | empty sheet + Rogue | No feat, feature, or spell rows; Combat AC stays 10 |

**Verdict:** Picking Rogue reuses the Fighter stamp path. Multiclass Fighter+Rogue unions Climb with Disable Device.

**Gaps:** Auto-spend of the pool; wildcard Craft/Perform/Profession rows; class features.

**Pack slice:** class-skill lists and skill-point table for the nine classes.

**Tests:** Every catalog class-skill key is a seeded skill; Rogue stamp; Fighter+Rogue union; Rogue pool without auto-spend; Paladin 2 / Rogue 3 stacked saves.

---

## Batch 12 — two mechanics

### 4.21 Feat catalog ids on the three goldens

**CRB (player-facing):** Feats are chosen by name (Power Attack, Weapon Focus, Scribe Scroll, …). A specialization (Weapon Focus: longsword) is part of the choice, not a second feat.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/feats.json` | Golden ids only |
| Lookup | `lookupCrbFeat` | Unknown or empty id → `null` (custom). Never throws |
| Apply | `applyCrbFeat` | Stamps feat id, catalog name, category, and source. Does **not** rewrite level, summary, or Combat |
| UI | Feats tab select | Catalog or Custom, plus a typed name (Weapon Focus (longsword) stays typed on the goldens) |
| Goldens | Fighter 5 / Wizard 5 / F2/W3 | Already stored those ids; Load does not re-apply |

**Verdict:** The golden feat ids resolve. Class features (Armor Training, Arcane Bond) stay on `features[]`, not this catalog.

**Gaps:** Remaining CRB feats; Weapon Focus / Spell Focus school-or-weapon as a structured field.

**Pack slice:** five feat ids.

**Tests:** Catalog lists golden ids; unknown id is null; goldens resolve.

### 4.22 Feat combat math stays typed

**CRB (player-facing):** Power Attack changes the attack/damage numbers the player uses. Improved Initiative adds +4 to initiative. The sheet does not roll or apply those for the player in 0.9.

**App today / this batch:** Applying a catalog feat leaves `combat`, `attacks`, and `initiativeMisc` unchanged. Summaries stay player text. `effects[]` stay ignored.

**Gaps:** Auto-applying Power Attack / Weapon Focus / Improved Initiative.

**Pack slice:** none beyond the feat rows.

**Tests:** Empty sheet melee/initiative stay 0 after Power Attack; Wizard 5 Improved Initiative still has `initiativeMisc` 0 and Dex-only initiative +2.

---

## Batch 13 — two mechanics

### 4.23 Spell catalog ids on the goldens

**CRB (player-facing):** Spells are chosen by name (Detect Magic, Light, Magic Missile, Fireball). The player writes them on the prepared list; the catalog does not fill a spellbook.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/spells.json` | Golden ids only |
| Lookup | `lookupCrbSpell` | Unknown or empty id → `null` (custom). Never throws |
| Apply | `applyCrbSpell` | Stamps spell id, catalog name, source, and `spellLevel`. Does **not** rewrite prepared, summary, uses, slots, or DCs |
| UI | Spells tab select | Catalog or Custom, plus a typed name |
| Goldens | Wizard 5 / F2/W3 | Already stored those ids; Fighter 5 has no spells. Load does not re-apply |

**Verdict:** The golden spell ids resolve. Three goldens can be rebuilt from race / class / item / feat / spell ids.

**Gaps:** Remaining CRB spells; spell descriptions (OGL first); auto-prepared spellbook.

**Pack slice:** four spell ids.

**Tests:** Catalog lists golden ids; unknown id (`spell.mage-armor`) is null; goldens resolve.

### 4.24 Spell slots, DCs, and prepared stay typed

**CRB (player-facing):** A Wizard prepares spells into slots. DC is 10 + spell level + ability. Bonus slots come from a high ability score. The sheet does not fill those from a catalog pick in 0.9.

**App today / this batch:** Applying a catalog spell leaves `slots`, `prepared`, and summaries unchanged. `compute()` still derives DC and bonus slots from the spellcasting ability. Batch 7 reviews that engine math.

**Gaps:** Auto-filling slots from class level; adding bonus slots into max; remaining CRB spell text.

**Pack slice:** none beyond the spell rows.

**Tests:** Empty Wizard-shaped entry still has slots 0 and Fireball DC 13 after apply (INT 10); Wizard 5 still has typed 3rd-level slots 2/1 and Fireball DC 17.

---

## Batch 14 — two mechanics

### 4.27 Remaining CRB player races

**CRB (player-facing):** The Core Rulebook player races are Dwarf, Elf, Gnome, Half-Elf, Half-Orc, Halfling, and Human. Ability adjustments and languages are chosen at creation; this batch does not write those scores.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/races.json` | Seven rows: id, name, size, source CRB |
| Lookup | `lookupCrbRace` | Unknown or empty id → `null` (custom). Never throws |
| Apply | `applyCrbRace` | Stamps race id, name, source, and catalog size. Does **not** rewrite languages, speeds, or ability scores |
| UI | Identity Race select | Lists `CRB_RACES` or Custom, plus a typed name |
| Goldens | PF1e Fighter/Wizard/multiclass | Stay `race.human`. Synthesist stays custom Half-Elf (`id` null) |

**Verdict:** Catalog names are generic race labels. Custom races stay a free name with `id` cleared. Half-Elf catalog id does **not** grant Human extra skill ranks.

**Gaps:** Racial ability adjustments, languages, speeds, weapon familiarity, extra feat. Do not auto-apply racial +2.

**Pack slice:** six remaining CRB player races (Human already existed).

**Tests:** Catalog lists seven ids; unknown id (`race.tiefling`) is null; Synthesist golden stays custom.

### 4.28 Race size stamp

**CRB (player-facing):** Gnome and Halfling are **Small**. The other CRB player races are **Medium**. Size already feeds AC/attack, CMB/CMD, and carry (batch 5).

**App today / this batch:** `applyCrbRace` writes `identity.size` from the catalog row. The player can still change size afterward. Ability scores stay typed. Goldens stay Medium.

**Gaps:** Size skill modifiers (Stealth/Fly) stay player-typed.

**Pack slice:** optional `size` on each race row (Human included).

**Tests:** Gnome/Halfling apply stamps `small`; Human apply stamps `medium` without changing scores; goldens remain Medium.

---

## Batch 16 — two mechanics

### 4.31 Remaining simple melee

**CRB (player-facing):** The simple melee table lists unarmed, light, one-handed, and two-handed weapons with **Medium damage dice, crit, type, range (if thrown), and weight**. The player copies those onto an attack row. Reach / brace / trip tags are special properties, not Combat auto-math.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `content/pf1e/crb/items.json` | Remaining simple melee ids from [§7.2](#72-weapons--batches-1619). Dagger and quarterstaff already existed |
| Apply | `applyCrbItem` | Stamps name, pounds, and `weapon` subobject. Does **not** rewrite `armorClass` or `attacks` |
| Goldens | Fighter 5 dagger; Wizard 5 quarterstaff | Unchanged. Quarterstaff stays a **single 1d6** |

**Verdict:** Medium table numbers resolve. Unarmed strike is not a catalog item. Gauntlet is packed.

**Gaps:** Small-size damage dice; reach/brace/trip tags; auto-filling attack rows.

**Pack slice:** eleven remaining simple melee weapons.

**Tests:** Table of Medium numbers; unarmed strike id is null; apply spear leaves AC 10.

### 4.32 Simple ranged weapons and ammo

**CRB (player-facing):** Simple ranged weapons list damage, crit, range increment, and weight. Ammunition is sold in listed bundles (10 darts / bolts / bullets) with a bundle weight.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Pack | `items.json` | Blowgun, heavy/light crossbow, dart, javelin, sling. Ammo rows are `kind: item` with the published **bundle** weight |
| Apply | existing | Weapons stamp `weapon`. Ammo stamps pounds only |
| Combat | `attacks` | Unchanged |

**Verdict:** Sling weight is **0** (table dash). Dart is ½ lb. Ammo quantity is packs of 10; pounds are the bundle line, not per shot.

**Gaps:** Loading actions; composite/repeating crossbows (exotic, batch 19); arrows (martial, batch 18).

**Pack slice:** six simple ranged weapons and three ammo ids.

**Tests:** Published range and dice; ammo has no weapon subobject; `weapon.greatsword` and `item.arrows` stay null.

---

## Batch 7 — two mechanics

### 4.25 Spell DC

**CRB (player-facing):** A spell’s saving-throw DC is **10 + the spell’s level + the caster’s ability modifier** (Intelligence for a Wizard). Cantrips are level 0, so DC is 10 + modifier. A Dexterity or Intelligence **penalty** lowers DC the same way a bonus raises it.

Spell Focus and similar feats raise DC for a school. They are a player choice, not this formula.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Engine | `spellDc`, `dcByLevel` in `engine/spellcasting.ts` | `10 + spell level + ability modifier` for levels 0–9 |
| Ability | `abilityModifiers` | `tempScore` is in the score before the modifier; `tempModifier` is a DC addend |
| UI | Spells tab derived DC column | Override per level; muted note that Spell Focus does not change DC |
| Goldens | Wizard 5 INT +4 → 14 / 15 / 17 (0 / 1 / 3); F2/W3 INT +3 → 13 / 14 / 15 | Unchanged |

**Verdict:** The formula matches CRB. Wizard 5 Spell Focus (evocation) does **not** add +1 to Fireball.

**Gaps:** Auto-applying Spell Focus / Greater Spell Focus; school-specific DC; concentration; spell resistance.

**Pack slice:** none (engine-owned). Catalog spell rows from batch 13 do not write DC.

**Tests:** 10 + level + mod including a penalty; Wizard 5 and F2/W3 snapshots; Spell Focus leaves Fireball at 17; `tempModifier` raises DC without changing bonus slots.

### 4.26 Bonus spells from ability

**CRB (player-facing):** A high spellcasting ability grants **bonus spells per day** from the Ability Modifiers and Bonus Spells table. Cantrips (level 0) never receive bonus slots. A score of 10–11 grants none. 12–13 grants +1 1st; 18–19 grants +1 at 1st through 4th; 20–21 grants +2 1st and +1 at 2nd through 5th. Odd and even scores in a pair share a row. You only receive a bonus slot of a level you can already cast.

Those bonus slots are added to the class table’s spells per day. In 0.9 the player types the total into **Max**.

**App today / this batch:**

| Piece | Where | Behavior |
| --- | --- | --- |
| Engine | `bonusSpellsFromAbility`, `bonusSlotsByLevel` | Table from the ability **score** (`tempScore` included; `tempModifier` is not) |
| Input | `spellcasting[].slots[].max` / `remaining` | User-entered. Compute does not add bonus into max |
| UI | Spells tab Bonus slots column (derived) next to Max / Left | Note: add them into max yourself |
| Goldens | Wizard 5 INT 18 → bonus `[0, 1, 1, 1, 1]`; typed max 4/4/3/2 is class 4/3/2/1 plus those bonuses | Unchanged |

**Verdict:** The table matches CRB for scores 10–30. Empty INT 18 still shows bonus 1st-level +1 with slot max 0.

**Gaps:** Auto-adding bonus into max; class spells-per-day table; specialist/domain extra slots; “only if you can cast that level.”

**Pack slice:** none.

**Tests:** Published bonus columns for 10–30 (odd scores share the even score below); no bonus cantrips at INT 30; Wizard 5 bonus 1/1/1/1 with typed max 4 at 1st; empty INT 18 leaves max 0; `tempScore` +2 (score 20) grants two bonus 1sts.

---

## 6. Recommended upcoming work

The 0.9 character-basics queue (batches 1–13) is done. Batch 14 landed the remaining CRB player races and size stamp. Batch 16 landed remaining simple melee and simple ranged weapons. Do **not** start the next pair of CRB encyclopedia rows in the same change as a platform increment.

**Next product work:** class spells-per-day tables (batch 15, if not merged), then martial weapons (batch 17), then batches 18–21, then remaining feats/spells, then APG follow-through. Magic weapons and magic armor stay **later** — leave schema room, do not pack them in 16–21. Leftover PF2e waits for a later release. Do **not** add Summoner to this CRB folder. Sidebar tools still wait until the PF1e sheet is ~90% done.

---

## 7. Remaining mundane weapons and armor

Locked fill-out after batch 15. Same rules as batch 10: documentary stamp of id, name, pounds, and weapon/armor (or later shield) stats. Combat numbers stay on `armorClass` / `attacks`. Unknown id → custom. Mechanics-only names and numbers. Two mechanics per PR.

**Already packed (do not duplicate):** Batch 10 goldens plus Batch 16 simple melee/ranged/ammo. Skip those ids in later weapon batches.

### 7.1 Shared locks (every 16–21 PR)

| Lock | Rule |
| --- | --- |
| Scope | Core Rulebook Chapter 6 tables only. No APG / Ultimate Combat / Adventurer’s Armory rows |
| Combat | Apply does **not** rewrite `armorClass` or `attacks` |
| Quarterstaff | Stays a **single 1d6** row. Do not split it into a double-weapon pair here |
| Double weapons (exotic 2H) | One catalog row; stamp the **primary** head only. Second head / two-weapon attack rows wait |
| Composite bows | One row each (`weapon.composite-longbow`, `weapon.composite-shortbow`). Strength rating stays typed / notes — no `str-2` ids |
| Unarmed strike | **Not** an inventory catalog item. Pack `weapon.gauntlet` only |
| Shield bash / spiked armor | **Not** weapon-table ids in 16–19. They wait with shields / extras in batch 21 |
| Ammo | Pack with the ranged mechanic that uses it (`item.*`, `kind: item`) |
| Masterwork | Same overlay pattern as magic. **No** separate masterwork catalog rows |
| Magic | **Do not pack** in 16–21. See [§7.5](#75-reserved-magic-weapons-and-armor) |
| Cost | Optional `costGp` may land with a later priced-treasure slice. Not required to add a weapon/armor row |
| Tests | New ids resolve; goldens still resolve; apply still leaves AC 10 on an empty sheet |

Id pattern stays `weapon.<kebab>`, `armor.<kebab>`, `item.<kebab>`. Batch 21 adds `shield.<kebab>` when `kind: "shield"` lands.

### 7.2 Weapons — batches 16–19

67 remaining weapon ids (packed 3; skip unarmed strike and the five armor/shield-as-weapon table lines).

#### Batch 16 — simple melee remainder + simple ranged

**Landed.** Remaining simple melee (11) and simple ranged + ammo (6 + 3). Packed dagger/quarterstaff unchanged. Unarmed strike not packed.

| Id | Name | Group |
| --- | --- | --- |
| `weapon.gauntlet` | Gauntlet | Unarmed |
| `weapon.punching-dagger` | Punching dagger | Light |
| `weapon.spiked-gauntlet` | Spiked gauntlet | Light |
| `weapon.light-mace` | Light mace | Light |
| `weapon.sickle` | Sickle | Light |
| `weapon.club` | Club | One-handed |
| `weapon.heavy-mace` | Heavy mace | One-handed |
| `weapon.morningstar` | Morningstar | One-handed |
| `weapon.shortspear` | Shortspear | One-handed |
| `weapon.longspear` | Longspear | Two-handed |
| `weapon.spear` | Spear | Two-handed |

**Mechanic B — simple ranged + simple ammo** (6 weapons + 3 ammo).

| Id | Name |
| --- | --- |
| `weapon.blowgun` | Blowgun |
| `weapon.heavy-crossbow` | Heavy crossbow |
| `weapon.light-crossbow` | Light crossbow |
| `weapon.dart` | Dart |
| `weapon.javelin` | Javelin |
| `weapon.sling` | Sling |
| `item.blowgun-darts` | Blowgun darts |
| `item.crossbow-bolts` | Crossbow bolts |
| `item.sling-bullets` | Sling bullets |

Hand crossbow and repeating crossbows also use bolts; they wait for batch 19 and reuse `item.crossbow-bolts` / `item.repeating-crossbow-bolts`.

#### Batch 17 — martial light + remaining martial one-handed

**Mechanic A — martial light** (8). Skip light-shield bash, spiked armor, and light spiked shield.

| Id | Name |
| --- | --- |
| `weapon.throwing-axe` | Throwing axe |
| `weapon.light-hammer` | Light hammer |
| `weapon.handaxe` | Handaxe |
| `weapon.kukri` | Kukri |
| `weapon.light-pick` | Light pick |
| `weapon.sap` | Sap |
| `weapon.starknife` | Starknife |
| `weapon.short-sword` | Short sword |

**Mechanic B — remaining martial one-handed** (7). Packed longsword stays. Skip heavy-shield bash and heavy spiked shield.

| Id | Name |
| --- | --- |
| `weapon.battleaxe` | Battleaxe |
| `weapon.flail` | Flail |
| `weapon.heavy-pick` | Heavy pick |
| `weapon.rapier` | Rapier |
| `weapon.scimitar` | Scimitar |
| `weapon.trident` | Trident |
| `weapon.warhammer` | Warhammer |

#### Batch 18 — martial two-handed + martial ranged

**Mechanic A — martial two-handed** (11).

| Id | Name |
| --- | --- |
| `weapon.falchion` | Falchion |
| `weapon.glaive` | Glaive |
| `weapon.greataxe` | Greataxe |
| `weapon.greatclub` | Greatclub |
| `weapon.heavy-flail` | Heavy flail |
| `weapon.greatsword` | Greatsword |
| `weapon.guisarme` | Guisarme |
| `weapon.halberd` | Halberd |
| `weapon.lance` | Lance |
| `weapon.ranseur` | Ranseur |
| `weapon.scythe` | Scythe |

**Mechanic B — martial ranged + arrows** (4 weapons + 1 ammo).

| Id | Name |
| --- | --- |
| `weapon.longbow` | Longbow |
| `weapon.composite-longbow` | Composite longbow |
| `weapon.shortbow` | Shortbow |
| `weapon.composite-shortbow` | Composite shortbow |
| `item.arrows` | Arrows |

#### Batch 19 — exotic melee + exotic ranged

**Mechanic A — exotic melee** (13). Light + one-handed + two-handed in one mechanic so the exotic table stays one PR pair.

| Id | Name | Group |
| --- | --- | --- |
| `weapon.kama` | Kama | Light |
| `weapon.nunchaku` | Nunchaku | Light |
| `weapon.sai` | Sai | Light |
| `weapon.siangham` | Siangham | Light |
| `weapon.bastard-sword` | Bastard sword | One-handed |
| `weapon.dwarven-waraxe` | Dwarven waraxe | One-handed |
| `weapon.whip` | Whip | One-handed |
| `weapon.orc-double-axe` | Orc double axe | Two-handed |
| `weapon.elven-curve-blade` | Elven curve blade | Two-handed |
| `weapon.dire-flail` | Dire flail | Two-handed |
| `weapon.gnome-hooked-hammer` | Gnome hooked hammer | Two-handed |
| `weapon.two-bladed-sword` | Two-bladed sword | Two-handed |
| `weapon.dwarven-urgrosh` | Dwarven urgrosh | Two-handed |

**Mechanic B — exotic ranged + repeating bolts** (7 weapons + 1 ammo).

| Id | Name |
| --- | --- |
| `weapon.bolas` | Bolas |
| `weapon.hand-crossbow` | Hand crossbow |
| `weapon.repeating-heavy-crossbow` | Repeating heavy crossbow |
| `weapon.repeating-light-crossbow` | Repeating light crossbow |
| `weapon.net` | Net |
| `weapon.shuriken` | Shuriken |
| `weapon.halfling-sling-staff` | Halfling sling staff |
| `item.repeating-crossbow-bolts` | Repeating crossbow bolts |

### 7.3 Armor and shields — batches 20–21

10 remaining armor ids (packed 2) plus 6 shields. Extras stay with batch 21.

#### Batch 20 — remaining light armor + remaining medium armor

**Mechanic A — remaining light armor** (3). Packed chain shirt stays.

| Id | Name |
| --- | --- |
| `armor.padded` | Padded |
| `armor.leather` | Leather |
| `armor.studded-leather` | Studded leather |

**Mechanic B — remaining medium armor** (3). Packed chainmail stays.

| Id | Name |
| --- | --- |
| `armor.hide` | Hide |
| `armor.scale-mail` | Scale mail |
| `armor.breastplate` | Breastplate |

Stamp the same `armor` subobject as chainmail (`acBonus`, `maxDex`, `armorCheckPenalty`, `spellFailurePercent`). Still do not write Combat.

#### Batch 21 — heavy armor + shields

**Mechanic A — heavy armor** (4).

| Id | Name |
| --- | --- |
| `armor.splint-mail` | Splint mail |
| `armor.banded-mail` | Banded mail |
| `armor.half-plate` | Half-plate |
| `armor.full-plate` | Full plate |

**Mechanic B — shields** (6) plus mundane extras.

| Id | Name |
| --- | --- |
| `shield.buckler` | Buckler |
| `shield.light-wooden` | Light wooden shield |
| `shield.light-steel` | Light steel shield |
| `shield.heavy-wooden` | Heavy wooden shield |
| `shield.heavy-steel` | Heavy steel shield |
| `shield.tower` | Tower shield |

This is the PR that may add `kind: "shield"` to the item catalog schema and stamp `ItemEntry.shield` (and clear `armor` / `weapon`). Tower shield needs `maxDex` and spell failure on the shield stats — extend `ShieldItemStats` here if those fields are still missing. Do not auto-write `armorClass.shieldBonus`.

Mundane extras in the same mechanic (still not magic; not counted in the 67 remaining weapon-table ids):

| Id | Name |
| --- | --- |
| `item.armor-spikes` | Armor spikes |
| `item.shield-spikes` | Shield spikes |
| `weapon.locked-gauntlet` | Locked gauntlet |

Shield-bash damage may live as an optional `weapon` subobject on the shield row later; do not mint `weapon.light-shield` ids.

### 7.4 Packed vs remaining counts

| Kind | Packed now | Remaining in 17–21 | Skip / later |
| --- | --- | --- | --- |
| Weapons | 20 (3 goldens + 17 simple) | 50 | Unarmed strike; shield-bash and spiked-armor weapon-table lines |
| Armor | 2 | 10 | Magic armor |
| Shields | 0 | 6 | Magic shields |
| Ammo / extras | spellbook + 3 simple ammo | 2 ammo + 3 extras | Priced treasure as a later slice |
| Magic weapons / armor | 0 | 0 | Entirely [§7.5](#75-reserved-magic-weapons-and-armor) |

### 7.5 Reserved: magic weapons and armor

**Do not implement in batches 16–21.** Leave the door open so mundane rows do not have to be renamed later.

| Decision | Lock |
| --- | --- |
| Mundane id is stable | A +1 longsword is still `weapon.longsword`. Never add `weapon.longsword-plus-1` or `armor.full-plate-plus-2` |
| Enhancement is a sheet overlay | Later: optional enhancement (and special-ability tags) on the **inventory row** (`ItemEntry` / weapon-armor-shield stats), not a second catalog copy of every table weapon |
| Named items later | A later catalog may add specific magic items (`weapon.holy-avenger`, …) with an optional `baseItemId` pointing at the mundane row. That is its own pair of mechanics, after 21 |
| Masterwork | Same overlay as enhancement. Not a catalog row per weapon |
| Combat | Magic attack/damage/AC still stay typed until a batch says otherwise |
| License | Still mechanics-only until the first pack **prose**. Names of specific items are labels; do not copy item body text without OGL / Section 15 |

Schema work that is allowed when magic *starts* (not now): optional `baseItemId` on a catalog row; optional `enhancementBonus` on character item stats; keep `additionalProperties: false` so mundane JSON does not grow unused keys.

After batch 21, the next catalog work is remaining **feats** and **spells**, not this magic pair, unless a later lock says otherwise.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Phase 3c opened. Batch 1: ability modifiers + BAB/save progressions; Fighter/Wizard catalog tags |
| 2026-08-17 | Batch 2: HP breakdown dialog (manual HD rolls) + iterative attacks |
| 2026-08-17 | Annotated upcoming batches 3–10 (next PR is AC/touch/FF + CMB/CMD) |
| 2026-08-17 | Batch 3 UI-honesty notes; typo Encumberance → Encumbrance |
| 2026-08-17 | Skill warn/blank and Combat honesty landed early; batch 3 formula table tests still next |
| 2026-08-18 | Audit merged on local `main`; batch 3 remains the next code change |
| 2026-08-18 | Batch 3: AC/touch/FF + CMB/CMD table tests; next is skills |
| 2026-08-18 | Batch 4: skill totals + max ranks; next is size tables |
| 2026-08-18 | Batch 5: size AC/attack/CMB/CMD + carry multiplier; next is encumbrance |
| 2026-08-18 | Batch 6: Strength heavy-load + load category; Ignore weight opt-out; next is Human catalog |
| 2026-08-18 | Batch 8: Human race catalog id; +2 stays typed; next is class skills |
| 2026-08-18 | Batch 9: Fighter/Wizard class skills + skill-point pool; next is weapons/armor ids |
| 2026-08-18 | Batch 10: documentary weapons/armor ids; AC/attacks stay typed; next is remaining 9 CRB classes |
| 2026-08-18 | Batch 11: remaining 9 CRB classes reuse the Fighter/Wizard catalog row; next is feat ids |
| 2026-08-18 | Batch 12: documentary feat ids; Combat math stays typed; next is spell metadata. 1.0 bar includes Synthesist Summoner (APG, not this pack) |
| 2026-08-18 | Batch 13: documentary spell ids; slots/DCs/prepared stay typed; next is Batch 7 pack review |
| 2026-08-18 | Batch 7: spell DC + bonus-spells table; slots stay typed; next is PWA proof |
| 2026-08-18 | App draft + PWA proof landed; this pack’s next gate is OGL before rules text |
| 2026-08-18 | OGL / PI review: mechanics-only pack; no Section 15 until rules text; next is 1.0 |
| 2026-08-18 | APG slice 1 landed in a separate pack; this folder stays CRB-only |
| 2026-08-19 | Pack `status` records batches 1–13 complete. Next product work is still APG overlay, not more CRB encyclopedia rows |
| 2026-08-19 | APG slice 2 landed in the separate pack; this folder stays CRB-only |
| 2026-08-19 | Synthesist golden landed in fixtures; this folder stays CRB-only |
| 2026-08-19 | Spanish UI catalog landed; this folder stays English mechanics-only names |
| 2026-08-19 | 1.0 stability; this folder stays CRB-only |
| 2026-08-19 | Batch 14: remaining CRB player races + size stamp; ability adjustments stay typed; next is spells-per-day tables |
| 2026-08-27 | Locked remaining mundane weapons/armor into batches 16–21; magic weapons/armor reserved as a later overlay, not plus-N rows |
| 2026-08-27 | Batch 16: remaining simple melee + simple ranged and ammo; Combat stays typed; next mundane equipment is martial weapons (17) |
