# Content licensing review (2026-08-18)

**Status:** Landed. Product lock: [ADR 0007](adr/0007-content-licensing.md).  
**Not legal advice.**

This is the OGL / Product Identity review that Phase 3c deferred until before **rules text**. It does not add text to the pack. It does not start Synthesist.

---

## 1. Verdict

The **ship pack today is mechanics-only** (ids, names, numbers). It does not copy Core Rulebook prose. **Do not attach OGL 1.0a or a Section 15 yet.** Attach those in the same change that first ships Open Game Content **rules text**.

**Product Identity is not in `content/pf1e/crb/`.** Keep it that way.

**1.0 APG Synthesist** may add a **separate** pack under `content/pf1e/apg/` with the same mechanics-only shape. Class flavor and evolution/spell text still wait for the OGL notice.

---

## 2. Three layers

| Layer | What it is | License posture |
| --- | --- | --- |
| App (`app/`, schemas, engine formulas) | Software | MIT |
| Ship packs (`content/`) | Curated mechanic metadata | Not a CRB reprint. Mechanics-only until an OGL increment |
| Player documents (Save `.json`, goldens, draft) | One character’s typed sheet | The player’s file. Campaign words may appear. Not the pack |

Engine formulas (ability modifier, BAB tables, spell DC, bonus spells, heavy load) are implemented in code from published table **numbers**, not by pasting table images or class write-ups.

---

## 3. What was audited

| Location | Finding |
| --- | --- |
| `content/pf1e/crb/classes.json` | 11 CRB class ids; HD / BAB / saves / skill points / class-skill keys; `source.book: CRB`. No Summoner. No flavor |
| `races.json` | Seven CRB player race names + size; no Golarion PI |
| `items.json` | Golden weapons/armor/spellbook: pounds and documentary combat fields |
| `feats.json` | Five golden feat ids; name + category |
| `spells.json` | Four golden spell ids; name + spell level. No descriptions |
| `pack.json` | Batch notes are **our** review comments, not book text |
| PF1e goldens | Feat/feature `summary` values are sheet honesty notes (“Not auto-applied”), not feat benefits |
| PF2e golden Wizard | `identity.homeRegion` may be a Golarion place name. That is **character identity**, not pack content |

Forbidden in pack JSON until an OGL increment: `description`, `summary`, `flavor`, `text`, `benefit`, spell bodies, class feature paragraphs. Enforced by [`app/src/systems/pf1e/content/licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts).

---

## 4. When OGL 1.0a / Section 15 is required

**Required in the same PR** that first adds pack (or encyclopedia) **prose taken from Open Game Content** — for example a feat Benefit paragraph, a spell description, or a class feature block.

That PR must:

1. Include the OGL 1.0a license text next to the pack (not by rewriting the app MIT `LICENSE`).
2. Include a Section 15 that lists the Open Game Content sources actually used.
3. Designate which fields are Open Game Content.
4. Still omit Product Identity.

**Not required** for the current mechanics-only CRB folder, for engine math, or for player-typed summaries on a sheet.

Do not scrape third-party SRD sites into `content/` even after that PR. Curate by hand.

---

## 5. Product Identity and trademarks

**Out of packs:** Golarion gazetteer, unique NPCs, adventure titles, Paizo logos, official art, Community Use assets, bestiary/adventure text.

**Allowed as catalog labels** (already on goldens): generic mechanical names such as Fighter, Wizard, Human, Longsword, Fireball, Power Attack.

**Chrome:** system picker may say Pathfinder First Edition / Second Edition. Working app title is **TTRPG Character Sheet**. No “Paizo compatible” logo in 0.9/1.0 unless a later ADR adds Community Use artwork and its attribution.

---

## 6. 1.0 APG pack

Slice 2 landed: `content/pf1e/apg/` with documentary evolution **names** and a fused STR/DEX/CON overlay + costume HP. Synthesist golden landed. **Never** `class.summoner` inside `content/pf1e/crb/`.

- 1.0 landed. Spanish UI catalog landed. Apply does not auto-write fused scores or evolution math.
- Evolution and eidolon **rules text** wait for the OGL increment in §4.
- Magical Child / other APG classes stay out until a later pack slice.

---

## 7. PF2e

No Remaster encyclopedia in this review. ORC import remains later (ADR 0003). PF2e goldens stay numeric + existing `ContentRef` names.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-18 | First review. CRB pack is mechanics-only; OGL notice deferred until rules text; 1.0 APG pack same bar |
| 2026-08-18 | APG slice 1 landed (Summoner tags + Synthesist name) |
| 2026-08-19 | APG slice 2: documentary evolution names + fused overlay |
| 2026-08-19 | Synthesist golden (Half-Elf Radiant Striker) |
| 2026-08-19 | Spanish UI catalog (`es.json`); pack still mechanics-only English names |
| 2026-08-19 | 1.0 stability; pack still mechanics-only |
| 2026-08-19 | CRB batch 14: remaining player race names + size; still no PI |
