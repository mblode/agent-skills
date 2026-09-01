# Platform limits and plan mapping

Applies to step 8. Copy the rows that shape your plans into the limits-to-plan table with the source URL and access date.

## Freshness policy

- Snapshot date: 2026-09-01.
- Re-check each source before pricing, launch, or an enforcement change; the docs win on conflict and this file gets the correction.
- Vendors rename products (Edge Config became Global Config in 2026) and move docs (`vercel.com/docs/multi-tenant/*` now lives under `/docs/platforms/multi-tenant-platforms/`); follow redirects and update URLs here.

## Cloudflare

| Limit | Free | Paid | Notes |
|-------|------|------|-------|
| Workers CPU time per request | 10 ms | 30 s default, 5 min max | Workers for Platforms user Workers: 30 s per invocation, 15 min per Cron or Queue invocation |
| Memory per isolate | 128 MB | 128 MB | |
| Worker size (compressed) | 3 MB | 10 MB | |
| Subrequests per invocation | 50 | 10,000 | Redirect hops count |
| Workers per account | 100 | 500 | Not applied to user Workers in a dispatch namespace (unlimited) |
| Routes per zone | 1,000 | 1,000 | Why the dispatch Worker uses one `*/*` route |
| Custom Domains (Workers) per zone | 100 | 100 | Distinct from Cloudflare for SaaS custom hostnames |
| Cloudflare for SaaS custom hostnames | 100 included, then $0.10 per hostname per month, cap 50,000 | Same on Pro and Business; Enterprise unlimited (talk to sales above 50,000) | Wildcard hostnames, CA choice, custom certificates, apex proxying, BYOIP: Enterprise |
| Workers for Platforms subscription | n/a | $25 per month: 20M requests (+$0.30 per extra million), 60M CPU-ms (+$0.02 per extra million), 1,000 scripts (+$0.02 per extra script) | Per-script custom limits via `cpuMs` and `subRequests` |
| D1 databases per account | 10 | 50,000 | Database-per-tenant ceiling |
| D1 database size | 500 MB | 10 GB | Per database |
| D1 queries per Worker invocation | 50 | 1,000 | 30 s per statement |
| KV consistency | Eventual, up to 60 s | Eventual, up to 60 s | Negative lookups cached (default `cacheTtl` 60 s) |
| Tags per script | 8 | 8 | |

## Vercel

| Limit | Hobby | Pro | Enterprise | Notes |
|-------|-------|-----|------------|-------|
| Domains per project | 50 | Unlimited (soft 100,000) | Unlimited (soft 1,000,000) | Soft limits raised on request |
| Domain API rate limits (per team) | 100 additions/h, 50 verifications/h, 100 removals/h | same | same | Queue onboarding; back off on `rate_limit_exceeded` |
| Wildcard domains | Yes | Yes | Yes | Vercel nameservers required (DNS-01) |
| Multi-tenant preview URLs on your domain | No | No | Yes | `tenant---branch-project.vercel.app` works everywhere |
| Custom SSL certificate upload | No | No | Yes | |
| Global Config store size | 1 MB | 1 MB | 1 MB | Formerly Edge Config (8/64/512 KB) |
| Global Config stores | 1 total, 1 per project | Unlimited, 3 per project | Unlimited, 3 per project | |
| Global Config writes | 250 per month | 100 per hour | 100 per hour | Write propagation up to 10 s |
| Deployments per day | 100 | 6,000 | 24,000 | |
| Routing Middleware request limits | URL 14 KB, body 4 MB, 64 headers, 16 KB headers | same | same | Applies to `proxy.ts` |
| Edge Requests included | Plan allotment | First 10,000,000 | Contract | Regional pricing beyond |
| ISR reads and writes | Plan allotment | $0.0004 per 1K reads, $0.004 per 1K writes | Contract | Per-tenant ISR pages multiply reads |
| DNS label length | 63 chars | 63 chars | 63 chars | Preview URL tenant labels |

## Neon (database-per-tenant)

| Limit | Free | Launch | Scale |
|-------|------|--------|-------|
| Projects included | 100 | 100 | 1,000 (soft) |
| Scale to zero | After 5 min, always on | After 5 min, can be disabled | Configurable, 1 min to always on |

## Planning guidance

- Enforce every plan limit at the routing layer (Cloudflare `limits`, Vercel `x-tenant-plan` plus server checks) and expose the same numbers in the API and the billing UI; a limit that only the UI knows about is unenforced.
- Keep request work short on both platforms; queue or schedule anything longer than a page render (Cloudflare Queues and Workflows, Vercel background functions and cron).
- Durable state lives in storage (D1, Neon, R2, Blob), never in-memory across requests.
- Vercel: Global Config holds the hostname map only; everything else reads from the database. Hobby's 250 writes per month rules it out for high-churn onboarding.
- Cloudflare: a D1 database is a single writer; shard busy tenants or give them their own database.
- Pricing inputs that surprise teams: $0.10 per Cloudflare custom hostname past 100; per-script fees past 1,000 user Workers; Vercel ISR reads scaling with tenant page count.

## Sources

Accessed 2026-09-01.

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/kv/concepts/how-kv-works/
- https://vercel.com/docs/platforms/multi-tenant-platforms/limits
- https://vercel.com/docs/limits
- https://vercel.com/docs/global-config/global-config-limits
- https://vercel.com/docs/global-config/migration-guide
- https://vercel.com/docs/routing-middleware
- https://neon.com/docs/introduction/plans
