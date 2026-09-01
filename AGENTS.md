# Agent guidance

## Testing

### CRB catalog fill-out (remaining feats/spells)

These batches append remaining catalog rows. Inventory already lists chips for weapon properties.

- From `app/`, run `npx vitest run src/systems/pf1e`.
- Do **not** record a demo video or upload Inventory screenshots unless the Inventory UI itself changed.

See [`docs/pf1e-crb-pack-design.md`](docs/pf1e-crb-pack-design.md) §7.6.

### When to record a browser walkthrough

Record a browser walkthrough when the sheet **control**, **layout**, or **Combat math** actually changes (new editor, restyle, derived AC/CMB/attack behavior, and similar).
