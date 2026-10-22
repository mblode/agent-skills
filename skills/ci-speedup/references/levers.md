# Lever Catalogue

Grouped by the class of time each one removes. For each lever: what must be true, the gain to expect, and how it has failed. Pick by gain on the measured critical path, never by how modern the lever sounds.

## Contents

- Gating
- Setup
- Execution
- Toolchain
- Image build
- Cost accounting
- Traps

## Gating

**Decide without a working tree.** A gating job that only needs the diff can use `fetch-depth: 1` plus a fetch of the base SHA, or no checkout when the decision comes from the API. One team's change-detection job fell from a 26 to an 8 second median this way (Linear, 2026).

**Cache writes off the merge path.** `actions/cache` saves in the post-job phase, so a job on the chain that saves a cache finishes later than one that only restores. Save from a job off the chain (default-branch-only, or the shortest shard) and restore everywhere; moving one cache write off the chain saved 42 seconds per pull request and merge-queue entry (Linear, 2026). Turbo and Nx remote caches write on the chain too; check the write is cheap.

**Inline trivial matrix jobs.** A job whose body is "read a file, emit a matrix" costs a runner allocation before its consumers start. Fold it into a step of the first real job when the consumer is one job.

## Setup

**Batch the small checks, shard the large ones.** Seven two-minute jobs each spending most of their time on setup finish no sooner than one batched job; one serial job running lint, typecheck and eight minutes of tests has a chain equal to their sum. One `static` job for everything that finishes inside its own setup time, shards for the suites that dominate, and the predicted chain is setup plus the slowest shard. Workflow steps are sequential, so run the batched checks concurrently (`turbo run lint check-types --concurrency=4`, or `&` with `wait`).

**Checkout depth.** `fetch-depth: 1` is usually right; jobs that diff fetch the base commit, not full history. Capping fetch depth took one team's slowest gate from 94 to 20 seconds, and a sparse, blobless checkout (`filter: blob:none` plus `sparse-checkout`) saved about 11 more (Linear, 2026). `GIT_HTTP_LOW_SPEED_LIMIT=1000` and `GIT_HTTP_LOW_SPEED_TIME=30` abort a stalled transfer after 30 seconds so a retry can run instead of hanging to the job timeout.

**Checkout size.** Large media committed to git makes every job pay to download it. `actions/checkout` leaves LFS objects out unless `lfs: true`; media in plain git wants a sparse checkout that excludes its directories in jobs that never read it, or a move to LFS or object storage. Time the checkout step before and after; on an old repository with binary history it can be the largest setup step.

**Dependency install.** Time three shapes on the runner: a plain install with the package manager's download cache (`actions/setup-node` with `cache: pnpm`), a whole-`node_modules` cache keyed on the lockfile hash, and a workspace-filtered install (`pnpm install --filter <app>...`). A cache hit took about 28 seconds to restore against about 7.5 for a filtered pnpm install (Linear, 2026); npm's extract is heavier, so the cache wins more often there. A filtered install breaks when a task runner later reaches a workspace that was not installed.

**Cache-hit evidence.** Credit a task cache from the task runner's own summary, not from the cache step. `turbo run test --summarize` writes per-task cache status; Nx marks each task it replayed from cache. A cache step that logs "restored" while every task's hash changed is a full rebuild with an extra download in front of it.

**Service boot.** Start only the services the suite connects to, after checking nothing calls the ones you drop. Excluding containers saves their pulls, not the boot: database init and health waits are the rest, so predict from the step's log, not the container count.

**Database schema.** Replaying every migration into a fresh database costs seconds per migration per container; a generated schema snapshot restores in one or two. Keep the replay in one place (one integration job) so a broken migration still fails somewhere.

**Browser install.** Cache the Playwright browser directory on the lockfile hash and install only OS dependencies on a hit. The OS dependency step still costs time on every job; a runner image that has them, or a container job on the Playwright image, removes it.

**Base image.** Preinstalling runtime, database client, and browser dependencies in a container image removes their install from every job, once the job count makes an image worth maintaining.

**Keep CI off the host that runs agents.** A self-hosted runner on the machine where agents build and test shares its cores and memory with them. Under load every check slows and some time out, and the timeouts read as flakes. Run CI on separate machines, or cap agent concurrency by measured load before blaming the suite.

## Execution

**Shard across jobs.** `vitest run --shard=1/2`, `playwright test --shard=1/2`, or a task-runner filter per workspace. Gain is the suite time divided by shards, minus one setup per shard; shard the suites whose duration exceeds the setup tax by a wide margin and put everything else in one. A step that also runs migrations or seeds cannot be sharded as it stands (every shard replays them, or races the others on one database); move the migration into a step the shards `need`.

**Shared module registry.** Vitest `isolate: false` keeps one module registry per worker across files, so the module graph is imported once. It was one team's largest single saving: about 17 percent monthly, with the slowest shard down from 300 to 379 seconds to about 195 (Linear, 2026). Measure the ceiling first with `vitest run --no-isolate` on the whole suite and count the files that fail, then apply as a second Vitest project. Keep isolated the files that register cross-file state, not the ones that fail: `vi.mock` and `vi.doMock`, fake timers, `vi.stubGlobal` and `vi.stubEnv`. Eligibility is an opt-in comment per file plus its teardown (explicit, needs every author to know it) or a mechanical scan in the config that isolates any file matching those calls (self-maintaining). The split pays only once the isolated half is small, because that half still boots per file. The gain waits on leak-safe mocks (restore in `afterEach`, or inject the dependency) and on the instruction file making the shared project the default for new tests.

**Lighter environment.** When the `environment` figure rivals `tests`, the suite boots jsdom for files that never touch the DOM. When DOM files are the minority, make `node` the default and opt them in; otherwise `// @vitest-environment node` on the logic-only files. Let the suite pick the set: tag every candidate, run, untag the ones that fail at import (modules reading `window` at load).

**Coverage only where it is read.** Instrumentation lands in `transform` and `collect` on every file. Collect on the default branch or a nightly job and keep the pull request run bare.

**Contention inside one job.** A task runner that fans every workspace's `test` script into one job runs many Vitest processes, each spawning `cpus - 1` workers, on a hosted runner's few cores. Split the heavy suites into their own jobs, or set the runner's concurrency and give each suite `--maxWorkers`.

**Memory-bound tests in parallel worktrees.** When several agent worktrees run suites on one machine, memory runs out before CPU: every worker that type-checks while it transforms holds its own compiler program. Use a transpile-only transform (Vitest's default, `@swc/jest`, or ts-jest in transpile-only mode) and run the type checker once as its own step; cap workers per suite (`--maxWorkers=2`) when worktrees run concurrently. A worker killed for memory fails a random test, so read the exit code before calling it a flake.

**Balancing shards.** Vitest and Playwright shard by file count, not by duration. Split the long files instead of writing a duration-balancing sequencer: a shard is only as fast as its longest file, and a file of a few hundred tests serializes one worker. After splitting its large files, one team moved from 4 to 8 shards and the critical job got about 19 percent faster and cheaper (Linear, 2026).

**Remote task cache.** Turbo or Nx remote caching turns a hit into a network fetch, a disk write, and a read by the next task, so a fully cached run on a hosted runner still takes real time. It pays for build outputs consumed downstream, less for test tasks whose only output is a pass. Without it, every task in CI is a miss and `turbo run test` is only a parallel runner.

**Playwright workers.** `workers: 1` in CI is a correctness choice when specs share a database. Raise it only with per-worker fixtures, and measure `fullyParallel` on the real API before trusting it.

## Toolchain

**Faster runners.** Standard hosted GitHub runners are two to four slow vCPUs on shared disks. Third-party runners (Blacksmith, Depot, Namespace, RWX, BuildJet, or self-hosted) run the same YAML on faster CPUs and NVMe; one team measured jobs 34 percent faster on average and `tsc` 52 percent faster (Linear, 2026). It is a spend, so it is the user's call, made on one run of the unchanged pipeline on each. Measure after the split and setup work, because a faster machine shortens every job and hides which one was the problem.

**Native TypeScript.** `tsgo` (`@typescript/native-preview`) cut one team's weekly median type-check by 73 percent (Linear, 2026). It does not support `baseUrl`, some `paths` shapes, `moduleResolution: node10` (usually inherited or defaulted rather than written in the tsconfig it fails on), or every `tsc -b` layout; check each tsconfig and keep `tsc` for the ones it refuses. The gain lands on the chain only when type-checking is on it.

**Lint without the type graph.** Rules that build the program are the expensive ones. Oxlint and Biome run syntax-only rules in seconds; type-aware rules stay in a separate, sharded, or default-branch-only job.

**Formatter scope.** `oxfmt --check .` or `prettier --check .` walks the whole tree. Check only files changed against the base on pull requests and the whole tree on the default branch.

## Image Build

**Split dependency layers by manifest.** Order the Dockerfile so a `COPY` of the lockfile and every workspace manifest precedes the install, keep sources out of that layer, and give the package manager a named cache mount. A source edit then reuses the dependency layer; `pnpm fetch` needs only the lockfile, so it can sit even earlier.

**Reuse images by input hash.** Tag each image with a hash of its inputs (the Dockerfile, the lockfile, and the files the build context copies) and skip the build when that tag already exists in the registry (`docker buildx imagetools inspect <ref>` succeeds). A commit that touched none of the inputs then costs one registry lookup. Promote the same digest between environments rather than rebuilding it.

**Build optional artifacts on demand.** Preview images, Storybook builds and bundle reports built on every push cost runner minutes and often sit on the chain. Build them on a label, a comment command, or `workflow_dispatch`, and on the default branch only when something consumes them.

## Cost Accounting

Wall-clock and runner minutes move independently; the ledger writes both:

- Splitting one 10-minute job into a 4-minute static job and three 5-minute shards takes the chain from 10 to 5 minutes and runner minutes from 10 to 19.
- Excluding containers, caching browsers and `isolate: false` lower both.
- A faster runner lowers wall-clock and may raise the bill per minute.

On a public repository with hosted runners, minutes are free and wall-clock is the only number. On a private one, or paid third-party runners, say what the extra minutes cost per month before choosing shards over shared state.

## Traps

- Every workspace's tests in one job through a task runner with no remote cache is oversubscription, not caching: one test process per workspace, each with `cpus - 1` workers, on a hosted runner's few cores. Read the per-workspace duration lines before blaming the tests.
- A restored dependency cache can be slower than a fresh install. Time both; a multi-gigabyte `node_modules` is not worth caching.
- Two IO-bound steps overlapped on a hosted runner return less than their sum: a background service boot shortens the wait after install while the install itself grows. Measure the pair, not each step.
- A background boot must resolve its project the way the reading step does: `supabase start --workdir <dir>` booted a default project under another container name, and `supabase status` found nothing.
- `supabase start -x postgrest` breaks every `supabase.from(...)` call in application code (a Drizzle `.from` is unaffected); `-x storage-api` breaks a config that declares buckets.
- Vitest and Playwright shard by file count, so two shards differ by a minute and the same shard varies by a minute between runs. Read median and p90 before adding a shard; splitting the long files rebalances, another shard does not.
- Matrix jobs default to `fail-fast: true`; one red shard cancels the rest and hides how many are red. Set `fail-fast: false` on test shards.
- A Docker registry cache pushed to the same tag as the image never hits: the push overwrites the cache manifests and `cache-from` finds a regular image. The cache ref is its own tag.
- `cache-to` on a registry needs the `docker-container` buildx driver; the default `docker` driver ignores it without a warning.
- `RUN --mount=type=cache` without an `id` shares one directory between parallel builds of different images and corrupts it under the default `sharing=shared`. Name every mount.
- Moving a `COPY --from=builder` above a source `COPY` with an overlapping destination changes the image silently. Diff the image, not only the build time.
- `compression=zstd,compression-level=1` on the cache exporter is a hypothesis: A/B it cold and warm against separate refs, and never set `force-compression=true`.
- A Dockerfile or workflow that a template or pipeline library generates is edited in the generator; a hand edit to the output is reverted by the next generation.
