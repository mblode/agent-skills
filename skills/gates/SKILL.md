---
name: gates
description: Installs the brakes that make agent PRs safe to merge (hooks, required CI checks including the container build, PR size limits, stop-on-red-main) and checks that tests, evals, and scorers can actually fail. Use when asked to "add pre-commit hooks", "agents open PRs without running tests", "main keeps breaking", "check the check", or "can this test fail". For CI speed use ci-speedup; for AGENTS.md use agents-md.
compatibility: Hooks assume git, lefthook, and the repository's toolchain. Required-check changes need the GitHub CLI or equivalent.
---

# Gates

Put an exit code where there was prose, then watch it go red. The failures that cost most were the ones where nothing fired: main went red and merging carried on, a container never built on the PR, a suite was green only because it was cached.

- **IS:** hooks and required CI checks, PR size and review-capacity rules, and auditing whether a test, eval, scorer, or dashboard can fail.
- **IS NOT:** CI speed (`ci-speedup`), AGENTS.md (`agents-md`), module boundary guardrails (`codebase-architecture`), dispatching agents (`backlog`), the PR itself (`pr-creator`, `pr-babysitter`), reviewing a diff (`tidy`).

## Done

- **Install:** hooks and CI jobs committed on the working branch, each shown failing on a deliberate violation and then passing. Branch protection or ruleset changes are written up for the user to apply.
- **Check the check:** a table of each suspect check, the recipe run, the result, and the fix or gate.

A gate nobody has seen fail is a claim. Every verification claim names its evidence level: cached check, fresh tests, build (including the container), or runtime startup.

| File | Read when |
|------|-----------|
| `references/hooks.md` | Installing hooks, the CI job that repeats them, the boot check, and the container build on the PR |
| `references/review-capacity.md` | PR size gate, WIP, stop-on-red-main, auto-approval rules, and the Risk and Proof block |
| `references/check-the-check.md` | Auditing a test, eval, scorer, or dashboard, or before trusting a green check |

Pre-approved: editing hook and workflow files on the working branch, running the suite cold in a scratch clone, and committing a deliberate violation in a scratch branch to watch a gate fail. Ask first: branch protection, rulesets, required checks, auto-merge, paid runners, and deleting a test instead of fixing it.

## Gotchas

- Agents open PRs without running tests, lint, or typecheck even when told to. A hook or required check fires; a sentence does not.
- `--no-verify` and fresh sandboxes skip hooks. CI repeats every hook as a required check, and `prepare` installs hooks on clone.
- A cached `turbo run test` was green while `--force` failed on an env singleton evaluated at import. Run uncached at least nightly.
- An e2e suite was forced green with a test-only HTTP header; agents have put conditionals inside tests. Both are grep-able.
- A quality scorer checked only for 20 characters; an eval with `failureMode: 'skip'` hid 100% failures. Add a must-fail fixture.
- `turbo run`, `lerna run`, and `npm run -ws --if-present` silently skip workspaces without the script.

Maintenance only: `evals/evals.json` holds scenarios and routing prompts for anyone changing this skill.
