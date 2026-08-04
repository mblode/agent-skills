# Verification Tiers

An agent that knows exactly which check to run wastes no tokens running the wrong one, and a command that passes while proving nothing costs more than one that fails. Load when defining which commands an agent should run, and when.

## Contents

- The tier ladder
- Latency budgets and file-scoped variants
- Commands that lie
- CI runs the same command
- The boot check
- Tests that survive parallelism

## The tier ladder

Name the tiers, publish the routing, and state in the instruction file which tier gates a commit.

| Tier | Contents | Runs when |
|---|---|---|
| `check` | lint, typecheck, format check | Continuously during an edit loop |
| `verify` | `check` plus unit tests | Before a commit |
| `verify:full` | `verify` plus integration, boot check, staleness gates | Before a push or in CI |

Three tiers is the useful number. Two collapses the edit loop into the test suite; four leaves the agent guessing which to pick.

## Latency budgets and file-scoped variants

Encode the budget in test filenames so "run the narrowest relevant tier" is executable rather than a judgment call: `*.test.ts` under 3s, `*.integration.test.ts` under 10s, `*.e2e.test.ts` unbounded and excluded from `verify`.

Publish file-scoped variants too (`lint:file`, typecheck one project, test one path). The agent knows exactly which files it touched, so a per-file check is the fastest loop available to it, and the one it will actually run between edits.

## Commands that lie

The sharpest thing to write down, and the one nobody thinks to. Enumerate this repo's commands that pass while proving nothing, because a green-but-lying command is worse than a red one: it ends the investigation.

Recurring shapes worth checking for:

- **A flag that hides findings.** `--quiet` suppressing lint warnings, a reporter that swallows a category, a threshold set so high nothing trips it.
- **A filter matching zero files.** A test path pattern, a workspace filter, or a glob that silently matches nothing and exits 0. This is the most common one and the most convincing.
- **A stale incremental cache.** `tsc --incremental` or a build cache returning a result computed against code that has since changed.
- **A step skipped by condition.** A CI job gated on a path filter or a branch condition that no longer matches, so the gate is nominally present and never runs.

Publish the list in the instruction file or a verify doc, with what to run instead. It is per-repo, so the generalisable move is making the list a step rather than the list itself.

## CI runs the same command

CI invokes the same umbrella command a developer runs (`verify:full`), rather than a hand-maintained list of individual steps.

A separately-maintained CI list drifts: a check gets added locally and never wired, or a step is dropped during a refactor and nobody notices because the absence of a failure looks like success. Where CI must diverge, make the difference explicit and stated rather than emergent.

## The boot check

A check that constructs the app's wiring (dependency container, module graph, route registration) without serving traffic.

It catches the class of error typecheck and unit tests both miss, which is exactly the class agents introduce when they add a dependency or register a new module: everything compiles, every unit test passes, and the app cannot start. Have it load `.env.example` so the environment contract is exercised at the same time.

## Tests that survive parallelism

Guardrails only hold if the suite behind them is trustworthy:

- Unique IDs per test, generated at runtime, never shared fixtures. Shared fixtures collide the moment the suite runs in parallel, and the resulting flake teaches everyone to rerun rather than read.
- Seeded randomness and a frozen-clock helper, so a failure reproduces.
- Unit tests stay database-free; anything needing a database is an integration test and named as one.
- A pluggable interface ships its behavioral spec as an importable contract test suite, so a new adapter (often agent-written) proves conformance by calling one function rather than reimplementing the expectations.
