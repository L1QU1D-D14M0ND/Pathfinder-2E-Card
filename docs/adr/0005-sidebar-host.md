# ADR 0005 — Loaded-sheet sidebar host (tools TBD)

**Status:** Accepted  
**Date:** 2026-08-17  
**Depends on:** [ADR 0003](0003-multi-system-product-direction.md), [ADR 0004](0004-shared-kernel.md)  
**Supersedes (UI slice):** ADR 0001 “Later reference UI = sidebar with Spells / Afflictions / Actions” as the *definition* of the sidebar. That encyclopedia remains a **future tool**, not the host.

**Context:** The loaded character sheet is a spreadsheet. Stakeholder wants a **sidebar** that appears when a sheet is loaded, showing tools and extra information, with **read and write** access to that sheet. Specific tools will be named later.

Detail: [`../sidebar-host-design.md`](../sidebar-host-design.md).

## Decision

When a character document is in memory (New or Load), the shell shows a **sidebar host** beside the spreadsheet: a collapsible rail that can display **extra information** and **tools**.

- **One document.** Tools read `character` + `derived` and write only through the same `update(mutator)` path as sheet tabs. No parallel copy, no bypass of Ajv on Save, no private undo stack that diverges from the sheet.
- **Registry, not a hard-coded encyclopedia.** The host is a slot. Tools register (shared and/or per `SystemModule`). Unspecified tools must be addable without redesigning chrome or forking persistence.
- **Sheet stays primary.** Spreadsheet tabs remain the full editor. The sidebar is companion chrome, not a second character sheet. Mobile: collapsed by default; sheet stays usable full-width.
- **Tool implementations are not specified** except **Attack Helper**, which is named for a later increment ([`../sidebar-tools-attack-helper.md`](../sidebar-tools-attack-helper.md)): weapon + feat selection, mechanical and mathematical **preview**, **no dice roller**. Attack Helper is **not** on the PF1e 0.9 critical path and waits until the **character sheet is ~90% done** (dynamic and functional). Pulling a tool that contradicts a non-goal (in-app dice, VTT, cloud) still needs its own lock.
- **UI chrome only for tool layout.** Which tool is open / whether the rail is collapsed is **session UI state**, not a save-file field, unless a specific tool must persist something — then it writes through `update` into the character (`extensions` or a later schema field).

## Consequences

- Phase M should leave room in the shell layout for the rail (even if collapsed/empty) so Phase Sb is not a full-width retrofit.
- Phase **Sb** (sidebar host) follows M; it does **not** block Phase 1e. 0.9 may ship with an empty or collapsed host.
- **Attack Helper** is the first named later tool: weapon + feat preview; physical dice only.
- ADR 0001’s Spells / Afflictions / Actions browser is a candidate **tool**, sequenced with other tools when specified.
- Sidebar strings go through i18n (`shell.sidebar.*`, tool keys under `shell.*` or `pf1e.*` / `pf2e.*`).

## Defaults

| Pick | Default | Override if… |
| --- | --- | --- |
| 0.9 tools populated | **No** — host may be empty/collapsed | Attack Helper or another named tool is pulled into 0.9 |
| Host on New (empty sheet) | **Yes** — any in-memory document |
| Collapse default (desktop) | Expanded if any tool is registered; else collapsed |
| Collapse default (narrow) | Collapsed |
| Dice / VTT in the sidebar | **Out.** Attack Helper shows expressions only; player rolls physical dice |

## References

- [`../sidebar-host-design.md`](../sidebar-host-design.md)
- [`../sidebar-tools-attack-helper.md`](../sidebar-tools-attack-helper.md)
- [`../ttrpg-character-sheet-design.md`](../ttrpg-character-sheet-design.md)
- [`../shared-kernel-design.md`](../shared-kernel-design.md)
- [`../ROADMAP.md`](../ROADMAP.md)
- [`0001-product-direction.md`](0001-product-direction.md)
- [`0003-multi-system-product-direction.md`](0003-multi-system-product-direction.md)
- [`0004-shared-kernel.md`](0004-shared-kernel.md)
