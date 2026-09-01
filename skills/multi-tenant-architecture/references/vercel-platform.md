# Vercel platform primitives (Next.js multi-tenancy)

Applies to steps 4 to 7 when Vercel is the chosen platform. Domain onboarding and SSL live in the domains reference.

## Contents

- Starter kit facts (what the template actually does)
- Proxy tenant resolution
- App Router layout
- Global Config for the hot path
- Per-tenant static files
- Custom subpaths
- Caching per tenant
- Local development and preview URLs
- Sources

## Starter kit facts (what the template actually does)

`github.com/vercel/platforms` as of 2026-09: Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui, Upstash Redis with keys `subdomain:{name}` (`KV_REST_API_URL`, `KV_REST_API_TOKEN`). `proxy.ts` extracts the subdomain (handles `*.localhost`, `tenant---branch.vercel.app` previews, and `*.<rootDomain>`), blocks `/admin` on subdomains, and rewrites `/` to `/s/{subdomain}`. Its matcher `'/((?!api|_next|[\\w-]+\\.\\w+).*)'` skips every root file with an extension, which is why the template does not serve per-tenant `robots.txt`. Treat it as a routing demo, not a data-isolation reference: it stores no tenant data beyond the subdomain record.

## Proxy tenant resolution

Next.js 16 renamed `middleware.ts` to `proxy.ts` (exported function `proxy`, Node.js runtime, setting `runtime` throws). On Next.js 15 keep `middleware.ts`, export `middleware`, and add `runtime: 'nodejs'` to `config` so database clients work. Migrate with `npx @next/codemod@canary middleware-to-proxy .`.

```ts
// proxy.ts
import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/global-config";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN!; // acme.app
const TENANT_HEADERS = ["x-tenant-id", "x-tenant-slug", "x-tenant-plan"];
const keyFor = (hostname: string) => hostname.replace(/\./g, "_"); // Global Config keys: ^[\w-]+$

function lookupKey(host: string): string | null {
  const hostname = host.split(":")[0];
  if (hostname.endsWith(".localhost")) return `sub_${hostname.split(".")[0]}`;
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) return `sub_${hostname.split("---")[0]}`;
  if (hostname === ROOT || hostname === `www.${ROOT}`) return null; // brand site
  if (hostname.endsWith(`.${ROOT}`)) return `sub_${hostname.slice(0, -(ROOT.length + 1))}`;
  return `domain_${keyFor(hostname)}`; // custom domain
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  for (const h of TENANT_HEADERS) headers.delete(h); // clients never supply tenant context

  if (pathname.startsWith("/.well-known")) return NextResponse.next({ request: { headers } });

  const key = lookupKey(request.headers.get("host") ?? "");
  if (!key) return NextResponse.next({ request: { headers } });

  const tenant = await get<{ id: string; slug: string; plan: string }>(key);
  if (!tenant) return new NextResponse("Not found", { status: 404 }); // never fall through to brand content

  headers.set("x-tenant-id", tenant.id);
  headers.set("x-tenant-slug", tenant.slug);
  headers.set("x-tenant-plan", tenant.plan);

  const url = request.nextUrl.clone();
  url.pathname = `/s/${tenant.slug}${pathname}`; // robots.txt, sitemap.xml, llms.txt included
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- Request headers, not response headers: `NextResponse.next({ headers })` ships them to the browser and `headers()` never sees them.
- The proxy runs for `_next/data` even when excluded, and a matcher that excludes a path also skips Server Function POSTs on it. Re-derive the tenant in Server Functions from the session and enforce in the data layer.
- Avoid large headers; some origins return `431` above a few KB.

## App Router layout

- `app/(brand)/`: marketing and console on the apex.
- `app/s/[slug]/layout.tsx`: tenant branding (logo, theme, fonts) from the database, `generateMetadata` with `metadataBase` set to the tenant's canonical host and `alternates.canonical` when a tenant serves on both a subdomain and a custom domain.
- `app/s/[slug]/[[...path]]/page.tsx`: tenant pages.
- `app/s/[slug]/robots.txt/route.ts`, `sitemap.xml/route.ts`, `llms.txt/route.ts`: per-tenant files (below).
- Reading tenant context: `params.slug` for cache keys and data fetching; `(await headers()).get("x-tenant-plan")` for plan gating; `request.headers.get("x-tenant-id")` in route handlers.

## Global Config for the hot path

Edge Config was renamed Global Config. Package `@vercel/global-config` (drop-in for `@vercel/edge-config`), env var `GLOBAL_CONFIG` (legacy `EDGE_CONFIG` still read by the new SDK; the legacy SDK cannot read newly connected stores).

- Store only `hostname -> { id, slug, plan }`. 1 MB per store on every plan, 3 stores per project, up to 10 s write propagation, writes 250 per month on Hobby and 100 per hour on Pro and Enterprise. Onboarding many domains on Hobby exhausts the write quota; the database stays the source of truth and Global Config is a write-through cache.
- Key names match `^[\w-]+$` (256 chars): encode dots in hostnames.
- Prefer `getAll()` over several `get()` calls; each SDK call is one billable read.
- The confirmation screen after a domain verifies reads the database, not Global Config, because of the propagation window.

## Per-tenant static files

Route handlers inside the tenant segment, reached through the rewrite above:

```ts
// app/s/[slug]/robots.txt/route.ts
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return new NextResponse("Not found", { status: 404 });
  const body = `User-agent: *\nAllow: /\nSitemap: https://${tenant.primaryHost}/sitemap.xml\n`;
  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain", "CDN-Cache-Control": "s-maxage=3600" },
  });
}
```

- `Content-Type`: `text/plain` for `.txt`, `application/xml` for `sitemap.xml`.
- `CDN-Cache-Control` caches at the Vercel CDN independent of the browser; purge by tag or path when tenant content changes.
- `/public` is for files identical across tenants; large media goes to Blob storage.

## Custom subpaths

Platform content under a customer path (`customer.com/docs`) while the customer hosts the rest of their site:

- Catch-all `app/sites/[...slug]/page.tsx` with `[customerSlug, ...contentPath]`.
- `assetPrefix: '/your-platform-assets'` plus a rewrite `/your-platform-assets/_next/:path*` -> `/_next/:path*`, so the customer only proxies two prefixes: `/docs/:path*` -> `https://acme.app/sites/<slug>/:path*` and `/your-platform-assets/:path*` -> `https://acme.app/your-platform-assets/:path*`.
- Subdomain traffic can rewrite into the same path routes (`tenant.acme.app/guide` -> `/sites/tenant/guide`) so one route tree serves both.

## Caching per tenant

- Next.js 16 Cache Components: `'use cache'` with `cacheTag(\`tenant-${id}\`)`; invalidate with `revalidateTag`. On Next.js 15, `unstable_cache` with `tags`.
- Every cache key includes the tenant id (function argument or tag); a cached tenant layout without it serves one tenant's branding to another.
- ISR serves stale while revalidating; per-tenant `generateMetadata` and OG images key on the tenant too.

## Local development and preview URLs

- Chromium and Firefox resolve `*.localhost` to loopback without `/etc/hosts`; Safari and `curl` need entries or `curl --resolve tenant1.localhost:3000:127.0.0.1`. HTTP only locally.
- Preview deployments: `tenant---branch-project.vercel.app`, parsed by splitting on `---`. Multi-tenant preview URLs on your own domain (`tenant1---project-git-branch.acme.dev`) are Enterprise only.
- Each DNS label is capped at 63 characters, so long branch names plus a tenant label fail to resolve.

## Sources

Accessed 2026-09-01.

- https://vercel.com/docs/platforms
- https://vercel.com/docs/platforms/multi-tenant-platforms/concepts
- https://vercel.com/docs/platforms/multi-tenant-platforms/middleware-and-routing
- https://vercel.com/docs/platforms/multi-tenant-platforms/serving-static-files
- https://vercel.com/docs/platforms/multi-tenant-platforms/custom-subpaths
- https://vercel.com/docs/platforms/multi-tenant-platforms/limits
- https://vercel.com/docs/platforms/examples/multi-tenant-template
- https://vercel.com/docs/platforms/multi-project-platforms/concepts
- https://github.com/vercel/platforms (proxy.ts, README)
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://vercel.com/docs/global-config/global-config-limits
- https://vercel.com/docs/global-config/migration-guide
- https://vercel.com/docs/routing-middleware
