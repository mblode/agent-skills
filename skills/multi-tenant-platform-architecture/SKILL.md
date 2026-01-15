---
name: multi-tenant-platform-architecture
description: Cloudflare-first architecture guidance for multi-tenant platforms where tenants own their space. Use when defining domain strategy, tenant isolation, Workers for Platforms routing, custom domains, and plan/limit mapping for untrusted tenant code or UGC.
---

# Multi-Tenant Platform Architecture (Cloudflare-first)

## Workflow (order matters)

1. Choose domain strategy
- Use a dedicated tenant domain (separate from the brand domain) for all subdomains/custom hostnames.
- Consider PSL for browser cookie isolation; it does not protect reputation. See `references/psl.md`.
- Start PSL submission early; review can take weeks.

2. Define isolation model
- Prefer per-tenant Workers for untrusted code (Workers for Platforms).
- Avoid shared-tenant branching unless you fully control code and data.

3. Route traffic deterministically
- Platform Worker owns routing/policy; hostname -> tenant id -> dispatch namespace -> tenant Worker.
- 404 when no mapping exists; tenants never control routing or see each other.

4. Bind only what is needed
- Least-privilege bindings per tenant (DB/storage/limited platform API), no shared global state.
- Treat new bindings as explicit changes; redeploy to grant access.

5. Support custom domains
- Provide DNS target, verify ownership, store mapping, and route by hostname.
- Use Cloudflare for SaaS custom hostnames + managed certs. See `references/cloudflare-platform.md`.
- Custom domains shift reputation to the tenant and segment users.

6. Surface limits as plans
- Map CPU/memory/request limits to tiers; expose in API + UI.
- Do not run long jobs in requests; use queues/workflows.
- See `references/limits-and-quotas.md` for current limits.

7. Make the API the product
- Everything works over HTTP; UI is for ops/incident/billing.
- Platform logic stays in the routing Worker; tenant Workers serve requests.
- If it only works in the UI, the platform is leaking.

8. Extend without breaking boundaries
- Add queues/workflows/containers as optional modes.
- Keep routing explicit and isolation intact.

## Deliverables

- Domain map: brand vs tenant domain, PSL plan, custom domain flow
- Isolation plan: per-tenant Workers + dispatch namespace layout
- Routing plan: hostname lookup, dispatch logic, fallback behavior
- Binding matrix: per-tenant capabilities and data access
- Limits-to-pricing map: CPU/memory/request budgets per tier
- API surface + ops UI scope

## References to load

- PSL submission and cookie isolation: `references/psl.md`
- Cloudflare platform primitives and routing: `references/cloudflare-platform.md`
- Worker limits and plan mapping: `references/limits-and-quotas.md`

## Pre-commit checklist

- Tenant workloads off the brand domain; PSL decision + timeline set
- Untrusted isolation for tenant code; dispatch routing authoritative and tenant-blind
- Custom domain onboarding defined; limits tied to billing; API parity with UI
