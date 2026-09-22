# Vercel Platform (Next.js Multi-Tenancy)

Tenancy workflow steps 4 to 7 when one Vercel deployment serves every tenant. Domain onboarding and certificates are in the domains reference. When a Next.js question is version-sensitive, the installed version's docs at `node_modules/next/dist/docs/` win over this file.

## Contents

- Proxy tenant resolution
- App Router layout
- Edge store for the hot path
- Per-tenant static files
- Custom subpaths
- Caching per tenant
- Local development and the starter kit
- Sources

## Proxy tenant resolution

`proxy.ts` (the renamed `middleware.ts`, Node.js runtime) resolves the tenant from verified records only and fails closed.

```ts
// proxy.ts
import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/global-config";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN!; // acme.app
const TENANT_HEADERS = ["x-tenant-id", "x-tenant-slug", "x-tenant-plan"];
type Tenant = { id: string; slug: string; plan: string; hostname: string };

// Edge store keys allow only [A-Za-z0-9_-]. Hash, never replace separators:
// replacing dots and hyphens with "_" maps different hostnames to one key.
const keyFor = (hostname: string) =>
  `h_${createHash("sha256").update(hostname).digest("hex")}`;

function tenantHostname(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname === ROOT || hostname === `www.${ROOT}`) return null; // brand site
  if (process.env.NODE_ENV !== "production" && hostname.endsWith(".localhost")) {
    return `${hostname.split(".")[0]}.${ROOT}`;
  }
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return `${hostname.split("---")[0]}.${ROOT}`; // preview deployments
  }
  return hostname; // tenant subdomain or custom domain
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  for (const h of TENANT_HEADERS) headers.delete(h); // clients never supply tenant context

  if (pathname.startsWith("/.well-known")) return NextResponse.next({ request: { headers } });

  const hostname = tenantHostname(request.headers.get("host") ?? "");
  if (!hostname) return NextResponse.next({ request: { headers } });

  // Written only after the domain verified; the database stays the source of truth.
  const tenant = await get<Tenant>(keyFor(hostname));
  if (!tenant || tenant.hostname !== hostname) {
    return new NextResponse("Not found", { status: 404 }); // never fall through to brand content
  }

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

- Request headers, not response headers: `NextResponse.next({ headers })` ships them to the browser.
- A matcher that excludes a path also skips Server Function POSTs on it. Server Functions and route handlers re-derive the tenant from the session; the data layer enforces it.
- `api` is excluded above, so every API route resolves the tenant itself (or the matcher includes it). Keep headers small; some origins return `431`.

## App Router layout

- `app/(brand)/`: marketing and console on the apex.
- `app/s/[slug]/layout.tsx`: tenant branding from the database; `generateMetadata` with `metadataBase` set to the tenant's canonical host.
- `app/s/[slug]/[[...path]]/page.tsx`: tenant pages.
- `app/s/[slug]/robots.txt/route.ts`, `sitemap.xml/route.ts`, `llms.txt/route.ts`: per-tenant files.
- Reading context: `params.slug` for cache keys and data; `(await headers()).get("x-tenant-plan")` for plan gating; `request.headers.get("x-tenant-id")` in route handlers.

## Edge store for the hot path

Vercel's edge key-value store (Global Config, formerly Edge Config; package `@vercel/global-config`, env var `GLOBAL_CONFIG`) holds only the hashed hostname map.

- Store size, stores per project, write quotas, and write propagation delay vary by plan and change: look them up before relying on them. Low write quotas rule it out for high-churn onboarding on small plans.
- The database is the source of truth; the store is a write-through cache written after verification. The confirmation screen reads the database, because writes take seconds to propagate.
- The legacy `@vercel/edge-config` SDK cannot read stores connected after the rename.
- Prefer one `getAll()` over several `get()` calls; each read is billed.

## Per-tenant static files

Route handlers inside the tenant segment, reached through the rewrite:

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

`text/plain` for `.txt`, `application/xml` for `sitemap.xml`. `/public` holds only files identical across tenants. Under Cache Components, route segment configs such as `revalidate` are build errors; put caching in a `'use cache'` helper.

## Custom subpaths

Platform content under a customer path (`customer.com/docs`): a catch-all `app/sites/[...slug]/page.tsx`, `assetPrefix: '/your-platform-assets'` plus a rewrite to `/_next/:path*`, so the customer proxies only two prefixes. Subdomain traffic can rewrite into the same routes.

## Caching per tenant

- Every cache key includes the tenant id: `'use cache'` with ``cacheTag(`tenant-${id}`)``, invalidated with `revalidateTag`. A cached tenant layout without it serves one tenant's branding to another.
- Per-tenant `generateMetadata` and OG images key on the tenant too.

## Local development and the starter kit

- Chromium and Firefox resolve `*.localhost` to loopback; Safari and `curl` need `--resolve tenant1.localhost:3000:127.0.0.1` or hosts entries.
- `github.com/vercel/platforms` is a routing demo, not an isolation reference: it parses the subdomain and stores no tenant data beyond the subdomain record, and its matcher skips every root file with an extension, so per-tenant `robots.txt` never reaches the proxy.

## Sources

- https://vercel.com/docs/platforms/multi-tenant-platforms/concepts
- https://vercel.com/docs/platforms/multi-tenant-platforms/middleware-and-routing
- https://vercel.com/docs/platforms/multi-tenant-platforms/serving-static-files
- https://vercel.com/docs/platforms/multi-tenant-platforms/custom-subpaths
- https://vercel.com/docs/platforms/multi-project-platforms/concepts
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://vercel.com/docs/global-config/global-config-limits
