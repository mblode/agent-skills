# Tenant data isolation

Applies to step 3 on either platform. Pick a model per plan tier, then implement the enforcement so a missing `WHERE tenant_id` cannot leak.

## Contents

- Choosing a model
- Shared schema with tenant_id and RLS (default)
- RLS implementation notes (Postgres, Supabase, Drizzle)
- Schema-per-tenant
- Database-per-tenant
- Evidence
- Sources

## Choosing a model

| Model | Isolation | Operational cost | Fits |
|-------|-----------|------------------|------|
| Shared schema, `tenant_id` column, RLS | Logical, enforced in the database | One migration, one pool, large tables need tuning as they grow | Default for SaaS; every tenant on the same features |
| Schema-per-tenant | Namespace | N migrations per release, `search_path` per request, catalog bloat, no per-tenant restore on Neon | Rare; legacy per-customer customizations |
| Database-per-tenant (Neon project or D1 database per tenant) | Physical | Provisioning API, one connection reference per tenant, fleet migrations; per-tenant PITR, region pinning, scale-to-zero for idle tenants | Regulated or noisy tenants, data-residency, tenant-owned exports |

Hybrid is normal: shared schema for Free and Pro, a dedicated database for the Enterprise tier, selected by `tenant.plan` in the data layer. The tenant row carries the connection reference either way.

## Shared schema with tenant_id and RLS (default)

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts FORCE ROW LEVEL SECURITY;          -- owners are bound too

CREATE POLICY posts_tenant ON posts
  FOR ALL TO app_user
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE INDEX posts_tenant_id_idx ON posts (tenant_id);
```

Per request, inside one transaction on the app role:

```sql
BEGIN;
SELECT set_config('app.tenant_id', $1, true);        -- true = local to this transaction
-- queries
COMMIT;
```

- `set_config(..., true)` or `SET LOCAL` only. A plain `SET` on a pooled connection survives the request and the next tenant inherits it; with PgBouncer in transaction mode the transaction-local form is the only safe one.
- Two roles: a migration role that owns tables, and `app_user` that the application connects as. Superusers, `BYPASSRLS` roles, and table owners (without `FORCE`) skip every policy, so an app connected as the owner sees all tenants with RLS "on".
- RLS enabled with no policy is default-deny: a forgotten policy shows up as empty results, not a leak. The dangerous failure is the reverse (owner connection or a permissive `USING (true)` policy), so test both directions.
- Views run with the definer's privileges by default and bypass RLS; set `security_invoker = true` (Postgres 15+).
- Grants and policies are separate: revoke default grants, then grant per role. A table protected only by policies still accepts `INSERT` from a role that keeps the grant.
- `current_setting('name', true)` returns `NULL` instead of erroring when unset, which makes the policy evaluate to no rows rather than failing the query; log the unset case in the app so it never passes silently.

## RLS implementation notes (Postgres, Supabase, Drizzle)

- **Supabase**: identify the tenant from the JWT, `USING (tenant_id = (select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid))`. Wrap the function in `select` so Postgres evaluates it once per query; read `app_metadata` (server-set) never `user_metadata` (user-editable); scope policies `TO authenticated`; index every column a policy filters on.
- **Drizzle**: `pgTable.withRLS('posts', {...})` or add `pgPolicy(...)` as a table extra (adding a policy enables RLS); `pgRole('app_user')` or `.existing()`; set the tenant with `tx.execute(sql\`select set_config('app.tenant_id', ${id}, true)\`)` inside `db.transaction`.
- **Neon**: plain Postgres RLS as above; Neon's own multitenancy guide recommends project-per-tenant when isolation or per-tenant restore matters, and warns that shared-schema compliance work grows with tenant count.
- Keep the `tenant_id` predicate in application queries as well; RLS is the last line, and the explicit predicate keeps the planner on the index.

## Schema-per-tenant

- `CREATE SCHEMA t_<id>` per tenant; per request `SET LOCAL search_path = t_<id>, public` inside the transaction.
- Migrations run once per schema; thousands of schemas bloat the catalog and slow `pg_dump` and planning. Neon notes it saves nothing operationally over separate databases and forfeits per-tenant PITR.
- Choose it only when tenants need divergent table shapes and you cannot afford separate databases.

## Database-per-tenant

- **Neon**: one project per tenant via the API; compute scales to zero after 5 minutes of inactivity on Free and Launch (configurable on Scale), so idle tenants cost close to nothing. Included projects: 100 on Free and Launch, 1,000 on Scale (soft limit). Per-tenant point-in-time restore and region choice come free with the model.
- **D1**: one database per tenant under the 50,000 databases per account cap on Workers Paid, 10 GB each; bind the tenant's database in its user Worker or open it by id from the dispatch Worker.
- Store the connection reference (Neon connection string or D1 database id) on the tenant row; run migrations as a fleet job that iterates tenants and records the applied version per tenant.
- Connection pooling: one pool per active tenant is fine on Neon's pooled endpoint; keep pools small and lazily created.

## Evidence

```bash
psql "$DATABASE_URL" -c "BEGIN; SET LOCAL ROLE app_user; SELECT set_config('app.tenant_id','<tenant-a>',true); SELECT count(*) FROM posts; ROLLBACK;"
psql "$DATABASE_URL" -c "BEGIN; SET LOCAL ROLE app_user; SELECT count(*) FROM posts; ROLLBACK;"   # unset tenant: expect 0
```

The first count matches tenant A's rows only; the second returns 0. A count equal to the full table in either case means the role owns the table, has `BYPASSRLS`, or a policy uses `USING (true)`.

## Sources

Accessed 2026-09-01.

- https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://orm.drizzle.team/docs/rls
- https://neon.com/docs/guides/multitenancy
- https://neon.com/docs/introduction/plans
- https://developers.cloudflare.com/d1/platform/limits/
