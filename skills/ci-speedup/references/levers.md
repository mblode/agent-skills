# Lever Catalogue

Grouped by the class of time each one removes. For each lever: what must be true, the gain to expect, and how it has failed. Pick by gain on the critical path measured in Step 1, never by how modern the lever sounds.

## Contents

- Gating
- Setup
- Execution
- Toolchain
- Deploy stage
- Cost accounting
- Sources

## Gating

**Change detection compares against the last verified commit.** On the default branch, `github.event.before` may be a push that was cancelled out of the queue and never checked. Compare against the head of the newest successful run of the workflow on the branch; anything else falls back to the full suite.

**Path filters keep the default branch whole.** Before merging a filter, walk the default-branch run where none of the filtered paths changed: the deploy and every required check must still report, or the merge queue waits forever. Never gate a repo-wide or required step, and never swap a native path filter for a hand-rolled changed-files check, which sees less.

**Decide without a working tree.** A gating job that only needs the diff can use `fetch-depth: 1` plus a fetch of the base SHA, or no checkout when the decision comes from the API. Linear took theirs from 26 to 8 seconds.

**Checkout scope and resilience.** `fetch-depth: 1` is usually right; jobs that diff fetch the base commit, not full history. A sparse blobless checkout (`filter: blob:none` plus `sparse-checkout`) took Linear's slowest change-detection run from 138 to 37 seconds. `GIT_HTTP_LOW_SPEED_LIMIT=1000` and `GIT_HTTP_LOW_SPEED_TIME=30` abort a stalled transfer after 30 seconds so a retry can run instead of hanging to the job timeout.

**Cache writes off the merge path.** `actions/cache` saves in the post-job phase, so a job on the chain that saves a cache finishes later than one that only restores. Save from a job off the chain (default-branch-only, or the shortest shard) and restore everywhere; Linear took 42 seconds per API pull request this way. Turbo and Nx remote caches write on the chain too; check the write is cheap.

**Cancel superseded pull-request runs only.** `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. With `true` everywhere a default-branch push cancels the previous deploy mid-rollout.

**Inline trivial matrix jobs.** A job whose body is "read a file, emit a matrix" costs a runner allocation (10 to 30 seconds) before its consumers start. Fold it into a step of the first real job when the consumer is one job.

## Setup

**Batch the small checks, shard the large ones.** Seven two-minute jobs each spending 100 seconds on setup finish no sooner than one batched job; one serial job running lint, typecheck and eight minutes of tests has a chain equal to their sum. One `static` job for everything that finishes inside its own setup time, shards for the suites that dominate, and the predicted chain is setup plus the slowest shard. Workflow steps are sequential, so run the batched checks concurrently (`turbo run lint check-types --concurrency=4`, or `&` with `wait`).

**Dependency install.** Time three shapes on the runner: a plain install with the package manager's download cache (`actions/setup-node` with `cache: npm`), a whole-`node_modules` cache keyed on the lockfile hash, and a workspace-filtered install (`npm ci --workspace=<app> --include-workspace-root`, pnpm `--filter`). A fresh pnpm install at 7.5 seconds beat Linear's cache restore at 28; npm's extract is heavier, so the cache often wins there. A filtered install breaks when a task runner later reaches a workspace that was not installed.

**Service boot.** Start only the services the suite connects to. For local Supabase, a stack using the database and Auth needs `db`, `kong`, and `gotrue`: `supabase start -x studio,postgres-meta,edge-runtime,realtime,imgproxy,mailpit,postgrest`, after checking nothing calls PostgREST (`supabase.from(...)` in application code, as opposed to Drizzle's `.from`). Keep `storage-api` when the config declares buckets. Excluding containers saves their pulls, not the boot; the SKILL.md gotchas carry the numbers and the `--workdir` trap.

**Database schema.** Replaying every migration into a fresh database costs seconds per migration per container; a generated schema snapshot restores in one or two. Keep the replay in one place (the merge-DAG check, or one integration job) so a broken migration still fails somewhere.

**Browser install.** Cache the Playwright browser directory on the lockfile hash and install only OS dependencies on a hit. The dependency step still costs about 15 seconds; a runner image that has them, or a container job on the Playwright image, removes it.

**Base image.** Preinstalling runtime, database client, and browser dependencies in a container image removes 7 to 20 seconds per job, once the job count makes an image worth maintaining.

## Execution

**Shard across jobs.** `vitest run --shard=1/2`, `playwright test --shard=1/2`, or a task-runner filter per workspace. Gain is the suite time divided by shards, minus one setup per shard; shard the suites whose duration exceeds the setup tax by a wide margin and put everything else in one. A step that also runs migrations or seeds cannot be sharded as it stands (every shard replays them, or races the others on one database); move the migration into a step the shards `need`.

**Shared module registry.** Vitest `isolate: false` keeps one module registry per worker across files, so the module graph is imported once. Linear's largest single saving (about 17 percent of monthly runner time; slowest shard from 300 to 379 seconds down to about 195). Measure the ceiling first with `vitest run --no-isolate` on the whole suite (a 222-file jsdom suite: 2:56 to 1:01, 31 files failing), then apply as a second Vitest project. Keep isolated the files that register cross-file state, not the ones that fail: `vi.mock` and `vi.doMock`, fake timers, `vi.stubGlobal` and `vi.stubEnv`. Eligibility is an opt-in comment per file plus its teardown (explicit, needs every author to know it) or a mechanical scan in the config that isolates any file matching those calls (self-maintaining). The split only pays once the mocking half is small: 122 of 222 isolated reached 2:31, because that half still boots per file. The gain waits on leak-safe mocks (restore in `afterEach`, or inject the dependency) and on the instruction file making the shared project the default for new tests.

**Lighter environment.** When the `environment` figure rivals `tests`, the suite boots jsdom for files that never touch the DOM. When DOM files are the minority, make `node` the default and opt them in; otherwise `// @vitest-environment node` on the logic-only files. Let the suite pick the set: tag every candidate, run, untag the ones that fail at import (11 of 79 in one suite, for modules reading `window` at load).

**Coverage only where it is read.** Instrumentation lands in `transform` and `collect` on every file. Collect on the default branch or a nightly job and keep the pull request run bare.

**Contention inside one job.** A task runner that fans every workspace's `test` script into one job runs twenty Vitest processes, each spawning `cpus - 1` workers, on four cores; a 2:56 suite took 6:35 there. Split the heavy suites into their own jobs, or set the runner's concurrency and give each suite `--maxWorkers`.

**Balancing shards by duration.** Vitest and Playwright shard by file count. A custom sequencer can balance by recorded duration; Linear tried it and the gain did not pay for the complexity. Split the long files instead: a shard is only as fast as its longest file, and files over a few hundred tests serialize one worker. Linear went from 4 to 8 shards only after this made the shards balance.

**Remote task cache.** Turbo or Nx remote caching turns a hit into a network fetch, a disk write, and a read by the next task, so on a hosted runner a fully cached mid-sized TypeScript monorepo lands at one to two minutes, not seconds. It pays for build outputs consumed downstream, less for test tasks whose only output is a pass. Without it, every task in CI is a miss and `turbo run test` is only a parallel runner.

**Playwright workers.** `workers: 1` in CI is a correctness choice when specs share a database. Raise it only with per-worker fixtures, and measure `fullyParallel` on the real API before trusting it.

## Toolchain

**Faster runners.** Hosted GitHub runners are four slow vCPUs on shared disks. Third-party runners (Blacksmith, Depot, Namespace, RWX, BuildJet, or self-hosted) run the same YAML on faster CPUs and NVMe; Linear measured 34 percent across the pipeline and 52 percent on `tsc`. It is a spend, so it is the user's call, made on one run of the unchanged pipeline on each. Measure after the split and setup work, because a faster machine shortens every job and hides which one was the problem.

**Native TypeScript.** `tsgo` (`@typescript/native-preview`) cut Linear's median type-check by 73 percent. It does not support `baseUrl`, some `paths` shapes, `moduleResolution: node10` (usually inherited or defaulted rather than written in the tsconfig it fails on), or every `tsc -b` layout; check each tsconfig and keep `tsc` for the ones it refuses. The gain lands on the chain only when type-checking is on it.

**Lint without the type graph.** Rules that build the program are the expensive ones. Oxlint and Biome run syntax-only rules in seconds; type-aware rules stay in a separate, sharded, or default-branch-only job.

**Formatter scope.** `oxfmt --check .` or `prettier --check .` walks the whole tree. Check only files changed against the base on pull requests and the whole tree on the default branch.

## Deploy Stage

**Rolling deploys queue, never cancel.** A cancelled `flyctl deploy` or `kubectl rollout` leaves the app half-rolled. Deploy jobs get their own concurrency group with `cancel-in-progress: false`; a rollback workflow shares the group with cancellation on so it pre-empts.

**Build once.** Order the Dockerfile so `COPY` of lockfiles and manifests precedes the install, keep sources out of that layer, and give the package manager a named cache mount. Across an internal fleet of Buildkite pipelines this was the largest measured lever: 13:35 per feature-branch build where it landed with change gating, 1:38 alone. Beyond the two cache traps in the SKILL.md gotchas:

- `cache-to` on a registry needs the `docker-container` buildx driver; the default `docker` driver ignores it without a warning.
- Moving a `COPY --from=builder` above a source `COPY` with an overlapping destination changes the image silently. Diff the image, not only the build time.
- `compression=zstd,compression-level=1` on the cache exporter is a hypothesis: A/B it cold and warm against separate refs, and never set `force-compression=true`.
- A Dockerfile or workflow that a template or pipeline library generates is edited in the generator; a hand edit to the output is reverted by the next generation.

**CDK deploys.** `cdk deploy --concurrency N` deploys independent stacks in parallel, with two or more stacks, capped around 5 by CloudFormation rate limits. `--method=direct` skips the changeset on stages where nobody reads it, measured at 3:20 per default-branch build. Neither applies to `--all` or wildcard stack arguments, and neither takes effect when the workflow line calls a wrapper script that owns the real command.

**Health checks as a job.** Twenty seconds of `curl --retry` in its own job costs a runner allocation. Fold it into the deploy job's last step.

## What Comes Next

Once push-to-green sits around five minutes, the bottleneck moves to the stages that do not shard: deploy, rollback, and human review. Say so in the ledger rather than chasing the last minute out of tests. Bazel and content-addressed builds (RWX, Dagger) get compiled languages to seconds, but for a JavaScript monorepo the people who did those conversions point back at `tsgo`, syntax-only linting, and setup work; note it as not taken, with that reason.

## Cost Accounting

Wall-clock and runner minutes move independently; the ledger writes both:

- Splitting one 10-minute job into a 4-minute static job and three 5-minute shards takes the chain from 10 to 5 minutes and runner minutes from 10 to 19.
- Excluding containers and caching browsers lowers both.
- `isolate: false` lowers both.

On a public repository with hosted runners, minutes are free and wall-clock is the only number. On a private one, or paid third-party runners, say what the extra minutes cost per month before choosing shards over shared state.

## Sources

The Linear numbers come from their published CI write-up. The Docker, CDK, migration-under-shards, path-filter, verification, and attribution rules come from an internal Buildkite optimizer's playbooks and nine weeks of its savings reports. Left behind from it: retry playbooks (reliability, `pr-babysitter`), host-specific queue and plugin playbooks, and the TypeScript upgrade ladder (a migration, not a lever).
