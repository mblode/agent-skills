# Vercel domain management (custom domains + SSL)

Use this reference for programmatic domain lifecycle, SSL provisioning, verification, preview URLs, and troubleshooting.

## Domain onboarding flow

- Tenant provides their domain in your UI or API.
- Call `projectsAddProjectDomain` via `@vercel/sdk` to register the domain on your Vercel project.
- Instruct tenant to set CNAME to `cname.vercel-dns.com` or A record to `76.76.21.21`.
- Poll `projectsVerifyProjectDomain` or use webhooks for verification status.
- Store verified domain mapping in Edge Config and DB; begin serving tenant traffic on that hostname.

## Wildcard domains

- Wildcard (`*.acme.com`) requires Vercel nameservers: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`.
- Vercel issues individual SSL certificates per subdomain on the fly via DNS-01 challenge.
- Add the apex domain first, then add the wildcard domain in project settings.
- Supported on all plans; no per-subdomain configuration needed.

## Custom domains (Vercel SDK)

- Use `@vercel/sdk` for programmatic CRUD: `projectsAddProjectDomain`, `projectsGetProjectDomain`, `projectsVerifyProjectDomain`, `projectsRemoveProjectDomain`.
- `domainsDeleteDomain` removes a domain from the account entirely (separate from project removal).
- Handle API errors: `409` (domain in use by another project), `403` (verification required), `429` (rate limited).
- Rate limits: 100 additions/hr, 50 verifications/hr, 100 removals/hr per team.
- Batch domain operations where possible to stay within rate limits.

## Domain verification

- TXT record required when the domain is already in use on another Vercel project.
- Verification record: `_vercel.domain.com` TXT with the value provided by the API response.
- Poll verification status via SDK; most verifications complete within minutes once DNS propagates.
- Re-verify if DNS changes after initial verification or if ownership is transferred.

## SSL certificates

- Automatic Let's Encrypt certificates via ACME protocol; no manual configuration.
- Standard/custom domains: HTTP-01 challenge (Vercel responds at `/.well-known/acme-challenge/*`).
- Wildcard domains: DNS-01 challenge (requires Vercel nameservers).
- Automatic renewal 14-30 days before expiration.
- CAA records must allow Let's Encrypt; do not block the ACME challenge path with redirects or middleware.
- Enterprise only: upload custom SSL certificates for compliance requirements.

## Redirects (www/apex)

- Add both `domain.com` and `www.domain.com` to the project.
- Configure redirect from `www` to apex (or vice versa) via the SDK `redirect` parameter.
- Set canonical URL in `<head>` if serving the same tenant on both a subdomain and custom domain.
- Use 301 redirects for permanent domain consolidation; 307 for temporary.

## Preview URLs

- Pattern: `tenant---preview-deployment.vercel.app`. Vercel routes to the deployment; your code receives the full hostname.
- Requires a custom preview deployment suffix; does not work with default `.vercel.app`.
- Middleware must parse the triple-dash separator: split on `---` to extract tenant slug from preview hostname.
- Total hostname length must not exceed 253 characters (DNS limit); keep branch names concise.
- Enterprise only for full multi-tenant preview URL support.

## Troubleshooting

- **DNS not propagating**: Wait up to 48 hours; verify with `dig` or whatsmydns.net. Most resolve in minutes.
- **Verification failure**: Confirm TXT record value matches exactly; check for CNAME flattening by DNS provider; ensure no trailing dots.
- **Wildcard not working**: Confirm nameservers point to Vercel; wildcard requires DNS-01 challenge which only works with Vercel nameservers.
- **SSL not issuing**: Ensure CAA records allow `letsencrypt.org`; check that middleware or redirects do not block `/.well-known/acme-challenge/*`.
- **Infinite redirects**: Check for conflicting redirect rules between Vercel config, middleware, and DNS provider (e.g. Cloudflare proxying).
- **SEO duplicate content**: Set canonical URLs; redirect non-canonical domain to canonical; use consistent domain in sitemaps.

## Sources

- https://vercel.com/docs/multi-tenant/domain-management
- https://vercel.com/docs/domains/working-with-ssl
- https://vercel.com/docs/multi-tenant/preview-urls
- https://vercel.com/docs/multi-tenant/limits
- https://github.com/vercel/sdk
- https://vercel.com/docs/multi-tenant/api-reference
