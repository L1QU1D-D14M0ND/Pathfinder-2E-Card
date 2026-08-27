# Imported skills

`tdd/`, `diagnosing-bugs/`, `codebase-design/`, `improve-codebase-architecture/`, `grilling/`, and `domain-modeling/` are copied from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock), at commit `6654f6b` (2026-08-24). They're plain project files, not a plugin install — edit them freely to fit this repo.

Per-agent metadata (`agents/openai.yaml`) was dropped on import since this project only targets Claude Code.

`improve-codebase-architecture` calls `grilling` and `domain-modeling` by name (Skill tool) partway through its flow — its "grilling loop" and live `CONTEXT.md`/ADR update steps now resolve. `tdd` and `codebase-design` only *mention* each other and `grilling` as optional cross-references, not hard dependencies.

One nuance worth knowing: `domain-modeling`'s [`ADR-FORMAT.md`](domain-modeling/ADR-FORMAT.md) proposes a minimal one-paragraph ADR template. This repo's existing ADRs (`docs/adr/0001`–`0007`) are already much richer (Status/Date/Depends-on/Supersedes header, Decision table, Consequences, References — see `CLAUDE.md`) and that's a locked, working convention, not something to replace. Follow the repo's existing ADR format when actually writing one; treat `ADR-FORMAT.md` as background reading on *when* to write an ADR, not the template to use here.

Neither `grilling` nor `domain-modeling` requires a `CONTEXT.md` or `docs/adr/` to already exist — both skills create those lazily on first use.
