---
name: autoship
description: Automates npm release workflows using changesets. Creates a changeset (default patch), writes a changelog entry, fixes lint/test/typecheck/format issues, commits and pushes, monitors CI via scheduled tasks, finds and merges the Version Packages PR, and watches the npm-publish workflow to completion. Use when the user asks to ship, release, publish, autoship, or cut a release for an npm package.
---

# Autoship

Automate npm releases with a changeset -> fix -> push -> monitor -> merge -> publish workflow.

## Reference Files

| File | Read when |
|------|-----------|
| `references/changeset-and-commit.md` | Creating a changeset, writing a changelog, fixing quality issues, or committing and pushing |
| `references/ci-polling.md` | Setting up scheduled tasks to monitor CI, diagnosing failures, or handling retries |
| `references/version-pr-and-publish.md` | Searching for the Version Packages PR, merging it, or watching the npm-publish workflow |

## Intent Map

| Intent | Steps | Notes |
|--------|-------|-------|
| Full autoship (ship / release / publish) | 1 through 6 | Default entry point |
| Create changeset and changelog only | Steps 1-2 | Stage a release without pushing |
| Fix quality and push | Steps 1-3 | Changeset + fixes + commit, no CI watch |
| Watch CI only | Steps 4-6 | When changes are already pushed |
| Merge version PR only | Steps 5-6 | When CI already passed |

## Safety Tiers

- `GREEN -- execute directly:` `gh run list`, `gh run view`, `gh pr list`, `gh pr checks`, `npm view`, reading CI status, listing changesets, reading `package.json` scripts, `git log`, `git status`.
- `YELLOW -- announce then execute:` `npm run changeset` / writing changeset files, `npx changeset version`, running lint/typecheck/test/format fixers, `git add/commit/push`, creating `/loop` scheduled tasks.
- `RED -- explicit confirmation required:` `gh pr merge` (merging the Version Packages PR), force-pushing, any destructive git operations.

## Workflow

Copy this checklist to track progress:

```text
Autoship progress:
- [ ] Step 1: Create changeset (default patch)
- [ ] Step 2: Write changelog entry
- [ ] Step 3: Fix lint, types, tests, format and commit+push
- [ ] Step 4: Monitor CI with scheduled tasks
- [ ] Step 5: Find and merge Version Packages PR
- [ ] Step 6: Watch npm-publish workflow to completion
```

### Step 1: Create changeset (default patch)

- Load `references/changeset-and-commit.md`.
- Check for existing pending changesets: `ls .changeset/*.md 2>/dev/null | grep -v README.md`.
- If changesets exist, ask the user whether to create an additional one or skip.
- Default to `patch` bump type. Only use `minor` or `major` when the user explicitly requests it.
- Write the changeset file directly for non-interactive agent mode.
- Infer the changeset summary from recent commits with `git log --oneline -10`.

### Step 2: Write changelog entry

- Run `npx changeset version` to consume pending changesets and update `CHANGELOG.md` and `package.json` version fields.
- Review the generated changelog entry for accuracy.
- If the project does not use `changeset version` for changelog generation, manually prepend an entry to `CHANGELOG.md` following the existing format.
- The changelog entry should summarize user-facing changes, not internal refactors.

### Step 3: Fix lint, types, tests, format and commit+push

- Load `references/changeset-and-commit.md`.
- Discover available scripts from `package.json`.
- Run quality gates in order: lint, typecheck, test, format.
- If any gate fails, attempt to auto-fix (e.g., `--fix`, `prettier --write`).
- Retry each gate up to 3 times after applying fixes.
- If a gate still fails after retries, stop and report to the user.
- Stage all changes (changeset, changelog, version bumps, fixes), commit, and push.

### Step 4: Monitor CI with scheduled tasks

- Load `references/ci-polling.md`.
- After pushing, set up a `/loop` to poll CI status on the current branch.
- Use adaptive polling intervals: 1 minute initially, backing off to 2 then 5 minutes.
- Do not stop prematurely. A single idle snapshot does not mean CI is done.
- On failure: read logs, classify as flaky or real.
- Retry flaky failures up to 3 times with `gh run rerun <id> --failed`.
- For real failures: fix the code, commit, push, and restart monitoring.
- Terminal condition: all required checks pass.

### Step 5: Find and merge Version Packages PR

- Load `references/version-pr-and-publish.md`.
- Search for an open PR titled "Version Packages" or on branch `changeset-release/main`.
- If not found, poll with `/loop` for up to 10 minutes (the changesets bot needs time).
- Verify the PR's CI checks are all passing before merge.
- Merge with `gh pr merge <number> --squash --delete-branch` (RED tier -- confirm with user).

### Step 6: Watch npm-publish workflow to completion

- Load `references/version-pr-and-publish.md`.
- After the Version Packages PR is merged, the `npm-publish.yml` workflow triggers on the push to the default branch.
- Use `/loop` to poll for the npm-publish workflow run.
- Terminal conditions: workflow succeeds (report published version) or fails (report with logs).
- Do NOT auto-retry publish failures. These typically need human investigation.
- On success, verify with `npm view <package> version` and clean up scheduled tasks.

## Anti-patterns

- Running `npm publish` directly instead of using the changesets workflow.
- Merging the Version Packages PR before its CI checks pass.
- Stopping CI monitoring after the first poll shows no runs (workflows take time to queue).
- Creating a changeset with `major` bump without explicit user instruction.
- Force-pushing to the default branch.
- Auto-retrying npm-publish failures (these are typically real auth or registry issues).
- Polling without backoff, which wastes GitHub API rate limit.
- Skipping `changeset version` and writing changelog entries that don't match the changeset format.
- Running `changeset version` before the changeset file is committed (it consumes the changeset).
