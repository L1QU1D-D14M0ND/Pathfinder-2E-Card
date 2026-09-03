# Agent guidance

## Testing

### Honesty / code fixes (next)

Phase 1x next code: leftover W7 test titles, golden `weapon.properties` / `secondHead` vs catalog stamp, honest `focusTab`. See [`docs/ROADMAP.md`](docs/ROADMAP.md) Phase 1x honesty / code fixes.

- From `app/`, run `npx vitest run src/systems/pf1e`.
- Do **not** start remaining feats/spells or sidebar tools in that change.
- Do **not** record a demo video unless sheet control, layout, or Combat math actually changes. Stamping golden inventory fields is not an Inventory UI change.

### CRB catalog fill-out (remaining feats/spells)

These batches append remaining catalog rows **after** the honesty/code fixes. Id tables are locked ([`docs/pf1e-crb-feat-spell-ids.md`](docs/pf1e-crb-feat-spell-ids.md); F1–F4 then S1–S5). Inventory already lists chips for weapon properties. Names + category/level only ([ADR 0007](docs/adr/0007-content-licensing.md)).

- From `app/`, run `npx vitest run src/systems/pf1e`.
- Do **not** record a demo video or upload Inventory screenshots unless the Inventory UI itself changed.
- Do **not** invent ids outside the lock file.

See [`docs/pf1e-crb-pack-design.md`](docs/pf1e-crb-pack-design.md) §8.

### When to record a browser walkthrough

Record a browser walkthrough when the sheet **control**, **layout**, or **Combat math** actually changes (new editor, restyle, derived AC/CMB/attack behavior, and similar).

### Sidebar tools

Named tools (Attack Helper, Actions List, Budget Calculator) are the **last character-sheet feature**. Do not implement one unless asked, and not before remaining catalog / APG follow-through / optional goldens / magic overlay / OGL-with-rules-text.
