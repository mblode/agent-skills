---
name: define-architecture
version: 0.1.0
description: Define repo layout, workflow, and full-stack architecture patterns for TypeScript apps. Use at project start or when setting conventions or designing backend services and middleware.
---

# Define Architecture

Define workflow, repo shape, and backend/frontend architecture patterns.

## Workflow

- Build frontend first: mock UI -> proto contract -> backend (TDD) -> integrate.
- Let unblocker infra (auth/middleware/schema) come first when needed.
- Ship small and reversible changes; rollback faster than you debate.
- Add structure only when customers pay, multiple contributors exist, or bugs cost real money/time.
- Use `references/shipping-practices.md` for rollout, flags, and feedback loops.

## Stack defaults

- Start from `references/stack-defaults.md` and adjust per project constraints.

## Monorepo shape (example)

- Use `apps/` for api, web, admin (adapt names to product domains).
- Use `packages/` for shared, ui, icons, auth.

## Backend module pattern

Split modules into:

- Handler: transport only.
- Service: business orchestration.
- DAO: DB access only (class with explicit methods).
- Mapper: DB/Proto/Domain transforms.
- Constants/types: module-level.

Follow DAO rules:

- Use explicit input/return types.
- Use Prisma select const pattern for DRY types.
- Audit log all Create/Update/Delete.

## Backend request context

- Use AsyncLocalStorage-backed `RequestContext`.
- Initialize context in every entrypoint (RPC, HTTP, jobs, CLI).
- Access via `getContext()`; no explicit context params.
- Let loggers read context automatically.

## ConnectRPC middleware rules

- Define a route policy for every method.
- Use shared middleware for auth, errors, logging, and context.
- No manual auth calls inside handlers.
- No try/catch for business logic; let error middleware handle.
- Use auth helpers (`requireUserAuth`, `requireStaffAuth`, `requireVenueAccess`, `getAuthContext`).
- Register services via `registerServiceWithPolicies`.

## Frontend architecture

- Server Components by default; "use client" only when needed.
- TanStack/Connect Query for server state; MobX only for global client state.
- Use `implement-frontend` for forms, hooks, and type safety.
- Use `audit-ui` for UI polish; use `ui-animation` for motion rules.

## Commands (common)

- Run `npm run dev` / `npm run dev --workspace=<pkg>`.
- Run `npm run build`, `npm run lint`, `npm run check-types`.
- Run `npm run test --workspace=<pkg>`, `npm run test:coverage --workspace=<pkg>`.
- Run `npm run codegen --workspace=packages/proto`.
- Run `npm run migrate:dev --workspace=apps/api`.

## Testing

- Require backend TDD: Red -> Green -> Refactor.
- Keep unit tests DB-free; run in parallel; mock dependencies.
- Run Integration/E2E in parallel with dynamic IDs.
- Use Vitest/jsdom for frontend tests as needed.

## Craftsmanship reference

- Use `references/craftsmanship.md` for debugging, testing, performance, portability, and professionalism checklists.
- Apply these when setting org-wide standards or reviewing architecture decisions.

## Conventions

- Prefer `interface` over `type`; use `interface extends` instead of `type &` (flat cached types vs recursive merge).
- Use `import type` for types.
- Configure Biome: 2-space indent, double quotes, semicolons, 100 char width.

## Commits and PRs

- Write commit subjects in imperative mood.
- Require green lint/type/tests, document migrations, and UI screenshots in PRs.
- Default to small changes, frequent merges, and a rollback plan. Use PRs as broadcast, not permission.

## Production readiness (priority order)

Prioritize in order:

- Security: rotate secrets, CORS, rate limits, headers, dependency scanning.
- Architecture: modular services, auth/error middleware, strict typing, and conventional/boring stacks.
- Infra: integration tests, health checks, automated deploys.
- Observability: tracing, audit logs, alerting.
