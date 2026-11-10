import postgres from "postgres";
import { getSession } from "./session";

// Connects as app_user. Migrations run separately as the migrator role.
const sql = postgres(process.env.APP_DATABASE_URL!, { max: 10 });

export class TenantMismatchError extends Error {}

export async function withTenant<T>(
  request: Request,
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  const session = await getSession(request);
  if (!session) {
    throw new TenantMismatchError("No session");
  }

  const routedTenantId = request.headers.get("x-tenant-id");
  if (routedTenantId !== session.tenantId) {
    throw new TenantMismatchError("Session does not belong to this tenant");
  }

  return sql.begin(async (tx) => {
    await tx`select set_config('app.tenant_id', ${session.tenantId}, true)`;
    return fn(tx);
  }) as Promise<T>;
}

export async function listProjects(request: Request) {
  return withTenant(request, (tx) => tx`
    select id, name, updated_at
    from projects
    order by updated_at desc
    limit 100
  `);
}
