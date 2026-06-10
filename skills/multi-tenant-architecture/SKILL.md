---
name: multi-tenant-architecture
description: Provides architecture guidance for multi-tenant SaaS platforms on Cloudflare or Vercel. Covers platform choice, domain strategy, tenant identification and isolation, subdomain routing, custom domains and SSL, white-label setup, tenant context propagation, PSL submission, and mapping platform limits to pricing plans. Use when building a multi-tenant application or asking "how do I support multiple tenants", "build a white-label platform", "add custom domains", "route tenants by subdomain", or "map limits to plans". For general app folder structure use define-architecture; for scaffolding a new Next.js repo use scaffold-nextjs.
---

# Multi-Tenant Platform Architecture (Cloudflare or Vercel)

- **IS:** domain strategy, tenant identification and isolation, subdomain routing, custom domains, white-label setup, and plan/limit mapping on Cloudflare or Vercel.
- **IS NOT:** general app folder structure or module boundaries (use `define-architecture`), or scaffolding a new repo (use `scaffold-nextjs`).

## Contents

- Platform dispatch (decide first)
- Workflow (order matters)
- Gotchas
- Deliverables
- Pre-commit checklist
- Related skills

## Platform dispatch (decide first)

| Signals | Platform | Load |
|---------|----------|------|
| Tenants run untrusted or per-tenant code; need code-level isolation; edge-first compute on D1/KV/Durable Objects | Cloudflare (Workers for Platforms, dispatch namespaces) | [cloudflare-platform.md](references/cloudflare-platform.md) |
| All tenants share one Next.js codebase; need ISR, React Server Components, managed deploys | Vercel (App Router + Middleware) | [vercel-platform.md](references/vercel-platform.md), then [vercel-domains.md](references/vercel-domains.md) for the domain lifecycle |

- Pick one platform and commit; do not mix hosting. Hybrid setups create routing complexity that compounds.
- Load only the chosen platform's references unless explicitly comparing the two.
- Always load [psl.md](references/psl.md) when deciding domain strategy (step 1).
- Load [limits-and-quotas.md](references/limits-and-quotas.md) before mapping limits to pricing (step 8).

## Workflow (order matters)

1. Choose domain strategy
- Use a dedicated tenant domain (separate from the brand domain) for all subdomains and custom hostnames. Reputation does not isolate; a phishing site on `random.acme.com` damages the whole domain.
- Register a separate TLD for tenant workloads (e.g. `acme.app` for tenants, `acme.com` for brand).
- Consider PSL for browser cookie isolation; it does not protect reputation. See [psl.md](references/psl.md).
- Start PSL submission early; review can take weeks.

2. Choose tenant identification strategy
- **Subdomain-based**: `tenant.yourdomain.com`. Requires wildcard DNS. Simplest for many tenants.
- **Custom domain**: tenant brings their own domain and CNAMEs to your platform. Best for serious or paying tenants.
- **Path-based**: `yourdomain.com/tenant-slug`. No per-tenant DNS/SSL, but limits branding and complicates cookie isolation.
- Pick one primary strategy; offer custom domain as an upgrade path.

3. Define isolation model
- **Cloudflare**: per-tenant Workers via dispatch namespaces for untrusted code. Avoid shared-tenant branching unless you fully control code and data.
- **Vercel**: single shared Next.js app with `tenant_id` scoping. Middleware resolves tenant from hostname; every data query includes tenant context. Use Postgres RLS for defence-in-depth.

4. Route traffic deterministically
- **Cloudflare**: the platform Worker owns routing; hostname -> tenant id -> dispatch namespace -> tenant Worker. 404 when no mapping exists.
- **Vercel**: Middleware extracts the hostname and rewrites to a `/domains/[domain]` dynamic segment. Edge Config for sub-millisecond tenant lookups. 404 when no mapping exists.
- Tenants never control routing or see each other on either platform.

5. Pass tenant context through the stack
- **Cloudflare**: the platform Worker resolves the tenant and injects headers or bindings before dispatching to the tenant Worker.
- **Vercel**: Middleware sets `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan` on the forwarded request headers (not the response). Server Components read via `headers()`; API routes read from request headers:
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
- The Middleware or platform Worker is the single authority; never trust client-supplied tenant identity.

6. Bind only what is needed
- **Cloudflare**: least-privilege bindings per tenant (DB/storage/limited platform API), no shared global state. Treat new bindings as explicit changes; redeploy to grant access.
- **Vercel**: Edge Config for tenant config (domain mappings, feature flags, plan info). `@vercel/sdk` for domain management. Database connections scoped by `tenant_id`, or database-per-tenant (Neon).

7. Support custom domains and per-tenant static files
- Provide a DNS target, verify ownership, store the mapping, route by hostname.
- **Cloudflare**: Cloudflare for SaaS custom hostnames with managed certs. See [cloudflare-platform.md](references/cloudflare-platform.md).
- **Vercel**: `@vercel/sdk` for programmatic domain CRUD plus automatic Let's Encrypt SSL; wildcard subdomains require Vercel nameservers. See [vercel-domains.md](references/vercel-domains.md).
- Custom domains shift reputation to the tenant and create natural user segments (casual on platform domain, serious on their own domain).
- `robots.txt`, `sitemap.xml`, `llms.txt` must vary by tenant; never serve them from `/public`. Cloudflare: generate in the tenant Worker. Vercel: route handlers under the domain segment (see [vercel-platform.md](references/vercel-platform.md)).

8. Surface limits as plans
- Map platform limits to pricing tiers; expose them in the API and UI.
- Do not run long jobs in requests; use queues or workflows.
- See [limits-and-quotas.md](references/limits-and-quotas.md) for limits snapshots and source links; re-check official docs before final architecture or pricing decisions.

9. Make the API the product
- Everything works over HTTP; the UI is for ops, incidents, and billing.
- Platform logic stays in the routing layer (dispatch Worker or Middleware); tenant content serves requests.
- If it only works in the UI, the platform is leaking.

10. Extend without breaking boundaries
- Add queues, workflows, or containers as optional modes.
- Keep routing explicit and isolation intact.

## Gotchas

- Don't use the brand domain for tenant subdomains: a phishing site on `random.acme.com` damages the entire `acme.com` reputation. Register a separate TLD for tenant workloads.
- Don't skip PSL submission when subdomains host untrusted content: review takes weeks, not days, and the cookie-isolation timeline slips with it.
- Don't trust client-supplied tenant identity, even behind auth. The Middleware or platform Worker is the single authority for tenant resolution.
- Don't set tenant headers on the Middleware response object: `headers()` in Server Components reads forwarded request headers, so use `NextResponse.next({ request: { headers } })` or the tenant id never arrives.
- Don't mix hosting platforms: pick Cloudflare or Vercel and commit. Hybrid setups create routing complexity that compounds.
- Don't start with path-based tenancy if custom domains are on the roadmap: migrating later requires URL rewrites, cookie changes, and DNS migration.
- Don't share database connections across tenants without RLS or `tenant_id` scoping: one missing WHERE clause leaks another tenant's data.
- Don't block `/.well-known/acme-challenge/*` with Middleware or redirects: Let's Encrypt HTTP-01 validation fails and custom-domain SSL never issues.
- Don't treat Edge Config writes as instant: propagation takes up to 10 seconds, so a "domain connected" UI that reads Edge Config immediately shows stale state.

## Deliverables

- Platform choice rationale: Cloudflare vs Vercel with justification
- Tenant identification strategy: subdomain, custom domain, or path-based
- Domain map: brand vs tenant domain, PSL plan, custom domain flow
- Isolation plan: per-tenant Workers or shared-app with tenant scoping
- Routing plan: hostname lookup, dispatch/rewrite logic, fallback behavior
- Tenant context flow: how tenant identity propagates through Middleware/headers/DB
- Binding/config matrix: per-tenant capabilities and data access
- Limits-to-pricing map: CPU/memory/request/domain budgets per tier
- API surface plus ops UI scope

## Pre-commit checklist

- [ ] Platform chosen with clear rationale documented
- [ ] Tenant workloads off the brand domain; PSL decision and timeline set
- [ ] Tenant identification strategy chosen; custom domain upgrade path defined
- [ ] Isolation model defined: per-tenant Workers (Cloudflare) or shared-app plus RLS (Vercel)
- [ ] Routing authoritative and tenant-blind; dispatch or Middleware handles all traffic
- [ ] Tenant context flows through Middleware/platform Worker only; no client-supplied identity trusted
- [ ] Custom domain onboarding defined with DNS target, verification, and cert provisioning
- [ ] Per-tenant static files (robots.txt, sitemap.xml, llms.txt) served dynamically
- [ ] Limits tied to billing; API parity with UI
- [ ] Limits snapshot refreshed from official docs and dated in planning notes

## Related skills

- `define-architecture`: folder structure, module contracts, and middleware pipelines for the application itself.
- `scaffold-nextjs`: bootstrap the Next.js turborepo before applying these tenancy patterns.
- `optimise-seo`: per-tenant sitemaps, canonical URLs, and structured data once routing works.
