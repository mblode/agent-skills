# Lever Catalogue

Grouped by the class of time each one removes. For each lever: what must be true for it to apply, the gain to expect, and how it has failed. Pick by gain on the critical path measured in Step 1, never by how modern the lever sounds.

## Contents

- Gating
- Setup
- Execution
- Toolchain
- Deploy stage
- Cost accounting

## Gating

**Change detection compares against the last verified commit.** On the default branch, `github.event.before` is the previous push, which may have been cancelled out of the queue and never checked. Ask the API for the newest successful run of the workflow on the branch and compare against its head; anything else falls back to the full suite. Applies whenever a concurrency group queues default-branch pushes.

**Decide without a working tree.** A gating job that only needs the diff can use `fetch-depth: 1` plus a fetch of the base SHA, or no checkout at all when the decision comes from the API. Gain is 10 to 20 seconds at the head of every chain. Linear moved theirs from 26 to 8 seconds this way.

**Cancel superseded pull-request runs only.** `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`. With `true` everywhere, a default-branch push cancels the previous run's deploy while it is rolling.

**Inline trivial matrix jobs.** A job whose whole body is "read a file, emit a matrix" costs a runner allocation (10 to 30 seconds) before the jobs it feeds can start. Fold it into a step of the first real job when the matrix consumer is a single job.

## Setup

**Batch the small checks, shard the large ones.** Setup is paid per job, so seven two-minute jobs that each spend 100 seconds getting ready cost 12 setups' worth of runner time and finish no sooner than one batched job would. Conversely one serial job that runs lint, typecheck, and eight minutes of tests has a critical path equal to their sum. The split: one `static` job for everything that finishes inside its own setup time, and test shards for the suites that dominate. Predict the new chain as setup plus the slowest shard.

**Dependency install.** Time three shapes on the runner before choosing: a plain install with the package manager's download cache (`actions/setup-node` with `cache: npm`), a whole-`node_modules` cache keyed on the lockfile hash, and a workspace-filtered install (`npm ci --workspace=<app> --include-workspace-root`, pnpm `--filter`). Linear found a fresh pnpm install at 7.5 seconds beat restoring their cache at 28; npm's extract is heavier, so the cache often wins there. A filtered install shrinks by whatever the omitted workspaces bring (a Next.js app is hundreds of megabytes) but breaks when a task runner later reaches a workspace that was not installed.

**Service boot.** Local Supabase starts about a dozen containers; a test stack that uses the database and Auth needs `db`, `kong`, and `gotrue`. Exclude the rest with `supabase start -x studio,postgres-meta,edge-runtime,realtime,imgproxy,mailpit,postgrest` after checking that nothing calls PostgREST (`supabase.from(...)` in application code, as opposed to Drizzle's `.from`). Keep `storage-api` when the config declares buckets; the CLI seeds them after start and errors otherwise. Similar reasoning applies to any docker-compose stack: list the services the suite connects to and start those.

**Database schema.** Replaying every migration into a fresh database costs seconds per migration per container. A generated schema snapshot restores in one or two seconds. Keep the migration replay in one place (the merge-DAG check, or one integration job) so a broken migration still fails somewhere.

**Browser install.** Cache the Playwright browser directory on the lockfile hash and install only OS dependencies on a hit. The dependency step still costs about 15 seconds; a runner image that already has them (or a container job on the Playwright image) removes it.

**Base image.** Preinstalling the runtime, database client, and browser dependencies in a container image removes 7 to 20 seconds per job. Applies once the job count makes it worth maintaining an image.

## Execution

**Shard across jobs.** `vitest run --shard=1/2`, `playwright test --shard=1/2`, or a task-runner filter per workspace. Gain is the suite time divided by shards, minus one extra setup per shard. Shard the suites whose duration exceeds the setup tax by a wide margin; put everything else in one shard.

**Shared module registry.** Vitest `isolate: false` keeps one module registry per worker across files, so the module graph is imported once instead of per file. Linear's largest single saving (about 17 percent of monthly runner time; slowest shard from 300 to 379 seconds down to about 195). Measure the ceiling first with `vitest run --no-isolate` on the whole suite: a 222-file jsdom suite went from 2:56 to 1:01 that way, with 31 files failing. Then apply as a second Vitest project. The files to keep isolated are the ones that register cross-file state, not the ones that fail: `vi.mock` and `vi.doMock` registrations, fake timers, `vi.stubGlobal` and `vi.stubEnv` all outlive the file under a shared registry, and the failures land in later files that did nothing wrong. A mechanical split by that scan is honest but only pays off once the mocking half is small; with 122 of 222 files isolated the same suite reached 2:31, because the isolated half still boots per file. The real gain waits on making mocks leak-safe (restore in `afterEach`, or inject the dependency) and moving files across, and on the instruction file saying new tests default to the shared project.

**Lighter environment.** A suite where the `environment` figure rivals `tests` is booting jsdom for files that never touch the DOM. `// @vitest-environment node` at the top of those files, or a project split by glob, removes the boot for them. Pure logic tests are the usual candidates: derivations, stores, formatters.

**Contention inside one job.** A task runner with no remote cache that fans every workspace's `test` script into one job is running twenty Vitest processes, each spawning its own workers, on four cores. A suite that takes 0:47 alone took 3:04 there and one that takes 2:56 alone took 6:35. Splitting the two heavy suites into their own jobs recovers most of that before any test changes.

**Worker count.** Two test processes each spawning `cpus - 1` workers on a four-core runner oversubscribe it. When a task runner fans out every workspace's tests in one job, set its concurrency or give each suite `--maxWorkers`. This is why a per-workspace duration under contention exceeds the same suite alone.

**Balancing shards by duration.** Vitest and Playwright shard by file count. Balancing by recorded per-file duration is possible with a custom sequencer; Linear tried it and found the gain did not pay for the complexity. Split the long files instead.

**Remote task cache.** Turbo or Nx remote caching turns a cache hit into a network fetch plus a disk write plus a read by the next task, so on a hosted runner it is bounded by network and IOPS rather than CPU; in practice a mid-sized TypeScript monorepo lands at one to two minutes for a fully cached run, not seconds. It pays off for build outputs consumed downstream, less for test tasks whose only output is a pass. Without a remote cache, every task in CI is a miss and `turbo run test` is only a parallel runner.

**Split large test files.** A shard is only as fast as its longest file. Files over a few hundred tests serialize one worker; splitting by describe block lets the scheduler balance. Linear went from 4 to 8 shards only after this made the shards balance.

**Playwright workers.** `workers: 1` in CI is a correctness choice when specs share a database. Raise it only with per-worker fixtures; measure `fullyParallel` on the real API before trusting it.

## Toolchain

**Faster runners.** Hosted GitHub runners are four slow vCPUs on shared disks. Third-party runners (Blacksmith, Depot, Namespace, RWX, BuildJet, or self-hosted) run the same YAML on faster CPUs and NVMe with a persistent cache. Linear measured 34 percent across the pipeline and 52 percent on `tsc` from the switch alone. It is a spend, so it is the user's call; the case for it is one run of the unchanged pipeline on each, side by side. Ordering matters: measure after the split and setup work, because a faster machine shortens every job and hides which one was the problem.

**Native TypeScript.** `tsgo` (`@typescript/native-preview`) cut Linear's median type-check by 73 percent. It does not support `baseUrl`, some `paths` shapes, or every `tsc -b` project-reference layout; check each tsconfig before switching, and keep `tsc` for the ones it refuses. Gain lands on the critical path only when type-checking is on it.

**Lint without the type graph.** Rules that build the program are the expensive ones. Oxlint and Biome run syntax-only rules in seconds; type-aware rules stay in a separate, sharded, or default-branch-only job.

**Formatter scope.** `oxfmt --check .` or `prettier --check .` walks the whole tree. Checking only files changed against the base on pull requests, and the whole tree on the default branch, keeps the guarantee and removes the cost from most runs.

## Deploy Stage

**Rolling deploys queue, never cancel.** A cancelled `flyctl deploy` or `kubectl rollout` leaves the app half-rolled. Deploy jobs get their own concurrency group with `cancel-in-progress: false`; a rollback workflow shares that group with cancellation on so it pre-empts.

**Build once.** Remote Docker builds re-run the dependency layer when the build context includes anything the lockfile does not pin. Order the Dockerfile so `COPY` of lockfiles and manifests precedes the install, and keep sources out of that layer.

**Health checks as a job.** Twenty seconds of `curl --retry` in its own job costs a runner allocation. Fold it into the deploy job's last step.

## What Comes Next

Once push-to-green sits around five minutes, an agent loop stops waiting on checks and the bottleneck moves to the stages that do not shard: deploy, rollback, and human review. Say so in the ledger rather than chasing the last minute out of tests; a 4:40 deploy stage that was a quarter of the chain becomes half of it once the tests are fixed, and gets the next round.

Bazel and content-addressed build systems (RWX, Dagger) get warm-cache builds to seconds for compiled languages, and agents have cut a Bazel conversion from years to weeks, but for a JavaScript monorepo the same people who did those conversions point back at `tsgo`, syntax-only linting, and setup work as the better spend. Note it as not taken, with that reason.

## Cost Accounting

Wall-clock and runner minutes move independently. Write both in the ledger:

- Splitting one 10-minute job into a 4-minute static job and three 5-minute shards takes the chain from 10 to 5 minutes and raises runner minutes from 10 to 19.
- Excluding containers and caching browsers lowers both.
- `isolate: false` lowers both.

For a public repository on hosted runners, minutes are free and wall-clock is the only number. For a private one, or on paid third-party runners, say what the extra minutes cost per month before choosing shards over shared state.
