# Imported skills

`tdd/`, `diagnosing-bugs/`, `codebase-design/`, and `improve-codebase-architecture/` are copied from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, Copyright (c) 2026 Matt Pocock), at commit `6654f6b` (2026-08-24). They're plain project files, not a plugin install — edit them freely to fit this repo.

Per-agent metadata (`agents/openai.yaml`) was dropped on import since this project only targets Claude Code.

Two of the four cross-reference sibling skills from the same source repo that were **not** imported:

- `improve-codebase-architecture` calls the `grilling` and `domain-modeling` skills by name (Skill tool) partway through its flow. Without them, its "grilling loop" and live `CONTEXT.md` update steps won't resolve — the scan-and-report phase (steps 1–2) still works standalone.
- `tdd` and `codebase-design` degrade gracefully — they only *mention* `codebase-design`/`grilling` as optional cross-references, not hard dependencies.

Pull in `grilling` and `domain-modeling` from the same source repo if the full `improve-codebase-architecture` flow is wanted.
