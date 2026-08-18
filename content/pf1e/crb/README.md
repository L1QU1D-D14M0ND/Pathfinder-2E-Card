# Pathfinder 1E — Core Rulebook player catalog

Curated **mechanics-only** data for the PF1e sheet. Not a copy of the Core Rulebook.

| File | Contents |
| --- | --- |
| `pack.json` | Manifest and which review batches have landed |
| `classes.json` | Class **progression tags** (HD, BAB, saves) plus **class skills** and **skill points per level**. All 11 CRB base classes. Same row shape; Identity select lists the catalog. |
| `races.json` | Race **id + name**. Batch 8: Human. Ability adjustments stay typed into scores. |
| `items.json` | Item **id, name, pounds**, plus documentary weapon/armor stats. Batch 10: golden weapons, armor, and spellbook. Combat numbers stay on `armorClass` / `attacks`. |
| `feats.json` | Feat **id, name, category**. Batch 12: golden feats. Summaries and Combat math stay typed. |
| `spells.json` | Spell **id, name, spellLevel**. Batch 13: golden spells. Slots, DCs, and prepared flags stay typed. |

**License:** app is MIT. This folder is **mechanics-only** (ids, names, numbers). No Product Identity, no class flavor, no spell text. OGL 1.0a / Section 15 is **not** attached until a later increment ships Open Game Content prose. See [`docs/content-licensing.md`](../../../docs/content-licensing.md) and [ADR 0007](../../../docs/adr/0007-content-licensing.md). Do not scrape third-party SRDs into this tree.

See [`docs/pf1e-crb-pack-design.md`](../../../docs/pf1e-crb-pack-design.md) for the review process and landed batches (1–13, including Batch 7). **Next is 1.0** (Spanish + APG Synthesist in a separate pack). APG Synthesist Summoner is **not** this CRB folder.
