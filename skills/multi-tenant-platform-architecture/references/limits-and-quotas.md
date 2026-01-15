# Workers limits and plan mapping

Use this reference to map platform limits directly to pricing tiers.

## Core limits (per request/isolate)

- CPU time defaults to 30s and can be configured up to 5m on paid plans; Free is 10ms.
- Memory limit is 128 MB per isolate.
- HTTP has no hard wall-clock limit, but runtime ends on client disconnect; `waitUntil()` can extend briefly.

## Planning guidance

- Keep workloads short; use queues/workflows for long jobs.
- Surface/enforce limits in plans and APIs/UI.
- Keep durable state in storage services, not memory.

## Sources

- https://developers.cloudflare.com/workers/platform/limits/
