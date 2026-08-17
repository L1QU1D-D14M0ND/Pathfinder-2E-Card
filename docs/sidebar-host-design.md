# Sidebar host — tools and extra information

**Status:** Product + shell lock (ADR 0005) — 2026-08-17  
**Parent:** [ADR 0005](adr/0005-sidebar-host.md), [`ttrpg-character-sheet-design.md`](ttrpg-character-sheet-design.md), [`shared-kernel-design.md`](shared-kernel-design.md)  
**Code:** thin host in `app/src/shell/sidebar` (collapsed empty rail). Named tools not implemented.

This document locks the **host**. Named later tools are listed in §5; they are **not** implemented until a tools increment.

---

## 1. Purpose

When a character sheet is loaded (including a New empty sheet), the player sees the spreadsheet **and** a **sidebar**: extra information and tools that can **inspect and change** the same character the tabs edit.

The spreadsheet remains the complete Build + Play editor. The sidebar is companion chrome so later tools (trackers, reference, shortcuts, summaries) do not each invent their own window or save path.

---

## 2. When it shows

| State | Sidebar |
| --- | --- |
| App has an in-memory character (New or Load) | Host is present |
| No document | Does not occur in the current product (New always creates one) |
| Invalid Load rejected | Previous sheet stays; sidebar stays bound to that sheet |
| User collapses the rail | Host remains; tools unmounted or hidden; sheet uses full width |

Narrow / mobile: rail **collapsed by default**. Desktop: expanded when at least one tool is registered, otherwise collapsed (empty host must not steal a wide column).

---

## 3. Read and write contract

Every tool receives the same context as a sheet panel:

```ts
interface SidebarToolContext<Doc, Derived> {
  system: SystemId
  character: Doc
  derived: Derived
  update: (mutator: (c: Doc) => Doc) => void
  /** Optional: jump the spreadsheet to a tab id. */
  focusTab?: (tabId: string) => void
}
```

Rules:

1. **Read** inputs from `character` and computed values from `derived` (recomputed after each `update`, same as tabs).
2. **Write** only via `update`. Mutators are immutable copies, same as `sheet/update.ts` today. Tools do not assign into `character` in place and do not keep a stale draft that Save might miss.
3. **Save / Load / New** stay in the shell. A tool must not download a different JSON or load a file behind the shell’s back.
4. **Validation** stays on Save (and Load). A tool may write a still-schema-valid partial (empty names, etc.) like the rest of the sheet. It must not require a second schema.
5. **Overrides** use the existing `overrides` map and engine allow-list if a tool is an override inspector. Do not add a second override channel.
6. **No shadow document.** If a tool needs persistent settings, it writes into the character (`extensions` until a schema ADR) or keeps **session-only** UI state in the host (active tool id, collapsed flag).

Edition-blind tools live in `shell/sidebar/tools/` (or `shared/ui/`) and only use kernel types. Edition-specific tools live in `systems/pf1e` / `systems/pf2e` and register through `SystemModule`.

---

## 4. Host chrome (not tools)

Locked look-and-feel, still lightweight (no animations beyond show/hide):

- A **rail** on the trailing edge of the main column (LTR: right). Spreadsheet tabs stay on the left/center.
- A **collapse** control in the identity/top bar or the rail header.
- Inside the rail: a **tool list** (names) + the **active tool** body. Extra information may be a built-in summary region *or* just another tool; do not invent a third column.
- Empty state: “No tools yet” (i18n `shell.sidebar.empty`) when the registry is empty — acceptable for 0.9.
- No cards, no decorative motion, no floating windows.

CSS lives with the shell. Do not put PF2e-only class names on the rail.

---

## 5. Tool registry

```ts
interface SidebarTool<Doc, Derived> {
  id: string              // stable, e.g. shell.summary, pf2e.conditions-quick
  labelKey: string        // i18n
  systems?: SystemId[]    // omit = all registered systems
  render: (ctx: SidebarToolContext<Doc, Derived>) => ReactNode
}
```

`SystemModule` may expose `sidebarTools`. The shell concatenates shared tools + the active system’s tools, filters by `systems`, and renders the host.

Adding a tool later = implement `SidebarTool` + register. It must not require changing Save/Load or the envelope.

### Named later tools

Do not stub these in the registry until their increment. Reserved ids:

| Id | Name | Spec |
| --- | --- | --- |
| `shell.attack-helper` | **Attack Helper** | [`sidebar-tools-attack-helper.md`](sidebar-tools-attack-helper.md) — pick a weapon + applicable feats; show mechanical triggers/inflicts and to-hit/damage **expressions**. **No dice roller** (physical dice at the table). |
| `shell.actions-list` | **Actions List** | [`sidebar-tools-actions-list.md`](sidebar-tools-actions-list.md) — what this PC can do now (attacks, maneuvers, movement, skills, aptitudes). Unavailable rows are **greyed out** with a one-word or short-sentence reason (`grappled`, `dazed`, `immobilized`, …). |

The old “reference sidebar” (Spells / Afflictions / Actions) remains a possible future **encyclopedia** tool group, catalog-fed, still license-gated. It is not the host and it is not Actions List (the PC’s current menu).

---

## 6. What this is not

- Not a second full sheet (do not duplicate every tab in the rail).
- Not GM encounter tools, cloud, or VTT (ADR 0003 non-goals unless a later ADR pulls one in).
- Not a dice roller. **Attack Helper** (and any other tool) must not add one; the player rolls physical dice.
- Not a multi-character library (still one loaded sheet).
- Not a requirement that 0.9 ship useful widgets. 0.9 ships the **ability to host** them (or a collapsed empty rail).

---

## 7. Sequencing

| Phase | Sidebar work |
| --- | --- |
| Docs (now) | This file + ADR 0005 |
| **M** | Done — empty collapsed `<aside>` in the shell |
| **Sb** | Done (thin host: collapse, registry, empty state, context wired) |
| **Tools** (later) | After the character sheet is **~90% done** (dynamic and functional). **Attack Helper** and **Actions List** are specified; encyclopedia is a candidate |
| 0.9 | PF1e bar does **not** wait on tools. Empty/collapsed host is fine |
| 1.0 | Same; Spanish includes `shell.sidebar.*` if the host shipped |

Phase Sb can follow 1e if engineering prefers PF1e math first; the **contract** must exist before the first tool PR so tools do not invent a second write path.

---

## 8. Kernel / layout notes

Add to the shell (not `systems/pf2e` math):

```text
app/src/shell/sidebar/
  SidebarHost.tsx      # rail + collapse + tool list
  types.ts             # SidebarTool, SidebarToolContext
  registry.ts          # merge shared + system tools
```

`SystemModule` grows an optional `sidebarTools` array. Shared kernel already owns `update` / derived-cell patterns; the sidebar reuses them.

Import rule unchanged: PF1e tools must not import PF2e modules.

---

## Appendix — Document history

| Date | Change |
| --- | --- |
| 2026-08-17 | Initial host lock; tools left unspecified (ADR 0005) |
| 2026-08-17 | Reserve **Attack Helper** as a later named tool (no in-app dice) |
| 2026-08-17 | Tools sequenced after the sheet is ~90% done; not during schema/engine work |
| 2026-08-17 | Reserve **Actions List** (grey-out + short reason) |
