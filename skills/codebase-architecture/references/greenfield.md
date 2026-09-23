# Greenfield Rebuild

Starting a from-scratch build on an agreed stack, and judging whether it may hold real customer data. The stack decision is an input here; if it is still open, finish Design first.

## Contents

- Think hard once, then fan out
- Walking skeleton
- The first vertical slice
- Production eligibility gate
- Capability quality ledger
- Decision records
- Audit failures to check
- Verification claims

## Think hard once, then fan out

Parallel agents multiply whatever goes in. "100 PRs by 7pm; main broke twice; the agents did exactly what I asked." A wrong transaction pattern copied into forty DAOs is forty fixes; the same mistake in one foundation is one.

1. **Foundations, serially, with few agents** and the most deliberate planning the session has: repo shape and task graph, config loading, database roles and the migration path, request and tenant context, auth session, codegen pipeline, telemetry, queue setup, boundary checks. Each lands with its decision record.
2. **Walking skeleton** through every deployable.
3. **One vertical slice** green end to end. Its code is the pattern every later slice copies, and its steps become the first add-a-new-X recipe.
4. **Eligibility gate** evaluated for what exists so far.
5. **Fan out** feature slices only now, each smaller than the review capacity behind it.

Stop and re-plan rather than fan out when a foundation is `unknown` on the eligibility gate: parallel work on an unproven foundation compounds the rework.

## Walking skeleton

Every deployable (web, API, worker) builds, starts, and talks to the next hop through the real infrastructure path, with no features. Done when all of these hold on a cold clone:

- One command sequence goes from clone to running processes: install, codegen, check, test with the cache disabled, build, dev startup, production startup.
- Each process validates its config in the entrypoint, not at import, and fails fast naming the missing key.
- Migrations apply from zero on an empty database as the migration role; the app connects as a separate role that cannot bypass RLS.
- Queues are created before any worker registers against them.
- Telemetry is initialized before any instrumented import in each process, a request produces one trace across web, API, and worker, and logs flush on shutdown.
- Each process exposes readiness that checks its real dependencies, and a non-production deploy serves it.

## The first vertical slice

One user-visible feature that crosses every hop, built test-first from the outside in. Each hop has a test that fails without it.

| Hop | What it proves | Failing test to write first |
|---|---|---|
| Verified domain | The host resolves to a tenant only through a verified-domain record | Unknown host returns 404; forged `x-tenant-id` is ignored |
| Authenticated session | A real session from the real auth provider, host-scoped cookie | Unauthenticated request returns 401 |
| Generated client | The UI calls the API only through the generated client | Regenerate-and-diff is clean; no hand-written request shape |
| Permission | The RPC's registered policy decides access | A role without the permission gets 403; a method without a policy fails registration |
| Scoped transaction | Tenant context set transaction-locally; every query in the request uses the transaction client | Tenant B's session reads zero of tenant A's rows through the DAO, not just in SQL |
| Response | One error envelope, trace id propagated | Error response carries the code and trace id; the log line has the same trace id |
| Visible UI states | Loading, empty, error, forbidden, and success all render | A Playwright test reaches each state |

Done when a Playwright test drives the slice for tenant A, a second proves tenant B cannot see A's data through the UI or the API, and both pass on a freshly migrated database with the test cache disabled.

## Production eligibility gate

Each criterion is `pass`, `fail`, or `unknown`, with evidence and the commit it was observed at. The system is eligible only when every criterion passes. `unknown` counts as not passing. No score elsewhere offsets a failing criterion: a single compensating readiness score let excellent developer experience hide missing auth.

Required before any real tenant data, including a pilot:

- Authentication enforced on every non-public route and RPC, proven by the registration check.
- Cross-tenant tests pass for read and write, through the API and through the DAO, under the app role.
- The app role is not a table owner without `FORCE ROW LEVEL SECURITY`, not a superuser, and lacks `BYPASSRLS` (query `pg_roles` and the table owners).
- Unknown and unverified hosts fail closed; inbound tenant headers are stripped on every path.
- Migrations apply from zero; queues exist; the outbox enqueues each row exactly once under two concurrent relays.
- Telemetry exports from every process; an error is visible in the backend within minutes.
- Secrets live outside the repo; config validated at startup.
- Backups enabled and one restore rehearsed; deploys pinned to a SHA with a rollback path.
- Data location and privacy obligations named by customer contracts are recorded with where the data lives. Resolve the obligations from current official sources; until someone has, the row is `unknown`.

```markdown
| Criterion | Status | Evidence | Commit |
|---|---|---|---|
| App role cannot bypass RLS | pass | `psql` output: rolbypassrls=f, not owner | abc1234 |
| Telemetry from worker | unknown | exporter configured; no trace observed yet | abc1234 |
```

Auth and cross-tenant tests belong to the walking skeleton and first slice. A plan that schedules them after the first deploy has put the gate after the data it protects.

## Capability quality ledger

Quality is scored separately from eligibility, only for capabilities that apply, and never averaged into the gate. Each row carries an evidence level and a commit.

| Evidence level | Meaning |
|---|---|
| Asserted | A doc, plan, or claim says so |
| Static | Code or config read; lint or typecheck passes |
| Tested | A fresh test run (cache disabled) exercises it |
| Exercised | Observed at runtime: started process, E2E run, or deploy |

```markdown
| Capability | Applies | Score (0-3) | Evidence level | Evidence | Commit |
|---|---|---|---|---|---|
| Observability | yes | 1 | Static | exporter wired, no trace seen | abc1234 |
| Offline support | no | n/a | | | |
```

A score above the evidence it rests on is the defect to catch: a 3 with evidence level Asserted is a 0.

## Decision records

Every foundation choice gets a record with the choice, the reason, and the flip condition: what observation would change it. Format and superseding rules are in `domain-language.md`. Record the rejected alternative only when someone is likely to propose it again.

## Audit failures to check

Observed in a real rebuild audit. Check each explicitly; none is caught by a cached green run.

- **Transaction client discarded.** A DAO accepted the transaction client and then used the global client, so tenant context set on the transaction never applied (a P0 isolation failure). Grep DAOs for the global client and type them to take only the transaction client.
- **Env singleton at import.** A cached test run was green; `turbo run test --force` failed because a config module parsed the environment at import. Parse config in the entrypoint.
- **ESM resolution in dev.** Dev startup failed on type-stripping plus `.js` import specifiers pointing into TypeScript source. Start every process in dev and prod mode as part of done.
- **Outbox claim.** Rows were locked only for the `SELECT` and enqueued afterwards, producing duplicate enqueues; unknown handler types sat `pending` silently. Claim and enqueue in one transaction; dead-letter unknown types.
- **Queue creation.** Queues were not created before registration on a fresh database. Create them idempotently before workers register.
- **Host parsing as tenant resolution.** Splitting the hostname was presented as tenant resolution with no verified-domain lookup. Resolve through verified records, fail closed, strip inbound tenant headers.
- **Telemetry never initialized.** The initializer was exported and never invoked; logging was disabled with no completion hook to flush it. Assert a trace and a log line arrive from each process.
- **Auth deferred past first deploy.** Auth and cross-tenant tests were planned after the first deploy. They gate any real tenant data.
- **Boundary script overclaimed.** The script's documentation listed more rules than it enforced. Each claimed rule needs a negative fixture.
- **FORCE RLS semantics.** `FORCE ROW LEVEL SECURITY` binds table owners; superusers and `BYPASSRLS` roles still bypass. Check the app role, not the policy text.

## Verification claims

Every claim of "verified" names its kind, because each proves something different:

- **Cached check:** a task-runner cache hit. Proves nothing about changed code or a cold environment.
- **Fresh test run:** tests with the cache disabled (`turbo run test --force` or equivalent) on a migrated database.
- **Build:** the production build succeeds.
- **Runtime startup:** the process started in dev and prod mode and answered readiness.

Report them separately. "All green" from a cached run while the fresh run was never executed is the failure this list exists to prevent.
