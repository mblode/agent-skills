# Vercel domain management (custom domains + SSL)

## Domain onboarding flow

- Tenant submits their domain in your UI/API.
- `projectsAddProjectDomain` (`@vercel/sdk`) registers it on your project.
- Tenant sets CNAME to `cname.vercel-dns.com` or A record to `76.76.21.21`.
- Poll `projectsVerifyProjectDomain` (or webhooks) for verification.
- Store the verified mapping in Edge Config and DB; serve traffic on that hostname.

## Wildcard domains

- Wildcard (`*.acme.com`) requires Vercel nameservers `ns1.vercel-dns.com`, `ns2.vercel-dns.com`.
- Vercel issues per-subdomain SSL on the fly via DNS-01 challenge.
- Add the apex domain first, then the wildcard in project settings.
- All plans; no per-subdomain config.

## Custom domains (Vercel SDK)

- `@vercel/sdk` CRUD: `projectsAddProjectDomain`, `projectsGetProjectDomain`, `projectsVerifyProjectDomain`, `projectsRemoveProjectDomain`.
- `domainsDeleteDomain` removes a domain from the account (separate from project removal).
- Errors: `409` (domain in use by another project), `403` (verification required), `429` (rate limited).
- Rate limits: 100 additions/hr, 50 verifications/hr, 100 removals/hr per team. Batch to stay within them.

## Domain verification

- Needed when the domain is already in use on another Vercel project.
- Record: `_vercel.domain.com` TXT with the value from the API response.
- Poll via SDK; most complete within minutes once DNS propagates.
- Re-verify if DNS changes or ownership transfers.

## SSL certificates

- Automatic Let's Encrypt via ACME; no manual config.
- Standard/custom domains: HTTP-01 challenge (Vercel responds at `/.well-known/acme-challenge/*`).
- Wildcard domains: DNS-01 challenge (requires Vercel nameservers).
- Auto-renewal 14-30 days before expiry.
- CAA records must allow Let's Encrypt; never block the ACME challenge path with redirects or middleware.
- Enterprise only: upload custom SSL certs for compliance.

## Redirects (www/apex)

- Add both `domain.com` and `www.domain.com`.
- Redirect `www` to apex (or vice versa) via the SDK `redirect` parameter.
- Set canonical URL in `<head>` if a tenant serves on both a subdomain and custom domain.
- 301 for permanent consolidation; 307 for temporary.

## Preview URLs

- Pattern: `tenant---preview-deployment.vercel.app`. Vercel routes to the deployment; your code gets the full hostname.
- Requires a custom preview deployment suffix; not the default `.vercel.app`.
- Middleware splits on `---` to extract the tenant slug.
- Total hostname <=253 characters (DNS limit); keep branch names concise.
- Enterprise only for full multi-tenant preview URLs.

## Troubleshooting

- **DNS not propagating**: wait up to 48 hours; verify with `dig` or whatsmydns.net (most resolve in minutes).
- **Verification failure**: TXT value must match exactly; check CNAME flattening by the DNS provider; no trailing dots.
- **Wildcard not working**: nameservers must point to Vercel (DNS-01 challenge only works with Vercel nameservers).
- **SSL not issuing**: CAA records must allow `letsencrypt.org`; middleware/redirects must not block `/.well-known/acme-challenge/*`.
- **Infinite redirects**: conflicting rules across Vercel config, middleware, DNS provider (e.g. Cloudflare proxying).
- **SEO duplicate content**: set canonical URLs; redirect non-canonical to canonical; consistent domain in sitemaps.

## Sources

- https://vercel.com/docs/multi-tenant/domain-management
- https://vercel.com/docs/domains/working-with-ssl
- https://vercel.com/docs/multi-tenant/preview-urls
- https://vercel.com/docs/multi-tenant/limits
- https://github.com/vercel/sdk
- https://vercel.com/docs/multi-tenant/api-reference
