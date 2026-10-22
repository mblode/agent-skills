# Lanes and Check Placement

Where each check runs, what it blocks, and how the wiring proves it. Which checks a repository should have at all is a separate question; this file starts once the check exists.

## Contents

- The lanes
- Placing a check
- How common checks classify
- One required check
- Change detection
- Concurrency
- Gates that pass while checking nothing
- Lane conformance test
- Author pre-push proof
- Test selection
- Gotchas

## The Lanes

| Lane | Runs on | Blocks |
|---|---|---|
| Author pre-push | affected scope vs origin/main | the push (local) |
| PR gate | exact head SHA | merge |
| Merge path | merged tree (queue) or nothing | merge |
| Post-merge main | merge commit, runs coalesced | deploy, and drives auto-revert |
| Pre-deploy | the exact artifact | promotion |
| Nightly | schedule | nothing; a red nightly is not a merge verdict |

A `pull_request` run tests the head merged into the base as it was at push time, and its status attaches to the head SHA. That evidence ages as main moves: it is exact for checks that read only the diff and stale for checks whose result depends on the rest of the tree. The placement rule exists to say which is which.

## Placing a Check

Ask in order, and stop at the first answer that places it:

1. **Irreversible if it ships?** Destructive migrations, infrastructure, leaked secrets. Block before merge, human tier.
2. **Merge-breakable?** Can its result change when this PR merges with other PRs? If yes, it must run on the merged tree, either in the queue or post-merge with revert. If no, it runs at the PR head only and is never re-run in a queue.
3. **Deterministic?** Only deterministic checks may drive auto-revert. Nondeterministic checks go under the flake policy and never decide a revert.
4. **Cost against catch rate?** Every blocking minute on the merge path adds to T and so to utilisation u = λ·T/60. Low-yield expensive checks move to post-merge or nightly: only 1.23% of test executions at Google found a breakage (Google TAP, 2017).

A fifth question catches a class people miss: **does the result change with time rather than code?** Vulnerability databases, license feeds and external API contracts turn red on a commit nobody touched. Run them nightly or on lockfile changes, never as a blocking PR check, or they fail unrelated PRs at random.

## How Common Checks Classify

| Check | Merge-breakable | Deterministic | Lane |
|---|---|---|---|
| Format, syntax-only lint of the diff | no | yes | pre-push, PR gate |
| Secrets scan of the PR's own commits | no | yes | pre-push, PR gate |
| LLM review, agent judges | no | no | PR gate, advisory |
| Typecheck, type-aware lint | yes | yes | PR gate + merge path; revert driver |
| Build, bundle, image build | yes | yes | PR gate + merge path; revert driver |
| Dependency-injection wiring, app boot | yes | yes | PR gate + merge path; revert driver |
| Dead code, unused exports, import cycles | yes | yes | PR gate + merge path; revert driver |
| Unit tests on shared code | yes | no, treat as flaky | PR gate + merge path; never a revert driver |
| Schema compatibility, migration order | yes | yes | PR gate + pre-merge guard, human tier |
| End-to-end, integration against services | yes | no | post-merge main, pre-deploy |
| Evals, benchmarks | yes | no | nightly or post-merge, advisory |
| Dependency audit, license | time-dependent | no | nightly, or advisory on a PR that changes the lockfile |

Dead code and cycles look diff-local but are not: PR A removes one caller of `x`, PR B removes the other, each head stays green, and the merge leaves `x` unused. Two PRs that each add one import edge can close a cycle the same way.

## One Required Check

Make a `ci-ok` job the only required check. It `needs` every job in the blocking set, the `changes` job included, and runs `if: always()` so it reports after a failure or a skip upstream. Skipped counts as pass; failed and cancelled count as fail. A required job that is itself skipped reports "Skipped", which GitHub treats as passing, so `ci-ok` must never carry an `if` that can be false.

```yaml
ci-ok:
  needs: [changes, static, typecheck, test]   # the blocking set only
  if: always()
  runs-on: ubuntu-latest
  steps:
    - if: contains(needs.*.result, 'failure') || contains(needs.*.result, 'cancelled')
      run: exit 1
```

- **Blocking set only.** Advisory jobs (LLM review, evals, coverage) report their own, unrequired status. An umbrella that waits on every job makes every job a blocker and puts the slowest advisory job on the merge path.
- **Separate statuses per shard.** Actions matrix jobs already report one check run each, and `needs.test.result` fails when any shard fails. When shards post commit statuses themselves (external CI, a script calling the statuses API), give each shard its own context: one shared context shows whichever shard finished last.
- **Same name on every event.** The queue looks for `ci-ok` on `merge_group` runs exactly as branch protection does on `pull_request` runs, so the job keeps its name and the workflow triggers on both. What differs per event is which jobs run beneath it.

## Change Detection

A `changes` job decides what runs; each work job `needs` it and skips through a job-level `if` on its outputs (`if: needs.changes.outputs.web == 'true'`). A job skipped by `if` still reports, so `ci-ok` turns green. When `changes` cannot decide, it runs everything.

The base it diffs against:

- **Pull request:** the merge base with the target branch.
- **Main push: the last green ancestor**, the head of the newest successful push run on main that is an ancestor of `HEAD`. Not `github.event.before` and not `HEAD~1`: one push can carry several merged PRs, and a coalesced or cancelled run left commits that nobody checked. Diffing against `HEAD~1` once skipped a non-tip PR's migration while the code that needed it shipped.
- **First push of a branch:** `github.event.before` is forty zeros. Treat it, and any base that is missing or not an ancestor, as "run everything".

```bash
base=$(gh run list --workflow ci.yml --branch main --event push --status success \
  --limit 1 --json headSha --jq '.[0].headSha // empty')
if [ -z "$base" ] || ! git fetch --quiet --depth=1 origin "$base" \
   || ! git merge-base --is-ancestor "$base" HEAD; then
  echo "all=true" >> "$GITHUB_OUTPUT"; exit 0
fi
git diff --name-only "$base" HEAD
```

The ancestor test needs enough history to reach `base`; fetch with a depth that covers a day of merges, or deepen until the test answers. Repo-wide checks (a whole-tree format check, the lane conformance test) stay ungated.

## Concurrency

```yaml
concurrency:
  group: ci-${{ github.event_name }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

- **PR runs:** cancel superseded runs. A new head voids the old one's evidence anyway.
- **Main runs:** coalesce, never cancel a started run. With `cancel-in-progress: false` GitHub keeps one running and the newest pending run per group, so a burst of merges is checked as one tree. The pending runs it drops carry no verdict, which is why culprit finding needs re-runs on coalesced commits.
- **Queue runs:** each merge group has its own ref, so the expression above gives every group its own group and nothing cancels it.
- **Deploys** get their own concurrency group, separate from every CI group.
- **Stalled runs.** A run whose jobs never got a runner can hold the main group for hours. Force-cancel a superseded run idle more than 15 minutes only when every unfinished job is still queued with no steps; never cancel a job that has started.

```bash
gh api "repos/{owner}/{repo}/actions/runs/$id/jobs" --jq \
  '[.jobs[] | select(.status != "completed")] | all(.status == "queued" and ((.steps // []) | length == 0))'
# true and superseded and idle > 15 min:
gh api -X POST "repos/{owner}/{repo}/actions/runs/$id/force-cancel"
```

## Gates That Pass While Checking Nothing

Each of these produced a green run that proved nothing:

- **Merge-base gates on a main push.** There `origin/main == HEAD`, so a gate that diffs against `origin/main` compares a commit with itself and finds no changes. Use the last green ancestor.
- **Merge-commit diffs.** `git log -p` prints no diff for merge commits; a scanner reading it misses everything a merge brought in. Use `git log -p --diff-merges=remerge`, or diff explicit SHAs.
- **Scanners that exit 0 on git errors.** A bad ref or shallow clone makes the scan read nothing and pass. Check the git step's exit status separately and fail when the scanned range is empty but the push was not.
- **Advisory jobs without their secret.** A fork or a rotated token makes the job skip its work and report success. Fail when the secret is missing on events where it should exist.
- **An `if` on a misspelled output.** `needs.changes.outputs.wbe` is always empty, so the job always skips and `ci-ok` stays green. Read two runs before merging a gate: one where the gated paths changed and the job ran, one where they did not and `ci-ok` and the deploy still reported.

## Lane Conformance Test

A test in the repository pins, per event (`pull_request`, `merge_group`, queue-branch push, main push, schedule), which jobs run and which block. It fails when a job joins a lane, leaves one, or `ci-ok` stops waiting on it. Keep the intended table as data:

```json
{ "typecheck": { "events": ["pull_request", "merge_group", "push:main"], "blocking": true },
  "llm-review": { "events": ["pull_request"], "blocking": false } }
```

The test parses the workflow files and asserts: every job appears in the table and every table entry in the workflow; `ci-ok.needs` equals the set marked blocking; each job's `if` matches the condition generated from its events. A job with no entry fails the build, so a new job is placed on purpose.

Teams that have been bitten by ordering bugs go one step further: model the CI control rules as facts plus invariants (optionally in TLA+), with a conformance test that the facts equal the real `if:` and `needs:`, and mutation tests that flip one fact and expect a failure. Invariants worth stating: no merge-breakable job is PR-only; only deterministic jobs feed auto-revert; every required check reports on every event that can merge; nothing deploys a commit whose `ci-ok` never ran. Each invariant maps to a real failure class: a concurrency group that keeps only the newest waiting run leaves main red with no alert, a revert can land after main is green, an unverified commit can deploy, and the all-zeros first-push base skips change detection.

## Author Pre-Push Proof

The cheapest lane: the author's machine runs the check and the affected tests against a fresh base before the push, so the PR gate mostly confirms.

```bash
git fetch --quiet origin main
pnpm --filter "...[origin/main]" run check
pnpm --filter "...[origin/main]" run test
```

`...[origin/main]` selects the packages changed since origin/main plus their dependents. Fetch first: a stale origin/main selects the wrong set and the proof is for a tree nobody will merge. The hook is advisory. Nothing on the merge path trusts it, because hooks are skipped with `--no-verify` and missing in fresh worktrees.

## Test Selection

Running fewer tests per change is how large monorepos keep the PR gate inside its budget:

- Google runs a subset at presubmit and the rest in batched postsubmit milestones; tests more than 10 dependency edges from a change hardly ever break, and files changed recently by three or more people break more often (Google TAP, 2017).
- Meta's predictive selection catches more than 99.9% of faulty changes (more than 95% of individual failures) while running about a third of the transitively dependent tests, doubling test infrastructure efficiency (Meta, 2018).

Start with path rules from the dependency graph (the pre-push filter above, or the task runner's affected graph). A learned or AI selector sits on top under four rules: it may only add tests to what the path rules chose, never remove them; it runs in shadow first, logging what it would have added against what later failed; it has a deadline, after which the path rules alone decide; and it sees the diff only after the secrets scan has passed. Whatever selection skips at the PR gate, the full suite still runs post-merge on main.

## Gotchas

- `ci-ok.needs` listing advisory jobs: every advisory step becomes a blocker and the slowest one sets merge latency.
- One commit-status context shared by parallel shards: it shows whichever shard finished last, so a red shard reads green.
- A workflow-level `paths:` or `paths-ignore:` filter on a required workflow: no run starts, and the required check stays pending forever. Gate jobs, not workflows.
- A job that `needs` a job skipped by `if` is skipped too, and skipped passes `ci-ok`. Give chained blocking jobs `if: ${{ !cancelled() && !failure() && <own condition> }}`.
- A merge-base gate on a main push: origin/main == HEAD, so it compares a commit with itself and passes.
- `git log -p` hides merge-commit diffs; a scanner reading it passes merges unread. Use `--diff-merges=remerge`.
- A scanner that exits 0 on a git error passes an empty scan.
- An advisory job whose secret is missing skips its work and reports success.
- Change detection diffing against `HEAD~1` on main: a non-tip PR's migration was skipped while the code that needed it shipped.
- A concurrency group that keeps only the newest waiting run: the dropped run carried the red report, and main stayed red with no alert. Alert from a listener on completed runs, not from a run that can be dropped.
- `github.event.before` of forty zeros on a first push: `git diff` fails or diffs nothing. Treat it as "run everything".
- A stalled run with no runner held the main concurrency group for hours; nothing behind it started.
- A whole-tree format check behind a code-paths filter: a docs-only PR skips it, a Markdown format error lands, and main turns red. Keep repo-wide checks ungated.
