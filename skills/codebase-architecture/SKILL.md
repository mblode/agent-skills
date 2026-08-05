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

Decide a TypeScript codebase's structure, improve it where change has become expensive, and make it hold.

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
- Related skills
- Gotchas

## Modes

Pick by the problem, not by the artifact.

| Mode | You are here when | Output |
|------|-------------------|--------|
| **Design** | Starting a new app, service, or surface, and the structure is not decided yet | An architecture brief |
| **Deepen** | The code works, but change is expensive: concepts scattered, seams leaking, one idea under three names | Ranked opportunities, then one migrated slice |
| **Harden** | The structure is decided and keeps decaying, or agents keep doing the wrong thing in this repo | Wired checks, markers, and recipes |

**Modes compose, and running more than one is normal.** Design ends in Harden, because a contract with no check is a suggestion. Deepen ends in Harden, so the new seam cannot decay back. Harden runs alone when the structure is already right and only the enforcement is missing, which is the common case in a repo that agents work in.

Track this checklist:

```text
Architecture progress:
- [ ] Step 1: Pick the mode or modes
- [ ] Step 2: Run each end to end
- [ ] Step 3: Produce the output (brief, ranked opportunities, or wired checks)
- [ ] Step 4: Run the Validation loop items for the modes you ran
- [ ] Step 5: Fix what failed, re-run the loop
```

## References

Load only when the condition applies.

| Reference | Mode | Read when |
|-----------|------|-----------|
| [references/stack-defaults.md](references/stack-defaults.md) | Design | Choosing libraries, tooling, or deploy targets |
| [references/api-design.md](references/api-design.md) | Design, Deepen | Designing endpoints, module contracts, request context, or error shapes |
| [references/distributed-correctness.md](references/distributed-correctness.md) | Design, Deepen | Flows that call external systems, consume webhooks, retry, need an audit trail, or move money |
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

## Design mode (new codebase)

1. Constraints first: product scope, team size, compliance/security, expected scale, deploy targets, required integrations, and quality bar.
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
3. **Find deepening opportunities.** Look for anemic concepts, shallow modules, leaking seams, naming divergence, duplicated concepts, primitive obsession, misplaced logic, and tests forced past the public interface. Record each with file paths, never a vague smell.
4. **Rank by leverage.** Prefer opportunities that pass the deletion test, localize named future changes, have low churn, meet a current requirement, and have a viable testing seam. Rank candidates before designing target interfaces; drop speculative cleanups.
5. **Migrate one vertical slice first.** Prove the highest-leverage move end to end through one slice before generalizing.
6. **Enforce the new seam** with lint, type, or test checks so it cannot decay, then roll out module by module. Continue into Harden mode for the enforcement rung and the check-bites test.

## Harden mode (make it stick)

Two halves: **guardrails** stop the wrong thing landing, **wayfinding** makes the right thing cheap to find. Both exist because agents arrive by grep, not by reading docs, so the warning has to live where they land and the rule has to be an exit code rather than a sentence someone might recall.

1. **Survey what exists.** Package scripts, CI steps, hook config, lint config, the instruction file, the docs index. Find two things: checks that run locally but do not gate the merge, and dormant config nobody invokes. Delete the dormant config, especially anything pointing at a path that no longer exists; an agent reads it as live convention, and a check aimed at a missing file passes while covering nothing.
2. **Choose checks by the failure they prevent**, never by tool popularity. Categories and tools in [references/guardrail-tooling.md](references/guardrail-tooling.md). Pick the two or three failures this repo actually exhibits; installing the full set at once forces the weakest enforcement rung on all of them.
3. **Install each check:** pick an enforcement rung for the violations that already exist ([references/enforcement-ladder.md](references/enforcement-ladder.md)), ship it green, then prove it bites (run it, break it on purpose, watch it fail with a message naming the fix, revert). Wire it into both a pre-commit hook and CI.
4. **Wayfinding** per [references/wayfinding.md](references/wayfinding.md): naming and locality, the add-a-new-X recipe file, the trust-labeled docs index, one canonical instruction file. The recipe file is the highest-value item and the one most often skipped.
5. **Contagion markers** per [references/contagion-markers.md](references/contagion-markers.md): anything an agent must not copy or must not edit gets a greppable marker at the code site naming what to use instead.
6. **Runtime ergonomics:** verification tiers in [references/verification-tiers.md](references/verification-tiers.md); session hooks, permission allowlists, and review gating in [references/agent-runtime.md](references/agent-runtime.md).

## Validation loop

Run the items matching the modes you ran, and record results in the output. Each needs evidence; "looks consistent" is not a pass.

1. **Consistency** (Design, Deepen): naming, module contracts, and middleware rules read the same across every service. Evidence: a contradiction scan with zero findings.
2. **Enforceability** (all): every contract names its lint rule, type check, or test. Evidence: an enforcement note per contract, and for any check actually installed, the pass, then fail on a deliberate violation, then pass after revert.
3. **Operability** (Design): observability, health checks, and a rollback path per deployable surface. Evidence: the rollout section names each.
4. **Quality gates** (whenever code changed): the repo's lint, type-check, and targeted tests (`npm run lint`, `npm run check-types`, `npm run test --workspace=<pkg>` or equivalents). Evidence: passing output.
5. **CI and local agree** (Harden): the CI step invokes the same umbrella command a developer runs, or the difference is deliberate and stated.
6. **No dangling pointers, and a recipe works cold** (Harden): a grep proving every path named in the docs index and instruction file exists, plus a fresh-context agent following one add-a-new-X recipe end to end with no further guidance.

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

| Excuse | Rebuttal |
|--------|----------|
| "The check is obviously configured right." | You have not watched it fail. A misconfigured gate passes on everything and reads as coverage. |
| "There are too many existing violations to fix." | That is what the enforcement ladder is for. Pick a rung and land it green today rather than a perfect rule next quarter. |
| "I'll write the baseline file, it's only 30 lines." | It was built and deleted. Every tool in this category ships the mechanism already; the custom layer is maintenance for no added coverage. |
| "AGENTS.md already says not to do that." | A prompt rule decays under context pressure. If a static tool can check it, it belongs in tooling. |
| "The recipe is obvious, I don't need to trace it." | A recipe naming a file that moved sends the agent to the wrong place with full confidence. Trace it. |
| "We'll add the enforcement in a follow-up." | The follow-up is the deadline's first casualty, and the contract decays from the day it ships unenforced. |

## Related skills

- `scaffold-nextjs` or `scaffold-cli`: scaffold the repo once the brief is agreed.
- `multi-tenant-architecture`: tenant identification, isolation, and domain strategy.
- `pr-reviewer`: structural review of a local diff once implemented.
- `planning`: turn a Deepen opportunity into an implementation plan, then stress-test it.
- `agents-md`: the instruction file's own content. Harden mode decides what moves out of it into tooling, and owns the docs tree around it.
- `tidy`: diff-scoped cleanup. Harden mode's guardrails are what keep each tidy pass small.
- `dx-audit`: the developer surface a library, CLI, or SDK ships outward, rather than the repo worked in.

## Gotchas

### Design and Deepen

- Don't default to microservices for teams under 5: each service adds a deploy pipeline, contract versioning, and on-call surface. Start with a modular monorepo; split when a boundary is proven by team or scale pressure.
- Don't put app-level deps in a monorepo's root `package.json`: hoisting hides missing declarations, so an app builds locally but breaks deploying alone. Each app owns its deps.
- Don't define module contracts (handler/service/dao) without enforcement: an unenforced contract decays at the first deadline. Add an import-boundary lint rule (e.g. `dao` may not import `handler`) the day you write it.
- Don't thread a ctx parameter through business functions instead of AsyncLocalStorage: every signature grows, and adding one field later touches hundreds of call sites.
- Don't place `"use client"` at page or layout level: it converts the whole subtree to client rendering and forfeits streaming and direct server data access. Push it to leaves.
- Don't propose a big-bang rewrite in Deepen mode: migrate one vertical slice, verify it, then generalize.
- Don't extract to `packages/` early: wait until 3+ apps need the same code; a premature shared package couples release cycles for nothing.
- Don't finalize a brief without a rollback plan per change: an irreversible decision needs a documented fallback before it ships.
- Don't dual-write to a database and a queue/webhook without an outbox (or CDC): one side commits, the other fails, and you silently lose or fabricate a notification. See `references/distributed-correctness.md`.
- Don't enforce an externally-forceable invariant by construction (unsigned type, hard CHECK): when the outside world forces the state, the system crashes or clamps instead of recording it. Represent it, detect it post-factum, recover explicitly.
- Don't scan a whole codebase for deepening opportunities: without git hot-spot scoping the list fills with modules nobody touches, and every entry on it is speculative by definition.
- Don't write a glossary entry for a general programming concept: a glossary earns its keep on the terms this product argues about, and padding it with "timeout" and "retry" trains everyone to skim it.

### Harden

- Don't hand-roll a shrink-only baseline (`*-ratchet.mjs` plus `*.baseline.json`): it was built once and deleted, because knip, eslint, madge, and jscpd all ship native ignore, allowlist, and warn mechanisms that do the same job with no code to maintain.
- Don't land a rule red: agents and humans both learn the check is noise, and the next person adds `--no-verify` instead of a fix.
- Don't ship a check you have not watched fail: a wrong glob or a filter matching zero files passes on everything and reads as coverage.
- Don't leave dormant config or an unused devDep in place: an agent reads it as live convention and extends it, and one pointing at a missing file yields a confident wrong answer instead of an error.
- Don't index a doc that does not exist: agents cite confidently, so a dangling pointer is worse than a missing one.
- Don't write add-a-new-X recipes from memory: a recipe naming a moved file sends the agent somewhere wrong, and it will not doubt the doc.
- Don't rely on pre-commit hooks alone: they are not guaranteed installed on a fresh clone or in a worktree, which is exactly where agents run.
- Don't put a marker only in `docs/legacy.md`: an agent that arrived by grep never opens it. The marker goes in the frozen file.
- Don't generate the instruction file wholesale: one 2026 study found LLM-generated context files reduced task success and raised inference cost. Hand-curate it and update it in the PR that changes the convention.
