# Tenant Domains

Domain strategy, the Public Suffix List decision, and the custom-domain lifecycle on Vercel and Cloudflare for SaaS. Quotas, rate limits, and prices change: look them up in the sources below when they matter, and date what you record.

## Contents

- Domain strategy
- Public Suffix List
- Custom-domain lifecycle
- Vercel: DNS targets, SDK, verification, certificates
- Cloudflare for SaaS custom hostnames
- Redirects, canonical hosts, previews
- Troubleshooting
- Sources

## Domain strategy

- Tenant workloads on a dedicated registrable domain (`acme.app` for tenants, `acme.com` for brand). One phishing tenant on `x.acme.com` puts the brand domain on blocklists, and a tenant cookie with `Domain=acme.com` reaches your dashboard.
- Dashboard and auth on a different apex from tenant subdomains (`app.acme.com` for the console, `*.acme.app` for tenants).
- Session cookies as `__Host-session=...; Secure; HttpOnly; Path=/; SameSite=Lax` with no `Domain` attribute, so a sibling tenant cannot overwrite them. Validate `Origin` or use CSRF tokens on state-changing requests.
- Tenant-owned custom domains move reputation to the tenant and need the onboarding lifecycle below.

## Public Suffix List

Listing makes browsers treat every label under the suffix as a separate site: cookies with `Domain=<suffix>` are rejected and `SameSite` boundaries fall between tenants. It confers no reputation separation.

- **Submit** when tenants can publish HTML or JavaScript, or run code, on `<tenant>.<suffix>`. Submit the label directly above the tenant name (`acme.app`, or `sites.acme.app` for `<tenant>.sites.acme.app`). Start early: there is no SLA, and browsers ship the list on their own release cycles.
- **Not needed** for tenant-owned custom domains, or when only your code runs on the subdomains.
- Listing kills parent-scoped cookies, cross-subdomain SSO on that suffix, and code that infers "same site" from the hostname. Test those before the PR.
- Eligibility: only the domain owner submits; the registration must have a long remaining term (check the current rule); short-term, sandbox, or rate-limit-dodging entries are declined.
- Steps: a permanent `TXT` at `_psl.<suffix>` whose value is the PR URL (it stays after merge); a PR to `publicsuffix/list` in the PRIVATE section with an org and submitter header, sorted per the guidelines; respond to review.
- Record: `PSL decision: Submit` with suffix, owner, PR link, and `_psl` TXT date; or `No PSL` with the reason.

## Custom-domain lifecycle

Design and record every step, including the unhappy ones:

1. Tenant submits the domain in the UI or API (same authority on both).
2. Attach it to the platform (project domain or custom hostname).
3. Show the DNS target the platform returns for this project, never a hardcoded value.
4. Verify ownership; poll on user action or a slow schedule, never in a tight loop (verification calls are rate limited).
5. Certificate issued.
6. Only now write the verified mapping to the database, then to any edge cache. Resolution reads verified records only.
7. Removal: delete the mapping first so traffic 404s instead of reaching a stale tenant, then detach the domain.
8. Failure: a domain stuck unverified or with a failed certificate has a visible state and a retry path.

## Vercel: DNS targets, SDK, verification, certificates

- **DNS targets.** Apex: an `A` record with the value the API or domain card returns for this project (newer projects get pool addresses). Subdomain: a `CNAME` to the project-specific target; keep the trailing period where the provider needs it. A `CNAME` at the apex conflicts with `NS` and `MX`; use the `A` record or CNAME flattening. Third-party `AAAA` is unsupported.
- **SDK.** `@vercel/sdk` functions: `projectsAddProjectDomain`, `projectsGetProjectDomain`, `projectsVerifyProjectDomain`, `projectsRemoveProjectDomain`, `domainsDeleteDomain`, `domainsGetDomainConfig` (reports `misconfigured`). Error codes worth handling: `domain_already_in_use` (verify with TXT), `invalid_domain` (punycode for IDNs), `forbidden` (token scope), `rate_limit_exceeded` (back off, queue onboarding).
- **Ownership verification.** Needed only when the domain is in use on another Vercel account or project: a `TXT` at `_vercel.<apex>` with the API's value, no trailing dot, no duplicates. Re-verify after nameserver changes or a transfer.
- **Wildcards.** `*.acme.app` requires Vercel nameservers, because certificates are issued per subdomain over DNS-01. Without them the domain shows `Invalid Configuration` forever. Recreate MX and other records in Vercel DNS before switching.
- **Certificates.** Let's Encrypt; HTTP-01 for non-wildcards. A `CAA` record must allow `letsencrypt.org`; a stale `_acme-challenge` TXT from a previous host blocks issuance. `/.well-known` is reserved and cannot be rewritten, so the proxy passes it through first.

## Cloudflare for SaaS custom hostnames

- **Setup.** Fallback origin is a proxied `A`, `AAAA`, or `CNAME` record in your SaaS zone. Publish a friendly target such as `customers.<you>.com` for tenants to CNAME to, not the zone apex. Never create a custom hostname equal to the zone name.
- **Create** per tenant via the API with `hostname` and `ssl.method` (`http` or `txt`). The create response may omit `validation_records`; fetch the hostname afterwards.
- **Two statuses.** Hostname ownership drives `status`; certificate validation drives `ssl.status`. TXT pre-validation reaches `active` before the tenant switches DNS, so onboarding has no downtime. Wildcard custom hostnames require TXT.
- **O2O.** When the customer's zone is also proxied on Cloudflare (requests carry `cf-connecting-o2o: 1`), their zone settings apply first and pre-validation does not work. Custom hostnames behind another CDN are unsupported.
- **Plan-gated features** (wildcard custom hostnames, CA choice, custom certificates, apex proxying, BYOIP) and per-hostname pricing: check the current plans page. Below the tier that allows apex proxying, a tenant apex needs CNAME flattening or a `www` redirect.

## Redirects, canonical hosts, previews

- Add both `tenant.com` and `www.tenant.com` and redirect the secondary. When a tenant serves on both a subdomain and a custom domain, redirect one or set the canonical, and keep one host in the sitemap (content is `seo`).
- `308` for permanent host consolidation, `307` for temporary.
- Vercel preview URLs follow `tenant---branch-project.vercel.app`; split on `---`. Each DNS label is capped at 63 characters, so long branch names break previews.

## Troubleshooting

- Lower the TTL before cutover so rollback is fast; nameserver changes can take a day or more.
- `Invalid Configuration`: wrong or missing records, verification pending, a blocking `CAA`, or a wildcard without platform nameservers.
- Verification failing with the record present: value mismatch, trailing dot, duplicates, or checked before propagation.
- Tenant DNS proxied through Cloudflare in front of Vercel: certificates and redirects now pass through their zone; ask for DNS-only.
- Diagnostics: `dig`, `letsdebug.net` for issuance, `dnsviz.net` for DNSSEC, `whatsmydns.net` for propagation.

## Sources

- https://publicsuffix.org/submit/ and https://github.com/publicsuffix/list/wiki/Guidelines
- https://vercel.com/docs/platforms/multi-tenant-platforms/configuring-domains
- https://vercel.com/docs/domains/working-with-ssl and https://vercel.com/docs/domains/troubleshooting
- https://vercel.com/docs/limits (domains and rate limits)
- https://github.com/vercel/sdk
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/domain-support/hostname-validation/pre-validation/
