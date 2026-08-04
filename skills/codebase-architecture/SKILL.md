---
name: codebase-architecture
description: Generates folder structures, module contracts, middleware pipelines, and frontend/backend boundaries for TypeScript full-stack applications, and finds domain-informed deepening opportunities in existing codebases. Use when setting up project structure, organizing a monorepo, defining folder layout, designing backend modules, establishing team conventions, recovering domain terminology, recording an architecture decision, improving architecture outside a local diff, writing an architecture brief, or asking "how should I structure this app", "design the folder structure", "set up the architecture", "find architecture improvements", "this module is a mess", or "make this codebase easier to change". For hardening a repo so coding agents work in it cheaply use agent-ready-codebase, for scaffolding a new Next.js repo use scaffold-nextjs, for a new TypeScript CLI use scaffold-cli, for multi-tenant domain or isolation strategy use multi-tenant-architecture, and for structural review of a local diff use pr-reviewer.
---

# Codebase Architecture

Define durable, easy-to-change architecture defaults for TypeScript full-stack apps; produce an enforceable architecture brief.

- **IS:** folder structures, module contracts, middleware pipelines, frontend/backend boundaries; architecture briefs; domain language and decision records; domain-informed deepening of an existing codebase.
- **IS NOT:** wiring guardrail tooling, CI gates, or agent wayfinding into a repo (`agent-ready-codebase`), scaffolding a new repo (`scaffold-nextjs` for a Next.js turborepo, `scaffold-cli` for a TypeScript CLI), multi-tenant domain/isolation/routing (`multi-tenant-architecture`), or structural review of a local diff (`pr-reviewer`).

## Contents

- Workflow and references
- Setup workflow (new codebase)
- Adoption workflow (existing codebase)
- Validation loop
- Output template
- Related skills
- Gotchas

## Workflow and references

Track this checklist:

```text
Architecture progress:
- [ ] Step 1: Pick workflow (new codebase: Setup; existing: Adoption)
- [ ] Step 2: Run it end to end
- [ ] Step 3: Write the brief (Output template)
- [ ] Step 4: Run Validation loop, record results in brief
- [ ] Step 5: Fix failed checks, re-run loop
```

Load references only when the condition applies:

| Reference | Read when |
|-----------|-----------|
| [references/stack-defaults.md](references/stack-defaults.md) | Choosing libraries, tooling, or deploy targets |
| [references/api-design.md](references/api-design.md) | Designing endpoints, module contracts, or request context; reviewing API surface changes |
| [references/distributed-correctness.md](references/distributed-correctness.md) | Designing flows that call external systems, consume webhooks, retry, need an audit trail, or move money (billing, credits, payouts) |
| [references/deepening-existing.md](references/deepening-existing.md) | Running the Adoption workflow (vocabulary, opportunity patterns, output template) |
| [references/domain-language.md](references/domain-language.md) | Writing or fixing a glossary, resolving naming divergence, recording an architecture decision |
| [references/craftsmanship.md](references/craftsmanship.md) | Writing the team-conventions, testing, or quality-bar sections |
| [references/shipping-practices.md](references/shipping-practices.md) | Writing the rollout and rollback section |

## Setup workflow (new codebase)

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
7. Guardrails: every contract in the brief names the lint rule, type check, or test that catches its violation. Run `agent-ready-codebase` to wire them.

## Adoption workflow (existing codebase)

Goal: domain-informed deepening, not a rewrite. Load [references/deepening-existing.md](references/deepening-existing.md) for the analysis method, opportunity patterns, and output template.

1. **Map the domain language and decisions.** Read `CONTEXT.md`, `docs/adr/`, or local equivalents if present, then read the code for entities, actions, and contexts as the team names them. Note divergence (one concept, three names; or one name, three concepts). Format and ADR rules in [references/domain-language.md](references/domain-language.md).
2. **Scope the scan by where change lands.** Deepening pays off on code that keeps changing, so `git log --oneline` over a good stretch of history first and weight the files that keep coming up. An unscoped scan drifts into speculative cleanup.
3. **Find deepening opportunities.** Look for anemic concepts, shallow modules, leaking seams, naming divergence, duplicated concepts, primitive obsession, misplaced logic, and tests forced past the public interface. Record each with file paths, never a vague smell.
4. **Rank by leverage.** Prefer opportunities that pass the deletion test, localize named future changes, have low churn, meet a current requirement, and have a viable testing seam. Rank candidates before designing target interfaces; drop speculative cleanups.
5. **Migrate one vertical slice first.** Prove the highest-leverage move end to end through one slice before generalizing.
6. **Add guardrails.** Enforce the new seam with lint, type, or test checks so it cannot decay, then roll out module by module. Run `agent-ready-codebase` for the enforcement rung, wiring, and the check-bites test.

## Validation loop

Run before finalizing; record results in the brief (Open risks). Each check needs evidence; "looks consistent" is not a pass.

1. **Consistency:** naming, module boundaries, and middleware rules read the same across every service. Evidence: a contradiction scan with zero findings.
2. **Enforceability:** every contract names its lint rule, type check, or test. Evidence: an enforcement column or note per contract. Where a check was actually installed, evidence is stronger: the check observed passing, then failing on a deliberately introduced violation, then passing again after revert.
3. **Operability:** observability, health checks, and rollback path per deployable surface. Evidence: the rollout section names each.
4. **Quality gates (only when code changed, e.g. an Adoption slice):** run the repo's lint, type-check, and targeted tests (`npm run lint`, `npm run check-types`, `npm run test --workspace=<pkg>` or equivalents). Evidence: passing output.

On failure: fix the brief or conventions, then re-run the loop.

## Output template

Use this structure:

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

## Related skills

- `agent-ready-codebase`: wire the brief's contracts into hooks and CI, and make the structure cheap for agents to navigate. This skill decides what the structure should be; that one makes it hold.
- `scaffold-nextjs` or `scaffold-cli`: scaffold the repo once the brief is agreed.
- `multi-tenant-architecture`: tenant identification, isolation, and domain strategy.
- `pr-reviewer`: structural review of a local diff once implemented.
- `planning`: turn an Adoption opportunity into an implementation plan, then stress-test it.
- `agents-md`: audit and refactor the AGENTS.md file itself.
- `tidy`: diff-scoped cleanup pass.

## Gotchas

- Don't default to microservices for teams under 5: each service adds a deploy pipeline, contract versioning, and on-call surface. Start with a modular monorepo; split when a boundary is proven by team or scale pressure.
- Don't put app-level deps in a monorepo's root `package.json`: hoisting hides missing declarations, so an app builds locally but breaks deploying alone. Each app owns its deps.
- Don't define module contracts (handler/service/dao) without enforcement: an unenforced contract decays at the first deadline. Add an import-boundary lint rule (e.g. `dao` may not import `handler`) the day you write it.
- Don't thread a ctx parameter through business functions instead of AsyncLocalStorage: every signature grows, and adding one field later touches hundreds of call sites.
- Don't place `"use client"` at page or layout level: it converts the whole subtree to client rendering and forfeits streaming and direct server data access. Push it to leaves.
- Don't propose a big-bang rewrite during Adoption: migrate one vertical slice, verify it, then generalize.
- Don't extract to `packages/` early: wait until 3+ apps need the same code; a premature shared package couples release cycles for nothing.
- Don't finalize a brief without a rollback plan per change: an irreversible decision needs a documented fallback before it ships.
- Don't dual-write to a database and a queue/webhook without an outbox (or CDC): one side commits, the other fails, and you silently lose or fabricate a notification. See `references/distributed-correctness.md`.
- Don't enforce an externally-forceable invariant by construction (unsigned type, hard CHECK): when the outside world forces the state, the system crashes or clamps instead of recording it. Represent it, detect it post-factum, recover explicitly.
- Don't scan a whole codebase for deepening opportunities: without git hot-spot scoping the list fills with modules nobody touches, and every entry on it is speculative by definition.
- Don't write a glossary entry for a general programming concept: a glossary earns its keep on the terms this product argues about, and padding it with "timeout" and "retry" trains everyone to skim it.
