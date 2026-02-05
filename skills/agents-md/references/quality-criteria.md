# Full Quality Criteria (File 44 + Audit 2)

Score each AGENTS.md / CLAUDE.md root file with this checklist.

## Contents
- A. Commands and execution readiness (12 checks)
- B. Gotchas and repeated mistakes (10 checks)
- C. Conventions and decision boundaries (8 checks)
- D. Signal-to-noise and bloat control (8 checks)
- E. Currency and validation (6 checks)
- F. Audit execution checks (2 checks)
- Grade mapping and automatic fails

**Target:** >= 91% of applicable points for grade A

## Scoring

- File quality (`1-44`): `Yes` = 1, `No` = 0, `N/A` = excluded from denominator
- Audit execution (`45-46`): score only when producing a report/edit proposal
- File grade uses `earned / applicable`

Use this when auditing from first principles: the file should help an agent execute correctly with minimal context.

## A. Commands and execution readiness (12)

1. Includes a working `dev` command (or equivalent local run command)
2. Includes a working `test` command
3. Includes a working `build` command
4. Includes a working `lint` and/or `typecheck` command
5. Includes deploy/release command when applicable
6. Includes migration/seed/db command when applicable
7. Commands are copy-paste ready (no placeholders)
8. Commands match the actual package manager and scripts
9. Includes required environment bootstrap steps
10. Includes quick path/context for where to run commands (root/workspace)
11. Includes one command for targeted test/debug iteration
12. Avoids duplicate or conflicting command variants

## B. Gotchas and repeated mistakes (10)

13. Documents at least one high-frequency failure mode
14. Gotchas are project-specific, not generic
15. Gotchas include corrective action (what to do instead)
16. Gotchas include trigger context (when the rule applies)
17. Captures at least one issue discovered from recent PR/review feedback
18. Includes ordering/dependency gotchas where order matters
19. Includes data/env gotchas where setup mistakes cause failures
20. Avoids vague advice like "be careful" or "follow patterns"
21. Separates universal rules from edge-case rules
22. Removes gotchas that no longer happen

## C. Conventions and decision boundaries (8)

23. States conventions that materially change implementation choices
24. States naming/path conventions when CI/tooling depends on them
25. States test strategy conventions (unit/e2e boundaries) when relevant
26. States when to use linked references instead of adding root-file detail
27. Marks scope boundaries for monorepo root vs workspace instruction files
28. Avoids restating obvious defaults known by modern coding agents
29. Uses precise language (specific verbs, explicit conditions)
30. Avoids contradictory instructions

## D. Signal-to-noise and bloat control (8)

31. Root file stays concise for repo complexity (60-150 lines is common for active app repos)
32. No full framework documentation pasted inline
33. No copy-pasted full AGENTS.md templates
34. No exhaustive file tree or "every file" inventory
35. No long architecture deep dives in root file
36. Uses links to detail files for non-universal guidance
37. Removes duplicate guidance repeated across sections
38. Each section provides operational value (not filler)

## E. Currency and validation (6)

39. Referenced file paths exist
40. Referenced tools/dependencies are currently used
41. Commands have been run (or limitations are explicitly documented when run is not possible)
42. Removed references to deleted folders/APIs
43. Version-sensitive guidance is date/version scoped where needed
44. Includes a clear maintenance loop (how to keep file current)

## F. Audit execution checks (2)

45. Post-change report includes concrete issues and resulting score
46. Suggested edits are minimal and traceable (diff-first)

## Grade mapping (file quality only)

Use `earned / applicable` percentage:

- A: >= 91%
- B: 76% to < 91%
- C: 59% to < 76%
- D: 39% to < 59%
- F: < 39%

Example: `36/40 = 90%` -> Grade `B`.

## Automatic fails

Mark grade as `F` regardless of score if any are true:
- Commands are mostly broken/stale
- Instructions are primarily generic advice
- File is dominated by copied docs/templates and not executable guidance
