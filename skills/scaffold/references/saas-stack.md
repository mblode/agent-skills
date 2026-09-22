# SaaS Stack Profile

The audited rebuild stack: npm workspaces and Turborepo; Next.js in `apps/web` on Vercel; Fastify in `apps/api` and a pg-boss worker in `apps/worker`, both as containers; ConnectRPC with Buf-generated clients in `packages/proto`; Zod config in `packages/config`; Postgres with Prisma in `packages/db`, RLS forced, separate migration and app roles; a transactional outbox relayed into pg-boss; OpenTelemetry in every process. Start `apps/web` from the web profile. Templates are in `templates/saas/`. Structure, tenancy, and the first vertical slice are `architecture`; this profile is what the empty repo must prove before anyone builds on it.

## What the cold clone must prove

Run `scripts/cold-clone.sh` against the committed state with a disposable Postgres, and report each line with its kind:

| Step | Kind | Passes when |
|---|---|---|
| `npm ci` | fresh | The lockfile installs cleanly on the target Node version |
| `npm run codegen` | fresh | Buf and Prisma generation produce the committed or declared outputs; regenerate-and-diff is clean |
| `npm run check` | fresh | Lint, format, and typecheck across every workspace |
| `npm test` with `TURBO_FORCE=true` | fresh | Passes with the cache disabled on a freshly migrated database; a cached green does not count |
| `npm run build` | build | Every workspace builds, including the API and worker container images |
| Dev startup | runtime | `npm run dev` brings up web, API, and worker; each answers readiness |
| Prod startup | runtime | The built output of each process starts with production settings and answers readiness |

The scaffold is not done until every row passes. Versions are whatever the lockfile resolved on the day; nothing here pins one.

## Contracts the skeleton carries

- **Config at the entrypoint.** `config.ts` exports `loadConfig()`; no module parses the environment at import. `.env.example` lists every key.
- **Two database roles.** `db-roles.sql`: the migration role owns tables and runs migrations; every process connects as the app role, which is not a superuser, lacks `BYPASSRLS`, and owns nothing. Tenant tables `ENABLE` and `FORCE` row-level security in the migration that creates them.
- **Queues before workers.** The worker creates its queues idempotently at startup before registering any handler, so a fresh database works.
- **Telemetry first.** `instrumentation.ts` loads through `node --import` before the app, and each entrypoint's shutdown handler calls `shutdownTelemetry()` last.
- **Codegen is a task.** `turbo.json` makes `build`, `check-types`, `lint`, `test`, and `dev` depend on `codegen`, so a clean clone never typechecks against missing generated code.
- **Dev resolves like prod.** Workspace packages resolve in dev the same way as in the build. Running TypeScript source directly with type stripping and `.js` import specifiers that point into `.ts` files fails at startup, so dev startup is a row in the table, not an assumption.

## Gotchas

- A cached `turbo run test` was green while `--force` failed on an environment singleton evaluated at import. `TURBO_FORCE=true` in the script exists for this.
- Dev startup failed on ESM resolution while build and tests passed; only starting the process caught it.
- Queues were missing on a fresh database because registration ran before creation.
- The telemetry initializer was exported and never invoked, and logging had no completion hook; the skeleton imports it via `--import` so there is nothing to forget.
- The app connected as the table owner, so RLS policies were "on" and enforced nothing. Assert the app role's flags from `db-roles.sql` in a test.
