---
name: autoship
description: Automates npm release workflows using changesets. Creates a changeset (default patch), fixes lint/test/typecheck/format issues, commits and pushes, watches CI via the Monitor tool, finds and merges the Version Packages PR opened by changesets/action, and watches the release workflow to completion. Use when the user asks to ship, release, publish, autoship, or cut a release for an npm package.
---

# Autoship

Automate npm releases with a changeset -> fix -> push -> monitor -> merge -> publish workflow.

## Reference Files

| File | Read when |
|------|-----------|
| `references/changeset-and-commit.md` | Creating a changeset, fixing quality issues, or committing and pushing |
| `references/ci-polling.md` | Watching CI with the Monitor tool, diagnosing failures, or handling retries |
| `references/version-pr-and-publish.md` | Searching for the Version Packages PR, merging it, or watching the release workflow |

## Intent Map

| Intent | Steps | Notes |
|--------|-------|-------|
| Full autoship (ship / release / publish) | 1 through 5 | Default entry point. Runs end-to-end through publish without intermediate prompts |
| Create changeset only | Step 1 | Stage a release without pushing |
| Fix quality and push | Steps 1-2 | Changeset + fixes + commit, no CI watch |
| Watch CI only | Steps 3-5 | When changes are already pushed |
| Merge version PR only | Steps 4-5 | When CI already passed. Auto-merges once preconditions are met |

## Safety Tiers

Invoking autoship is standing consent for the full release flow. Do not pause mid-flow for re-confirmation; gate risky steps with objective preconditions instead.

- `GREEN -- execute directly:` `gh run list`, `gh run view`, `gh pr list`, `gh pr checks`, `npm view`, reading CI status, listing changesets, reading `package.json` scripts, `git log`, `git status`.
- `YELLOW -- announce then execute:` `npm run changeset` / writing changeset files, running lint/typecheck/test/format fixers, `git add/commit/push`, starting `Monitor` background watches, and `gh pr merge` of the Version Packages PR opened by `changesets/action` once its identity is confirmed and all checks are green.
- `RED -- explicit confirmation required:` force-pushing, history rewrites, and any destructive git operations.

## Workflow

Copy this checklist to track progress:

```text
Autoship progress:
- [ ] Step 1: Create changeset (default patch)
- [ ] Step 2: Fix lint, types, tests, format
- [ ] Step 3: Commit + push changeset (do NOT run `changeset version`)
- [ ] Step 4: Monitor CI and find/merge the Version Packages PR
- [ ] Step 5: Watch release workflow to completion
```

### Step 1: Create changeset (default patch)

- Load `references/changeset-and-commit.md`.
- Check for existing pending changesets: `ls .changeset/*.md 2>/dev/null | grep -v README.md`.
- If changesets exist, ask the user whether to create an additional one or skip.
- Default to `patch` bump type. Only use `minor` or `major` when the user explicitly requests it.
- Write the changeset file directly for non-interactive agent mode.
- Infer the changeset summary from recent commits with `git log --oneline -10`.

### Step 2: Fix lint, types, tests, format

- Load `references/changeset-and-commit.md`.
- Discover available scripts from `package.json`.
- Run quality gates in order: lint, typecheck, test, format.
- If any gate fails, attempt to auto-fix (e.g., `--fix`, `prettier --write`).
- Retry each gate up to 3 times after applying fixes.
- If a gate still fails after retries, stop and report to the user.

### Step 3: Commit + push changeset

- Stage the changeset file and any auto-fixes, commit, and push.
- Do NOT run `npx changeset version` locally. CI's `changesets/action` runs it inside the Version Packages PR.
- The pushed commit must contain the pending `.changeset/*.md` file so CI's "Changeset Status" check passes.

### Step 4: Monitor CI and find/merge the Version Packages PR

- Load `references/ci-polling.md` and `references/version-pr-and-publish.md`.
- After pushing, start a `Monitor` watch that emits a line each time the latest workflow run on the current branch reaches a terminal state (`completed`). The agent reacts to each emitted line; no `/loop` re-prompt needed.
- Do not stop prematurely. A single idle snapshot does not mean CI is done — keep the monitor running until at least one workflow run reports `completed`.
- On failure: read logs, classify as flaky or real. Retry flaky failures up to 3 times with `gh run rerun <id> --failed`. For real failures: fix, commit, push, restart the monitor.
- Once CI is green, search for an open PR titled "Version Packages" or on branch `changeset-release/main`. If not found immediately, start a second `Monitor` watch that polls for the PR for up to 10 minutes (the changesets bot needs time).
- Before merging, verify ALL of the following preconditions:
  - PR title is exactly "Version Packages" OR head branch is `changeset-release/main` (do not merge any other PR).
  - Every check on the PR shows `state: completed` and `conclusion: success`.
  - PR is mergeable (`mergeable: MERGEABLE`, not `CONFLICTING` or `UNKNOWN`).
- Announce in one short line ("Merging Version Packages PR #N — <package>@<version>"), then merge with `gh pr merge <number> --squash --delete-branch`. Do not pause for confirmation; invoking autoship is the consent.
- If any precondition fails, stop and report — do not merge.

### Step 5: Watch the publish run to completion

- Load `references/version-pr-and-publish.md` and `references/ci-polling.md`.
- Merging the Version Packages PR triggers the SAME release workflow again. Because no pending changesets remain, `changesets/action` now executes the `publish:` script (`changeset publish`).
- Identify the workflow file (commonly `release.yml`, `npm-publish.yml`, or `publish.yml`) in `.github/workflows/`.
- Start a `Monitor` watch on that workflow's latest run on `main`, emitting a line when it reaches a terminal state.
- Terminal conditions: workflow succeeds (report published version) or fails (report with logs).
- Do NOT auto-retry publish failures. These typically need human investigation (npm auth, registry, OIDC/provenance, tag conflict).
- On success, verify with `npm view <package> version` and stop any remaining `Monitor` watches.

## Anti-patterns

- Running `npm publish` directly instead of using the changesets workflow.
- Merging the Version Packages PR before its CI checks pass.
- Stopping CI monitoring after the first poll shows no runs (workflows take time to queue).
- Creating a changeset with `major` bump without explicit user instruction.
- Force-pushing to the default branch.
- Auto-retrying publish failures (these are typically real auth, registry, OIDC/provenance, or tag-conflict issues).
- Polling tighter than ~30s, which wastes GitHub API rate limit. Monitor scripts should `sleep 30` or longer between `gh` calls.
- **Never run `npx changeset version` locally.** CI's `changesets/action` runs it inside the Version Packages PR. Running it locally consumes the changeset file, the pushed commit has no pending changeset, CI's "Changeset Status" check fails, and no Version Packages PR is opened.
- Hand-editing `CHANGELOG.md` or `package.json` `version` as part of autoship — CI generates both.
