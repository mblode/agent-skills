# Vercel platform primitives (Next.js multi-tenancy)

## Routing pattern (Middleware hostname rewrite)

- Runs on Vercel's Edge Runtime; extract hostname from `request.headers.get('host')`.
- Rewrite to a dynamic catch-all segment: `/domains/${hostname}${pathname}`.
- Matcher excludes `api`, `_next`, static files: `/((?!api|_next|[\w-]+\.\w+).*)`.
- Three environments: `*.localhost` (dev), `tenant---branch.vercel.app` (preview), `*.yourdomain.com` (production).
- 404 when no mapping exists; never fall through to default content.

## Tenant identification (Vercel mechanics)

Strategy choice lives in SKILL.md; this is the per-strategy extraction logic.

- **Subdomain-based**: `hostname.split('.')[0]` (requires wildcard DNS on the tenant domain).
- **Custom domain**: map full hostname to tenant via Edge Config or DB lookup (tenant sets a CNAME/A record).
- **Path-based**: first path segment (no per-tenant DNS/SSL).

## App Router folder structure

- `app/(main)/`: brand/marketing pages on the apex.
- `app/domains/[domain]/`: tenant routes; Middleware rewrites all tenant traffic here.
- `app/domains/[domain]/layout.tsx`: tenant branding (logo, fonts, theme from DB).
- `app/domains/[domain]/[slug]/page.tsx`: tenant content pages.
- `generateMetadata` per tenant: title, description, favicon, canonical URL, OG images.

## Tenant context passing

Middleware is the single authority; SKILL.md step 5 states which headers to set and where they are read. The implementation:

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const tenant = hostname.split(".")[0]; // resolve from Edge Config/DB in production
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

## Edge Config (tenant lookup)

- Sub-millisecond reads via push-based CDN replication; for domain-to-tenant mappings.
- Lightweight mappings: `tenant_${hostname}` -> `{ id, slug, plan }`.
- `@vercel/edge-config` `get()` in Middleware for resolution.
- Write propagation up to 10 s globally.
- Size limits: 8 KB (Hobby), 64 KB (Pro), 512 KB (Enterprise). For large tenant sets, keep only the mapping in Edge Config and fetch full config from DB.

## Custom subpaths

- Catch-all `[...slug]` serves tenant content under a path prefix (e.g. `yourdomain.com/sites/tenant-slug/`).
- Middleware rewrites subdomain traffic to path routes: `tenant.yourdomain.com/guide` -> `/sites/tenant-slug/guide`.
- Set `assetPrefix` in `next.config.js` to avoid cross-tenant asset path conflicts.
- Avoids per-tenant DNS/SSL complexity but limits custom branding.

## Per-tenant static files

- `robots.txt`, `sitemap.xml`, `llms.txt` must vary by tenant; never use `/public`.
- Route handlers at `app/domains/[domain]/robots.txt/route.ts`, `app/domains/[domain]/sitemap.xml/route.ts`, `app/domains/[domain]/llms.txt/route.ts` read tenant from params and return tenant-specific content.
- Set `Content-Type` explicitly (`text/plain`, `application/xml`).
- Cache with `CDN-Cache-Control: s-maxage=3600`; invalidate on content changes.

## Database patterns

- **Shared schema + `tenant_id`** (simplest): `tenant_id` on every tenant-aware table. Neon (Vercel Postgres).
- **Shared schema + RLS** (defence-in-depth): RLS policy enforces `tenant_id = current_setting('app.current_tenant_id')`; prevents leaks even if a query omits the WHERE clause.
- **Database-per-tenant** (strongest isolation): one Neon project per tenant; inactive projects scale to zero; manage via Neon API.
- Drizzle ORM or Prisma for schema/migrations.

## Caching (ISR + revalidation)

- `unstable_cache` with `tags` for per-tenant caching.
- Invalidate with `revalidateTag('tenant-123-posts')` on changes.
- ISR serves stale from the edge while revalidating in the background.
- `generateMetadata` produces per-tenant OG images, favicons, sitemaps.

## Local development

- Add `*.localhost` to `/etc/hosts` or rely on browser auto-resolution of `*.localhost`.
- Middleware must handle `hostname.includes('localhost')` for local subdomains.
- No HTTPS locally; access via `http://tenant1.localhost:3000`.

## Sources

- https://vercel.com/docs/multi-tenant
- https://vercel.com/templates/next.js/platforms-starter-kit
- https://github.com/vercel/platforms
- https://vercel.com/docs/edge-config
- https://vercel.com/docs/multi-tenant/custom-subpaths
- https://vercel.com/docs/multi-tenant/static-files
- https://neon.com/docs/guides/multitenancy
