# Full Quality Criteria (45 Checks)

Score each AGENTS.md root file against this checklist. Standard: the file helps an agent execute correctly with minimal context.

## Contents

- Scoring
- A. Commands and execution readiness (12 checks)
- B. Gotchas and repeated mistakes (10 checks)
- C. Conventions and decision boundaries (8 checks)
- D. Signal-to-noise and bloat control (8 checks)
- E. Currency and validation (7 checks)
- Grade mapping
- Automatic fails

## Scoring

- `Yes` = 1, `No` = 0, `N/A` = excluded from the denominator
- Grade uses `earned / applicable`
- **Target:** >= 91% of applicable points (grade A)

## A. Commands and execution readiness (12)

1. Working `dev` command (or equivalent local run)
2. Working `test` command
3. Working `build` command
4. Working `lint` and/or `typecheck` command
5. Deploy/release command when applicable
6. Migration/seed/db command when applicable
7. Commands are copy-paste ready (no placeholders)
8. Commands match the package manager and scripts
9. Required env bootstrap steps (incl. secondary runtimes like Python venvs)
10. Where to run commands (root/workspace)
11. A command for targeted test/debug iteration
12. No duplicate or conflicting command variants

## B. Gotchas and repeated mistakes (10)

13. At least one high-frequency failure mode
14. Gotchas are project-specific, not generic
15. Gotchas include corrective action (what to do instead)
16. Gotchas include trigger context (when the rule applies)
17. Captures at least one issue discovered from PR/review feedback
18. Ordering/dependency gotchas where order matters
19. Data/env gotchas where setup mistakes cause failures
20. Avoids vague advice like "be careful" or "follow patterns"
21. Separates universal rules from edge-case rules
22. Removes gotchas that no longer happen

## C. Conventions and decision boundaries (8)

23. States conventions that materially change implementation choices
24. States naming/path conventions when CI/tooling depends on them
25. States test strategy conventions (unit/e2e boundaries) when relevant
26. Uses `@import` or links for non-universal detail instead of inlining in root
27. Marks scope boundaries: monorepo root vs workspace files
28. Avoids restating defaults agents already know
29. Uses precise language (specific verbs, explicit conditions)
30. Emphasis markers (IMPORTANT, NEVER, YOU MUST) used sparingly on critical rules agents skip

## D. Signal-to-noise and bloat control (8)

31. Root file concise for repo complexity (60-150 lines for active app repos)
32. No full framework documentation pasted inline
33. No copy-pasted full templates
34. No exhaustive file tree or "every file" inventory
35. No long architecture deep dives in root file
36. Links to detail files for non-universal guidance
37. No duplicate guidance across sections
38. Each section passes the litmus test: removing it would cause mistakes

## E. Currency and validation (7)

39. Referenced file paths exist
40. Referenced tools/dependencies are still in use
41. Commands have been run (or limitations documented when run isn't possible)
42. Removed references to deleted folders/APIs
43. Version-sensitive guidance is date/version scoped where needed
44. Clear maintenance loop (how to keep the file current)
45. CLAUDE.local.md used for personal/gitignored overrides (not mixed into shared AGENTS.md)

## Grade mapping

Use `earned / applicable` percentage:

- A: >= 91%
- B: 76% to < 91%
- C: 59% to < 76%
- D: 39% to < 59%
- F: < 39%

Example: `36/40 = 90%` -> Grade `B`.

## Automatic fails

Mark grade `F` regardless of score if any hold:

- Commands are mostly broken/stale
- Instructions are primarily generic advice
- File is dominated by copied docs/templates rather than executable guidance
