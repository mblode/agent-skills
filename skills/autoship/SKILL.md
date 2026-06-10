---
name: autoship
description: Automates end-to-end npm releases of existing packages using changesets. Creates a changeset (default patch), runs an iterative fix loop over lint, typecheck, tests, and format, commits and pushes, watches CI with background Monitor scripts, merges the Version Packages PR opened by changesets/action once every check is green, then watches the publish run and verifies the new version on npm. Use when the user asks to ship a release, "release this", "publish this package", "autoship", "cut a release", "fix compiler errors", "fix type errors", "make it compile", or "fix the build". For opening a feature PR (including "ship it" meaning a PR) use pr-creator; for watching a feature PR's CI, reviews, and conflicts use pr-babysitter; for creating a brand-new package use scaffold-cli, which hands back to autoship for the first release.
---

# Autoship

Drive an npm release end to end: changeset, fix loop, push, CI watch, Version Packages PR merge, publish watch, npm verification.

- **IS:** the full release pipeline for an existing changesets-based npm package, from writing the changeset file to confirming the new version on the registry.
- **IS NOT:** opening a feature PR (use `pr-creator`), monitoring a feature PR for reviews, conflicts, or CI (use `pr-babysitter`), or scaffolding a new package (use `scaffold-cli`, which hands off to autoship for the first release).

## The Release Loop

One workflow, two successive runs. Misreading this as two different workflows is the root cause of most autoship mistakes.

1. You push a commit containing a pending `.changeset/*.md` file to the default branch.
2. The release workflow runs. `changesets/action` sees pending changesets, runs `changeset version` inside CI, and opens or updates a PR titled "Version Packages" on branch `changeset-release/main` containing the `package.json` bump and `CHANGELOG.md` updates.
3. You merge that PR once every check is green.
4. The same workflow runs again. With no pending changesets left, the action executes its `publish:` script (`changeset publish`), which pushes tags and publishes to npm.

The local job ends at "push the changeset file". CI owns versioning and publishing; anything versioned locally breaks the loop (see Gotchas).

## Reference Files

| File | Read when |
|------|-----------|
| `references/changeset-and-commit.md` | Creating a changeset, running quality gates, or committing and pushing (Steps 1-3) |
| `references/ci-polling.md` | Writing Monitor watch scripts, diagnosing CI failures, or handling the Changeset Status check (Steps 4-5) |
| `references/version-pr-and-publish.md` | Finding and merging the Version Packages PR, or watching the publish run (Steps 4-5) |

## Intent Map

| Intent | Steps | Notes |
|--------|-------|-------|
| Full autoship (ship / release / publish) | 1 through 5 | Default entry point. Runs end-to-end through publish without intermediate prompts |
| Create changeset only | Step 1 | Stage a release without pushing |
| Fix quality and push | Steps 1-2 | Changeset + fixes + commit, no CI watch |
| Watch CI only | Steps 3-5 | When changes are already pushed |
| Merge version PR only | Steps 4-5 | When CI already passed. Auto-merges once preconditions are met |
| Fix compiler only | Step 2 | When the build is broken; no changeset needed |

## Safety Tiers

Invoking autoship is standing consent for the full release flow. Do not pause mid-flow for re-confirmation; gate risky steps with objective preconditions instead.

- **Green (execute directly):** `gh run list`, `gh run view`, `gh pr list`, `gh pr checks`, `npm view`, reading CI status, listing changesets, reading `package.json` scripts, `git log`, `git status`.
- **Yellow (announce, then execute):** writing changeset files, running lint/typecheck/test/format fixers, `git add/commit/push`, starting `Monitor` background watches, and `gh pr merge` of the Version Packages PR once its identity is confirmed and all checks are green.
- **Red (explicit confirmation required):** force-pushing, history rewrites, and any destructive git operation.

## Workflow

Copy this checklist to track progress:

```text
Autoship progress:
- [ ] Step 1: Create changeset (default patch)
- [ ] Step 2: Fix lint, types, tests, format
- [ ] Step 3: Commit + push changeset (do NOT run `changeset version`)
- [ ] Step 4: Monitor CI and find/merge the Version Packages PR
- [ ] Step 5: Watch the publish run, verify on npm
```

### Step 1: Create changeset (default patch)

- Load `references/changeset-and-commit.md`.
- Check for existing pending changesets: `ls .changeset/*.md 2>/dev/null | grep -v README.md`. If any exist, ask the user whether to add another or skip.
- Default to `patch`. Only use `minor` or `major` on explicit user instruction.
- Write the changeset file directly (non-interactive agent mode); infer the summary from `git log --oneline -10`.

### Step 2: Fix lint, types, tests, format

- Load `references/changeset-and-commit.md` (skip the changeset sections when running the "Fix compiler only" intent).
- Discover commands from `package.json` scripts (`build`, `typecheck`, `tsc`, `type-check`, `lint`, `test`, `format`); also check for `Makefile`, `Cargo.toml`, `pyproject.toml`, `go.mod` in non-npm repos.
- Run gates in order: lint, typecheck, test, format.
- Scope auto-fixers (`lint --fix`, `format`) to changed files where the tool supports it. After any fixer runs, check `git status`: broad fix scripts routinely reformat files outside your change (MDX is a frequent casualty). Revert unrelated churn with `git restore <path>` before continuing.
- On gate failure, parse output for file, line, code, and message. Fix syntax errors first, then type errors, then lint errors. Fix one root cause at a time when errors cascade.
- Retry each gate up to 5 fix iterations, reporting the remaining error count each pass. If a gate still fails after 5, stop and report (see Failure Recovery).

### Step 3: Commit + push changeset

- Stage the changeset file and in-scope fixes only: `git add <paths>`, never `git add -A`. Sweep `git status --porcelain` for stray generated artifacts (e.g. a root `schema.gql` left by a pre-commit hook) and unrelated fixer churn before committing.
- Commit (`chore: add <type> changeset for <package>`) and push.
- Do NOT run `npx changeset version` locally. The pushed commit must still contain the pending `.changeset/*.md` file so CI's "Changeset Status" check passes and the Version Packages PR opens.

### Step 4: Monitor CI and find/merge the Version Packages PR

- Load `references/ci-polling.md` and `references/version-pr-and-publish.md`.
- Start a `Monitor` watch scoped to the pushed commit SHA that emits a line on each state change and a `TERMINAL:` line when every workflow run completes. Do not stop on an idle first poll; runs take time to queue.
- On failure, classify via logs (`gh run view <id> --log-failed`): flaky/infra failures get `gh run rerun <id> --failed` up to 3 times; real failures get a fix, commit, push, and a fresh Monitor.
- Once green, find the open PR titled "Version Packages" on branch `changeset-release/main`. If absent, start a second Monitor that polls for it, capped at 10 minutes (the bot needs time).
- Verify ALL merge preconditions:
  - PR title is exactly "Version Packages" OR head branch is `changeset-release/main`. Never merge any other PR.
  - Every check reports `bucket: pass` via `gh pr checks <number> --json name,bucket`.
  - `gh pr view <number> --json mergeable` reports `MERGEABLE` (not `CONFLICTING` or `UNKNOWN`; on `UNKNOWN`, wait briefly and re-query).
- Announce in one line ("Merging Version Packages PR #N: <package>@<version>"), then `gh pr merge <number> --squash --delete-branch`. No confirmation pause; invoking autoship is the consent.
- If any precondition fails, stop and report. Do not merge.

### Step 5: Watch the publish run, verify on npm

- Load `references/version-pr-and-publish.md` and `references/ci-polling.md`.
- Merging the Version Packages PR triggers the SAME workflow again; with no pending changesets it publishes (see The Release Loop).
- Identify the workflow file in `.github/workflows/` (commonly `release.yml`, `npm-publish.yml`, or `publish.yml`) and start a `Monitor` watch on its latest run on the default branch.
- On failure: report with logs and stop. Never auto-retry a publish failure; causes are real (npm auth, registry, OIDC/provenance, tag conflict).
- On success: verify with `npm view <package> version` against the merged `package.json`, stop all remaining Monitors, and report the published version. The `npm view` output is the completion evidence; do not report success without it.

## Failure Recovery

| Failure point | Response |
|---------------|----------|
| Quality gate still failing after 5 fix iterations | Stop. Report the gate, remaining error count, and last error output |
| CI fails after the changeset push | Classify per `references/ci-polling.md`: flaky/infra gets `gh run rerun <id> --failed` (max 3), real failures get fix + push + fresh Monitor |
| "Changeset Status" check fails | Missing changeset: add one (Step 1). Consumed changeset (a local `changeset version` ran): revert the version bump and `CHANGELOG.md` edit, re-add the changeset file. Rerunning CI cannot fix consumed state |
| Version Packages PR absent after 10 minutes | Check pending changesets exist on the default branch, the workflow file exists in `.github/workflows/`, and the action actually ran (`gh run list`) |
| Merge precondition fails | Stop and report. Never override failing checks or resolve conflicts inside the bot PR |
| Publish run fails | Never auto-retry. Report with logs; typical causes are npm auth, OIDC/provenance, tag conflict, registry outage |

## Gotchas

- **Never run `npx changeset version` locally.** It consumes the `.changeset/*.md` file, so the pushed commit has no pending changeset, the "Changeset Status" check fails, and no Version Packages PR opens. Recovery means reverting the bump, not rerunning CI.
- Never run `npm publish` directly. It bypasses changesets, skips the changelog and git tags, and leaves the Version Packages PR describing a version that already shipped.
- Do not hand-edit `CHANGELOG.md` or the `package.json` `version` field. CI generates both inside the Version Packages PR; local edits create conflicts that make the bot PR unmergeable.
- `gh pr list --json headBranch` and `gh pr checks --json conclusion` are invalid fields and error out. Use `headRefName` and `bucket` respectively.
- Do not stop CI monitoring because the first poll shows no runs; workflows take time to queue. Stop only on a `TERMINAL:` line from the Monitor script.
- Keep Monitor `sleep` at 30 seconds or longer. Tighter polling burns GitHub API rate limit (`gh api rate_limit`) and can throttle the rest of the flow.
- Letting a broad `format`/`fix` script ride into the release commit ships unrelated reformatting. Scope fixers to changed files and `git restore` everything else first.
- `git add -A` silently commits pre-commit-hook artifacts (e.g. a root `schema.gql`). Stage explicit paths only.
- Selecting `major` without explicit user instruction signals breaking changes to every consumer of the package. Default to `patch`.

## Related Skills

- `scaffold-cli`: scaffolds a new TypeScript package and hands off to autoship for its first release.
- `pr-creator`: opens feature PRs. Autoship only ever merges the bot-opened Version Packages PR.
- `pr-babysitter`: watches feature PRs (reviews, conflicts, CI). Autoship watches release CI only.
