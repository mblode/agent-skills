# Verification Gate

Checks that must pass before any commit the monitor pushes, plus the stray-artifact sweep before commit. Pushing red work or stray files wastes a whole poll cycle.

## Contents

- [When the gate runs](#when-the-gate-runs)
- [Detect available checks](#detect-available-checks)
- [Run order and scope](#run-order-and-scope)
- [Stray-artifact sweep](#stray-artifact-sweep)
- [Pre-commit hooks that emit artifacts](#pre-commit-hooks-that-emit-artifacts)
- [Gate failure handling](#gate-failure-handling)

## When the gate runs

Apply the repository and user's check policy first, including any rule reserving tests for the final push. After a fix, run the permitted checks affected by it; a status poll, comment reply, or unchanged input does not require another run. Do not bypass a failing required gate.

Record the checked revision or diff, command, result, and relevant environment in the monitor's state file. Reuse that evidence until those inputs change. A new head still needs the checks required by branch protection; do not present an older result as a current-head pass.

## Detect available checks

Read the project's task runner; run only checks that exist. Do not assume fixed script names.

```bash
# npm/yarn/pnpm projects: read the scripts block
jq -r '.scripts | keys[]' package.json 2>/dev/null
```

Map common names (a project may use any subset):

| Check       | Common script names                          |
| ----------- | -------------------------------------------- |
| lint        | `lint`, `lint:fix`, `eslint`, `oxlint`       |
| type-check  | `typecheck`, `type-check`, `tsc`, `check`    |
| test        | `test`, `test:unit`, `vitest`, `jest`        |
| dead code   | `knip`                                       |

Non-npm runners: `turbo run <task>`, `nx run <task>`, `make <target>`. If no checks exist, say so and skip the gate rather than inventing commands.

## Run order and scope

Run in increasing cost order; stop and fix on the first failure.

1. **type-check**: fastest signal on a fix. Scope to changed files where the tooling supports it, else run the project script.
2. **lint**: scope to changed files (`eslint <files>`, `oxlint <files>`) when possible.
3. **test**: run affected tests at the point allowed by the repository and user's policy. Use the full suite only when required or when the affected scope cannot be established. Use a quiet reporter or capture a log and inspect the failure excerpt while preserving the original exit status.
4. **knip**: run when the fix affects dependency or export reachability, CI reported a knip failure, or the repository requires it. Handling is the `knip` item of the failure classification in `ci-platforms.md`.

**Required checks must pass at the repository's prescribed gate.** A type-check failure may be a stale-dependency issue, not a code bug; check the stale-dependency branch in `ci-platforms.md` first.

## Stray-artifact sweep

Pre-commit hooks and build/check steps can dirty the working tree with files **not** part of the intended fix (canonical case: a root-level `schema.gql` or similar generated output emitted by a hook). Committing these pollutes the PR and trips reviewers.

After checks and hooks, inspect the tree:

```bash
git status --porcelain
```

For each untracked or modified file, decide:

- **Intended**: part of the fix, or a tracked generated file the change is supposed to update. Keep it.
- **Stray**: generated output or formatter churn introduced by this run. Leave unrelated work unstaged. Remove only newly generated files whose ownership is established, and reverse only this run's hunks in pre-existing files. Do not restore whole files against HEAD.

Stage only the fix's files: `git add <paths>`, never `git add -A`, so stray files are never committed. The skill's own state and plan files under `.claude/pr-babysitter/` are always stray: they never go in the PR.

## Pre-commit hooks that emit artifacts

A hook can dirty the tree *during* the commit, after your sweep. Re-check after committing:

```bash
git status --porcelain
```

Inspect the commit diff separately from the working tree. Uncommitted artifacts do not require an amend. If the monitor's own unpushed commit accidentally included an artifact, stage only its correction and amend that commit. Preserve any pre-existing index entries; never clear the whole index as cleanup.

## Gate failure handling

- **Lint/type/test failure on the fix**: read the error and fix it. Repeat the affected check only as permitted by the repository and user's policy; do not push past a failing gate.
- **Failure unrelated to the fix** (flaky test, pre-existing type error elsewhere): note it; don't expand scope to fix unrelated breakage in a comment-triage commit. If it blocks the gate, surface it to the user instead of pushing past it.
- **Gate can't run** (no scripts, missing deps): say so in the notification; rely on CI and flag that local verification was unavailable.
