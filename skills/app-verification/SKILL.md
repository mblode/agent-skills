---
name: app-verification
description: Builds and maintains a repo's own verification harness (verify CLI, doctor, worktree isolation, feature map, seed data) and a reproduce-first bug handoff. Use when asked to "build a verification harness", "add a doctor command", "prove every feature still works", or "reproduce this bug report".
compatibility: Create mode needs a shell and the target repo's own toolchain (whatever starts, seeds, and drives that app). Native and desktop proof paths need a computer-use tool as the last-resort method. Runs only when called by name; see Invocation below.
---

# App Verification

Builds, inside a product's own repository, the harness every agent uses to run that product and prove a claim about it: a verify CLI, a doctor command, an isolated instance per worktree, a feature map written from the user's point of view, seed data and test accounts, and a reproduce-first bug handoff. The harness lives in the target repo, not in this skill; this skill scaffolds and then maintains it, so every agent that opens that repo runs the app the same way instead of writing a throwaway script each session.

- **IS:** scaffolding a project-local verification harness (Create mode) and running or extending one that already exists (Maintain mode): the verify CLI's contract, the feature-map format, the proof record, per-worktree isolation and seed data, the cheapest-method ladder up to computer use, and the bug-handoff format.
- **IS NOT:** ad hoc browser probes against a fixed catalogue of UI rules (`ui-verification`; this skill's `verify` can call those probes as one check among several), repo-wide module boundaries and enforcement tooling (`codebase-architecture`; this skill's CI wiring follows its enforcement order), pruning an existing test suite (`test-audit`), or a plan for one feature (`planning`).

## Invocation

Create mode edits the target repo and Maintain mode drives a real running instance of it; both run only when named, not from a loose "check the app" prompt a lighter skill might serve better. On a host that supports it, add `disable-model-invocation: true` to the installed copy's frontmatter. It is a host extension, not a portable field, so it is not shipped in this source (`agent-skills-creator`'s `references/format-specification.md` explains why). Hosts with an equivalent explicit-invocation setting should apply it the same way.

## Contents

- [Modes](#modes)
- [The harness contract](#the-harness-contract)
- [Create mode](#create-mode)
- [Maintain mode](#maintain-mode)
- [References](#references)
- [Gotchas](#gotchas)
- [Related skills](#related-skills)
- [Credit](#credit)

## Modes

Pick by what exists, and say which you picked.

| Mode | You are here when | Output |
|---|---|---|
| **Create** | The repo has no verify CLI, doctor command, or feature map yet | A working harness, proven once end to end against a real feature, handed off to Maintain mode |
| **Maintain** | A harness already exists and needs to run this session, gain a feature, or investigate a bug report | A `clean` / `changed` / `blocked` outcome, or a reproduce-first bug handoff |

Copy this to track progress:

```text
App verification progress:
- [ ] Mode chosen and stated (Create / Maintain)
- [ ] doctor run first, read-only, before any drive
- [ ] Isolation confirmed: own port, own database, own browser profile; refused (not fell back to) the main instance
- [ ] Every path in scope checked or named as a skip with a reason
- [ ] Native/desktop paths, if any, verified with computer use as the last-resort method, not the first
- [ ] Outcome stated: clean / changed / blocked, or a reproduce-first handoff
```

## The harness contract

Both modes build toward the same three commands, kept inside a skill folder in the target repo (for example `.claude/skills/verify-<app>/` or that host's equivalent project-skill location) so the commands live at one path every session finds the same way.

| Command | Does | Must |
|---|---|---|
| `doctor` | One read-only pass answering "is this instance worth driving": toolchain, isolation, ports, database, migrations, seed, build freshness, and whichever driver (browser, computer-use) the harness needs | Changes nothing. Exits non-zero on any failure, each failure line naming the exact fix. Prints `blocked by <id>` for a check whose dependency already failed instead of a cascade of unrelated-looking failures. Offers `--json` for a caller that branches on the result |
| `seed` | Loads fixed test accounts and demo data | Idempotent: safe to run twice, safe against a database that already has the seed. Refuses a non-local or main-instance database rather than seeding it |
| `verify` | Runs the checks the feature map lists for the change, cheapest method first, and writes a proof record of what ran, what it covered, what it skipped, and why | Every path a feature lists gets a check or a named skip. Exits non-zero on a failed check or a changed source file no feature owns |

`doctor` and `verify` are separate commands: one is read-only triage, the other drives and reports. Merging them hides the read-only fast check behind the slow one every time.

## Create mode

`references/create-mode.md`. Interview the repo (surface, run, drive, observe, isolate), scaffold `doctor`, `seed`, `verify` and the feature map per the contract above, wire isolation before writing the first feature file, seed the top three to five features, then prove the generated harness end to end before calling it done. A harness nobody has run is a draft, not a deliverable.

## Maintain mode

`references/maintain-mode.md`. Run `doctor` first, every session, before the first drive and after any failed one. Pick one outcome and say which: `clean` (nothing needed changing), `changed` (one PR or commit of proven corrections to the harness itself, never to product code), or `blocked` (name exactly what blocked it). A maintenance run that finds a real product bug reports it; it does not quietly patch around it inside the harness.

Two things this mode owns that a lighter probe skill does not: **scoped proof** (every listed path checked or skipped with a reason, recorded in the proof file; `references/maintain-mode.md`) and the **reproduce-first bug handoff**, whose first line is exactly `Reproduced`, `Reproduced but already fixed on main` or `Could not reproduce` (`references/bug-handoff.md`).

## References

Load only when the condition applies.

| Reference | Mode | Read when |
|---|---|---|
| [references/create-mode.md](references/create-mode.md) | Create | Bootstrapping a harness where none exists, or reshaping `doctor` or `verify` |
| [references/maintain-mode.md](references/maintain-mode.md) | Maintain | Running or extending an existing harness, reading or writing the proof record, or auditing the harness for drift |
| [references/feature-map-format.md](references/feature-map-format.md) | Both | Writing or reading a feature file, renaming a feature id, or building the map's completeness check |
| [references/verification-ladder.md](references/verification-ladder.md) | Both | Choosing a method for a path, marking a path `manual`, or deciding whether a native/desktop path needs computer use |
| [references/worktree-isolation.md](references/worktree-isolation.md) | Both | Setting up or checking port, database, env-file, and browser-profile isolation, or seeding test accounts and a sign-in shortcut |
| [references/bug-handoff.md](references/bug-handoff.md) | Maintain | Investigating a bug report |

## Gotchas

- A dev-only sign-in shortcut or a fixed test-account secret is a production backdoor the moment it ships enabled; gate it and verify the guard per `references/worktree-isolation.md` before adding one.
- `verify --fast` (cli checks only) is a development convenience, never a merge gate on its own; a run that skipped every browser and computer-use check is not the same proof as a full one, and the proof record says which mode ran.
- Two feature maps drift the moment a second one exists. Keep one canonical map per app; if a lighter probe skill also tracks routes or components, point at this map rather than growing a parallel one.

## Related skills

- `ui-verification`: scoped browser probes against a fixed UI rule catalogue, one finding at a time. This skill's `verify` can call those probes for the paths they cover; it does not replace them for a rule-by-rule audit.
- `codebase-architecture`: repo-wide module boundaries, CI guardrails, and the enforcement order this skill's own CI wiring follows.
- `test-audit`: suite-wide pruning of a durable test suite, a different asset from the feature map here. Gating a new test in a diff is `tidy`.
- `planning`: a plan for one feature; a new feature's plan is where its eventual feature file starts.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a verification run.

## Credit

Builds on Lauren Tan's pstack `create-verification-skill` and `maintain-verification-skill` (MIT): the interview-then-generate method, the outcome-based maintenance loop, and the reproduce-first handoff are hers. This skill generalizes that method past one company's conventions and adds a machine-checkable proof contract. Credit them; this is not a copy of either file.
