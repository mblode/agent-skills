# Cloudflare platform primitives (Workers for Platforms + Cloudflare for SaaS)

Applies to steps 3 to 7 when Cloudflare is the chosen platform. Numbers here were checked 2026-09-01; the limits file carries the dated table.

## Contents

- Architecture
- Routing (hostname -> tenant -> dispatch)
- Custom hostnames (Cloudflare for SaaS)
- Isolation modes and per-tenant limits
- Data primitives per tenant
- Local checks
- Sources

## Architecture

- **Dispatch namespace**: the container for tenant ("user") Workers. Unlimited scripts, no per-account script cap, every script runs in untrusted mode by default.
- **Dynamic dispatch Worker**: the only Worker with a route. Resolves the tenant, applies limits, sanitizes the response, and invokes the tenant Worker through the namespace binding.
- **User Workers**: uploaded with `wrangler deploy --dispatch-namespace <namespace>` or the dispatch namespaces script upload API (`PUT /accounts/{account_id}/workers/dispatch/namespaces/{namespace}/scripts/{script_name}`). Bindings to KV, D1, R2, and Durable Objects are declared per script. No gradual deployments: each upload takes 100% of traffic immediately.
- **Outbound Worker** (optional): intercepts every `fetch()` a user Worker makes. Use for hostname allowlists, egress logging, and injecting credentials the tenant never sees. Enabling it disables the `connect()` TCP API inside user Workers.

Binding in the dispatch Worker's `wrangler.toml`:

```toml
[[dispatch_namespaces]]
binding = "DISPATCHER"
namespace = "tenants-prod"
```

Dispatch Worker shape:

```js
export default {
  async fetch(request, env) {
    const host = new URL(request.url).hostname;
    let tenant = await env.TENANTS.get(host, { type: "json" }); // KV: hostname -> { script, plan, cpuMs, subRequests }
    if (!tenant) tenant = await lookupInD1(env, host);         // KV misses for ~60 s after onboarding
    if (!tenant) return new Response("Not found", { status: 404 });
    try {
      const worker = env.DISPATCHER.get(tenant.script, {}, {
        limits: { cpuMs: tenant.cpuMs, subRequests: tenant.subRequests },
      });
      const headers = new Headers(request.headers);
      headers.set("x-tenant-id", tenant.id);
      headers.set("x-tenant-plan", tenant.plan);
      return await worker.fetch(new Request(request, { headers }));
    } catch (e) {
      if (e.message.startsWith("Worker not found")) return new Response("Not found", { status: 404 });
      throw e;
    }
  },
};
```

## Routing (hostname -> tenant -> dispatch)

- One `*/*` route on the SaaS zone pointing at the dispatch Worker. Per-hostname routes hit the 1,000 routes-per-zone limit and behave differently for grey-clouded customer DNS; the wildcard is consistent for proxied and unproxied customers and scales to millions of hostnames.
- `*.saas.example/*` is enough when routing platform subdomains only; it needs a proxied wildcard DNS record.
- Custom hostnames arrive because the customer's CNAME points at your zone; Cloudflare for SaaS routes them to the fallback origin, which can be a placeholder proxied record when the Worker is the origin.
- Resolve `hostname -> tenant -> script name`; never derive the script name from the hostname string alone, or a tenant registering `victim.saas.example` picks their neighbor's script.

## Custom hostnames (Cloudflare for SaaS)

- Bundled on Free, Pro, and Business; add-on for Enterprise. 100 custom hostnames included per zone, then $0.10 per hostname per month; hard cap 50,000 per zone below Enterprise.
- **Setup**: fallback origin = a proxied `A`, `AAAA`, or `CNAME` record in your zone. Publish a friendly CNAME target such as `customers.<you>.com` and give tenants that, not the zone apex.
- **Create** per tenant in the dashboard or with the Create Custom Hostname API: `hostname`, `ssl.method` (`http` | `txt` | `email`), minimum TLS version, optional custom origin server. The `POST` response may omit `validation_records`; `GET` the hostname afterwards.
- **Two validations, two statuses**: hostname ownership (`ownership_verification`, drives `status`) and certificate DCV (`ssl.validation_records`, drives `ssl.status`). HTTP validation completes automatically once DNS points at you. TXT pre-validation (`_cf-custom-hostname.<hostname>` TXT with the returned UUID, or serving `/.well-known/cf-custom-hostname-challenge/<id>` with the token) reaches `active` before DNS cutover, so the tenant sees no downtime; traffic still moves only when the customer changes their DNS target. Wildcard custom hostnames require TXT.
- Do not create a custom hostname equal to the SaaS zone name.
- Hostnames over 64 characters need `cloudflare_branding: true` (the certificate CN becomes `sni.cloudflaressl.com`).
- **Enterprise only**: wildcard custom hostnames, choosing the CA (`certificate_authority`), uploading custom certificates, apex proxying (customer `A` record at their apex), BYOIP. Below Enterprise a tenant apex needs a DNS provider with CNAME flattening, or a `www` redirect.
- **O2O (Orange-to-Orange)**: the customer's zone is also on Cloudflare and proxied. Their zone's settings apply first, then yours; requires two different accounts; pre-validation is unsupported; requests carry `cf-connecting-o2o: 1`. Custom hostnames behind another CDN are not compatible.

## Isolation modes and per-tenant limits

- **Untrusted** (default): no `request.cf`, `caches.default` disabled, each Worker has an isolated cache. Required when customers control the code.
- **Trusted**: `request.cf` available and `caches.default` shared across the namespace, so a Worker can read another tenant's cached responses. Only when you author every script.
- Per-invocation limits in `DISPATCHER.get(name, {}, { limits: { cpuMs, subRequests } })`; the user Worker throws the moment it exceeds either. Map plan tiers to these values and keep the mapping next to billing.
- Up to eight tags per script; tag with tenant id and plan for bulk list and delete.
- Platform ceiling on Workers for Platforms: 30 s CPU per invocation, 15 min per Cron Trigger or Queue consumer invocation.

## Data primitives per tenant

- **KV** for `hostname -> tenant` in the hot path. Eventually consistent: up to 60 s across locations, negative lookups cached for the default `cacheTtl` of 60 s. Fall back to D1 on miss during onboarding.
- **D1** for tenant records and, if chosen, database-per-tenant: 10 GB per database on Paid, 50,000 databases per account, 1,000 queries per invocation, 30 s per statement. Each database is a single writer, so shard a busy tenant rather than a busy table.
- **Durable Objects** for per-tenant coordination and rate limiting; no namespace cap under Workers for Platforms.
- **R2** with per-tenant prefixes (or buckets for regulated tenants); zero egress fees.

## Local checks

- `curl -sI -H "Host: tenant.saas.example" http://127.0.0.1:8787/` against `wrangler dev` of the dispatch Worker: expect 200 for a known tenant, 404 for unknown.
- `curl -s -H "Host: tenant.saas.example" -H "x-tenant-id: other" http://127.0.0.1:8787/whoami`: expect the resolved tenant, not `other`.

## Sources

Accessed 2026-09-01.

- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/dynamic-dispatch/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/custom-limits/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/hostname-routing/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/worker-isolation/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/getting-started/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/create-custom-hostnames/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/pre-validation/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/security/certificate-management/issue-and-validate/validate-certificates/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/how-it-works/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/kv/concepts/how-kv-works/
- https://developers.cloudflare.com/d1/platform/limits/
