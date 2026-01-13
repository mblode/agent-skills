---
name: fullstack-architecture
description: Architecture patterns for TypeScript full-stack apps (backend context, ConnectRPC, DAOs, and frontend integration). Use when setting up projects or implementing backend services and middleware.
---

# Full-Stack Architecture

## Stack (typical)
- Turborepo + npm workspaces.
- Next.js App Router + React.
- ConnectRPC + protobuf types.
- Prisma + Postgres.
- Supabase (auth/storage), Stripe (payments).
- Biome + Vitest.

## Workflow
- Use `repository-workflow` for frontend-first development and TDD process.

## Frontend UX baseline
- Use `craft-checklist` for UI polish and `animation-guidelines` for motion.
- Use `frontend-standards` for forms, hooks, and type safety.

## Backend request context
- Use AsyncLocalStorage-backed `RequestContext`.
- Initialize context in every entrypoint (RPC, HTTP, jobs, CLI).
- Access via `getContext()`; no explicit context params.
- Loggers read context automatically.

## ConnectRPC middleware rules
- Define a route policy for every method.
- Use shared middleware for auth, errors, logging, and context.
- No manual auth calls inside handlers.
- No try/catch for business logic; let error middleware handle.
- Use auth helpers (`requireUserAuth`, `requireStaffAuth`, `requireVenueAccess`, `getAuthContext`).
- Register services via `registerServiceWithPolicies`.

## File organization
- Handlers: transport only.
- Services: business orchestration.
- DAOs: DB access only; class-based methods with explicit types.
- Mappers: DB/Proto/Domain transforms.
- Constants/types: module-level.
- Audit log all Create/Update/Delete in DAOs.

## Frontend architecture
- Server Components by default; "use client" only when needed.
- TanStack/Connect Query for server state; MobX only for global client state.
- Form rules live in `frontend-standards`.

## Testing
- Unit tests: parallel, no DB, mocks only.
- Integration/E2E: parallel with dynamic IDs.
- Frontend tests: Vitest/jsdom as needed.

## Conventions
- Prefer `type` over `interface`.
- Use `import type` for types.
- Biome: 2-space indent, double quotes, semicolons, 100 char width.

## Shared packages
- `packages/proto` for API contracts.
- `packages/ui` for shared components.
- `packages/icons` for icon set.
