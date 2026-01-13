---
name: repository-workflow
description: Development workflow and repo conventions. Use when starting new projects, organizing modules, or establishing patterns for frontend, backend, and testing.
---

# Repository Workflow

## Principles
- Build frontend first: mock UI -> proto contract -> backend (TDD) -> integrate.
- Exception: unblocker infra (auth/middleware/schema) can come first.
- For backend context/middleware rules, use `fullstack-architecture`.

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

## Commands (common)
- `npm run dev` / `npm run dev --workspace=<pkg>`
- `npm run build`, `npm run lint`, `npm run check-types`
- `npm run test --workspace=<pkg>`, `npm run test:coverage --workspace=<pkg>`
- `npm run codegen --workspace=packages/proto`
- `npm run migrate:dev --workspace=apps/api`

## Stack defaults (adjust per project)
- Next.js, React, Tailwind.
- Fastify/Express, Prisma, Postgres.
- Supabase or Clerk for auth; Vercel for frontend deploy.

## Frontend UX baseline
- Use `craft-checklist` for UI polish and `animation-guidelines` for motion.

## Style rules
- Files: kebab-case; components: PascalCase; functions: camelCase; constants: UPPER_SNAKE_CASE.
- Prefer `type` over `interface`.
- Forbid `any`, `as any`, and `@ts-ignore`.
- Remove all `console.*` and `debugger`.

## Testing
- Backend TDD required: Red -> Green -> Refactor.
- Unit tests: no DB; run in parallel; mock dependencies.
- Integration/E2E: parallel with dynamic IDs.

## Commits and PRs
- Commit subjects in imperative mood.
- PRs: green lint/type/tests, document migrations, add UI screenshots.

## Production readiness (priority order)
- Security: rotate secrets, CORS, rate limits, headers, dependency scanning.
- Architecture: modular services, auth/error middleware, strict typing.
- Infra: integration tests, health checks, automated deploys.
- Observability: tracing, audit logs, alerting.
