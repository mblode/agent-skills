# Design Mode

Structure for a new app, service, or surface, and the brief that records it. Make conventions enforceable; leave generic style advice out.

## Contents

- Before any surface
- Repo shape and module contracts
- Request context and middleware
- Frontend boundaries
- Testing and release
- Stack defaults
- Brief template
- Convention entries
- Testing shapes
- Rollout and rollback

## Before any surface

Ask whether each surface needs to exist. A module, service, app, or entrypoint that could be a folder in something that already ships is the cheapest decision available. Every surface you accept names its owner, tests, observability, and deletion path before it goes in the brief.

Constraints first: product scope, team size, compliance, expected scale, deploy targets, integrations, quality bar. A one-line request supplies none of these: assume the common case, state every assumption in the brief's first section, and invite correction.

## Repo shape and module contracts

- `apps/` for deployable surfaces (`web`, `api`, `worker`, `admin`); `packages/` for shared libraries (`ui`, `auth`, `proto`, `config`, `db`).
- Backend module contracts, each naming its enforcement: `handler` (transport only), `service` (orchestration), `dao` (database access only, takes the transaction client), `mapper` (DB/proto/domain transformations), `constants` and `types` (module-local).
- Extract to `packages/` only when 3+ apps need the code, except the contract two surfaces already share (generated types, the RPC schema, branded IDs), which belongs in a package at two.

## Request context and middleware

- Carry `tenantId`, `userId`, and `traceId` in an AsyncLocalStorage-backed `RequestContext`, initialized in every entrypoint (RPC, HTTP, jobs, CLI). A threaded `ctx` parameter grows every signature.
- Every RPC method declares an auth policy at registration; a method without one fails registration rather than defaulting to open.
- Auth, logging, errors, and context live in shared middleware, not per-handler code.

## Frontend boundaries

Next.js App Router default:

- `app/` holds routing files only. Domain code lives in `src/modules/<name>/` behind its root files; UI private to one route goes in a `_components/` folder beside its page.
- Server Components by default; `"use client"` at the interactive leaves, with server content passed in as `children`.
- Server state in TanStack or Connect Query; client state in components; one owner per piece of data. Server data mirrored into `useState`, or two stores synced with `useEffect`, means ownership is unclear.
- `proxy.ts` handles redirects, rewrites, and headers. Authorization is decided in each route handler and Server Function.

## Testing and release

- Unit tests stay database-free; integration and E2E tests generate unique IDs per run so parallel runs never collide.
- Release in small, complete, reversible vertical slices. A slice is complete only when error paths, observability, and user-facing states ship with it.

## Stack defaults

A preference, not a finding, and the most perishable content here. Confirm each choice against the current ecosystem before writing it into a brief, and record any deviation.

- npm workspaces + Turborepo; Next.js App Router + React; Tailwind CSS + shadcn/ui.
- React Hook Form + TanStack Query (Connect Query where the API is ConnectRPC); ConnectRPC + protobuf via Buf.
- Postgres + Prisma; Zod for config and boundary validation.
- Supabase (auth/storage), Stripe (payments), Resend (email), Twilio (SMS) where the product needs them.
- Ultracite over Oxlint + Oxfmt, hooks via Lefthook; Vitest; Playwright for E2E.
- Deploy: Vercel for web, a container host for API and worker.

## Brief template

```markdown
# Architecture brief

## Context and constraints (assumptions stated)
## Repo shape
## Backend module contracts
## Request context and middleware policy
## Frontend boundaries
## Tenancy (when applicable)
## Testing strategy
## Quality bar and surface-area budget
## Decisions (choice, reason, flip condition)
## Rollout and rollback plan
## Open risks and follow-ups
```

Drop any heading the project does not face. Each section carries the decision and the constraint that forced it, not a restatement of conventions.

## Convention entries

Each convention names four fields; one that cannot is a preference and stays out of the brief:

- **Boundary:** the files, modules, package, or entrypoint it applies to.
- **Failure mode:** the bug, drift, or operational failure it prevents.
- **Enforcement:** the lint rule, type check, test, generator, or review gate that catches violations.
- **Owner:** who owns exceptions.

Recurring shapes:

- **Layer imports:** handlers import services; services import DAOs and clients; DAOs import neither handlers nor request objects. Import-boundary lint.
- **Context initialization:** every entrypoint initializes `RequestContext` before shared services run. Entrypoint tests or a fail-closed bootstrap helper.
- **Auth policy registration:** type-level registry or startup validation.
- **Dependency ownership:** each deployable app declares its runtime dependencies; the root holds workspace tooling only.
- **Dependency-version single source:** pnpm `catalog:`, or `syncpack` version groups on npm workspaces.
- **Tool-owned ordering:** migrations and changelog entries are generated by their CLI, never hand-authored; a hand-typed future-dated migration blocks every one after it.
- **Surface-area budget:** a new module, route, job, flag, setting, or deployable names its relationships, owner, tests, observability, and deletion path before it is accepted.
- **Complete vertical slices:** a release gate rejects happy-path-only slices.
- **Domain language:** one canonical name per concept, aliases only for migration.

## Testing shapes

- **Test data isolation:** unique tenant, user, and resource IDs per run.
- **Invariants:** property-based tests asserting core invariants after every step of a generated operation sequence.
- **Idempotency:** replaying each outside-world operation produces no second effect.
- **Crash and resume:** inject a failure between each step of a long flow and assert it resumes consistently.
- **Round trip and backward compatibility:** serialize and convert back; a corpus of old-format payloads still deserializes.

## Rollout and rollback

Buy safety with the reversal path rather than the gate alone. Pin every deploy to a commit SHA so "what is running" is answerable, ship a rollback workflow that takes a target SHA, environment, and mandatory reason, and end it with a follow-up checklist (error rates by deployed version, then root cause).
