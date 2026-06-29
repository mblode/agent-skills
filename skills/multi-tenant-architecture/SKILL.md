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
- Output schema
- Pre-commit checklist
- Related skills

## Platform dispatch (decide first)

| Signals | Platform | Load |
|---------|----------|------|
| Tenants run untrusted or per-tenant code; need code-level isolation; edge-first compute on D1/KV/Durable Objects | Cloudflare (Workers for Platforms, dispatch namespaces) | [cloudflare-platform.md](references/cloudflare-platform.md) |
| All tenants share one Next.js codebase; need ISR, React Server Components, managed deploys | Vercel (App Router + Middleware) | [vercel-platform.md](references/vercel-platform.md), then [vercel-domains.md](references/vercel-domains.md) for domains |

- Pick one platform and commit; never mix hosting (hybrid routing complexity compounds).
- Load only the chosen platform's references unless explicitly comparing.
- Load [psl.md](references/psl.md) when deciding domain strategy (step 1).
- Load [limits-and-quotas.md](references/limits-and-quotas.md) before mapping limits to pricing (step 8).
- `agents/openai.yaml` is launcher metadata for external runners only; do not load it in normal use.

## Workflow (order matters)

1. Choose domain strategy
- Dedicated tenant domain, separate from the brand domain, for all subdomains and custom hostnames. Reputation does not isolate: a phishing site on `random.acme.com` damages the whole domain.
- Register a separate TLD for tenant workloads (e.g. `acme.app` for tenants, `acme.com` for brand).
- Untrusted content on sibling subdomains: choose PSL submission, record owner plus timeline. Otherwise record `No PSL` with the cookie-isolation reason. See [psl.md](references/psl.md).
- Start PSL early; review takes weeks.

2. Choose tenant identification strategy (pick one primary; offer custom domain as upgrade path)
- **Subdomain-based**: `tenant.yourdomain.com`. Requires wildcard DNS. Simplest at scale.
- **Custom domain**: tenant CNAMEs their own domain to your platform. Best for serious/paying tenants.
- **Path-based**: `yourdomain.com/tenant-slug`. No per-tenant DNS/SSL, but limits branding and complicates cookie isolation.

3. Define isolation model
- **Cloudflare**: per-tenant Workers via dispatch namespaces for untrusted code. Avoid shared-tenant branching unless you fully control code and data.
- **Vercel**: shared Next.js app with `tenant_id` scoping. Middleware resolves tenant from hostname; every query includes tenant context. Postgres RLS for defence-in-depth.

4. Route traffic deterministically (tenants never control routing or see each other)
- **Cloudflare**: platform Worker owns routing: hostname -> tenant id -> dispatch namespace -> tenant Worker. 404 when no mapping.
- **Vercel**: Middleware extracts hostname, rewrites to a `/domains/[domain]` segment; Edge Config for sub-millisecond lookups. 404 when no mapping.

5. Pass tenant context through the stack (single authority: Middleware or platform Worker; never trust client-supplied identity)
- **Cloudflare**: platform Worker resolves the tenant, injects headers/bindings before dispatching to the tenant Worker.
- **Vercel**: Middleware sets `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan` on forwarded request headers (not the response). Server Components read via `headers()`; API routes read from request headers:
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

6. Bind only what is needed
- **Cloudflare**: least-privilege bindings per tenant (DB/storage/limited platform API), no shared global state. New bindings are explicit changes; redeploy to grant access.
- **Vercel**: Edge Config for tenant config (domain mappings, feature flags, plan info). `@vercel/sdk` for domain management. DB connections scoped by `tenant_id`, or database-per-tenant (Neon).

7. Support custom domains and per-tenant static files
- Provide a DNS target, verify ownership, store the mapping, route by hostname.
- **Cloudflare**: Cloudflare for SaaS custom hostnames with managed certs. See [cloudflare-platform.md](references/cloudflare-platform.md).
- **Vercel**: `@vercel/sdk` for domain CRUD plus automatic Let's Encrypt SSL; wildcard subdomains require Vercel nameservers. See [vercel-domains.md](references/vercel-domains.md).
- Custom domains shift reputation to the tenant and create natural user segments (casual on platform domain, serious on their own).
- `robots.txt`, `sitemap.xml`, `llms.txt` must vary by tenant; never serve from `/public`. Cloudflare: generate in the tenant Worker. Vercel: route handlers under the domain segment (see [vercel-platform.md](references/vercel-platform.md)).

8. Surface limits as plans
- Map platform limits to pricing tiers; expose in API and UI.
- No long jobs in requests; use queues or workflows.
- See [limits-and-quotas.md](references/limits-and-quotas.md); re-check official docs before final architecture or pricing decisions.

9. Make the API the product
- Everything works over HTTP; the UI is for ops, incidents, billing.
- Platform logic stays in the routing layer (dispatch Worker or Middleware); tenant content serves requests.
- If it only works in the UI, the platform is leaking.

10. Extend without breaking boundaries
- Add queues, workflows, or containers as optional modes. Keep routing explicit and isolation intact.

## Gotchas

- Tenant headers go on the Middleware request, not the response: `headers()` in Server Components reads forwarded request headers, so use `NextResponse.next({ request: { headers } })` or the tenant id never arrives.
- Don't start path-based if custom domains are on the roadmap: migrating later means URL rewrites, cookie changes, and DNS migration.
- Never share DB connections across tenants without RLS or `tenant_id` scoping: one missing WHERE clause leaks another tenant's data.
- Never block `/.well-known/acme-challenge/*` with Middleware or redirects: Let's Encrypt HTTP-01 validation fails and custom-domain SSL never issues.
- Edge Config writes are not instant: propagation takes up to 10 seconds, so a "domain connected" UI reading Edge Config immediately shows stale state.

## Output schema

```markdown
# Multi-tenant architecture

## Platform decision
- Platform: Cloudflare | Vercel
- Why this platform:
- Rejected platform and reason:

## Domain map
- Brand domain:
- Tenant domain:
- Tenant subdomains:
- Custom domains:
- PSL decision: Submit | No PSL
- PSL owner/timeline or No PSL reason:

## Routing matrix
| Host pattern | Resolver | Destination | Unknown tenant behavior |
|---|---|---|---|

## Tenant context flow
- Authority: Middleware | platform Worker
- Propagation:
- Server read path:
- Database/API scoping:

## Isolation model
- Compute isolation:
- Data isolation:
- Config/binding isolation:

## Custom-domain lifecycle
1. DNS target:
2. Ownership verification:
3. Certificate provisioning:
4. Routing activation:
5. Removal/failure path:

## Limits-to-plan table
| Limit | Source URL/date | Free | Pro | Enterprise | Enforcement point |
|---|---|---:|---:|---:|---|

## Validation evidence
| Check | Command/source | Expected result | Result |
|---|---|---|---|
```

## Pre-commit checklist

- [ ] Platform chosen with documented rationale
- [ ] Tenant workloads off the brand domain; PSL decision and timeline set
- [ ] Tenant identification strategy chosen; custom-domain upgrade path defined
- [ ] Isolation model defined: per-tenant Workers (Cloudflare) or shared-app plus RLS (Vercel)
- [ ] Routing authoritative and tenant-blind; dispatch or Middleware handles all traffic
- [ ] Tenant context flows through Middleware/platform Worker only; no client-supplied identity trusted
- [ ] Custom-domain onboarding defined: DNS target, verification, cert provisioning
- [ ] Per-tenant static files (robots.txt, sitemap.xml, llms.txt) served dynamically
- [ ] Limits tied to billing; API parity with UI
- [ ] Limits snapshot refreshed from official docs and dated in planning notes

Evidence commands (run or mark N/A):

| Check | Evidence |
|---|---|
| Tenant context exists at the boundary | `rg "x-tenant-id|tenant_id|tenantId|CREATE POLICY|USING \\(" .` |
| Tenant routing works | `curl -sI -H "Host: tenant.example.com" <local-or-preview-url>` |
| Per-tenant static files are dynamic | `curl -s -H "Host: tenant.example.com" <url>/robots.txt` and `curl -s -H "Host: tenant.example.com" <url>/sitemap.xml` |
| Custom-domain verification path exists | API route, SDK call, or platform config path in the plan |
| Platform limits are up to date | official Cloudflare/Vercel URLs with access date in the Limits-to-plan table |

## Related skills

- `define-architecture`: folder structure, module contracts, and middleware pipelines for the application itself.
- `scaffold-nextjs`: bootstrap the Next.js turborepo before applying these tenancy patterns.
- `optimise-seo`: per-tenant sitemaps, canonical URLs, and structured data once routing works.
