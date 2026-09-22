# Tenancy

Multi-tenant platforms on Cloudflare or Vercel: platform choice, identification, isolation, routing, context propagation, bindings, domains, and plan limits. Order matters; each step constrains the next.

## Contents

- Platform dispatch
- Workflow
- Gotchas
- Output schema
- Evidence commands

## Platform dispatch

| Signals | Platform | Model |
|---------|----------|-------|
| Tenants upload or generate their own code; edge compute on KV, D1, Durable Objects, R2 | Cloudflare | Dispatch Worker in front of a dispatch namespace of per-tenant Workers; Cloudflare for SaaS for custom hostnames |
| Every tenant runs the same codebase and differs by content, branding, and plan | Vercel (or any single deployment) | One deployment resolves the tenant from the hostname; wildcard plus custom domains on the project |

- One platform per product. Fronting a Vercel app with a Cloudflare proxy doubles the TLS and redirect layers and is the usual cause of redirect loops and failed certificate issuance.
- Tenants shipping their own code on Vercel is the multi-project model (one project per tenant). It follows the Cloudflare row's isolation reasoning.
- A container API behind the web tier (Fastify, ConnectRPC) resolves the tenant the same way: from a verified host record or the session, never from a client-supplied header.

## Workflow

1. **Domain strategy.** Tenant workloads on a dedicated registrable domain (`acme.app` for tenants, `acme.com` for brand); dashboard and auth on a different apex. PSL decision recorded. Details in `domains.md`.
2. **Identification.** Subdomain by default; custom domain as the paid upgrade path; path-based only when tenants will never get a hostname (it forfeits cookie isolation and branding, and migrating later means URL, cookie, and DNS changes).
3. **Isolation.** Compute: tenant code never executes in a shared deployment; if tenants ship code, use Cloudflare untrusted dispatch or Vercel multi-project. Data: shared schema with `tenant_id` plus forced RLS by default; database-per-tenant for regulated or noisy tenants, selectable per plan (`data-isolation.md`).
4. **Deterministic routing.** Hostname to verified tenant record to destination; unknown host is a 404, never the brand site. Let `/.well-known` through before any tenant rewrite. Route `robots.txt`, `sitemap.xml`, and `llms.txt` into the tenant segment so they vary per tenant.
5. **Context from one authority.** The proxy or dispatch Worker deletes every inbound `x-tenant-*` header, then sets `x-tenant-id`, `x-tenant-slug`, `x-tenant-plan` from the resolved record on the request. The proxy is routing, not authorization: Server Functions, route handlers, RPC handlers, and jobs re-derive the tenant from the session, and the data layer enforces it.
6. **Least-privilege bindings.** Cloudflare: each user Worker gets only its own KV namespace, D1 database, and R2 prefix. Vercel: the edge store holds only `hostname -> { id, slug, plan }`; the database is the source of truth, written through when a domain verifies.
7. **Custom domains and per-tenant static files.** Lifecycle: add, show DNS target, verify ownership, certificate issued, mapping activated, removal or failure path (`domains.md`). Per-tenant files are route handlers with explicit `Content-Type`; nothing tenant-specific lives in `/public`.
8. **Limits as plans.** Map platform limits to plan tiers from current official sources (`plan-limits.md`), enforce at the routing layer and in server checks, and expose the same numbers in the API and billing UI. Nothing long-running in the request path. Every tenant operation (create, add domain, verify, remove) works over the API with the same authority as the UI.

## Gotchas

- Tenant headers set on the response instead of the request: `NextResponse.next({ headers })` sends `x-tenant-id` to the browser and `headers()` reads nothing. Use `NextResponse.next({ request: { headers } })`.
- Forwarding inbound tenant headers: `curl -H "x-tenant-id: <other>"` then serves another tenant's data. Strip on every path, including paths that skip resolution.
- A proxy matcher that excludes every root file with an extension skips `robots.txt` and `sitemap.xml`, so every tenant gets the platform's copy. It also skips Server Function POSTs on excluded paths.
- Encoding a hostname into a restricted key alphabet by replacing every separator with an underscore maps `a-b.example.com` and `a.b-example.com` to the same key, so one tenant's domain serves another. Hash the lowercased hostname (or use a reversible encoding), store the original hostname in the authoritative record, and compare it on lookup; a mismatch is an unknown host.
- `SET app.tenant_id` outside a transaction on a pooled connection persists into the next request. Use `set_config('app.tenant_id', $1, true)` inside the transaction.
- A DAO that uses the global client instead of the transaction client runs outside the tenant context entirely.
- RLS: superusers and `BYPASSRLS` roles always bypass; table owners bypass unless `FORCE ROW LEVEL SECURITY` is set. Connect as a separate app role.
- Wildcard subdomains on Vercel need Vercel nameservers (DNS-01), and `/.well-known` cannot be rewritten; a proxy that rewrites every path breaks HTTP-01.
- KV is eventually consistent and caches negative lookups: a hostname added after the first lookup 404s until the cache expires. Fall back to D1 on miss during onboarding.
- Domain quotas and prices vary by provider and plan and change. Put current official figures with access dates in the plan table before setting pricing.

## Output schema

Length follows the decisions: drop any section the project does not face.

```markdown
# Multi-tenant architecture

## Platform decision
- Platform, reason, rejected platform and reason

## Domain map
- Brand domain / tenant domain / tenant subdomains / custom domains
- PSL decision: Submit (suffix, owner, PR link, _psl TXT date) | No PSL (reason)

## Routing matrix
| Host pattern | Resolver | Destination | Unknown tenant behavior |
|---|---|---|---|

## Tenant context flow
- Authority, headers set and stripped, server read path, data-layer enforcement

## Isolation model
- Compute / data (and per-plan variant) / config and bindings

## Custom-domain lifecycle
1. DNS target 2. Ownership verification 3. Certificate 4. Activation 5. Removal and failure path

## Limits-to-plan table
| Limit | Source URL / access date | Free | Pro | Enterprise | Enforcement point |
|---|---|---:|---:|---:|---|

## Validation evidence
| Check | Command | Expected | Result |
|---|---|---|---|
```

## Evidence commands

Run against local or preview; mark N/A with a reason.

| Check | Command | Expected |
|---|---|---|
| Tenant boundary exists in code | `rg -n "x-tenant-id\|CREATE POLICY\|FORCE ROW LEVEL SECURITY\|DISPATCHER.get" .` | Hits in the proxy or dispatch Worker and in the schema |
| Unknown host is 404 | `curl -sI -H "Host: nope.acme.app" <url>` | `404` |
| Forged header ignored | `curl -s -H "Host: a.acme.app" -H "x-tenant-id: tenant-b" <url>/api/whoami` | Tenant A |
| Static files vary | `curl -s -H "Host: a.acme.app" <url>/robots.txt` vs `-H "Host: b.acme.app"` | Different bodies, `Content-Type: text/plain` |
| RLS holds for the app role | `psql -c "BEGIN; SET LOCAL ROLE app_user; SELECT set_config('app.tenant_id','<t1>',true); SELECT count(*) FROM posts; ROLLBACK;"` | Only tenant t1's rows |
| App role cannot bypass | `psql -c "SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = 'app_user';"` | Both `f`, and `app_user` owns no tenant table |
| ACME path reachable | `curl -sI -H "Host: tenant.com" <url>/.well-known/acme-challenge/test` | Not a redirect into the tenant segment |
| Limits current | Access date next to each URL in the limits table | Within the planning window |
