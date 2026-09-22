# Release Mode

Drive a changesets npm release end to end: changeset file, gate fixes, push, CI watch, Version Packages PR merge, publish watch, registry check. Invoking the release is standing consent for the whole flow; SKILL.md's Authority section sets what still needs a question.

## Contents

- The release loop
- Intent map
- Step 1: Changeset file
- Step 2: Gates
- Step 3: Release commit
- Step 4: Watch CI, merge the Version Packages PR
- Step 5: Watch the publish, verify on npm
- Failure recovery
- The Changeset Status check
- Gotchas

## The release loop

One workflow, two successive runs. Misreading it as two workflows causes most release mistakes.

1. Push a commit containing a pending `.changeset/*.md` file to the default branch.
2. The release workflow runs: `changesets/action` sees pending changesets, runs `changeset version` in CI, and opens or updates a PR on branch `changeset-release/<default-branch>` (title "Version Packages", suffixed "(next)" in pre mode) carrying the `package.json` bump and `CHANGELOG.md` entry.
3. Merge that PR once every check is green.
4. The same workflow runs again. With no pending changesets left, the action runs its publish script (`changeset publish`), which publishes to npm and, by default, pushes the git tag and creates a GitHub release.

The local job ends at "push the changeset file". CI owns versioning and publishing; anything versioned locally breaks the loop.

The action has two live majors with different input names: `@v1` takes `publish:`, `@v2` takes `publish-script:`. Read the `uses:` line before diagnosing a run that versioned but never published.

## Intent map

| Intent | Steps | Notes |
|--------|-------|-------|
| Full release ("release", "publish", "ship it" in a changesets repo) | 1-5 | Default. End to end through publish, no intermediate prompts |
| Create changeset only | 1 | Stage a release without pushing |
| Fix gates and push | 1-3 | No CI watch |
| Watch CI only | 4-5 | Changeset already pushed |
| Merge Version Packages PR only | 4 (merge) - 5 | CI already green; merges once preconditions hold |
| Diagnose a release that did not publish | none; no writes | Failure recovery below, then the publish failure table in `references/version-pr-and-publish.md` |

## Step 1: Changeset file

- Inspect pending changesets and their package coverage. Reuse those covering the requested release; add one only for uncovered changes. Ask only if unrelated pending releases make the publish scope ambiguous.
- Default to `patch`. `minor` or `major` only on explicit instruction: `major` signals breaking changes to every consumer.
- `npx changeset` prompts for a TTY, so write the file directly. The summary ships verbatim in `CHANGELOG.md` and is the only thing consumers read about this version: write the user-facing change, inferred from `git log --oneline -10`, not the commit log.

```bash
ID=$(node -e "console.log(Math.random().toString(36).slice(2,10))")
cat > ".changeset/$ID.md" <<'EOF2'
---
"<package-name>": patch
---

<one or two sentences of user-facing change>
EOF2
npx changeset status   # read-only; errors on a package name not in the workspace
```

Quote the package name: a scoped name (`@scope/pkg`) is invalid YAML unquoted and the action fails on parse. `changeset status` catches a misspelled name here instead of a full CI round trip later.

## Step 2: Gates

Run the repository's lint, typecheck, test, and format commands, discovered from `package.json` scripts (`check`, `lint`, `typecheck`, `test`, `format`, `fix`) or the repo's task runner; `gates` owns which are required. After any code change, rerun from the first gate: a type fix routinely breaks lint, and a lint autofix can break a test.

- Scope auto-fixers to changed paths where supported. A broad `fix` or `format` script reformats files outside the change (MDX is a frequent casualty); undo only what this run introduced, preserving pre-existing edits in the same files.
- Prefer the quiet reporter (`vitest run --reporter=dot`); a full test dump is re-sent on every remaining turn.
- Five fix iterations per gate, reporting the remaining error count each pass, then stop and report.

## Step 3: Release commit

```bash
git status --porcelain            # everything listed must be yours
git add .changeset/<id>.md <fixed paths>
git commit -m "chore: add patch changeset for <package>"
git push
```

Hook output and fixer churn outside the change stay unstaged. The pushed commit must still contain `.changeset/*.md`.

## Step 4: Watch CI, merge the Version Packages PR

Run `scripts/watch-commit.sh <sha>` on the pushed SHA. Through the `Monitor` tool, pass `timeout_ms: 3600000`: the default of 300000 kills the watch after five minutes, before most CI runs finish, and the timeout reads like a quiet run. Without Monitor, run it as a background Bash command; the completion notification carries the `TERMINAL:` line. No `/loop` or cron: each tick wakes the agent whether or not anything changed. An idle first poll is normal while runs queue.

The watch is scoped to the commit, not the branch, so older pushes do not bleed in and it does not exit when the first of several parallel workflows finishes. The release workflow's own run on that push is included. Any conclusion other than `success` reports as failure so the logs get read.

On `TERMINAL: failure`, read `gh run view <id> --log-failed` and classify:

| Type | Indicators | Action |
|------|-----------|--------|
| Flaky or infrastructure | Intermittent, runner lost, network timeout, service unavailable | `gh run rerun <id> --failed`, fresh watch; at most 3 reruns, then report |
| Real failure | Consistent, tied to the change | Fix, commit, push, fresh watch on the new SHA |
| Release workflow failed on the changeset push | "not permitted to create or approve pull requests", or the action errored | Repo settings or workflow config, not code: failure recovery below |

On `TERMINAL: success`, find and merge the Version Packages PR per `references/version-pr-and-publish.md`: identity by head branch, every check `pass`, `MERGEABLE`, announce one line, merge.

## Step 5: Watch the publish, verify on npm

Merging triggers the same workflow again. Take the merge SHA (`gh pr view <n> --json mergeCommit --jq .mergeCommit.oid`) and run the commit watch on it. On failure, match the log against the publish failure table, report, and stop: every cause on that table needs a config or settings change, and a blind rerun after a partial monorepo publish can double-publish the packages that succeeded. On success, the two `npm view` outputs are the completion evidence. Stop any watch you started before reporting.

## Failure recovery

| Failure point | Response |
|---------------|----------|
| Gate still failing after 5 iterations | Stop. Report the gate, remaining error count, last error output |
| CI fails after the changeset push | Classify per Step 4 |
| "Changeset Status" check fails | No changeset: Step 1. Consumed by a local `changeset version`: revert the bump and the `CHANGELOG.md` edit, re-add the changeset file, push. Rerunning cannot fix state that is wrong at the commit |
| Version Packages PR absent after 10 minutes | `gh run view` the release run: "not permitted to create or approve pull requests" means the repo setting is off (Gotchas). Otherwise confirm pending changesets on the default branch and a `changesets/action` step in `.github/workflows/` |
| Release run green but nothing published | `changesets/action@v2` with the v1 `publish:` input, or no publish input at all. Check the run's "Unexpected input(s)" warning |
| Merge precondition fails | Stop and report. Never override failing checks or resolve conflicts in the bot PR; fix on the default branch and let the action regenerate it |
| Publish run fails | Match the publish failure table; report the fix; stop |

## The Changeset Status check

Changesets repos typically run `npx changeset status --since origin/<base>` on pull requests, failing a PR that changes publishable code without a pending `.changeset/*.md`. It needs `fetch-depth: 0` on checkout; a shallow clone makes `--since` fail on every PR. "Some packages have been changed but no changesets were found" means add one (or `npx changeset add --empty` when the change needs no release). Check this first when a release-related PR fails CI.

## Gotchas

- `npx changeset version` run locally consumes `.changeset/*.md`, so the pushed commit has no pending changeset, "Changeset Status" fails, and no Version Packages PR opens. Recovery is reverting the bump, not rerunning CI.
- `npm publish` run directly bypasses changesets, skips the changelog and tag, and leaves the Version Packages PR describing an already-shipped version, which then fails with "You cannot publish over the previously published versions".
- Hand edits to `CHANGELOG.md` or the `package.json` `version` make the bot PR `CONFLICTING`.
- New personal repos block Actions from opening PRs: the release run fails with "GitHub Actions is not permitted to create or approve pull requests" and no Version PR appears. The fix is Settings, Actions, General, "Allow GitHub Actions to create and approve pull requests" (an org setting can override it). Report it; do not change settings unasked.
- Poll every 30 seconds or slower. Faster loops burn the API rate limit (`gh api rate_limit --jq .resources.core.remaining`) and stall the flow mid-release.
