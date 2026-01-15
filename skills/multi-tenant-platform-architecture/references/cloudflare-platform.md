# Cloudflare platform primitives (Workers for Platforms)

Use this reference for Cloudflare-specific routing, isolation, and custom domain mechanics.

## Routing pattern (hostname -> tenant -> dispatch)

- Hostname routing with a wildcard route (`*/*`) sends all SaaS-domain traffic to a dispatch Worker.
- Supports platform subdomains and customer vanity domains; avoid per-domain routes.
- Resolve hostname -> tenant id -> dispatch namespace -> tenant Worker; 404 if no mapping.
- Use a dedicated SaaS domain and set custom hostnames + fallback origin; point DNS (CNAME/proxied apex).

## Custom domains (Cloudflare for SaaS)

- Supports subdomains on your zone and customer vanity domains.
- Validation required before cert issuance (http/txt/email via API).
- Standard mode routes custom hostnames to the SaaS fallback origin.

## Isolation modes (dispatch namespaces)

- Untrusted mode (default) for customer code: no `request.cf`, no `caches.default` (isolated cache).
- Trusted mode enables `request.cf` and shared cache; use only when you control code or enforce isolation.

## Sources

- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/get-started/hostname-routing/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
- https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/platform/worker-isolation/
- https://developers.cloudflare.com/api/operations/custom-hostnames-for-a-zone-create-custom-hostname
