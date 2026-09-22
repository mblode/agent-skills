# Cloudflare Platform (Workers for Platforms)

Tenancy workflow steps 3 to 7 when tenants run their own code, or the product lives on Cloudflare's edge primitives. Custom hostnames (Cloudflare for SaaS) are in the domains reference. Limits and prices change: look them up in the sources before they shape a plan.

## Contents

- Architecture
- Dispatch Worker
- Routing
- Isolation modes and per-tenant limits
- Data primitives per tenant
- Local checks
- Sources

## Architecture

- **Dispatch namespace:** the container for tenant ("user") Workers. Scripts run in untrusted mode by default.
- **Dispatch Worker:** the only Worker with a route. Resolves the tenant, applies limits, sets context, and invokes the tenant Worker through the namespace binding.
- **User Workers:** uploaded with `wrangler deploy --dispatch-namespace <namespace>` or the script upload API, with bindings (KV, D1, R2, Durable Objects) declared per script. No gradual deployments: each upload takes all traffic at once.
- **Outbound Worker** (optional): intercepts every `fetch()` a user Worker makes, for hostname allowlists, egress logging, and credentials the tenant never sees. Enabling it disables the `connect()` TCP API in user Workers.

```toml
# dispatch Worker wrangler.toml
[[dispatch_namespaces]]
binding = "DISPATCHER"
namespace = "tenants-prod"
```

## Dispatch Worker

```js
export default {
  async fetch(request, env) {
    const host = new URL(request.url).hostname.toLowerCase();
    let tenant = await env.TENANTS.get(host, { type: "json" }); // KV: verified hostname -> tenant
    if (!tenant) tenant = await lookupVerifiedInD1(env, host);   // KV misses right after onboarding
    if (!tenant) return new Response("Not found", { status: 404 });
    try {
      const worker = env.DISPATCHER.get(tenant.script, {}, {
        limits: { cpuMs: tenant.cpuMs, subRequests: tenant.subRequests },
      });
      const headers = new Headers(request.headers);
      for (const h of ["x-tenant-id", "x-tenant-plan"]) headers.delete(h);
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

## Routing

- One `*/*` route on the SaaS zone to the dispatch Worker. Per-hostname routes hit the per-zone route cap and behave differently for unproxied customer DNS; the wildcard scales to any number of hostnames.
- `*.saas.example/*` suffices for platform subdomains only, with a proxied wildcard DNS record.
- Resolve hostname to tenant record to script name. Never derive the script name from the hostname string, or a tenant registering `victim.saas.example` reaches a neighbour's script.

## Isolation modes and per-tenant limits

- **Untrusted** (default): no `request.cf`, no `caches.default`, an isolated cache per Worker. Required when customers control the code; tenant code reading `request.cf.country` throws.
- **Trusted:** restores `request.cf` and shares `caches.default` across the namespace, so one Worker can read another tenant's cached responses. Only when you author every script.
- Per-invocation `cpuMs` and `subRequests` limits in `DISPATCHER.get`; the user Worker throws the moment it exceeds either. Keep the plan-to-limit mapping next to billing.
- Tag scripts with tenant id and plan for bulk list and delete.

## Data primitives per tenant

- **KV** for the hostname map in the hot path. Eventually consistent, with negative lookups cached, so a new hostname 404s briefly after onboarding; fall back to D1 on miss.
- **D1** for tenant records and, if chosen, database-per-tenant. Each database is a single writer: shard a busy tenant rather than a busy table.
- **Durable Objects** for per-tenant coordination and rate limiting.
- **R2** with per-tenant prefixes, or buckets for regulated tenants.

## Local checks

- `curl -sI -H "Host: tenant.saas.example" http://127.0.0.1:8787/` against `wrangler dev` of the dispatch Worker: 200 for a known tenant, 404 for unknown.
- `curl -s -H "Host: tenant.saas.example" -H "x-tenant-id: other" http://127.0.0.1:8787/whoami`: the resolved tenant, not `other`.

## Sources

- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/reference/how-workers-for-platforms-works/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/dynamic-dispatch/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/custom-limits/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/configuration/outbound-workers/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/worker-isolation/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/
- https://developers.cloudflare.com/kv/concepts/how-kv-works/
- https://developers.cloudflare.com/d1/platform/limits/
