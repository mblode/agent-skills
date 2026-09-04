---
name: codebase-architecture
description: Designs module contracts, deepens existing boundaries, and installs enforceable repository guardrails. Use when asked to "design the architecture", "simplify our modules", or "harden the repo". For one feature plan use planning; for diff cleanup use tidy; for tenancy use multi-tenant-architecture.
---

# Codebase Architecture

Decide a TypeScript codebase's structure, improve it where change has become expensive, and make it hold. The target is a codebase a reader can hold in their head: few surfaces, one canonical way to do each job, and behaviour where you would first look for it.

- **IS:** folder structures, module contracts, request context and middleware pipelines, frontend/backend boundaries; architecture briefs; domain language and decision records; domain-informed deepening; guardrail tooling, CI gates, and agent wayfinding.
- **IS NOT:** scaffolding a new repo (`scaffold-nextjs` for a Next.js turborepo, `scaffold-cli` for a TypeScript CLI), multi-tenant domain/isolation/routing (`multi-tenant-architecture`), the content of AGENTS.md itself (`agents-md`), a plan for one feature (`planning`), a diff-scoped cleanup pass (`tidy`), or structural review of a local diff (`pr-reviewer`).

## Contents

- Modes
- References
- Design mode (new codebase)
- Deepen mode (existing codebase)
- Harden mode (make it stick)
- Validation loop
- Output template
- Excuses
- Gotchas
- Related skills

## Modes

Pick by the problem, not by the artifact, and say which you picked.

| Mode | You are here when | Output |
|------|-------------------|--------|
| **Design** | Starting a new app, service, or surface, and the structure is not decided yet | An architecture brief |
| **Deepen** | The code works, but change is expensive: concepts scattered, seams leaking, one idea under three names | Ranked opportunities, then one migrated slice |
| **Harden** | The structure is decided and keeps decaying, or agents keep doing the wrong thing in this repo | Wired checks, markers, and recipes |

**Modes compose, and running more than one is normal.** Design ends in Harden, because a contract with no check is a suggestion. Deepen ends in Harden, so the new seam cannot decay back. Harden runs alone when the structure is already right and only the enforcement is missing, which is the common case in a repo that agents work in.

**When two look equally right, prefer Deepen.** "Agents keep using the old pattern" sounds like Harden, but if the cause is one concept living in two places, quarantine only freezes the duplicate: Deepen deletes it and Harden holds the line until that lands. Harden alone is right when the old thing genuinely has to stay.

**When you cannot write to the repo** (no checkout, read-only request, or a question rather than a change), each mode's output degrades to its plan: the brief, the ranked opportunities, or the named checks with their rungs. Say which checks remain unproven, since none of them are wired.

**As simple as possible, no simpler.** Every mode cuts: surfaces in Design, concepts in Deepen, dual paths and dormant config in Harden. The floor does not get cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, observability on anything deployed, and whatever was explicitly asked for. A simplification that reaches one of those is a bug. Where a corner is cut on purpose, mark it with its ceiling and upgrade path rather than leaving the next reader to guess whether it is finished.

Copy this to track progress, and delete the lines for modes you are not running:

```text
Codebase architecture progress:
- [ ] Modes chosen and stated (Design / Deepen / Harden)
- [ ] Design: assumptions stated, repo shape, every contract names its check, brief written
- [ ] Deepen: git hot spots, glossary, ranked opportunities with paths, one slice migrated
- [ ] Harden: existing checks surveyed, checks picked by failure, each landed green and proven to bite
- [ ] Validation loop run for the modes used; evidence recorded, N/A items named
```

## References

Load only when the condition applies.

| Reference | Mode | Read when |
|-----------|------|-----------|
| [references/stack-defaults.md](references/stack-defaults.md) | Design | Choosing libraries, tooling, or deploy targets |
| [references/api-design.md](references/api-design.md) | Design, Deepen | Designing endpoints, module contracts, request context, error shapes, or an agent-facing CLI/SDK surface |
| [references/distributed-correctness.md](references/distributed-correctness.md) | Design, Deepen | The work provably touches an external system, webhook, retry, audit trail, or money. In Deepen you can grep for it; in Design it is a question about requirements, so confirm before loading rather than inferring it from the product's domain |
| [references/brief-conventions.md](references/brief-conventions.md) | Design | Writing the conventions, testing, quality-bar, or rollout and rollback sections of the brief |
| [references/deepening-existing.md](references/deepening-existing.md) | Deepen | Running Deepen: vocabulary, opportunity patterns, output template |
| [references/domain-language.md](references/domain-language.md) | Deepen | Writing or fixing a glossary, resolving naming divergence, recording a decision |
| [references/enforcement-ladder.md](references/enforcement-ladder.md) | Harden | Adding any check to a repo that already violates it |
| [references/guardrail-tooling.md](references/guardrail-tooling.md) | Harden | Choosing and wiring the actual checks: dead code, duplication, cycles, module and package boundaries, file size, staleness gates |
| [references/wayfinding.md](references/wayfinding.md) | Harden | Agents cannot find things, or keep re-deriving the same path |
| [references/contagion-markers.md](references/contagion-markers.md) | Harden | The repo has legacy, generated, dual-path, or deliberately simplified code |
| [references/verification-tiers.md](references/verification-tiers.md) | Harden | Defining which commands an agent should run, and when |
| [references/agent-runtime.md](references/agent-runtime.md) | Harden | Configuring session hooks, permissions, or review gating |
| [references/evaluation-scenarios.md](references/evaluation-scenarios.md) | none | Changing this skill. Never loads during a user task; it is the author's rubric |

## Design mode (new codebase)

Before any of this, ask whether each surface needs to exist. A module, service, app, or entrypoint that could be a folder in something that already ships is the cheapest architecture decision available, and the only one that stays cheap. Every surface you do accept pays the relationship cost in the surface-area budget (`brief-conventions.md`): name its owner, tests, observability, and deletion path before it goes in the brief.

1. Constraints first: product scope, team size, compliance/security, expected scale, deploy targets, required integrations, and quality bar. A one-line request supplies none of these, so assume the common case, state every assumption in the brief's first section, and invite correction. Ask outright only where a wrong guess would restructure the brief rather than extend it, which in practice is multi-tenancy and whether the API is public.
2. Choose repo shape:
   - `apps/` for deployable surfaces (`api`, `web`, `admin`).
   - `packages/` for shared libraries (`shared`, `ui`, `icons`, `auth`, `proto`).
3. Define backend module contracts, each naming its enforcement (import-boundary lint or type check):
   - `handler`: transport only.
   - `service`: business orchestration.
   - `dao`: database access only.
   - `mapper`: DB/proto/domain transformations.
   - `constants` and `types`: module-local contracts.
4. Define request context and middleware:
   - Carry `tenantId`, `userId`, and `traceId` in an AsyncLocalStorage-backed `RequestContext`, initialized in every entrypoint (RPC, HTTP, jobs, CLI) and read via `getContext()`. A threaded `ctx` parameter grows every signature, and adding one field later touches every call site. Implementation in [references/api-design.md](references/api-design.md).
   - Require an explicit auth policy per RPC method at registration; a method without one fails registration rather than defaulting to open.
   - Keep auth, logging, errors, and context in shared middleware, not per-handler code.
5. Define frontend boundaries (Next.js App Router default):
   - `app/` holds routing files only (`page`, `layout`, `loading`, `error`, `route`). Domain code lives in `src/modules/<name>/` behind its root files; UI private to one route goes in a `_components/` folder beside its page. A page that grows logic moves it to a module, not to a sibling file in `app/`.
   - Server Components by default; `"use client"` at the interactive leaves. Where a client wrapper needs server-rendered content, pass it in as `children`.
   - Server state in TanStack or Connect Query; client state in component state; MobX only for cross-cutting client state that fits neither. Each piece of data has one owner: server data mirrored into `useState`, or two stores synced with `useEffect`, is the sign that ownership is unclear.
   - `proxy.ts` (Next 16's name for `middleware.ts`) handles redirects, rewrites, and headers. Authorization is decided inside each route handler and Server Function, because a matcher-excluded path skips the proxy and Server Functions post to their page's route.
6. Testing and release:
   - Unit tests stay DB-free; integration/E2E run in parallel with dynamically generated IDs so runs never collide on fixtures.
   - Release in small, complete, reversible vertical slices with a rollback plan per change.
   - A slice is complete only when reliability, error paths, observability, and user-facing states are covered; deferring them to a polish pass is how they never ship.
7. Every contract in the brief names the lint rule, type check, or test that catches its violation, then continue into Harden mode to wire them.

## Deepen mode (existing codebase)

Goal: domain-informed deepening, not a rewrite. Load [references/deepening-existing.md](references/deepening-existing.md) for the analysis method, opportunity patterns, and output template.

1. **Map the domain language and decisions.** Read `CONTEXT.md`, `docs/adr/`, or local equivalents if present, then read the code for entities, actions, and contexts as the team names them. Note divergence (one concept, three names; or one name, three concepts). Format and ADR rules in [references/domain-language.md](references/domain-language.md).
2. **Scope the scan by where change lands.** Deepening pays off on code that keeps changing, so `git log --oneline` over a good stretch of history first and weight the files that keep coming up. An unscoped scan drifts into speculative cleanup.
3. **Find deepening opportunities.** Look for anemic concepts, shallow modules, leaking seams, naming divergence, duplicated concepts, primitive obsession, misplaced logic, and tests forced past the public interface. Record each with file paths, never a vague smell. Check deletion first on every candidate: a concept with no live caller, a flag whose branch never runs, a layer with one implementation. Deleting it is the deepening, and it is the only move that cannot make the codebase harder to read.
4. **Rank by leverage.** Prefer opportunities that pass the deletion test, localize named future changes, have low churn, meet a current requirement, and have a viable testing seam. Rank candidates before designing target interfaces; drop speculative cleanups.
5. **Migrate one vertical slice first.** Prove the highest-leverage move end to end through one slice before generalizing.
6. **Enforce the new seam** with lint, type, or test checks so it cannot decay, then roll out module by module. Continue into Harden mode for the enforcement rung and the check-bites test.

## Harden mode (make it stick)

Two halves: **guardrails** stop the wrong thing landing, **wayfinding** makes the right thing cheap to find. Both exist because agents arrive by grep, not by reading docs, so the warning has to live where they land and the rule has to be an exit code rather than a sentence someone might recall.

Steps 1 to 3 always run. Steps 4 to 6 run only when their condition holds, and a request to add one check stops at step 3. Running all six for every request loads most of the bundle and is the failure this mode is most prone to.

1. **Survey what exists.** Package scripts, CI steps, hook config, lint config, the instruction file, the docs index. Find three things: checks that run locally but do not gate the merge, checks that run in CI but cannot fail (`verification-tiers.md`, "Commands that lie"), and dormant config nobody invokes. Wire the first, fix the second, delete the third ([references/contagion-markers.md](references/contagion-markers.md)).
2. **Choose checks by the failure they prevent**, never by tool popularity. Categories and tools in [references/guardrail-tooling.md](references/guardrail-tooling.md). Pick the two or three failures this repo actually exhibits; installing the full set at once forces the weakest enforcement rung on all of them.
3. **Install each check:** pick an enforcement rung for the violations that already exist ([references/enforcement-ladder.md](references/enforcement-ladder.md)), ship it green, then prove it bites (run it, break it on purpose, watch it fail with a message naming the fix, revert). Wire it into both a pre-commit hook and CI.
4. **Wayfinding** per [references/wayfinding.md](references/wayfinding.md): naming and locality, the add-a-new-X recipe file, the trust-labeled docs index, one canonical instruction file.
5. **Contagion markers** per [references/contagion-markers.md](references/contagion-markers.md): anything an agent must not copy or must not edit gets a greppable marker at the code site naming what to use instead.
6. **Runtime ergonomics:** verification tiers in [references/verification-tiers.md](references/verification-tiers.md); session hooks, permission allowlists, and review gating in [references/agent-runtime.md](references/agent-runtime.md).

## Validation loop

Run the items matching the modes you ran, and record results in the output. Each needs evidence; "looks consistent" is not a pass. An item that cannot execute yet, because nothing is installed or the repo is not writable, is recorded N/A with that reason. Silently passing it is how an unenforced contract ships looking verified.

1. **Consistency** (Design, Deepen): naming, module contracts, and middleware rules read the same across every service. Evidence: a contradiction scan with zero findings.
2. **Enforceability** (all): every contract names its lint rule, type check, or test. Evidence: an enforcement note per contract, and for any check actually installed, the pass, then fail on a deliberate violation, then pass after revert.
3. **Operability** (Design): observability, health checks, and a rollback path per deployable surface. Evidence: the rollout section names each.
4. **Quality gates** (whenever code changed): the repo's lint, type-check, and targeted tests (`npm run lint`, `npm run check-types`, `npm run test --workspace=<pkg>` or equivalents). Evidence: passing output, quoted.
5. **CI and local agree** (Harden): the CI step invokes the same umbrella command a developer runs, or the difference is deliberate and stated.
6. **No dangling pointers, and a recipe works cold** (Harden): a grep proving every path named in the docs index and instruction file exists, plus a fresh-context agent following one add-a-new-X recipe end to end with no further guidance.
7. **Net simplicity** (all): the result leaves a reader less to hold, not more. Evidence: the net change in files, surfaces, and exported names, with every increase named and paid for by what it removed elsewhere; plus, for each layer, port, or indirection introduced, the second caller or implementation that made it real. An architecture pass that only adds has failed this check even when every other item passes.

On failure: fix the brief, the conventions, or the wiring, then re-run the loop.

## Output template

Design mode produces this brief. Deepen mode's ranked-opportunity template is in `references/deepening-existing.md`. Harden mode's output is the wiring itself plus the loop's evidence, not a document.

```markdown
# Architecture brief

## Context and constraints
## Repo shape
## Backend module contracts
## Request context and middleware policy
## Frontend boundaries
## Testing strategy
## Quality bar and surface-area budget
## Rollout and rollback plan
## Open risks and follow-ups
```

**Size the brief to the decisions, not to the template.** Drop any heading the project does not face rather than filling it: a single-tenant internal service with no frontend does not owe you a Frontend boundaries section. Each section carries the decision and the constraint that forced it, not a restatement of the conventions in the references. A brief that pads to nine sections costs the review attention that the two contested decisions needed.

## Excuses

Each rebuttal redirects to the step being skipped.

| Excuse | Rebuttal |
|--------|----------|
| "The check is obviously configured right." | You have not watched it fail. A misconfigured gate passes on everything and reads as coverage. |
| "There are too many existing violations to fix." | That is what the enforcement ladder is for. Pick a rung and land it green today rather than a perfect rule next quarter. |
| "AGENTS.md already says not to do that." | A prompt rule decays under context pressure. If a static tool can check it, it belongs in tooling. |
| "We'll add the enforcement in a follow-up." | The follow-up is the deadline's first casualty, and the contract decays from the day it ships unenforced. |
| "CI already runs that tool." | Running is not gating. Read the step: a tool with no threshold, a `warn`-only rule, or a job behind a stale path filter is green on every PR. |

## Gotchas

### Design and Deepen

- Microservices for a team under 5 buy a deploy pipeline, contract versioning, and an on-call surface per service. Start with a modular monorepo; split when a boundary is proven by team or scale pressure.
- App-level deps in a monorepo's root `package.json` hoist silently, so an app builds locally and breaks when deployed alone. Each app owns its deps.
- A `handler`/`service`/`dao` contract with no import-boundary rule decays at the first deadline. Add the rule (`dao` may not import `handler`) the day you write the contract.
- `"use client"` at page or layout level converts the whole subtree to client rendering and forfeits streaming and direct server data access. Push it to leaves.
- Extracting to `packages/` before 3+ apps need the code couples release cycles for nothing. The exception is the contract two surfaces already share (generated types, the RPC schema, branded IDs): that is the interface between them, and it belongs in a package at two apps.
- Dual-writing to a database and a queue or webhook without an outbox (or CDC) loses or fabricates a notification whenever one side commits and the other fails. See `references/distributed-correctness.md`.
- An externally-forceable invariant enforced by construction (unsigned type, hard CHECK) crashes or clamps when the outside world forces the state. Represent it, detect it post-factum, recover explicitly.
- A whole-codebase deepening scan without `git log` hot-spot scoping fills the list with modules nobody touches, and every entry on it is speculative by definition.
- Relying on `proxy.ts` as the only authorization layer: a matcher-excluded path skips it, and Server Functions post to their page's route, so a matcher change silently removes coverage. Check authorization in the handler or Server Function itself.

### Harden

- `jscpd` without `--threshold` exits 0 on any duplication, and `knip` with too many declared `entry` files hides real dead code behind them. A green step is not a gate until you have watched it fail.
- Pick cycle tooling that resolves this repository's aliases and workspace edges. Prefer a configured linter rule or dependency-cruiser before adding another graph tool; verify an intentional cycle fails.
- dependency-cruiser without `options.tsConfig` cannot resolve path aliases, drops those edges, and passes every rule on a graph with half its imports missing.
- `turbo boundaries` checks cross-package imports and undeclared dependencies only; it sees nothing inside a package, so it does not replace the module boundary rule.
- A hand-rolled shrink-only baseline (`*-ratchet.mjs` plus `*.baseline.json`) reimplements the `ignore`, allowlist, and `warn` mechanisms knip, the linter, dependency-cruiser, and jscpd already ship, and the baseline becomes the file people edit for a green run.
- Dormant config or an unused devDep reads to an agent as live convention; a config pointing at a renamed file yields a confident empty result instead of an error.
- A docs index entry or add-a-new-X recipe written from memory names a moved file, and the agent follows the pointer with full confidence rather than doubting the doc. Grep-verify every path before publishing it.
- Pre-commit hooks alone are not installed on a fresh clone or in a worktree, which is exactly where agents run. CI is the gate; the hook is the fast signal.
- A LEGACY marker only in `docs/legacy.md` is never seen by an agent that arrived by grep. The marker goes at the top of the frozen file.

## Related skills

- `agents-md`: the AGENTS.md / CLAUDE.md file itself. This skill owns the checks and docs tree that file points at; a rule a linter can enforce goes here as an exit code, not there as prose.
- `tidy`: the diff-scoped cleanup that Harden's guardrails keep small; `pr-reviewer`: read-only review of a local diff.
- `planning`: a plan for one feature; architecture briefs from Design mode feed into it.
- `scaffold-nextjs`, `scaffold-cli`: creating the repo this skill then structures.
- `multi-tenant-architecture`: tenant identification, isolation, and routing; this skill supplies the module layout underneath.
- `dx-audit`: the developer-facing surface a package ships outward; `api-design.md` here covers only the contract shape.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
