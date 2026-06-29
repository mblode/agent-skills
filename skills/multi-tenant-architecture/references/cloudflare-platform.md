# Cloudflare platform primitives (Workers for Platforms)

## Routing pattern (hostname -> tenant -> dispatch)

- Wildcard route (`*/*`) sends all SaaS-domain traffic to a dispatch Worker; avoid per-domain routes.
- Supports platform subdomains and customer vanity domains.
- Resolve hostname -> tenant id -> dispatch namespace -> tenant Worker; 404 if no mapping.
- Dedicated SaaS domain with custom hostnames + fallback origin; point DNS (CNAME/proxied apex).

## Custom domains (Cloudflare for SaaS)

- Subdomains on your zone and customer vanity domains.
- Validate before cert issuance (http/txt/email via API).
- Standard mode routes custom hostnames to the fallback origin.

## Isolation modes (dispatch namespaces)

- Untrusted mode (default) for customer code: no `request.cf`, no `caches.default` (isolated cache).
- Trusted mode enables `request.cf` and shared cache; only when you control code or enforce isolation.

## Sources

- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/hostname-routing/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/worker-isolation/
- https://developers.cloudflare.com/api/operations/custom-hostnames-for-a-zone-create-custom-hostname
- https://x.com/burcs/status/2011542877420294233 (Brandon from Cloudflare, multi-tenant platform development walkthrough)
