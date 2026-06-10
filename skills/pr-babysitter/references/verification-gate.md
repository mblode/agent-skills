# Verification Gate

The checks that must pass before any commit the monitor pushes, plus the stray-artifact sweep that runs before commit. Replaces the soft "run lint/test if available": pushing red work or stray files wastes a whole poll cycle.

## Contents

- [When the gate runs](#when-the-gate-runs)
- [Detect available checks](#detect-available-checks)
- [Run order and scope](#run-order-and-scope)
- [Stray-artifact sweep](#stray-artifact-sweep)
- [Pre-commit hooks that emit artifacts](#pre-commit-hooks-that-emit-artifacts)
- [Gate failure handling](#gate-failure-handling)

## When the gate runs

Run the gate after applying a fix (CI fix in Phase 3, or a review-comment fix in triage) and **before** the commit/push for that fix. If the gate fails, fix and re-run; do not push until it is green. This is local verification; CI is the backstop, not the first line of defence.

## Detect available checks

Read the project's task runner and run only the checks that exist. Do not assume a fixed set of script names.

```bash
# npm/yarn/pnpm projects: read the scripts block
cat package.json | jq -r '.scripts | keys[]' 2>/dev/null
```

Map common names (a project may use any subset):

| Check       | Common script names                          |
| ----------- | -------------------------------------------- |
| lint        | `lint`, `lint:fix`, `eslint`, `oxlint`       |
| type-check  | `typecheck`, `type-check`, `tsc`, `check`    |
| test        | `test`, `test:unit`, `vitest`, `jest`        |
| dead code   | `knip`                                       |

Also handle non-npm runners: `turbo run <task>`, `nx run <task>`, or `make <target>`. If none of the checks exist, say so and skip the gate rather than inventing commands.

## Run order and scope

Run in increasing cost order; stop and fix on the first failure.

1. **type-check**: fastest signal on a fix. Scope to changed files only where the tooling supports it; otherwise run the project script.
2. **lint**: scope to changed files (`eslint <files>`, `oxlint <files>`) when possible.
3. **test**: run the project test script. Scope to affected tests where a watch/affected mode exists; otherwise run the full suite.
4. **knip**: run last (project-wide by design). See the `knip` entry in `ci-platforms.md` for handling failures.

**All present checks must pass before committing.** A type-check failure may be a stale-dependency issue, not a code bug; check the stale-dependency branch in `ci-platforms.md` before treating it as a code error.

## Stray-artifact sweep

Pre-commit hooks and build/check steps can dirty the working tree with files that are **not** part of the intended fix. The canonical case is a root-level `schema.gql` (or similar generated output) emitted by a hook. Committing these pollutes the PR and trips reviewers.

After running checks and hooks, inspect the tree:

```bash
git status --porcelain
```

For each untracked or modified file, decide:

- **Intended**: the file is part of the fix, or a tracked generated file the change is supposed to update. Keep it.
- **Stray**: a generated artifact the fix did not intend to touch (root `schema.gql`, stray build output, an unrelated file a broad formatter rewrote). Revert or remove it before staging:

```bash
git restore <stray-tracked-file>     # revert an unintended modification
rm <stray-untracked-file>            # remove an unintended new file (e.g. root schema.gql)
```

Stage only the files belonging to the fix: prefer `git add <paths>` over `git add -A` so stray files never get committed in the first place.

## Pre-commit hooks that emit artifacts

A hook can dirty the tree *during* the commit, after your sweep. After committing, re-check:

```bash
git status --porcelain
```

If the commit left new stray files, strip them and amend (only safe pre-push, on the monitor's own commit):

```bash
git restore --staged . && rm <stray-files>
git commit --amend --no-edit
```

Never amend a commit that has already been pushed and may be on a teammate's machine.

## Gate failure handling

- **Lint/type/test failure on the fix**: read the error, fix, re-run the gate. Do not push.
- **Failure unrelated to the fix** (a flaky test, a pre-existing type error elsewhere): note it; do not expand scope to fix unrelated breakage inside a comment-triage commit. If it blocks the gate, surface it to the user rather than silently pushing past it.
- **Gate can't run** (no scripts, missing deps): say so in the notification; rely on CI and flag that local verification was unavailable.
