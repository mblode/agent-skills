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

Run after applying a fix (Phase 3 CI fix, or a triage review-comment fix) and **before** that fix's commit/push. On failure: fix, re-run, do not push until green. Local verification; CI is the backstop, not the first line of defence.

## Detect available checks

Read the project's task runner; run only checks that exist. Do not assume fixed script names.

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

Non-npm runners: `turbo run <task>`, `nx run <task>`, `make <target>`. If no checks exist, say so and skip the gate rather than inventing commands.

## Run order and scope

Run in increasing cost order; stop and fix on the first failure.

1. **type-check**: fastest signal on a fix. Scope to changed files where the tooling supports it, else run the project script.
2. **lint**: scope to changed files (`eslint <files>`, `oxlint <files>`) when possible.
3. **test**: run the project test script. Scope to affected tests where a watch/affected mode exists, else run the full suite.
4. **knip**: run last (project-wide by design). See the `knip` entry in `ci-platforms.md`.

**All present checks must pass before committing.** A type-check failure may be a stale-dependency issue, not a code bug; check the stale-dependency branch in `ci-platforms.md` first.

## Stray-artifact sweep

Pre-commit hooks and build/check steps can dirty the working tree with files **not** part of the intended fix (canonical case: a root-level `schema.gql` or similar generated output emitted by a hook). Committing these pollutes the PR and trips reviewers.

After checks and hooks, inspect the tree:

```bash
git status --porcelain
```

For each untracked or modified file, decide:

- **Intended**: part of the fix, or a tracked generated file the change is supposed to update. Keep it.
- **Stray**: a generated artifact the fix didn't intend to touch (root `schema.gql`, stray build output, a file a broad formatter rewrote). Revert or remove before staging:

```bash
git restore <stray-tracked-file>     # revert an unintended modification
rm <stray-untracked-file>            # remove an unintended new file (e.g. root schema.gql)
```

Stage only the fix's files: prefer `git add <paths>` over `git add -A` so stray files are never committed.

## Pre-commit hooks that emit artifacts

A hook can dirty the tree *during* the commit, after your sweep. Re-check after committing:

```bash
git status --porcelain
```

If the commit left stray files, strip and amend (only safe pre-push, on the monitor's own commit):

```bash
git restore --staged . && rm <stray-files>
git commit --amend --no-edit
```

Never amend a commit already pushed; it may be on a teammate's machine.

## Gate failure handling

- **Lint/type/test failure on the fix**: read the error, fix, re-run the gate. Do not push.
- **Failure unrelated to the fix** (flaky test, pre-existing type error elsewhere): note it; don't expand scope to fix unrelated breakage in a comment-triage commit. If it blocks the gate, surface it to the user instead of pushing past it.
- **Gate can't run** (no scripts, missing deps): say so in the notification; rely on CI and flag that local verification was unavailable.
