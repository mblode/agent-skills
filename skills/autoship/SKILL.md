---
name: autoship
description: Runs a changesets npm release through the version PR, CI publish, and registry verification. Use when asked to "release this package", "autoship", "merge Version Packages", or diagnose a release that did not publish. For feature PRs use pr-creator or pr-babysitter.
compatibility: Requires a Git checkout, GitHub CLI authentication, Node.js, and a changesets-based npm release workflow.
---

# Autoship

Drive an npm release end to end: changeset, fix loop, push, CI watch, Version Packages PR merge, publish watch, npm verification.

- **IS:** the full release pipeline for an existing changesets-based npm package, from writing the changeset file to confirming the new version on the registry, plus diagnosing why a release run did not version or publish.
- **IS NOT:** opening a feature PR (use `pr-creator`), monitoring a feature PR for reviews, conflicts, or CI (use `pr-babysitter`), general build or type fixes outside a release flow, or scaffolding a new package (use `scaffold-cli`, which hands off to autoship for the first release).

## The Release Loop

One workflow, two successive runs. Misreading it as two workflows causes most autoship mistakes.

1. Push a commit containing a pending `.changeset/*.md` file to the default branch.
2. The release workflow runs: `changesets/action` sees pending changesets, runs `changeset version` in CI, and opens or updates a PR on branch `changeset-release/<default-branch>` (title "Version Packages", suffixed "(next)" in pre mode) carrying the `package.json` bump and `CHANGELOG.md` entry.
3. Merge that PR once every check is green.
4. The same workflow runs again. With no pending changesets left, the action runs its publish script (`changeset publish`), which publishes to npm and, by default, pushes the git tag and creates a GitHub release.

The local job ends at "push the changeset file". CI owns versioning and publishing; anything versioned locally breaks the loop (see Gotchas).

The action has two live majors with different input names: `@v1` takes `publish:`, `@v2` takes `publish-script:`. Read the `uses:` line before diagnosing a run that versioned but never published.

## Reference Files

| File | Read when |
|------|-----------|
| `references/changeset-and-commit.md` | Steps 1-3: writing the changeset file, discovering and running gates non-interactively, staging the release commit |
| `references/ci-polling.md` | Step 4 and Step 5 watches: the Monitor tool, the commit watch script, failure classification, the Changeset Status check |
| `references/version-pr-and-publish.md` | Once CI is green: workflow shape, finding and merging the Version Packages PR, the publish run, npm verification, publish failure diagnosis |
| `evals/evals.json` | Only when changing this skill; never loads during a release |

## Intent Map

| Intent | Steps | Notes |
|--------|-------|-------|
| Full autoship (ship / release / publish) | 1-5 | Default entry point. End to end through publish, no intermediate prompts |
| Create changeset only | 1 | Stage a release without pushing |
| Fix gates and push | 1-3 | Changeset, fixes, commit, no CI watch |
| Watch CI only | 4-5 | Changeset already pushed |
| Merge Version Packages PR only | 4b-5 | CI already green; merges once preconditions hold |
| Fix gates only | 2 | Inside a release flow; no changeset needed |
| Diagnose a release that did not publish | read-only | Failure Recovery table plus `references/version-pr-and-publish.md` |

"Ship it" with no npm release context routes to `pr-creator`.

## Safety Tiers

Invoking autoship is standing consent for the full release flow. Do not pause mid-flow to re-confirm; gate risky steps on objective preconditions instead.

- **Green (execute directly):** reads: CI and PR state, `npm view`, pending changesets, `package.json` scripts, git history and status.
- **Yellow (announce in one line, then execute):** writing changeset files, running lint/type/test/format fixers, `git add/commit/push`, starting watches, and merging the Version Packages PR once its identity is confirmed and every check passes.
- **Red (explicit confirmation required):** force-pushes, history rewrites, repository settings changes, any destructive git operation.

## Workflow

Copy this checklist to track progress:

```text
Autoship progress:
- [ ] Step 1: Create changeset (default patch)
- [ ] Step 2: Fix lint, types, tests, format
- [ ] Step 3: Commit and push the changeset (never `changeset version` locally)
- [ ] Step 4a: Watch CI on the pushed commit
- [ ] Step 4b: Find and merge the Version Packages PR
- [ ] Step 5: Watch the publish run, verify on npm
```

### Step 1: Create changeset (default patch)

- Load `references/changeset-and-commit.md`.
- Inspect pending changesets and their package coverage. Reuse those covering the requested release; add one only for uncovered changes. Ask only if unrelated pending releases make the publish scope ambiguous.
- Default to `patch`; `minor` or `major` only on explicit user instruction.
- Write the file directly (the interactive prompt needs a TTY); the summary is user-facing changelog text inferred from `git log --oneline -10`.
- `npx changeset status` validates the file: a misspelled package name fails here instead of in CI.

### Step 2: Fix lint, types, tests, format

- Discover commands from `package.json` scripts (`check`, `lint`, `typecheck`, `test`, `format`, `fix`); in non-npm repos check `Makefile`, `Cargo.toml`, `pyproject.toml`, `go.mod`.
- Run lint, typecheck, test, format. After any code change, re-run from the first gate: a type fix routinely breaks lint, and a lint autofix can break a test.
- Scope auto-fixers to changed files where supported, then check `git status`: broad `fix`/`format` scripts reformat files outside the change (MDX is a frequent casualty). Undo only fixer changes introduced by this run, preserving pre-existing edits in the same files.
- Cap the loop at 5 fix iterations per gate, reporting the remaining error count each pass; then stop and report (Failure Recovery).

### Step 3: Commit and push the changeset

- Stage the changeset file and in-scope fixes by explicit path; sweep `git status --porcelain` for hook artifacts (a root `schema.gql` is a known one) before committing.
- Commit (`chore: add <type> changeset for <package>`) and push.
- The pushed commit must still contain `.changeset/*.md`. Running `changeset version` locally consumes it (see Gotchas).

### Step 4a: Watch CI on the pushed commit

- Load `references/ci-polling.md`.
- Start the commit watch on the pushed SHA. It emits a line per state change and one `TERMINAL:` line when every run for that commit (CI and the release workflow) completes. An idle first poll is normal; runs take time to queue.
- On failure, classify from `gh run view <id> --log-failed`: flaky or infra gets `gh run rerun <id> --failed` (max 3); a real failure gets a fix, commit, push, and a fresh watch on the new SHA.

### Step 4b: Find and merge the Version Packages PR

- Load `references/version-pr-and-publish.md`.
- Find the open PR whose head is `changeset-release/<default-branch>`. If absent, run the PR-wait watch (10-minute cap).
- Merge only when all three hold:
  - Head branch is `changeset-release/<default-branch>` (title normally "Version Packages", but `pr-title` can rename it). Never merge any other PR.
  - `gh pr checks <n> --json name,bucket` reports `bucket: pass` for every check.
  - `gh pr view <n> --json mergeable` reports `MERGEABLE` (on `UNKNOWN`, wait and re-query).
- Announce ("Merging Version Packages PR #N: <package>@<version>"), then `gh pr merge <n> --squash --delete-branch`, or the merge method the repo allows. Any failed precondition: stop and report, never merge.

### Step 5: Watch the publish run, verify on npm

- Merging triggers the same workflow again; with no pending changesets it publishes.
- Take the merge SHA (`gh pr view <n> --json mergeCommit --jq .mergeCommit.oid`) and run the commit watch on it.
- On failure: read the log, match it against the publish failure table in `references/version-pr-and-publish.md`, report, and stop. Publish failures are never retried blind; every cause on that table needs a config or settings change.
- On success: `npm view <package>@<version> version` must print the merged version, and `npm view <package> dist-tags` must show `latest` pointing at it (unless pre mode). Stop remaining watches and report both outputs; they are the completion evidence.

## Failure Recovery

| Failure point | Response |
|---------------|----------|
| Gate still failing after 5 iterations | Stop. Report the gate, remaining error count, last error output |
| CI fails after the changeset push | Flaky or infra: `gh run rerun <id> --failed`, max 3. Real: fix, push, fresh watch |
| "Changeset Status" check fails | No changeset: Step 1. Consumed (a local `changeset version` ran): revert the bump and `CHANGELOG.md` edit, re-add the changeset file. Rerunning cannot fix consumed state |
| Version Packages PR absent after 10 minutes | `gh run view` the release run: "not permitted to create or approve pull requests" means the repo setting is off (Gotchas). Otherwise confirm pending changesets on the default branch and a `changesets/action` step in `.github/workflows/` |
| Release run green but nothing published | `uses: changesets/action@v2` with the v1 `publish:` input, or no publish input at all. Check the run's "Unexpected input(s)" warning |
| Merge precondition fails | Stop and report. Never override failing checks or resolve conflicts in the bot PR |
| Publish run fails | Match the log against the publish failure table; report the fix; stop |

## Gotchas

- **Never run `npx changeset version` locally.** It consumes `.changeset/*.md`, so the pushed commit has no pending changeset, "Changeset Status" fails, and no Version Packages PR opens. Recovery is reverting the bump, not rerunning CI.
- Never run `npm publish` directly. It bypasses changesets, skips the changelog and tag, and leaves the Version Packages PR describing an already-shipped version, which then fails with "You cannot publish over the previously published versions".
- Never hand-edit `CHANGELOG.md` or the `package.json` `version`. CI generates both in the Version Packages PR; local edits make the bot PR `CONFLICTING`.
- `changesets/action@v2` renamed every input (`publish` to `publish-script`, `version` to `version-script`, `title` to `pr-title`, `commit` to `commit-message`, `branch` to `pr-base-branch`). The old names are ignored with only a warning, so a `@v2` workflow still using `publish:` opens the Version PR and then completes green without publishing anything.
- `setup-node` with `node-version: 22` ships npm 10.9.x. Trusted publishing needs npm 11.5.1 or later, so `changeset publish` fails `ENEEDAUTH` even with `id-token: write` set. Use Node 24 or add `npm install -g npm@latest` before publishing.
- A workflow authenticating with an `NPM_TOKEN` secret that holds a classic token fails `ENEEDAUTH`: npm revoked every classic token on 9 December 2025. Move to trusted publishing rather than minting a new token; write-capable granular tokens expire within 90 days.
- npm does not validate a trusted publisher when you save it. A workflow filename that differs from `.github/workflows/<file>.yml` by case or extension surfaces only at publish time, as `ENEEDAUTH`.
- New personal repos block Actions from opening PRs. The release run fails with "GitHub Actions is not permitted to create or approve pull requests" and no Version PR appears. Fix: Settings, Actions, General, "Allow GitHub Actions to create and approve pull requests" (an org-level setting can override it). Red tier: report it, do not change settings unasked.
- `gh pr list --json headBranch` and `gh pr checks --json conclusion` are invalid fields and error. Use `headRefName` and `bucket`.
- The Monitor tool's default `timeout_ms` is 300000 (5 minutes). A CI run that outlasts it kills the watch with a timeout that looks like silence. Pass `timeout_ms: 3600000` for CI watches.
- Poll every 30 seconds or slower. Faster loops burn the GitHub API rate limit (`gh api rate_limit --jq .resources.core.remaining`) and stall the flow mid-release.
- `git add -A` commits pre-commit-hook artifacts and fixer churn into the release commit. Stage explicit paths.
- `major` without explicit instruction signals breaking changes to every consumer. Default to `patch`.

## Related Skills

- `scaffold-cli`: scaffolds a new TypeScript package with changesets and OIDC publishing, then hands off to autoship for its first release.
- `pr-creator`: opens feature PRs. Autoship merges only the bot-opened Version Packages PR.
- `pr-babysitter`: watches feature PRs (reviews, conflicts, CI). Autoship watches release CI only; never babysit a Version Packages PR autoship is driving.
