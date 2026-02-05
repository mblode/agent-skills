# Vercel platform primitives (Next.js multi-tenancy)

Use this reference for routing, tenant resolution, data isolation, content patterns, and local development on Vercel.

## Routing pattern (Middleware hostname rewrite)

- Middleware runs on Vercel's Edge Runtime; extracts hostname from `request.headers.get('host')`.
- Rewrite URL to a dynamic catch-all segment: `/domains/${hostname}${pathname}`.
- Matcher excludes `api`, `_next`, and static files: `/((?!api|_next|[\w-]+\.\w+).*)`.
- Handle three environments: `*.localhost` (dev), `tenant---branch.vercel.app` (preview), `*.yourdomain.com` (production).
- 404 when no tenant mapping exists; never fall through to default content.

## Tenant identification strategies

- **Subdomain-based**: Extract tenant from `hostname.split('.')[0]`. Requires wildcard DNS. Simplest for platforms with many tenants.
- **Custom domain**: Map full hostname to tenant via Edge Config or DB lookup. Tenant sets CNAME/A record.
- **Path-based**: Extract tenant from first path segment. No DNS/SSL per tenant, but limits branding and complicates cookie isolation.
- Pick one primary strategy; offer custom domain as an upgrade path for serious tenants.

## App Router folder structure

- `app/(main)/` — brand/marketing pages on the apex domain.
- `app/domains/[domain]/` — tenant-specific routes; Middleware rewrites all tenant traffic here.
- `app/domains/[domain]/layout.tsx` — tenant layout with branding (logo, fonts, theme from DB).
- `app/domains/[domain]/[slug]/page.tsx` — tenant content pages.
- `generateMetadata` per tenant for title, description, favicon, canonical URL, and OG images.

## Tenant context passing

- Middleware resolves tenant and sets `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan` on the forwarded request headers (for rewrite/next), not on final response headers.
- Server Components read tenant from `headers()`; no prop drilling through layouts.
- API routes read tenant from `request.headers.get('x-tenant-id')`.
- Middleware is the single authority for tenant identity; never trust client-supplied values.

## Edge Config (tenant lookup)

- Sub-millisecond reads via push-based CDN replication; ideal for domain-to-tenant mappings.
- Store lightweight mappings: `tenant_${hostname}` -> `{ id, slug, plan }`.
- Use `@vercel/edge-config` `get()` in Middleware for tenant resolution.
- Write propagation: up to 10 seconds globally.
- Size limits: 8 KB (Hobby), 64 KB (Pro), 512 KB (Enterprise). For large tenant sets, store only the mapping in Edge Config and fetch full config from DB.

## Custom subpaths

- Catch-all route `[...slug]` handles tenant content under a path prefix (e.g. `yourdomain.com/sites/tenant-slug/`).
- Middleware rewrites subdomain traffic to path-based routes: `tenant.yourdomain.com/guide` -> `/sites/tenant-slug/guide`.
- Set `assetPrefix` in `next.config.js` to avoid static asset path conflicts across tenants.
- Subpath routing avoids DNS/SSL complexity per tenant but limits custom branding.

## Per-tenant static files

- `robots.txt`, `sitemap.xml`, `llms.txt` must vary by tenant; do not use `/public`.
- Use route handlers at `app/domains/[domain]/robots.txt/route.ts`, `app/domains/[domain]/sitemap.xml/route.ts`, and `app/domains/[domain]/llms.txt/route.ts` to read tenant from params and return tenant-specific content.
- Set `Content-Type` headers explicitly (`text/plain`, `application/xml`).
- Cache with `CDN-Cache-Control: s-maxage=3600`; invalidate when tenant content changes.

## Database patterns

- **Shared schema + `tenant_id`** (simplest): Include `tenant_id` on every tenant-aware table. Use with Neon (Vercel Postgres).
- **Shared schema + RLS** (defence-in-depth): Row-Level Security policy enforces `tenant_id = current_setting('app.current_tenant_id')`. Prevents leaks even if a query omits the WHERE clause.
- **Database-per-tenant** (strongest isolation): One Neon project per tenant. Inactive projects scale to zero. Manage via Neon API.
- Use Drizzle ORM or Prisma for schema and migration management.

## Caching (ISR + revalidation)

- Use `unstable_cache` with `tags` for per-tenant content caching.
- Invalidate with `revalidateTag('tenant-123-posts')` on content changes.
- ISR serves stale content from the edge while revalidating in the background.
- Dynamic metadata (`generateMetadata`) produces per-tenant OG images, favicons, and sitemaps.

## Local development

- Add `*.localhost` entries to `/etc/hosts` or rely on browser auto-resolution of `*.localhost`.
- Middleware hostname matching must handle `hostname.includes('localhost')` for local subdomains.
- No HTTPS required locally; access via `http://tenant1.localhost:3000`.

## Sources

- https://vercel.com/docs/multi-tenant
- https://vercel.com/templates/next.js/platforms-starter-kit
- https://github.com/vercel/platforms
- https://vercel.com/docs/edge-config
- https://vercel.com/docs/multi-tenant/custom-subpaths
- https://vercel.com/docs/multi-tenant/static-files
- https://neon.com/docs/guides/multitenancy
