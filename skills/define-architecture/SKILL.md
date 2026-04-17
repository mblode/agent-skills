---
name: define-architecture
description: Generates folder structures, module contracts, middleware pipelines, and frontend/backend boundaries for TypeScript full-stack applications. Use when starting a project, setting up project structure, organizing a monorepo, configuring middleware, defining folder layout, designing backend modules, establishing team conventions, or asking "how should I structure this app", "design the folder structure", or "set up the architecture".
---

# Define Architecture

Define durable, easy-to-change architecture defaults for TypeScript apps.

## How to use this skill

Copy and track this checklist:

```text
Architecture progress:
- [ ] Step 1: Determine context (new vs existing codebase) and pick workflow
- [ ] Step 2: Run the chosen workflow end-to-end
- [ ] Step 3: Produce architecture brief using Output template
- [ ] Step 4: Run Validation loop (consistency, quality gates, operability)
- [ ] Step 5: Address any failed checks and re-run Validation loop
```

1. Determine context:
   - New codebase: follow `Architecture setup workflow`.
   - Existing codebase: follow `Adoption workflow`.
2. Produce an architecture brief using `Output template`.
3. Run `Validation loop` before finalizing.

Load references only when needed:
- Stack defaults: [references/stack-defaults.md](references/stack-defaults.md)
- Shipping and rollout: [references/shipping-practices.md](references/shipping-practices.md)
- Engineering quality checklists: [references/craftsmanship.md](references/craftsmanship.md)

## Architecture setup workflow

1. Define constraints first:
   - Product scope, team size, compliance/security needs, expected scale.
   - Deployment targets and required integrations.
2. Choose repo shape:
   - Use `apps/` for deployable surfaces (`api`, `web`, `admin`).
   - Use `packages/` for shared libraries (`shared`, `ui`, `icons`, `auth`, `proto`).
3. Define backend module contracts:
   - `handler`: transport only.
   - `service`: business orchestration.
   - `dao`: database access only.
   - `mapper`: DB/proto/domain transformations.
   - `constants` and `types`: module-local contracts.
4. Define request context and middleware:
   - Use AsyncLocalStorage-backed `RequestContext`:
     ```ts
     import { AsyncLocalStorage } from "node:async_hooks";
     type RequestContext = { tenantId: string; userId: string; traceId: string };
     const store = new AsyncLocalStorage<RequestContext>();
     export const getContext = () => store.getStore()!;
     export const runWithContext = (ctx: RequestContext, fn: () => void) => store.run(ctx, fn);
     ```
   - Initialize context in every entrypoint (RPC, HTTP, jobs, CLI).
   - Read context via `getContext()`; do not thread context params through business functions.
   - Require route policy per RPC method and register services through `registerServiceWithPolicies`.
   - Keep auth, logging, errors, and context in shared middleware.
5. Define frontend boundaries:
   - Default to Server Components; add `"use client"` only for client-only behavior.
   - Use TanStack/Connect Query for server state.
   - Use MobX only for cross-cutting client state that cannot live in component state.
   - Keep forms, hooks, and UI mappings type-safe and implementation-focused.
6. Define testing and release expectations:
   - Backend TDD loop: Red -> Green -> Refactor.
   - Unit tests stay DB-free; integration and E2E tests run in parallel with dynamic IDs.
   - Release in small, reversible steps with a rollback plan.

## Adoption workflow (existing codebase)

1. Map current architecture and pain points.
2. Select the smallest set of changes that enforce clear module boundaries.
3. Migrate one vertical slice first.
4. Add guardrails (lint/type/test checks) to prevent regression.
5. Roll out module-by-module.

## Stack defaults

Use [references/stack-defaults.md](references/stack-defaults.md) as the default baseline. Deviate only when constraints require it.

## Validation loop

Run this loop before finalizing architecture decisions:

1. Verify consistency:
   - Naming, module boundaries, and middleware rules are applied the same way across services.
2. Verify quality gates:
   - `npm run lint`
   - `npm run check-types`
   - `npm run test --workspace=<pkg>` (or equivalent targeted tests)
3. Verify operability:
   - Observability, health checks, and rollback path are defined.
4. If any check fails:
   - Fix the architecture brief or conventions.
   - Re-run the loop.

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

## Skill handoffs

- Use `ui-audit` for final UI quality checks.
- Use `ui-animation` for motion-specific guidance.

## Gotchas

- Don't default to microservices for teams under 5 — start with a modular monorepo and split later when boundaries are proven.
- Don't put app-level dependencies in root `package.json` in a monorepo — each app owns its deps.
- Don't skip the adoption workflow for existing codebases — big-bang rewrites fail; migrate one vertical slice first.
- Don't define module contracts (handler/service/dao) without enforcing them via lint rules or type checks — unenforced contracts decay immediately.
- Don't over-abstract shared packages early — wait until three or more apps need the same code before extracting to `packages/`.
- Don't skip the rollback plan — every architecture decision should be reversible or have a documented fallback.
