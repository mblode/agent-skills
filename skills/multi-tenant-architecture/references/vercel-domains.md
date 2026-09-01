# Vercel domain management (custom domains + SSL)

Applies to step 7 when Vercel is the chosen platform: the onboarding lifecycle a tenant walks through, and the platform behaviors that break it.

## Contents

- Onboarding lifecycle
- DNS targets
- SDK surface, error codes, rate limits
- Ownership verification
- Wildcard domains
- SSL certificates
- Redirects and canonical hosts
- Preview URLs
- Troubleshooting
- Sources

## Onboarding lifecycle

1. Tenant submits `tenant.com` in your UI or API.
2. `projectsAddProjectDomain(vercel, { idOrName, teamId, requestBody: { name } })` attaches it to the project; Vercel starts certificate issuance as soon as DNS resolves to it.
3. Show the DNS instructions from the API response for this project (`projectsGetProjectDomain` returns `verification` records when needed; `domainsGetDomainConfig` reports `misconfigured`).
4. Tenant sets the records. Poll `projectsVerifyProjectDomain` on user action or a slow schedule; it is rate limited to 50 per hour per team.
5. When `verified` is true and the config is no longer misconfigured, write the mapping to the database, then to Global Config.
6. Offboarding: `projectsRemoveProjectDomain` (detach from the project) then `domainsDeleteDomain` (drop from the account); delete the mapping first so traffic 404s instead of hitting a stale tenant.

## DNS targets

- Apex: `A` record. The classic value is `76.76.21.21`, but newer projects receive pool addresses such as `216.198.79.1`. Show the value the API or domain card returns for this project rather than a hardcoded IP.
- Subdomain (`www.tenant.com`, `docs.tenant.com`): `CNAME` to the project-specific target, formatted like `d1d4fc829fe7bc7c.vercel-dns-017.com.`; the trailing period marks an absolute name and some providers require it verbatim.
- A `CNAME` at the apex violates RFC 1034 when `NS` or `MX` records exist there; tell tenants to use the `A` record or a provider with CNAME flattening.
- IPv6 (`AAAA`) is not supported for third-party domains.
- Nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) work for any domain and are mandatory for wildcards; the tenant must recreate their MX and other records inside Vercel DNS.

## SDK surface, error codes, rate limits

- `@vercel/sdk` functional imports: `projectsAddProjectDomain`, `projectsGetProjectDomain`, `projectsVerifyProjectDomain`, `projectsRemoveProjectDomain`, `domainsDeleteDomain`, `domainsGetDomainConfig`. Class form: `vercel.projects.addProjectDomain(...)`, `vercel.domains.getDomainConfig(...)`.
- Error codes: `domain_already_in_use` (another project or account holds it: verify with the TXT record), `invalid_domain` (format, punycode needed for IDNs), `forbidden` (token scope or team), `rate_limit_exceeded` (back off exponentially).
- Rate limits for platforms: 100 domain additions per hour, 50 verifications per hour, 100 removals per hour, per team. Queue onboarding jobs and never verify in a tight loop.
- Plan caps: Hobby 50 domains per project; Pro and Enterprise unlimited with soft limits of 100,000 and 1,000,000 (raised on request).

## Ownership verification

- Required only when the domain is already in use on another Vercel account or project. It grants use in your project without moving the domain.
- Record: `TXT` at `_vercel.<tenant apex>` with the value from the API; check with `dig TXT _vercel.tenant.com`. No trailing dot in the value, no duplicate `_vercel` records, allow 5 to 10 minutes.
- Re-verify after nameserver changes or a domain transfer.

## Wildcard domains

- Point the apex's nameservers to Vercel, add the apex, then add `*.acme.app`. All plans.
- Vercel issues a certificate per subdomain on demand using DNS-01; that is why nameservers are mandatory. Without them the wildcard shows `Invalid Configuration` and never gets a certificate.
- Multi-level names (`docs.tenant1.acme.app`) resolve under the same wildcard.

## SSL certificates

- Let's Encrypt for every domain. Non-wildcard: HTTP-01, answered by Vercel as long as the domain points at Vercel. Wildcard: DNS-01 through Vercel nameservers.
- `CAA`: if the tenant has any `CAA` records, they must include `0 issue "letsencrypt.org"` or issuance fails. Check with `dig -t CAA +noall +ans tenant.com`.
- A stale `_acme-challenge` TXT from a previous host blocks issuance; ask the tenant to remove it (`dig -t TXT _acme-challenge.tenant.com`).
- `/.well-known` is reserved: it cannot be rewritten or redirected, and the proxy must let it through.
- Renewal is automatic. Uploading custom certificates is Enterprise only.

## Redirects and canonical hosts

- Add both `tenant.com` and `www.tenant.com`; set `redirect` on the secondary through the API or dashboard.
- When a tenant serves on both `tenant.acme.app` and `tenant.com`, redirect one to the other or set `alternates.canonical` in `generateMetadata`; keep one host in the sitemap. The `optimise-seo` skill owns the canonical and sitemap content.
- Use `308` for permanent host consolidation (preserves method), `307` for temporary.

## Preview URLs

- Default pattern `tenant---branch-project.vercel.app`; split the hostname on `---` to recover the tenant.
- Multi-tenant preview URLs on your own domain (`tenant1---project-git-branch.acme.dev`) are Enterprise only and enabled by your account representative.
- Each DNS label is limited to 63 characters; keep branch names short or previews stop resolving.

## Troubleshooting

- Nameserver changes propagate in up to 24 to 48 hours; record changes follow the old TTL. Lower the TTL to 60 s before cutover so a rollback is fast.
- `Invalid Configuration`: wrong or missing records, verification pending, a `CAA` blocking issuance, or a wildcard without Vercel nameservers.
- Verification failing with the record present: value mismatch, trailing dot in the value, duplicate records, or checking before propagation.
- Tenant's DNS is Cloudflare-proxied (orange cloud) in front of Vercel: HTTP-01 and redirects then pass through Cloudflare's TLS and rule layers. Ask the tenant to set the record to DNS-only, or accept that certificates and redirects are now governed by their zone settings.
- Same content on two hosts: canonical or redirect, and one host in the sitemap.
- Diagnostics: `letsdebug.net` for issuance, `dnsviz.net` for DNS and DNSSEC, `whatsmydns.net` for propagation.

## Sources

Accessed 2026-09-01.

- https://vercel.com/docs/platforms/multi-tenant-platforms/configuring-domains
- https://vercel.com/docs/platforms/multi-tenant-platforms/quickstart
- https://vercel.com/docs/platforms/multi-tenant-platforms/reference
- https://vercel.com/docs/platforms/multi-tenant-platforms/limits
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/domains/working-with-ssl
- https://vercel.com/docs/domains/troubleshooting
- https://vercel.com/kb/guide/a-record-and-caa-with-vercel
- https://vercel.com/docs/limits (Domains and Rate limits sections)
- https://github.com/vercel/sdk
