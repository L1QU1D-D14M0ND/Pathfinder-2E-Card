# Legal aspects report — TTRPG Character Sheet

**Date:** 2026-08-28  
**Scope:** This repository as of `main` (CRB batches 1–19 and weapon-property tags W1–W4).  
**Status:** Inventory and risk map. **Not legal advice.** A lawyer should review before shipping copyrighted rules text, Paizo logos, a claimed compatibility mark, a public hosted service, or a commercial product that uses Pathfinder trademarks.

Product lock (what the project has already decided): [ADR 0007](adr/0007-content-licensing.md) and [`content-licensing.md`](content-licensing.md). This report does not change that lock. It describes what the lock covers, what has landed since the 2026-08-18 review, and which questions still sit with counsel.

---

## 1. Verdict

The **software** is MIT. The **ship packs** are curated mechanics-only metadata (ids, names, numeric tags, weapon/armor stats, class tables). The project **does not** currently attach Open Game License 1.0a, an OGL Section 15, the Open RPG Creative License (ORC), or Paizo’s Community Use Policy. That is a deliberate product choice: OGL text is scheduled for the same change that first ships Open Game Content **prose**, not for the current number catalogs.

That posture is internally consistent and is enforced in CI. It is **not** a substitute for a license opinion. The gray area is whether copying Core Rulebook **table grids** (spells-per-day, weapon rows, class-skill lists) without attaching OGL 1.0a is still “not a distribution of Open Game Content.” The project treats those grids as mechanics-only numbers. Counsel should confirm that reading before a public or commercial release.

---

## 2. Three layers (how this repo thinks about license)

| Layer | What it is | License posture today |
| --- | --- | --- |
| App (`app/`, schemas, engine formulas, UI) | Original software | MIT ([`LICENSE`](../LICENSE)) |
| Ship packs (`content/pf1e/crb/`, `content/pf1e/apg/`) | Curated mechanic metadata | Mechanics-only. `contentKind: "mechanics-only"`, `oglNoticeRequired: false`. Not a Core Rulebook reprint. |
| Player documents (Save `.json`, goldens, IndexedDB draft) | One character’s typed sheet | The player’s file. Campaign words may appear. Not the pack. |

[ADR 0003](adr/0003-multi-system-product-direction.md) says “content packs follow the source license; curated stats/summaries only.” [ADR 0007](adr/0007-content-licensing.md) refines that: **summaries copied from a book wait** until an OGL increment. Until then, packs are ids/names/numbers only.

Engine math (ability modifier, BAB/save progressions, iterative attacks, size, encumbrance, spell DC) lives in TypeScript formulas, not pasted table images or class write-ups. Catalog JSON holds the numbers those formulas need (class tags, weapon rows, `spellsPerDay` grids).

---

## 3. Software license (MIT)

[`LICENSE`](../LICENSE) is the MIT License, Copyright (c) 2026 L1QU1D-D14M0ND, plus a short project note:

> The MIT License covers the software in this repository. Catalog files under content/ are mechanics-only metadata, not a reprint of the Pathfinder Core Rulebook.

**Implications:**

- Downstream users may use, copy, modify, and sell the **software**, subject to keeping the copyright notice.
- MIT does **not** grant rights in Paizo’s copyrights or trademarks. A fork that adds spell text, Golarion gazetteer, or a Pathfinder logo is not licensed by this MIT file.
- GitHub currently reports the repo license as **“Other”** (`licenseInfo.key: other`), not MIT. The extra paragraph after the standard MIT text is the likely cause. That is a metadata issue, not a change of terms. If SPDX/GitHub detection matters, keep the extra paragraph in `README` / `docs/content-licensing.md` instead of inside `LICENSE`.

There is no `NOTICE`, `CONTRIBUTING`, `SECURITY`, `CODE_OF_CONDUCT`, or privacy policy in the tree.

Imported agent skills under `.claude/skills/` are copied from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock), recorded in [`.claude/skills/README.md`](../.claude/skills/README.md).

---

## 4. Pathfinder First Edition — OGL 1.0a and Product Identity

Pathfinder 1e was published under the **Open Game License 1.0a**. Under that license, a publisher designates some text as **Open Game Content (OGC)** and some as **Product Identity (PI)**. Using OGC typically requires reproducing the OGL and a **Section 15** that lists the sources used, and omitting PI.

### 4.1 Project decision (locked)

1. Do **not** add OGL 1.0a or Section 15 until the first pack (or encyclopedia) row that copies OGC **rules text** (feat Benefit, spell description, class-feature paragraph).
2. Pack JSON has no `description` / `summary` / `flavor` / `text` / `benefit` / similar keys.
3. Product Identity stays out of packs: Golarion place names, unique NPCs, adventure titles, Paizo logos, bestiary/adventure dumps.
4. Do **not** scrape d20pfsrd, Archives of Nethys, Hero Lab, or Foundry dumps into `content/`. Curate by hand from the books’ mechanical tables.
5. Page numbers stay omitted (`source.book` is `"CRB"` or `"APG"`).
6. `class.summoner` lives only in the APG pack, never in the CRB folder — source-attribution hygiene for a future Section 15.

### 4.2 What is in the packs today

**CRB pack** (`content/pf1e/crb/`):

- 11 Core Rulebook base classes: HD, BAB/save tags, skill points, class-skill keys, and (casters) a 20×10 `spellsPerDay` table.
- 7 player races: id, name, size.
- Feats: five golden ids (name + category).
- Spells: four golden ids (name + spell level).
- Items: mundane weapons (simple / martial / exotic), ammo, chain shirt, chainmail, spellbook — pounds plus documentary combat fields; W1–W4 add kebab-case `weapon.properties` tags (`reach`, `brace`, `trip`, `disarm`). Remaining armor/shields and magic items are queued.

**APG pack** (`content/pf1e/apg/`):

- Summoner class tags (no flavor).
- Synthesist archetype: id + name.
- Evolution ids + names only (Bite, Claws, …). No point costs, no eidolon prose.

Catalog labels the project treats as mechanical names, not setting gazetteer: Fighter, Wizard, Human, Longsword, Fireball, Power Attack, Starknife, Dwarven urgrosh, Elven curve blade, and similar CRB equipment names. No Aldori / deity / Inner Sea proper names showed up in a pack scan for this report.

### 4.3 Gray area: tables without prose

US copyright does not protect ideas, procedures, or methods of operation. Game **systems** are generally not copyrightable; the **literary expression** of those systems is. OGL 1.0a is a **license to copy designated OGC**, not a finding that numbers are free.

This repo copies more than formulas:

| Kind | Where | Example |
| --- | --- | --- |
| Closed-form math | Engine | `modifier = floor((score − 10) / 2)`; BAB full / ¾ / ½ |
| Numeric series derived from a table | Engine | Strength heavy-load pounds |
| Verbatim table grids | Pack JSON | Class `spellsPerDay` 20×10; class-skill lists; weapon damage/crit/range; armor AC/max Dex/ACP/spell failure |
| Closed vocabulary tags | Pack JSON | `reach`, `brace`, `trip`, `disarm` |

The 2026-08-18 review described engine formulas as “published table **numbers**, not … class write-ups.” **Batch 15** later shipped full spells-per-day grids; **batches 16–19 and W1–W4** shipped the rest of the CRB weapon table as JSON rows. The product lock still says “no OGL until rules **text**.” That is a line the project can keep as policy; it is the line counsel should stress-test.

If counsel concludes those grids are OGC in use, the fix is the already-planned increment: attach OGL 1.0a + Section 15 **next to the pack** (do not rewrite the app MIT `LICENSE`), designate which fields are OGC, and still omit PI.

### 4.4 Product Identity word list (enforced, short)

[`licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts) rejects these substrings in pack **entity** JSON:

Golarion, Absalom, Cheliax, Varisia, Sandpoint, Paizo, Pathfinder Society, Inner Sea.

That list is a tripwire, not a gazetteer. It will not catch Osirion, Korvosa, Iomedae, Aldori, Runelord, and many other PI terms. Expanding the list is a product/test change, not a substitute for not adding setting text.

---

## 5. Pathfinder Second Edition — ORC and Remaster

PF2e **Remaster** (Player Core / Player Core 2) is published under the **Open RPG Creative (ORC) License**, not OGL 1.0a. Legacy pre-Remaster PF2e was OGL. The two licenses are not drop-in replacements for each other.

**Today:** there is **no** `content/pf2e/` pack. PF2e goldens fill numeric fields by hand and use `rulesetSource: "custom"` on content refs. The PF2e engine computes HP, AC, skills, strikes, spell attack/DC, bulk, and similar from those inputs. Remaining Remaster pack work is deferred ([ADR 0003](adr/0003-multi-system-product-direction.md) postscript; roadmap later release).

**Locked for later:** optional attributed ORC import after its own license review. Do not scrape Archives of Nethys or mix OGL PF1e prose and ORC PF2e prose in one pack without that review.

PF2e panel UI strings are still partly hardcoded English (i18n deferred). That is a product sequencing issue, not a license issue.

---

## 6. Trademarks and Community Use

**Pathfinder**, **Paizo**, and related logos are Paizo trademarks. The project’s working display name is **TTRPG Character Sheet**. PWA `name` / `short_name` and the HTML `<title>` use that name, not “Pathfinder.”

**Nominative uses that exist today:**

- System picker and module `displayName`: “Pathfinder First Edition” / “Pathfinder Second Edition” (`app/src/locales/en.json`, `es.json`).
- PWA manifest description: “Local player character sheet for Pathfinder 1E and 2E.”
- GitHub repository name: `Pathfinder-2E-Card`.
- npm `package.json` `"name"`: `pathfinder-2e-character-sheet` (`private: true`, not published).

[ADR 0007](adr/0007-content-licensing.md) §7: no official Paizo compatibility logo and no Community Use artwork in 0.9/1.0 unless a later ADR says so.

**Community Use Policy (CUP)** is Paizo’s fan-work safe harbor (attribution, unofficial, restrictions on charging for CUP material, approved logos only). This repo **does not** claim CUP and **does not** include CUP attribution. Fan tools often rely instead on **nominative fair use** (using the mark to name the game the tool is for). Whether that is enough for a given distribution (especially a **paid** one under MIT’s commercial grant) is a counsel question. CUP and MIT-commercial are in tension if someone sells a build that still says “Pathfinder” as product branding.

**Do not add:** Paizo logos, “compatible with Pathfinder” seals, official art, or Community Use assets without a dedicated ADR and the required CUP notice.

---

## 7. Privacy, persistence, and hosting

The product is **local-first**:

- One active sheet in memory.
- Explicit Save/Load of a `.json` file on the user’s machine.
- One IndexedDB draft (`ttrpg-character-sheet` / key `draft`) for refresh-restore only, debounced, not a character library.
- Locale in `localStorage` (`ttrpg-sheet.locale`).
- No cloud account, no analytics in application code, no character sync.

There is no privacy policy. For a purely local PWA that never phones home, many consumer-privacy statutes have little to grab. If the app is **hosted as a public website** (especially for EU/UK users), counsel may still want a short notice covering local storage (IndexedDB + `localStorage`), no sale of data, and how to clear the draft. Installing as a PWA does not by itself create a server-side processing relationship.

`workbox-google-analytics` appears as a **transitive** Workbox package in the lockfile. The Vite PWA config does not enable it. Do not turn it on without a privacy review.

Save files can contain whatever the player typed (names, campaign PI, notes). That is the player’s document. The ship pack must not grow by harvesting those files.

---

## 8. Third-party open-source (npm)

Runtime dependencies: `react`, `react-dom`, `ajv`, `ajv-formats` — MIT-family.

Dev/build: Vite, TypeScript, Vitest, Testing Library, oxlint, `vite-plugin-pwa` / Workbox. The lockfile also includes Apache-2.0, ISC, BSD, BlueOak-1.0.0, CC-BY-4.0, CC0-1.0, and **MPL-2.0** (`lightningcss`, a CSS toolchain used at build time).

No GPL/AGPL runtime dependency showed up in a lockfile scan for this report. MPL-2.0 file-level copyleft applies if those MPL files are modified and distributed; using them as an unmodified build tool is the usual case. A full NOTICE/attribution file is not required by MIT but is good hygiene if you ship a `dist/` to end users.

---

## 9. Enforcement in CI

[`app/src/systems/pf1e/content/licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts) is the mechanical gate (ADR 0007). It now **globs** every `content/pf1e/**/*.json` file rather than enumerating paths, so a new pack file is scanned automatically.

| Check | What it does |
| --- | --- |
| Pack manifests | `contentKind === "mechanics-only"` and `oglNoticeRequired === false` |
| Forbidden keys | `benefit`, `body`, `description`, `flavor`, `flavortext`, `fulltext`, `prose`, `rules`, `special`, `summary`, `text` |
| PI regex | Short list in §4.4, entity JSON only |
| Summoner split | No Summoner in CRB `classes.json`; APG `classes.json` is exactly `class.summoner` |

CI (`.github/workflows/ci.yml`) runs the full Vitest suite, so the gate is on every PR.

**Gaps the gate does not cover:**

- `pack.json` notes (intentionally “our comments”); PI regex is entity-only.
- Locales, UI chrome, PWA description, README, goldens, engine source.
- `source.page` (schema allows it; ADR says omit it; tests do not assert `page` is absent).
- Completeness of the PI word list.
- Third-party scrape provenance (policy + review, not a test).
- PF2e (no pack to scan).

Forbidden-key `special` means a JSON field named `special` cannot hold weapon special-quality **prose**. The project uses `weapon.properties` (tag list) instead, which is allowed.

---

## 10. Player goldens vs pack PI

[ADR 0007](adr/0007-content-licensing.md) §6: player sheets may contain campaign words. Example: PF2e Wizard 5 golden has `identity.homeRegion: "Absalom"`. That is character identity, not catalog PI. The license gate does not scan fixtures, by design.

PF1e goldens use feat/feature `summary` values as sheet honesty notes (“Not auto-applied”), not copied feat benefits.

---

## 11. Future legal triggers (do not skip)

These are the increments the roadmap already names. Each one should reopen license review, not only code review.

| Trigger | Required in the same change |
| --- | --- |
| First pack or encyclopedia **rules text** (feat benefit, spell body, class feature) | OGL 1.0a text beside the pack; Section 15 listing CRB and/or APG (and any other OGC source actually used); designation of OGC fields; still no PI |
| Remaining CRB feats/spells **with descriptions** | Same as above |
| APG Summoner spell catalog **with descriptions**, evolution rules text, Magical Child | Same; Section 15 must list APG; keep Summoner out of the CRB folder |
| Sidebar encyclopedia (Spells / Afflictions / Actions) | License-gated ([ADR 0005](adr/0005-sidebar-host.md)); same OGL increment if it ships OGC prose |
| PF2e Remaster / Player Core packs | Separate **ORC** review; do not reuse the PF1e OGL notice as if it covered Remaster |
| Paizo logos, CUP art, “compatible” mark | CUP (or other) permission + attribution ADR; working title stays non-Pathfinder unless product decides otherwise |
| Public hosting, accounts, or analytics | Privacy notice / terms; do not enable Workbox Google Analytics by accident |
| Selling binaries or a hosted product | Trademark + CUP vs nominative fair use; MIT commercial grant does not clear Paizo marks |
| Third-party SRD import pipeline | Still forbidden as a scrape; any import must be attributed, license-reviewed, and hand-curated |

Magic weapons/armor (pack design §7.5) are a later overlay on mundane ids. Named unique items and plus-N copies are more likely to collide with PI or copied treasure tables; keep them out of the ship pack until that review.

---

## 12. Questions for counsel (not for the next code PR)

1. Does shipping CRB **spells-per-day grids**, **weapon table rows**, and **class-skill lists** without OGL 1.0a match the “mechanics-only, no OGC prose” theory, or should Section 15 go on before a public release?
2. Is nominative use of “Pathfinder First/Second Edition” in the system picker enough, given the GitHub repo name `Pathfinder-2E-Card` and no CUP notice?
3. If a third party sells an MIT-licensed build of this app, what trademark hygiene should the README require?
4. When PF2e Remaster packs start, what ORC reserved-material list applies, and how is it isolated from PF1e OGL files?
5. For a GitHub Pages (or similar) host of the PWA, is a one-page privacy notice needed for IndexedDB/localStorage?

Until those are answered, the safe engineering default remains the current ADR: **no rules-text prose, no PI, no scrape, no Paizo logo, OGL notice in the same PR as the first OGC paragraph.**

---

## 13. Document map

| Document | Role |
| --- | --- |
| [`LICENSE`](../LICENSE) | MIT + pointer at catalog posture |
| [ADR 0007](adr/0007-content-licensing.md) | Product lock (OGL / PI gate) |
| [`content-licensing.md`](content-licensing.md) | 2026-08-18 review (updated for later weapon batches in §3) |
| [`pf1e-crb-pack-design.md`](pf1e-crb-pack-design.md) §4 | CRB folder license notes |
| [`pf1e-apg-pack-design.md`](pf1e-apg-pack-design.md) | APG pack license notes |
| [ADR 0003](adr/0003-multi-system-product-direction.md) | Multi-system product; OGL vs ORC acquisition |
| [`ROADMAP.md`](ROADMAP.md) | OGL notice + Section 15 still open in Phase 1x |
| [`licenseGate.test.ts`](../app/src/systems/pf1e/content/licenseGate.test.ts) | CI tripwire |
| `content/pf1e/*/README.md` and `pack.json` | Per-pack mechanics-only flags |

---

## Appendix — History relevant to this report

| Date | What landed | License note |
| --- | --- | --- |
| 2026-08-18 | ADR 0007 + content-licensing review | Mechanics-only; OGL deferred |
| 2026-08-18–19 | APG Synthesist slices; Spanish UI | Same bar; pack names stay English |
| 2026-08-19 | Batch 14 races; 1.0 stability | Still no PI in packs |
| later | Batch 15 `spellsPerDay` grids | First large verbatim class tables in JSON |
| later | Batches 16–19 weapons; W1–W4 property tags | Weapon table rows + tags; still `oglNoticeRequired: false` |
| 2026-08-28 | This report | Inventory only; lock unchanged |
