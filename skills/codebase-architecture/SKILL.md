---
name: codebase-architecture
description: >-
  Designs, deepens, and hardens TypeScript codebase architecture in three
  modes: folder structures, module contracts, and middleware pipelines for a
  new app; domain-informed deepening of existing code; and the guardrail
  tooling, CI gates, and wayfinding that stop a structure decaying. Use when
  setting up project structure, organizing a monorepo, designing backend
  modules, writing an architecture brief, recovering domain terminology,
  recording an architecture decision, or asking "how should I structure this
  app", "find architecture improvements", "this module is a mess", "make this
  codebase agent-friendly", "set up guardrails for coding agents", "add a
  dead-code check", or "my agent can't find anything in this repo". For
  scaffolding a new repo use scaffold-nextjs or scaffold-cli, for multi-tenant
  isolation use multi-tenant-architecture, for the AGENTS.md file's own content
  use agents-md, and for review of a local diff use pr-reviewer.
---

# Codebase Architecture

Decide a TypeScript codebase's structure, improve it where change has become expensive, and make it hold. The target is a codebase a reader can hold in their head: few surfaces, one canonical way to do each job, and behaviour where you would first look for it.

- **IS:** folder structures, module contracts, middleware pipelines, frontend/backend boundaries; architecture briefs; domain language and decision records; domain-informed deepening; guardrail tooling, CI gates, and agent wayfinding.
- **IS NOT:** scaffolding a new repo (`scaffold-nextjs` for a Next.js turborepo, `scaffold-cli` for a TypeScript CLI), multi-tenant domain/isolation/routing (`multi-tenant-architecture`), the content of AGENTS.md itself (`agents-md`), a diff-scoped cleanup pass (`tidy`), or structural review of a local diff (`pr-reviewer`).

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

## Modes

Pick by the problem, not by the artifact.

| Mode | You are here when | Output |
|------|-------------------|--------|
| **Design** | Starting a new app, service, or surface, and the structure is not decided yet | An architecture brief |
| **Deepen** | The code works, but change is expensive: concepts scattered, seams leaking, one idea under three names | Ranked opportunities, then one migrated slice |
| **Harden** | The structure is decided and keeps decaying, or agents keep doing the wrong thing in this repo | Wired checks, markers, and recipes |

**Modes compose, and running more than one is normal.** Design ends in Harden, because a contract with no check is a suggestion. Deepen ends in Harden, so the new seam cannot decay back. Harden runs alone when the structure is already right and only the enforcement is missing, which is the common case in a repo that agents work in.

**When the two look equally right, prefer Deepen.** A user reporting "agents keep using the old pattern" is describing a Harden symptom, but if the cause is one concept living in two places, quarantine only freezes the duplicate in place: Deepen deletes it and Harden holds the line until that lands. Harden alone is the right answer when the old thing genuinely has to stay.

**When you cannot write to the repo** (no checkout, read-only request, or the user asked a question rather than for a change), each mode's output degrades to its plan: the brief, the ranked opportunities, or the named checks with their rungs. Say which checks remain unproven, since none of them are wired.

**As simple as possible, no simpler.** Every mode cuts: surfaces in Design, concepts in Deepen, dual paths and dormant config in Harden. The floor does not get cut for simplicity: validation at trust boundaries, error handling that prevents data loss, security, accessibility, observability on anything deployed, and whatever was explicitly asked for. A simplification that reaches one of those is a bug, not a simplification. Where a corner is genuinely cut on purpose, mark it with its ceiling and upgrade path rather than leaving the next reader to guess whether it is finished.

## References

Load only when the condition applies.

| Reference | Mode | Read when |
|-----------|------|-----------|
| [references/stack-defaults.md](references/stack-defaults.md) | Design | Choosing libraries, tooling, or deploy targets |
| [references/api-design.md](references/api-design.md) | Design, Deepen | Designing endpoints, module contracts, request context, or error shapes |
| [references/distributed-correctness.md](references/distributed-correctness.md) | Design, Deepen | The work provably touches an external system, webhook, retry, audit trail, or money. In Deepen you can grep for it; in Design it is a question about requirements, so confirm before loading rather than inferring it from the product's domain |
| [references/craftsmanship.md](references/craftsmanship.md) | Design | Writing the team-conventions, testing, or quality-bar sections |
| [references/shipping-practices.md](references/shipping-practices.md) | Design | Writing the rollout and rollback section |
| [references/deepening-existing.md](references/deepening-existing.md) | Deepen | Running Deepen: vocabulary, opportunity patterns, output template |
| [references/domain-language.md](references/domain-language.md) | Deepen | Writing or fixing a glossary, resolving naming divergence, recording a decision |
| [references/enforcement-ladder.md](references/enforcement-ladder.md) | Harden | Adding any check to a repo that already violates it |
| [references/guardrail-tooling.md](references/guardrail-tooling.md) | Harden | Choosing and wiring the actual checks |
| [references/wayfinding.md](references/wayfinding.md) | Harden | Agents cannot find things, or keep re-deriving the same path |
| [references/contagion-markers.md](references/contagion-markers.md) | Harden | The repo has legacy, generated, or dual-path code |
| [references/verification-tiers.md](references/verification-tiers.md) | Harden | Defining which commands an agent should run, and when |
| [references/agent-runtime.md](references/agent-runtime.md) | Harden | Configuring session hooks, permissions, or review gating |
| [references/evaluation-scenarios.md](references/evaluation-scenarios.md) | none | Changing this skill. Never loads during a user task; it is the author's rubric |

## Design mode (new codebase)

Before any of this, ask whether each surface needs to exist. A module, service, app, or entrypoint that could be a folder in something that already ships is the cheapest architecture decision available, and the only one that stays cheap. Every surface you do accept pays the relationship cost in `craftsmanship.md`'s surface-area budget: name its owner, tests, observability, and deletion path before it goes in the brief.

1. Constraints first: product scope, team size, compliance/security, expected scale, deploy targets, required integrations, and quality bar. A one-line request supplies none of these, so assume the common case, state every assumption you made in the brief's first section, and invite correction. Ask outright only where a wrong guess would restructure the brief rather than extend it, which in practice is multi-tenancy and whether the API is public.
2. Choose repo shape:
   - `apps/` for deployable surfaces (`api`, `web`, `admin`).
   - `packages/` for shared libraries (`shared`, `ui`, `icons`, `auth`, `proto`).
3. Define backend module contracts, each naming its enforcement (lint boundary rule or type check):
   - `handler`: transport only.
   - `service`: business orchestration.
   - `dao`: database access only.
   - `mapper`: DB/proto/domain transformations.
   - `constants` and `types`: module-local contracts.
4. Define request context and middleware:
   - Carry `tenantId`, `userId`, and `traceId` in an AsyncLocalStorage-backed `RequestContext`, initialized in every entrypoint (RPC, HTTP, jobs, CLI) and read via `getContext()`; never thread a ctx parameter through business functions. Implementation in [references/api-design.md](references/api-design.md).
   - Require explicit auth policy per RPC method at registration; a method without one fails registration, never defaults to open.
   - Keep auth, logging, errors, and context in shared middleware, not per-handler code.
5. Define frontend boundaries:
   - Default to Server Components; add `"use client"` only at leaf components needing interactivity.
   - Server state in TanStack/Connect Query; client state in component state; MobX only for cross-cutting client state that fits neither.
   - Each piece of data has exactly one owner. Never mirror server data into `useState` or sync two stores with `useEffect`; both are the red flag that ownership is unclear.
6. Testing and release:
   - Unit tests stay DB-free; integration/E2E run in parallel with dynamically generated IDs so runs never collide on fixtures.
   - Release in small, complete, reversible vertical slices with a rollback plan per change.
   - A slice is complete only when reliability, error paths, observability, and user-facing states are covered; do not defer them to a later polish pass.
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

1. **Survey what exists.** Package scripts, CI steps, hook config, lint config, the instruction file, the docs index. Find two things: checks that run locally but do not gate the merge, and dormant config nobody invokes. Wire the first, delete the second ([references/contagion-markers.md](references/contagion-markers.md)).
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
4. **Quality gates** (whenever code changed): the repo's lint, type-check, and targeted tests (`npm run lint`, `npm run check-types`, `npm run test --workspace=<pkg>` or equivalents). Evidence: passing output.
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

## Excuses

Each rebuttal redirects to the step being skipped; none of them repeat a gotcha below.

| Excuse | Rebuttal |
|--------|----------|
| "The check is obviously configured right." | You have not watched it fail. A misconfigured gate passes on everything and reads as coverage. |
| "There are too many existing violations to fix." | That is what the enforcement ladder is for. Pick a rung and land it green today rather than a perfect rule next quarter. |
| "AGENTS.md already says not to do that." | A prompt rule decays under context pressure. If a static tool can check it, it belongs in tooling. |
| "We'll add the enforcement in a follow-up." | The follow-up is the deadline's first casualty, and the contract decays from the day it ships unenforced. |

## Gotchas

### Design and Deepen

- Don't default to microservices for teams under 5: each service adds a deploy pipeline, contract versioning, and on-call surface. Start with a modular monorepo; split when a boundary is proven by team or scale pressure.
- Don't put app-level deps in a monorepo's root `package.json`: hoisting hides missing declarations, so an app builds locally but breaks deploying alone. Each app owns its deps.
- Don't define module contracts (handler/service/dao) without enforcement: an unenforced contract decays at the first deadline. Add an import-boundary lint rule (e.g. `dao` may not import `handler`) the day you write it.
- Don't thread a ctx parameter through business functions instead of AsyncLocalStorage: every signature grows, and adding one field later touches hundreds of call sites.
- Don't place `"use client"` at page or layout level: it converts the whole subtree to client rendering and forfeits streaming and direct server data access. Push it to leaves.
- Don't propose a big-bang rewrite in Deepen mode: migrate one vertical slice, verify it, then generalize.
- Don't extract to `packages/` early: wait until 3+ apps need the same code; a premature shared package couples release cycles for nothing. The exception is the contract two surfaces already share (generated types, the RPC schema, branded IDs): that is not speculative reuse, it is the interface between them, and it belongs in a package at two apps.
- Don't finalize a brief without a rollback plan per change: an irreversible decision needs a documented fallback before it ships.
- Don't dual-write to a database and a queue/webhook without an outbox (or CDC): one side commits, the other fails, and you silently lose or fabricate a notification. See `references/distributed-correctness.md`.
- Don't enforce an externally-forceable invariant by construction (unsigned type, hard CHECK): when the outside world forces the state, the system crashes or clamps instead of recording it. Represent it, detect it post-factum, recover explicitly.
- Don't scan a whole codebase for deepening opportunities: without git hot-spot scoping the list fills with modules nobody touches, and every entry on it is speculative by definition.
- Don't write a glossary entry for a general programming concept: a glossary earns its keep on the terms this product argues about, and padding it with "timeout" and "retry" trains everyone to skim it.

### Harden

- Don't hand-roll a shrink-only baseline (`*-ratchet.mjs` plus `*.baseline.json`): it was built once and deleted, because knip, eslint, madge, and jscpd all ship native ignore, allowlist, and warn mechanisms that do the same job with no code to maintain.
- Don't land a rule red: agents and humans both learn the check is noise, and the next person adds `--no-verify` instead of a fix.
- Don't leave dormant config or an unused devDep in place: an agent reads it as live convention and extends it, and one pointing at a missing file yields a confident wrong answer instead of an error.
- Don't index a doc that does not exist: agents cite confidently, so a dangling pointer is worse than a missing one.
- Don't write add-a-new-X recipes from memory: a recipe naming a moved file sends the agent somewhere wrong, and it will not doubt the doc.
- Don't rely on pre-commit hooks alone: they are not guaranteed installed on a fresh clone or in a worktree, which is exactly where agents run.
- Don't put a marker only in `docs/legacy.md`: an agent that arrived by grep never opens it. The marker goes in the frozen file.
- Don't generate the instruction file wholesale: generated files mostly restate documentation the agent can already read, cost 20 to 23% more per task, and measurably lose to hand-written ones. Hand-curate it and update it in the PR that changes the convention.
