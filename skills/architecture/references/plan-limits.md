# Plan Limits

Tenancy workflow step 8. Platform limits and prices change without notice, so this file names which limits shape plans and where to read them, not their values. Resolve each from the current source, record the value with its URL and access date in the limits-to-plan table, and re-check before pricing, launch, or an enforcement change.

## Limits that shape plans

| Limit | Why it shapes plans | Source |
|---|---|---|
| Workers CPU time per request, and per Workers for Platforms invocation | Per-plan `cpuMs` ceilings; long work must leave the request path | https://developers.cloudflare.com/workers/platform/limits/ |
| Subrequests per invocation | Per-plan `subRequests`; redirect hops count | same |
| Routes per zone | Why the dispatch Worker uses one `*/*` route | same |
| Workers for Platforms subscription: included requests, CPU, scripts, overage | Per-tenant cost floor; per-script fees past the included count | https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/ |
| Cloudflare for SaaS custom hostnames: included, per-hostname price, per-zone cap, Enterprise-only features | Custom-domain pricing and the tier that unlocks apex proxying and wildcards | https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/ |
| D1 databases per account, size per database, queries per invocation | Database-per-tenant ceiling | https://developers.cloudflare.com/d1/platform/limits/ |
| KV consistency window and negative-lookup cache | Onboarding delay before a hostname resolves | https://developers.cloudflare.com/kv/concepts/how-kv-works/ |
| Vercel domains per project and domain API rate limits (additions, verifications, removals) | Onboarding throughput; queue and back off | https://vercel.com/docs/platforms/multi-tenant-platforms/limits and https://vercel.com/docs/limits |
| Vercel wildcard domains, multi-tenant preview URLs on your domain, custom certificates | Which features need which plan | https://vercel.com/docs/platforms/multi-tenant-platforms/limits |
| Global Config store size, stores per project, writes, propagation | Whether the hostname map fits and how fast onboarding can write | https://vercel.com/docs/global-config/global-config-limits |
| Routing Middleware request limits (URL, body, headers) | Applies to `proxy.ts` | https://vercel.com/docs/routing-middleware |
| Edge requests and ISR reads and writes | Per-tenant page counts multiply ISR reads | https://vercel.com/docs/limits |
| Neon projects per plan and scale-to-zero behaviour | Database-per-tenant cost for idle tenants | https://neon.com/docs/introduction/plans |

## Planning rules

- Enforce every plan limit at the routing layer (Cloudflare `limits`, Vercel plan header plus server checks) and expose the same numbers in the API and billing UI. A limit only the UI knows about is unenforced.
- Queue or schedule anything longer than a page render (Cloudflare Queues or Workflows; Vercel background functions or cron; the container worker).
- Durable state lives in storage, never in memory across requests.
- The surprises are usually per-unit: per custom hostname past the included count, per user Worker past the included scripts, ISR reads growing with tenant page count. Model them per tenant, not per account.
- Vendors rename products and move docs. Follow redirects and correct the URL here when one moves.
