---
name: define-architecture
description: Generates folder structures, module contracts, middleware pipelines, and frontend/backend boundaries for TypeScript full-stack applications, and finds domain-informed deepening opportunities in existing codebases. Use when setting up project structure, organizing a monorepo, defining folder layout, designing backend modules, establishing team conventions, improving the architecture of an existing codebase, or asking "how should I structure this app", "design the folder structure", "set up the architecture", or "find architecture improvements". For scaffolding a new Next.js repo use scaffold-nextjs, for a new TypeScript CLI use scaffold-cli, and for multi-tenant domain or isolation strategy use multi-tenant-architecture.
---

# Define Architecture

Define durable, easy-to-change architecture defaults for TypeScript full-stack apps, and produce an architecture brief the team can enforce.

- **IS:** designing folder structures, module contracts, middleware pipelines, and frontend/backend boundaries; writing an architecture brief; finding domain-informed deepening opportunities in an existing codebase.
- **IS NOT:** scaffolding a new repo (use `scaffold-nextjs` for a Next.js turborepo, `scaffold-cli` for a TypeScript CLI) or multi-tenant domain, isolation, and routing strategy (use `multi-tenant-architecture`).

## Contents

- Principles
- Workflow and references
- Setup workflow (new codebase)
- Adoption workflow (existing codebase)
- Validation loop
- Output template
- Related skills
- Gotchas

## Principles (ordered by priority)

1. **KISS**: the simplest architecture that solves the problem. Complexity is a cost, not a feature.
2. **YAGNI**: build what is needed now, not hypothetical futures.
3. **Easier to change**: isolate concerns so future changes stay local.
4. **Tracer bullet**: prove the approach with one minimum viable vertical slice before building layers.
5. **Duplication over wrong abstraction**: extract shared code only after three or more consumers need it.

When two recommendations conflict, the higher-numbered principle yields.

## Workflow

Copy and track this checklist:

```text
Architecture progress:
- [ ] Step 1: Pick the workflow (new codebase: Setup; existing codebase: Adoption)
- [ ] Step 2: Run the chosen workflow end to end
- [ ] Step 3: Write the architecture brief using the Output template
- [ ] Step 4: Run the Validation loop and record results in the brief
- [ ] Step 5: Fix any failed checks and re-run the loop
```

Load references only when their condition applies:

| Reference | Read when |
|-----------|-----------|
| [references/stack-defaults.md](references/stack-defaults.md) | Choosing libraries, tooling, or deploy targets for the brief |
| [references/api-design.md](references/api-design.md) | Designing endpoints, defining module contracts, or reviewing API surface changes |
| [references/deepening-existing.md](references/deepening-existing.md) | Running the Adoption workflow (domain mapping method, opportunity patterns, output template) |
| [references/craftsmanship.md](references/craftsmanship.md) | Writing the team-conventions or testing sections of the brief |
| [references/shipping-practices.md](references/shipping-practices.md) | Writing the rollout and rollback section of the brief |

## Setup workflow (new codebase)

1. Define constraints first:
   - Product scope, team size, compliance/security needs, expected scale.
   - Deployment targets and required integrations.
2. Choose repo shape:
   - `apps/` for deployable surfaces (`api`, `web`, `admin`).
   - `packages/` for shared libraries (`shared`, `ui`, `icons`, `auth`, `proto`).
3. Define backend module contracts:
   - `handler`: transport only.
   - `service`: business orchestration.
   - `dao`: database access only.
   - `mapper`: DB/proto/domain transformations.
   - `constants` and `types`: module-local contracts.
   - Name the enforcement mechanism (lint boundary rule or type check) alongside each contract.
4. Define request context and middleware:
   - Use an AsyncLocalStorage-backed `RequestContext`:
     ```ts
     import { AsyncLocalStorage } from "node:async_hooks";
     type RequestContext = { tenantId: string; userId: string; traceId: string };
     const store = new AsyncLocalStorage<RequestContext>();
     export const getContext = () => store.getStore()!;
     export const runWithContext = (ctx: RequestContext, fn: () => void) => store.run(ctx, fn);
     ```
   - Initialize context in every entrypoint (RPC, HTTP, jobs, CLI). Jobs and CLI are the ones teams forget; `getContext()` then throws at runtime far from the cause.
   - Read context via `getContext()`; never thread a ctx parameter through business functions.
   - Require an explicit auth policy per RPC method at registration time; a method without a policy fails registration rather than defaulting to open.
   - Keep auth, logging, errors, and context in shared middleware, not per-handler code.
5. Define frontend boundaries:
   - Default to Server Components; add `"use client"` only at the leaf components that need interactivity.
   - Server state lives in TanStack/Connect Query; client state in component state; reach for MobX only for cross-cutting client state that cannot live in either.
6. Define testing and release expectations:
   - Unit tests stay DB-free; integration and E2E tests run in parallel using dynamically generated IDs so runs never collide on fixtures.
   - Release in small, reversible steps with a rollback plan per change.

## Adoption workflow (existing codebase)

The goal is domain-informed deepening, not a rewrite. Load [references/deepening-existing.md](references/deepening-existing.md) for the analysis method, opportunity patterns, and output template.

1. **Map the domain language.** Read the code for the ubiquitous language in actual use: entities, actions, and bounded contexts as the team names them. Note naming divergence (one concept with three names, or one name covering three concepts).
2. **Find deepening opportunities.** Look for anemic domain concepts, leaking boundaries, naming divergence, duplicated concepts, primitive obsession, and misplaced logic. Record each as a concrete opportunity with file paths, never a vague smell.
3. **Rank by leverage.** Score opportunities against the Principles. Prefer changes that make the most future changes local for the least churn. Drop speculative cleanups that no current requirement justifies.
4. **Migrate one vertical slice first.** Pick the highest-leverage opportunity and prove the move end to end through one slice before generalizing.
5. **Add guardrails.** Enforce the new boundary with lint, type, or test checks so it cannot decay, then roll out module by module.

## Validation loop

Run before finalizing, and record the results in the brief (Open risks section). Each check must produce evidence; "looks consistent" is not a pass.

1. **Consistency:** naming, module boundaries, and middleware rules read the same across every service in the brief. Evidence: a contradiction scan of the brief with zero findings.
2. **Enforceability:** every contract in the brief names the lint rule, type check, or test that enforces it. Evidence: an enforcement column or note per contract.
3. **Operability:** observability, health checks, and rollback path are defined per deployable surface. Evidence: the rollout section names each.
4. **Quality gates (only when code was changed, e.g. an Adoption slice migration):** run the repo's lint, type-check, and targeted tests (`npm run lint`, `npm run check-types`, `npm run test --workspace=<pkg>` or the project equivalents). Evidence: passing output.

If any check fails: fix the brief or the conventions, then re-run the loop.

## Output template

Use this structure for architecture recommendations:

```markdown
# Architecture brief

## Context and constraints
## Repo shape
## Backend module contracts
## Request context and middleware policy
## Frontend boundaries
## Testing strategy
## Rollout and rollback plan
## Open risks and follow-ups
```

## Related skills

- `scaffold-nextjs` or `scaffold-cli`: scaffold the repo once the brief is agreed.
- `multi-tenant-architecture`: tenant identification, isolation, and domain strategy.
- `plan-creator`: turn an Adoption opportunity into an implementation plan.

## Gotchas

- Don't default to microservices for teams under 5: every service adds a deploy pipeline, contract versioning, and an on-call surface. Start with a modular monorepo and split when a boundary is proven by team or scale pressure.
- Don't put app-level dependencies in the root `package.json` of a monorepo: hoisting hides missing declarations, so an app builds locally and breaks the moment it deploys alone. Each app owns its deps.
- Don't define module contracts (handler/service/dao) without an enforcement mechanism: an unenforced contract decays at the first deadline. Add an import-boundary lint rule (e.g. `dao` may not import `handler`) the day the contract is written.
- Don't thread a ctx parameter through business functions instead of AsyncLocalStorage: every signature grows the argument, and adding one field later touches hundreds of call sites.
- Don't place `"use client"` at the page or layout level: it converts the whole subtree to client rendering and forfeits streaming and direct server data access. Push it to leaf components.
- Don't propose a big-bang rewrite during the Adoption workflow: migrate one vertical slice, verify it, then generalize.
- Don't extract to `packages/` early: wait until three or more apps need the same code; a premature shared package couples release cycles for nothing.
- Don't finalize a brief without a rollback plan per change: an architecture decision that cannot be reversed needs a documented fallback before it ships.
