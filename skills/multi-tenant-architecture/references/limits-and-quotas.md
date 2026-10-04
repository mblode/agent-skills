# Platform limits and plan mapping

Applies to step 8. This file names the limits that shape tenant plans and where each is published; it holds no values on purpose, because vendors change them. Resolve every current value from its source URL at use time, and put the value, the URL and the access date in the limits-to-plan table. Vendors rename products (Edge Config became Global Config in 2026) and move docs (`vercel.com/docs/multi-tenant/*` now lives under `/docs/platforms/multi-tenant-platforms/`); follow redirects and fix the URL here.

## Cloudflare

| Limit | Why it matters for tenants | Source |
|-------|----------------------------|--------|
| Workers CPU time per request; Workers for Platforms per-invocation, Cron and Queue ceilings | Upper bound for per-tenant `cpuMs` | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [WfP limits](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/) |
| Memory per isolate; Worker size (compressed) | Caps what a tenant script can ship | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Subrequests per invocation (redirect hops count) | Upper bound for per-tenant `subRequests` | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Workers per account (user Workers in a dispatch namespace are exempt) | Why tenant code goes in a dispatch namespace | [WfP limits](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/) |
| Routes per zone | Why the dispatch Worker uses one `*/*` route | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Custom Domains (Workers) per zone | Distinct from Cloudflare for SaaS custom hostnames | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Cloudflare for SaaS custom hostnames: included count, per-hostname price, per-zone cap; Enterprise-only features (wildcards, CA choice, custom certificates, apex proxying, BYOIP) | Per-tenant domain cost and the Enterprise trigger | [SaaS plans](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/) |
| Workers for Platforms subscription: included requests, CPU-ms and scripts, and overage rates | Per-tenant compute cost | [WfP pricing](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/pricing/) |
| D1 databases per account; size per database; queries per invocation; statement timeout | Database-per-tenant ceiling | [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) |
| KV consistency window and negative-lookup caching | Onboarding delay before a new hostname resolves | [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) |
| Tags per script | Bulk list and delete by tenant or plan | [WfP limits](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/limits/) |

## Vercel

| Limit | Why it matters for tenants | Source |
|-------|----------------------------|--------|
| Domains per project, per plan (soft limits raised on request) | Tenant count ceiling per plan | [Multi-tenant limits](https://vercel.com/docs/platforms/multi-tenant-platforms/limits) |
| Domain API rate limits per team: additions, verifications, removals | Queue onboarding; back off on `rate_limit_exceeded` | [Multi-tenant limits](https://vercel.com/docs/platforms/multi-tenant-platforms/limits) |
| Wildcard domains (Vercel nameservers required) | Subdomain tenancy | [Multi-tenant limits](https://vercel.com/docs/platforms/multi-tenant-platforms/limits) |
| Multi-tenant preview URLs on your own domain; custom SSL certificate upload | Enterprise triggers | [Multi-tenant limits](https://vercel.com/docs/platforms/multi-tenant-platforms/limits) |
| Global Config store size, stores per project, writes per plan, write propagation | Whether the hostname map fits and whether onboarding churn exhausts writes | [Global Config limits](https://vercel.com/docs/global-config/global-config-limits), [migration guide](https://vercel.com/docs/global-config/migration-guide) |
| Deployments per day | Multi-project platforms deploying per tenant | [Vercel limits](https://vercel.com/docs/limits) |
| Routing Middleware request limits: URL, body, header count and size | Applies to `proxy.ts`; tenant headers count | [Routing Middleware](https://vercel.com/docs/routing-middleware) |
| Edge Requests included, ISR read and write pricing | Per-tenant ISR pages multiply reads | [Vercel limits](https://vercel.com/docs/limits) |
| DNS label length | Preview URL tenant labels | [Vercel limits](https://vercel.com/docs/limits) |

## Neon (database-per-tenant)

| Limit | Why it matters for tenants | Source |
|-------|----------------------------|--------|
| Projects included per plan | Database-per-tenant ceiling | [Neon plans](https://neon.com/docs/introduction/plans) |
| Scale-to-zero delay and whether it can be disabled | Cold starts for idle tenants | [Neon plans](https://neon.com/docs/introduction/plans) |

## Planning guidance

- Enforce every plan limit at the routing layer (Cloudflare `limits`, Vercel `x-tenant-plan` plus server checks) and expose the same numbers in the API and the billing UI; a limit that only the UI knows about is unenforced.
- Keep request work short on both platforms; queue or schedule anything longer than a page render (Cloudflare Queues and Workflows, Vercel background functions and cron).
- Durable state lives in storage (D1, Neon, R2, Blob), never in-memory across requests.
- Vercel: Global Config holds the hostname map only; everything else reads from the database. Check the Hobby write quota before using it for high-churn onboarding.
- Cloudflare: a D1 database is a single writer; shard busy tenants or give them their own database.
- Pricing inputs that surprise teams: per-hostname charges past the included Cloudflare for SaaS count; per-script fees past the included user Workers; Vercel ISR reads scaling with tenant page count.
