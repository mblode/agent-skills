---
name: multi-tenant-architecture
description: Designs tenant isolation, hostname routing, custom-domain lifecycle, and plan limits on Cloudflare or Vercel. Use when asked to "isolate tenant data", "support custom domains", "build a white-label platform", or assess PSL registration. For general module structure use codebase-architecture; for SEO content use seo.
---

# Multi-Tenant Platform Architecture (Cloudflare or Vercel)

- **IS:** platform choice, domain strategy and PSL, tenant identification, compute and data isolation, hostname routing, tenant context propagation, custom domains and SSL, per-tenant static files, and mapping platform limits to plans.
- **IS NOT:** general folder structure or module contracts (use `codebase-architecture`), scaffolding a new repo (use `scaffold-nextjs`), or the content of per-tenant SEO files once routing serves them dynamically: sitemap entries, canonical URLs, structured data, indexing policy (use `seo`).

## Contents

- Platform dispatch (decide first)
- Reference files
- Workflow (order matters)
- Gotchas
- Output schema
- Evidence commands
- Related skills

## Platform dispatch (decide first)

| Signals | Platform | Model |
|---------|----------|-------|
| Tenants upload or generate their own code; code-level isolation; edge compute on KV, D1, Durable Objects, R2 | Cloudflare | Dispatch Worker in front of a dispatch namespace of per-tenant Workers; Cloudflare for SaaS for custom hostnames |
| Every tenant runs the same Next.js codebase and differs by content, branding, and plan; ISR, Server Components, Vercel deploys | Vercel | One deployment; `proxy.ts` resolves the tenant from the hostname; wildcard plus custom domains on the project |

- Pick one platform per product. Fronting a Vercel app with a Cloudflare proxy doubles the TLS and redirect layers and is the usual cause of redirect loops and failed certificate issuance.
- Tenants shipping their own code on Vercel is the multi-project model (one Vercel project per tenant, created with the SDK). It follows the Cloudflare row's isolation reasoning; this skill's Vercel references cover the single-deployment model only.

## Reference files

| File | Read when |
|------|-----------|
| [cloudflare-platform.md](references/cloudflare-platform.md) | Cloudflare chosen: dispatch namespaces, routing, Cloudflare for SaaS custom hostnames, isolation modes, KV and D1 (steps 3 to 7) |
| [vercel-platform.md](references/vercel-platform.md) | Vercel chosen: `proxy.ts` resolution, App Router layout, Global Config lookups, per-tenant static files, custom subpaths, local dev (steps 4 to 7) |
| [vercel-domains.md](references/vercel-domains.md) | Vercel chosen: SDK domain lifecycle, DNS targets, verification, wildcard nameservers, SSL, troubleshooting (step 7) |
| [data-isolation.md](references/data-isolation.md) | Step 3 on either platform: shared schema with RLS, schema-per-tenant, database-per-tenant, and the Postgres/Supabase/Drizzle policy pattern |
| [psl.md](references/psl.md) | Step 1 when tenants publish content or run code on sibling subdomains: eligibility, submission, interim cookie controls |
| [limits-and-quotas.md](references/limits-and-quotas.md) | Step 8: Cloudflare, Vercel, and Neon limit names with the official source for each, to map onto plans |

## Workflow (order matters)

Copy this checklist to track progress:

```text
Multi-tenant progress:
- [ ] Step 1: Domain strategy and PSL decision
- [ ] Step 2: Tenant identification strategy
- [ ] Step 3: Isolation model (compute and data)
- [ ] Step 4: Deterministic routing
- [ ] Step 5: Tenant context propagation
- [ ] Step 6: Tenant config and least-privilege bindings
- [ ] Step 7: Custom domains and per-tenant static files
- [ ] Step 8: Limits mapped to plans, evidence captured
```

1. Choose the domain strategy
- Put tenant workloads on a dedicated registrable domain (`acme.app` for tenants, `acme.com` for brand). One phishing tenant on `x.acme.com` puts the whole domain on blocklists, and a tenant cookie with `Domain=acme.com` reaches your dashboard.
- Keep the dashboard and auth on a different apex from tenant subdomains (`app.acme.com` for the console, `*.acme.app` for tenants).
- If tenants publish content or run code on sibling subdomains, submit the label directly above the tenant name (`acme.app`, or `sites.acme.app` for `<tenant>.sites.acme.app`) to the PSL and start now: there is no SLA. Tenant-owned custom domains need no PSL entry. Otherwise record `No PSL` with the reason.

2. Choose tenant identification (one primary; custom domain as the upgrade path)
- **Subdomain** `tenant.acme.app`: wildcard DNS plus wildcard certificate. The default.
- **Custom domain** `tenant.com`: the tenant CNAMEs to you. Paying tenants; reputation shifts to them; needs the onboarding lifecycle in step 7.
- **Path** `acme.app/tenant`: no per-tenant DNS or certificates, but no cookie isolation and no branding. Choose it only when tenants will never get a hostname.

3. Define the isolation model
- **Compute, Cloudflare:** one dispatch namespace in untrusted mode; per-invocation `cpuMs` and `subRequests` limits per plan; an outbound Worker if tenant code may call the internet.
- **Compute, Vercel:** one deployment, tenant code never executes. If tenants must ship code, move to Vercel multi-project or Cloudflare rather than sandboxing inside the app.
- **Data:** shared schema with `tenant_id` on every tenant-aware table plus RLS is the default; database-per-tenant for regulated or noisy tenants, selectable per plan. See [data-isolation.md](references/data-isolation.md).

4. Route deterministically (tenants never influence routing or see each other)
- **Cloudflare:** a single `*/*` route on the SaaS zone to the dispatch Worker; hostname -> tenant record (KV, D1 on miss) -> `env.DISPATCHER.get(script)`; `Worker not found` -> 404.
- **Vercel:** `proxy.ts` (Next.js 16; `middleware.ts` with `runtime: 'nodejs'` on 15) reads `host`, looks the tenant up in Global Config or the database, rewrites into the tenant segment; unknown hostname -> 404, never the brand site.
- Let `/.well-known` through before any tenant rewrite. Route `robots.txt`, `sitemap.xml`, and `llms.txt` into the tenant segment so they vary per tenant.

5. Propagate tenant context from one authority
- Delete every inbound `x-tenant-*` header, set `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan` from the resolved tenant, and forward them on the request (`NextResponse.next({ request: { headers } })`). Server Components read `await headers()`; route handlers read `request.headers`. Cloudflare: the dispatch Worker sets headers or passes parameters before `fetch`.
- The proxy is routing, not authorization. Server Functions, route handlers, and jobs re-derive the tenant from the session and the data layer enforces it (RLS or `tenant_id` predicates).

6. Bind only what the tenant needs
- **Cloudflare:** each user Worker gets its own bindings (KV namespace, D1 database, R2 prefix); adding a binding is an explicit redeploy. No shared globals.
- **Vercel:** Global Config holds only `hostname -> { id, slug, plan }`; the database is the source of truth and write-through happens when a domain verifies. Feature flags and branding come from the database keyed by tenant id.

7. Support custom domains and per-tenant static files
- Lifecycle to design and record: add domain -> show DNS target -> verify ownership -> certificate issued -> mapping activated -> removal or failure path.
- **Cloudflare:** Cloudflare for SaaS custom hostname on the SaaS zone, proxied fallback origin, `customers.<you>.com` CNAME target, `http` or `txt` validation, pre-validate before DNS cutover. See [cloudflare-platform.md](references/cloudflare-platform.md).
- **Vercel:** `projectsAddProjectDomain` -> DNS values from the project's domain card -> `_vercel` TXT only if the domain is already on Vercel -> `projectsVerifyProjectDomain` -> Let's Encrypt HTTP-01. See [vercel-domains.md](references/vercel-domains.md).
- `robots.txt`, `sitemap.xml`, `llms.txt` are route handlers inside the tenant segment with explicit `Content-Type`; nothing tenant-specific lives in `/public`. Their content is `seo` territory.

8. Surface limits as plans and capture evidence
- Fill the limits-to-plan table from [limits-and-quotas.md](references/limits-and-quotas.md), reading each current value from its source URL and dating it; enforce at the routing layer (Cloudflare `limits`, Vercel plan header plus server checks).
- Nothing long-running in the request path: Cloudflare Queues or Workflows, Vercel background functions or cron.
- Every tenant operation (create tenant, add domain, verify, remove) works over HTTP with the same authority as the UI; if it only works in the dashboard, the platform leaks into the UI.
- Run the evidence commands and paste results into the output.

## Gotchas

Platform and data gotchas live in the reference for that step; these fire before any reference loads.

- Forwarding inbound tenant headers: `curl -H "x-tenant-id: <other>"` then serves another tenant's data. Delete or overwrite `x-tenant-*` on every path through the proxy or dispatch Worker, including paths that skip resolution (`/.well-known`, the brand site).
- A hostname map keyed in a restricted alphabet (Global Config allows only `^[\w-]+$`) needs a collision-free encoding or a hash; replacing dots with underscores maps `a-b.example.com` and `a.b-example.com` to one key. Keep the original hostname in the record and compare it on read.
- Starting path-based with custom domains on the roadmap means URL rewrites, cookie changes, and DNS migration later.

## Output schema

Length follows the decisions: drop any section the project does not face rather than filling it.

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
- PSL decision: Submit (suffix, owner, PR link, _psl TXT date) | No PSL (reason)

## Routing matrix
| Host pattern | Resolver | Destination | Unknown tenant behavior |
|---|---|---|---|

## Tenant context flow
- Authority: proxy.ts | dispatch Worker
- Headers set and stripped:
- Server read path:
- Data-layer enforcement:

## Isolation model
- Compute isolation:
- Data isolation (and per-plan variant):
- Config/binding isolation:

## Custom-domain lifecycle
1. DNS target:
2. Ownership verification:
3. Certificate provisioning:
4. Routing activation:
5. Removal/failure path:

## Limits-to-plan table
| Limit | Source URL / access date | Free | Pro | Enterprise | Enforcement point |
|---|---|---:|---:|---:|---|

## Validation evidence
| Check | Command | Expected | Result |
|---|---|---|---|
```

## Evidence commands

Run against local or preview before calling the design done; mark N/A with a reason.

| Check | Command | Expected |
|---|---|---|
| Tenant boundary exists in code | `rg -n "x-tenant-id\|CREATE POLICY\|FORCE ROW LEVEL SECURITY\|DISPATCHER.get" .` | Hits in proxy or dispatch Worker and in the schema |
| Unknown host is 404 | `curl -sI -H "Host: nope.acme.app" <url>` | `404` |
| Forged header ignored | `curl -s -H "Host: a.acme.app" -H "x-tenant-id: tenant-b" <url>/api/whoami` | Tenant A |
| Static files vary | `curl -s -H "Host: a.acme.app" <url>/robots.txt` vs `-H "Host: b.acme.app"` | Different bodies, `Content-Type: text/plain` |
| RLS holds for the app role | `psql -c "BEGIN; SET LOCAL ROLE app_user; SELECT set_config('app.tenant_id','<t1>',true); SELECT count(*) FROM posts; ROLLBACK;"` | Only tenant t1's rows |
| ACME path reachable | `curl -sI -H "Host: tenant.com" <url>/.well-known/acme-challenge/test` | Not a redirect into the tenant segment |
| Limits current | Access date next to each URL in the limits table | Dated within the planning window |

## Related skills

- `codebase-architecture`: folder structure, module contracts, and the request-context pipeline for the application itself.
- `scaffold-nextjs`: bootstrap the Next.js turborepo before applying these tenancy patterns.
- `seo`: content of per-tenant `robots.txt`, `sitemap.xml`, `llms.txt`, canonical URLs, and structured data once routing serves them.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
