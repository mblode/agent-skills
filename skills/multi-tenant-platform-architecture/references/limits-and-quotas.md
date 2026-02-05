# Platform limits and plan mapping

Use this reference to map platform limits directly to pricing tiers.

## Freshness policy

- Treat values below as a snapshot as of 2026-02-05.
- Re-check each cited source before finalizing pricing, architecture, or launch decisions.
- If a source conflicts with this file, treat the source documentation as canonical and update this file.

## Cloudflare Workers limits (per request/isolate)

- CPU time: 10 ms (Free), 30 s default / 5 min max (Paid).
- Memory: 128 MB per isolate.
- HTTP: no hard wall-clock limit; runtime ends on client disconnect; `waitUntil()` can extend briefly.
- D1: 10 GB per database; millions of databases per account; ~1,000 QPS per database.
- KV: eventually consistent (~60 s propagation); optimised for high-read/low-write.
- R2: 10 GB free storage; zero egress fees.
- Custom hostnames (Cloudflare for SaaS): 5,000 (Free/Pro/Business), unlimited (Enterprise).

## Vercel limits

- Domains per project: 50 (Hobby), unlimited (Pro/Enterprise). Soft limit 100,000 (Pro), 1,000,000 (Enterprise).
- Edge Config size: 8 KB (Hobby), 64 KB (Pro), 512 KB (Enterprise). Write propagation up to 10 s.
- Middleware bundle size: 1 MB (Hobby), 2 MB (Pro), higher (Enterprise).
- Edge requests: 1 M (Hobby), 10 M (Pro). Overage $2/million.
- Bandwidth: 100 GB (Hobby), 1 TB (Pro). Overage $0.15/GB.
- CPU time: 4 CPU-hrs (Hobby), 16 CPU-hrs (Pro).
- ISR reads: 1 M (Hobby), 10 M (Pro).
- Deployments/day: 100 (Hobby), 6,000 (Pro).
- Domain API rate limits: 100 additions/hr, 50 verifications/hr, 100 removals/hr per team.
- Wildcard domains: supported on all plans; requires Vercel nameservers.
- Custom SSL certificates: Enterprise only.

## Planning guidance

- Keep workloads short on both platforms; use queues/workflows for long jobs.
- Surface and enforce limits in plans and APIs/UI.
- Keep durable state in storage services (D1/Neon/R2/Vercel Blob), not in-memory.
- For Vercel: Edge Config is best for lightweight tenant metadata (<64 KB on Pro). Use a database for full tenant configuration when you exceed Edge Config size limits.
- For Cloudflare: D1 is single-threaded per database; shard or use database-per-tenant for high throughput.

## Sources

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/limits/
- https://vercel.com/docs/multi-tenant/limits
- https://vercel.com/docs/edge-config/edge-config-limits
- https://vercel.com/pricing
