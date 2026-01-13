---
name: define-architecture
description: Define repo layout, workflow, and full-stack architecture patterns for TypeScript apps. Use at project start or when setting conventions or designing backend services and middleware.
---

# Define Architecture

Define workflow, repo shape, and backend/frontend architecture patterns.

## Workflow

- Build frontend first: mock UI -> proto contract -> backend (TDD) -> integrate.
- Exception: unblocker infra (auth/middleware/schema) can come first.

## Stack defaults (adjust per project)

- Turborepo + npm workspaces.
- Next.js App Router + React.
- ConnectRPC + protobuf types.
- Prisma + Postgres.
- Supabase (auth/storage), Stripe (payments), Resend (email), Twilio (SMS).
- Ultracite withBiome
- Vitest.

## Monorepo shape (example)

- apps/: api, web, admin (adapt names to product domains)
- packages/: shared, ui, icons, auth

## Backend module pattern

- Handler: transport only.
- Service: business orchestration.
- DAO: DB access only (class with explicit methods).
- Mapper: DB/Proto/Domain transforms.
- Constants/types: module-level.

DAO rules

- Explicit input/return types.
- Prisma select const pattern for DRY types.
- Audit log all Create/Update/Delete.

## Backend request context

- Use AsyncLocalStorage-backed `RequestContext`.
- Initialise context in every entrypoint (RPC, HTTP, jobs, CLI).
- Access via `getContext()`; no explicit context params.
- Loggers read context automatically.

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
- Use `audit-ui` for UI polish and motion rules.

## Commands (common)

- `npm run dev` / `npm run dev --workspace=<pkg>`
- `npm run build`, `npm run lint`, `npm run check-types`
- `npm run test --workspace=<pkg>`, `npm run test:coverage --workspace=<pkg>`
- `npm run codegen --workspace=packages/proto`
- `npm run migrate:dev --workspace=apps/api`

## Testing

- Backend TDD required: Red -> Green -> Refactor.
- Unit tests: no DB; run in parallel; mock dependencies.
- Integration/E2E: parallel with dynamic IDs.
- Frontend tests: Vitest/jsdom as needed.

## Conventions

- Prefer `type` over `interface`.
- Use `import type` for types.
- Biome: 2-space indent, double quotes, semicolons, 100 char width.

## Commits and PRs

- Commit subjects in imperative mood.
- PRs: green lint/type/tests, document migrations, add UI screenshots.

## Production readiness (priority order)

- Security: rotate secrets, CORS, rate limits, headers, dependency scanning.
- Architecture: modular services, auth/error middleware, strict typing.
- Infra: integration tests, health checks, automated deploys.
- Observability: tracing, audit logs, alerting.
