# Agent-friendly codebase

Make a codebase cheap and safe for coding agents to work in. Load when preparing a repo for agentic coding, wiring guardrail tooling, or marking legacy code.

## Contents

1. [Why agents care](#why-agents-care)
2. [Deterministic guardrails over prompt rules](#deterministic-guardrails-over-prompt-rules)
3. [Bespoke invariant guards with a ratchet](#bespoke-invariant-guards-with-a-ratchet)
4. [Legacy quarantine](#legacy-quarantine)
5. [Generated contracts](#generated-contracts)
6. [Locality and naming for cheap traversal](#locality-and-naming-for-cheap-traversal)
7. [Verification tiers](#verification-tiers)
8. [Errors agents can debug](#errors-agents-can-debug)
9. [Docs agents can trust](#docs-agents-can-trust)
10. [Self-bootstrapping worktrees](#self-bootstrapping-worktrees)
11. [Scheduled refactor passes](#scheduled-refactor-passes)
12. [Convention entries](#convention-entries)

## Why agents care

Code cleanliness does not change an agent's pass rate; it changes the cost of every task. On matched clean/messy repos, Claude Code used 7 to 8% fewer tokens and revisited files 34% less often when the code was clean (SonarSource, 2026). Two mechanisms drive this:

- **Traversal cost.** Agents rebuild context per task by grepping and reading. Predictable names and small files mean the first guess lands; bloated files mean chunked reads and repeated visits.
- **Convention contagion.** Agents mimic whatever code they read first. A legacy pattern sitting unmarked next to the current one gets copied, even when AGENTS.md says otherwise.

## Deterministic guardrails over prompt rules

A rule an agent must remember is a suggestion; an exit code is a contract. Anything a static tool can check moves out of AGENTS.md and into tooling, wired into both a pre-commit hook (lefthook or husky) and CI. Both, always: hooks are not guaranteed installed, and CI alone gives feedback too late for the agent's edit loop. When a hook fails the agent's commit, it self-corrects on the spot; that loop is the cheapest QA round available.

TypeScript-first tools per category (swap per ecosystem; the categories are language-agnostic):

| Category | Tool | Catches |
|---|---|---|
| Dead code, unused exports and deps | `knip` | Orphaned helpers agents leave behind |
| Copy-paste duplication | `jscpd` | Near-duplicate blocks that should share one implementation |
| Import boundaries and cycles | `dependency-cruiser` or eslint `boundaries` | Layer violations (enforce the handler/service/dao contract) |
| File size and complexity | eslint `max-lines` (~400), `complexity` | Files too big to read in one pass |

## Bespoke invariant guards with a ratchet

Generic linters stop at generic rules. The invariants that define your architecture (layer contracts like "DAOs never import handlers", naming rules like "derive identity from file path", bans like "no `as unknown as` double-casts") go in a custom guard script that fails the build on violation. Three properties make the guard agent-grade:

- **Self-explaining failures.** Every violation prints why the invariant exists and how to fix it, not just where it fired. The agent self-corrects on the spot instead of guessing or asking a reviewer.
- **A shrink-only baseline.** Pre-existing violations live in a committed baseline file (JSON list of file paths or counts). The guard passes while violations stay at or below the baseline and fails when they grow, so a new rule enforces repo-wide on day one while migration happens incrementally. Fix violations; never edit the baseline upward.
- **Graduated enforcement.** A warn-only variant runs in pre-commit for fast signal without blocking work-in-progress commits; the blocking variant runs in CI and gates the merge.

Two guard shapes worth copying:

- **Registry completeness as a reflection test.** When every X must be registered (tools in a manifest, tables in a deletion sweep, routes with an auth policy), write a test that reflects over the real code and fails when an item is missing from the registry or the allowlist. Nothing can be added without declaring it.
- **Deprecation greps.** Removed APIs, commands, and packages must not reappear in active code or docs; each hit prints the sanctioned replacement. Exclude changelogs, they are historical record. Boundary-lint messages should also name the rule and link the architecture doc, so the failure teaches the convention it enforces.

## Legacy quarantine

Mixed-quality code teaches agents the wrong conventions, and deleting legacy is not always an option. Quarantine what stays:

- Mark do-not-reference code with a greppable comment at the top of each file: `// LEGACY: do not use as a reference or extend. See docs/legacy.md`.
- Keep `docs/legacy.md` short: which areas are frozen, why, and what to use instead. Comments reference it instead of repeating it.
- State the marker convention once in AGENTS.md so agents know what the marker means before they hit one.
- Never leave an unmarked old/new dual path (deprecated endpoint next to its replacement, two ways to fetch the same data). Delete the old path or mark it; an unmarked pair reads as two valid conventions.
- The invariant guard's baseline doubles as machine-readable quarantine: each entry names the module still on the old pattern and a comment names the migration it owes. The guard holds new code to the standard while the list shrinks.
- Quarantine whole directories where that is the natural seam: a `test-legacy/` folder marked "archived, do not add to, not a source of truth" keeps an old suite runnable without teaching agents its patterns.

## Generated contracts

Anything derivable from a schema (API clients, GraphQL types, protobuf messages, DB models) is generated, never hand-written, so agents cannot drift a copy:

- Make the schema the single source of truth and state the rule in AGENTS.md: import generated types; never hand-write an API shape the codegen already owns.
- Commit the generated output. Agents then read real types on any checkout without knowing how to run codegen.
- Banner every generated file with a greppable marker: `// GENERATED FILE, DO NOT EDIT. Run <command> to regenerate.` It is the same contagion defense as the LEGACY marker, pointed at the opposite failure.
- Gate contract changes in CI: a regen-diff check (generated output matches the schema) and a breaking-change check against the published schema.

## Locality and naming for cheap traversal

- Name files for what an agent (or new teammate) would grep first: `invoice-refunds.ts`, not `utils2.ts` or `helpers.ts`.
- Keep files small enough to read in one pass; the ~400-line lint cap doubles as a traversal budget.
- Co-locate code that changes together; a feature spread across six directories is six reads before the first edit.
- One canonical name per concept. Naming divergence (one concept, three names) is the strongest confusion signal for agents and humans alike; see the domain-language mapping in [deepening-existing.md](deepening-existing.md).

## Verification tiers

An agent that knows exactly which check to run wastes no tokens running the wrong one. Name the tiers and publish the routing:

- Umbrella commands per confidence level: `check` (lint + typecheck), `verify` (check + unit tests), `verify:full` (verify + integration and boot checks). AGENTS.md states which tier gates a commit.
- Test filename conventions with latency budgets (`*.test.ts` under 3s, `*.integration.test.ts` under 10s, `*.e2e.test.ts`) so "run the narrowest relevant tier" is executable, not judgment.
- Add a boot check that constructs the app's wiring (DI container, module graph, route registration) without serving traffic. It catches the wiring errors typecheck and unit tests both miss, which is exactly the class of error agents introduce when they add a dependency.
- Keep `.env.example` as the canonical environment contract: the boot check loads it, and every new variable lands there or CI fails.
- Publish file-scoped variants (typecheck, lint, test one file). The agent knows exactly which files it touched; per-file checks are the fastest loop it can run.
- Make tests deterministic and parallel-safe: unique IDs per test (never shared fixtures), seeded randomness, a frozen clock helper. A pluggable interface can ship its behavioral spec as an importable contract test suite, so a new adapter (often agent-written) proves conformance by calling one function.

## Errors agents can debug

An agent debugs from the output it can read; a structured failure is the difference between one fix loop and five:

- Structured error classes with a machine-readable code. Callers and tests assert on class and code, never message text; message strings are not API.
- Two audiences by construction: a caller-safe message plus a developer-only guidance field, and user-facing copy registered separately from internal error identity so internals never leak to users.
- Domain errors stay transport-agnostic; middleware owns the mapping to HTTP or RPC codes, so services never pick status codes ad hoc.
- Log the raw error object and let serializers extract type, stack, and cause. Never catch-log-rethrow: middleware already logs unhandled errors once, and duplicates make the agent chase two failures.
- Ambient request context (the RequestContext pattern in the main workflow) auto-enriches every log line with request and correlation IDs, so a failure is traceable from log output alone with no per-call-site work.

## Docs agents can trust

Stale docs are worse than no docs: an agent cites them confidently. Make trust explicit:

- Index every agent-facing doc in AGENTS.md with a one-line "consult when" scope, so the agent knows whether to open it before paying to read it.
- Label each doc's trust level in a docs index: live (maintained), reference (stable background), historical (point-in-time artifact, do not treat as current).
- Validate docs in CI where possible: code snippets compile, frontmatter is well-formed, any registry that mirrors docs into code stays in sync.
- For a pattern agents must reproduce, ship a copy-paste template file next to the prose; a working file teaches more reliably than a description of one.
- Anchor docs to domain concepts over file paths where possible; paths go stale silently, and an agent follows a stale pointer with full confidence. Link-check doc pointers in CI, including the ones inside AGENTS.md itself.
- Keep AGENTS.md hand-curated and update it in the same PR that changes a convention. Generating it wholesale measurably hurts: one 2026 study found LLM-generated context files reduced task success and raised inference cost.
- Test doc examples against the real interface. A drift test that extracts every command invocation from the published docs and skill files, resolves each against the live command tree (command path plus flags exist), and fails the build on a mismatch turns "examples must stay runnable" into a gate. Reject any past-dated example in the same test, so a stale snippet fails instead of misleading an agent.
- Pair each non-obvious claim with the command that re-proves it. A gotcha note that ships the exact repro (`curl ...`, a one-line query) lets an agent re-verify the claim still holds instead of trusting a note that may have rotted.

## Self-bootstrapping worktrees

Agents increasingly run in fresh clones and parallel worktrees; every manual setup step is a failed session or a wasted detour:

- A session-start hook that installs dependencies when they are missing makes any fresh worktree productive without instructions.
- A post-edit hook that runs the formatter/autofixer after every file write keeps the tree always-clean instead of relying on the agent to remember.
- For parallel agent fleets, a worktree bootstrap script copies env files, reuses dependency and codegen artifacts from the main checkout when lockfiles match, and offsets ports so worktrees never collide.

## Scheduled refactor passes

Agent-written code accretes single-use helpers, stale dual paths, and bloated files even with guardrails. Schedule small cleanup passes instead of waiting for a rewrite:

1. Run the dead-code and duplication tools; delete what they flag.
2. Split any file over the size cap along its natural seams.
3. One slice at a time, verified by the existing test suite; never big-bang (the Adoption workflow's slice rule applies).

Refactor safety equals test coverage: a thin suite caps how aggressive a pass can be, so growing coverage is part of staying agent-friendly, not a separate track.

## Convention entries

Ready to drop into an architecture brief (format per [craftsmanship.md](craftsmanship.md)):

- **Dead code:** Boundary: all packages. Failure mode: agents grep dead helpers, treat them as live conventions, and extend them. Enforcement: `knip` in pre-commit and CI. Owner: platform/tooling.
- **Legacy marker:** Boundary: paths listed in `docs/legacy.md`. Failure mode: agents copy deprecated patterns into new code. Enforcement: CI grep asserting every file under a listed path carries the LEGACY marker. Owner: the team that owns the migration.
- **File size:** Boundary: all source files. Failure mode: agents burn tokens on chunked reads and revisit the file per task. Enforcement: eslint `max-lines` at ~400 with per-file overrides requiring a comment. Owner: each package.
- **Duplication:** Boundary: all packages. Failure mode: fixes land in one copy and drift from the others. Enforcement: `jscpd` threshold in CI. Owner: platform/tooling.
- **Invariant ratchet:** Boundary: the guard script's baseline file. Failure mode: new code copies quarantined violations and the debt grows instead of shrinking. Enforcement: guard fails CI when violations exceed the baseline; baseline edits only shrink it. Owner: platform/tooling.
- **Generated contracts:** Boundary: schema files and committed `gen/` output. Failure mode: agents hand-edit generated files or hand-write API types that drift from the schema. Enforcement: generated-file banner plus a CI regen-diff and breaking-change check. Owner: the schema-owning package.
