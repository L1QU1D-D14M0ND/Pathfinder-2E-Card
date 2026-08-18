# Pathfinder 1E — Advanced Player’s Guide player catalog

Curated **mechanics-only** data for the PF1e sheet. Not a copy of the Advanced Player’s Guide. **Never** put Summoner in [`../crb/`](../crb/).

| File | Contents |
| --- | --- |
| `pack.json` | Manifest and which 1.0 slices have landed |
| `classes.json` | Slice 1: Summoner **progression tags** (HD, BAB, saves, class skills, skill points). Same row shape as the CRB catalog. |
| `archetypes.json` | Slice 1: Synthesist **id + name**. Apply does not rewrite HD/BAB/saves or fused ability scores. |
| `evolutions.json` | Slice 2: evolution **ids + names**. Apply does not write fused scores, costume HP, or attacks. |

**License:** app is MIT. This folder is **mechanics-only** (ids, names, numbers). No Product Identity, no class flavor, no eidolon or spell text. OGL 1.0a / Section 15 is **not** attached until a later increment ships Open Game Content prose. See [`docs/content-licensing.md`](../../../docs/content-licensing.md) and [ADR 0007](../../../docs/adr/0007-content-licensing.md).

See [`docs/pf1e-apg-pack-design.md`](../../../docs/pf1e-apg-pack-design.md). **Next:** Synthesist golden (still not auto-applied evolutions). Spanish is a separate 1.0 track.
