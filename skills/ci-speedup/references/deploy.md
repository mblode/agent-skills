# Deploy at Merge Rate

When merges arrive faster than one deploy finishes, a serial deploy queue grows without bound. At 30 merges an hour and 20-minute deploys, ten merges land during each deploy, so a queue that ships them one at a time falls further behind every hour. The fix is not a faster deploy first; it is deploying fewer, newer builds.

## Supersede to the Newest Validated Build

Each deploy carries every merge since the last one. A queued build that a newer validated build already contains is skipped.

The gate runs inside the deploy lock (the deploy concurrency group), before migrations:

1. Read the build this job would deploy and the newest validated build waiting behind it.
2. If the newer build contains this one (this SHA is its ancestor) and the batch is safe (below), end this job as superseded.
3. Otherwise deploy this build.
4. If the gate cannot decide (an API read fails, a migration cannot be classified), deploy and warn. A skipped deploy is silent; a slow one is visible.

With superseding, the time from merge to live is at most about two deploy durations, whatever the merge rate.

Rules the gate never breaks:

- **Never cancel a running rollout.** Supersede only builds that have not started. Once a rollout starts, it finishes or the platform rolls it back.
- **Never deploy older after newer.** Before rolling out, check the SHA currently live is an ancestor of this SHA (`git merge-base --is-ancestor <live> <this>`). If this SHA is an ancestor of the live one, end the job: it is already deployed.

## Batch Only Additive Migrations

Superseding batches the skipped builds' migrations into the newer build. That is safe only when every added migration is purely additive: a new table, a nullable column, a column with a default, an index built without locking. The old code running during the rollout ignores what it does not know about.

A rename, drop, type change, or new constraint is not additive. The build that adds it deploys alone, in order, never superseded: the code before it and the code after it each expect a different schema. Classify migrations from the files added between the live SHA and this SHA, not from the newest build's file list.

## Cancel-Safe Deploys

Cancelling the CI job does not stop the cloud rollout. CloudFormation, ECS, Kubernetes, and most PaaS rollouts keep running after the job that started them is killed. The next deploy then either fails on a stack that is still updating or races the first one.

- Before starting, wait for the target to leave its in-progress state (`kubectl rollout status`, `aws cloudformation wait stack-update-complete`, or the platform's equivalent), with a timeout that fails loudly.
- Treat a rollout the job lost track of as still running until the platform says otherwise.

## Rolling Deploys Queue, Never Cancel

A cancelled `flyctl deploy` or `kubectl rollout` leaves the app half-rolled. Deploy jobs get their own concurrency group with `cancel-in-progress: false`.

A rollback workflow shares that group so it goes ahead of queued deploys. It still waits for a rollout already running, or uses the platform's own undo (`kubectl rollout undo`), rather than cancelling the job mid-rollout.

GitHub's concurrency group keeps one running and one pending run per group; a newer pending run replaces the older pending one. That is a supersede with no migration check. Either run the gate above inside the job, or accept that a skipped build's non-additive migration rides along with the next one.

## Deploy Only Verified Ancestors

Release and install only commits that passed CI on the default branch.

- Pick the newest ancestor of the branch tip whose push `ci-ok` is green. Commits after it have no verdict yet, or a red one.
- Resolve it once to a fixed SHA at the start of the deploy and pass that SHA to every later job and stage. Never re-resolve `main` mid-pipeline.
- Build the image once and promote the same digest (`image@sha256:...`) from staging to production. A rebuild or a moved tag is a different artifact from the one staging tested.
- Never deploy from the event's default-branch SHA. A scheduled or manually dispatched workflow's `github.sha`, or a checkout of `ref: main`, is the current tip, which may have merged a minute ago and never run CI.

One way to find the SHA:

```bash
gh run list --workflow ci.yml --branch main --event push --status success \
  --limit 20 --json headSha --jq '.[].headSha'
```

Take the first SHA that `git merge-base --is-ancestor <sha> origin/main` accepts. When `ci-ok` is a job inside a larger workflow, read that job's conclusion, not the run's.

## CDK Deploys

`cdk deploy --concurrency N` deploys independent stacks in parallel once there are two or more; CloudFormation API rate limits cap the useful value at a handful. `--method=direct` skips creating a changeset on stages where nobody reviews it. Confirm in the deploy log that the flags reached the `cdk` invocation and that stacks actually overlapped; a wrapper script or a stack list with dependencies between every stack leaves the deploy serial.

## Gotchas

- Cancelling the deploy job to free the lock: the cloud rollout keeps going, and the next deploy fails on a stack still in progress or races it.
- Deploying `github.sha` from a scheduled or dispatched workflow: ships the current tip of main, which may never have run CI.
- Superseding past a non-additive migration: old code runs against a schema it does not expect for the length of the rollout.
- Retagging `latest` between staging and production: production runs an artifact staging never tested.
