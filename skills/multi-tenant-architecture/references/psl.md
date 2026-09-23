# Public Suffix List (PSL): decision and submission

Applies to step 1 when tenants publish content or run code on sibling subdomains of your tenant domain.

## What listing does

- Browsers treat every label under a listed suffix as a separate site: cookies with `Domain=<suffix>` are rejected, `SameSite` boundaries fall between tenants, and one tenant cannot set a cookie that reaches another tenant or your dashboard.
- Isolation only. It confers no trust, reputation, or Safe Browsing separation; a phishing tenant still damages the registrable domain, which is why tenants live on their own domain regardless.

## Decide

- Submit when tenants can publish HTML or JavaScript, or run code, on `<tenant>.<suffix>`.
- Submit the label directly above the tenant name: `acme.app` for `<tenant>.acme.app`, `sites.acme.app` for `<tenant>.sites.acme.app`.
- Not needed for custom domains tenants own, or when only your code runs on the subdomains.
- Listing changes behavior you may rely on: parent-scoped cookies, cross-subdomain sign-in, and code that infers "same site" from the hostname. Test those before the PR, because the change lands on the browsers' schedule, not yours.

## Eligibility (PRIVATE section)

- Only the domain owner or an authorized representative may submit; third-party requests are declined.
- Registration must have more than two years remaining, with a commitment to keep more than a year on the term.
- Declined: short-term, sandbox, or lab projects; entries meant to dodge rate limits or vendor protections; wildcard entries used for IP mapping; alternative TLD systems.

## Submission steps

1. Create a permanent `TXT` record at `_psl.<suffix>` whose value is the pull request URL (add it once the PR exists). It stays in the zone after merge to signal continued inclusion.
2. Open a PR against `publicsuffix/list` adding the suffix under `// ===BEGIN PRIVATE DOMAINS===`, with the header:

   ```text
   // Acme : https://acme.app/
   // Submitted by Jane Doe <jane@acme.app>
   acme.app
   ```

   Sort the block by company name; within it, by TLD then the label left of the TLD; keep multiple suffixes alphabetical.
3. Describe the service, example tenant hostnames, and the intended site boundaries in the PR template. Respond to maintainer review.
4. After merge, wait: there is no SLA and no way to expedite. Chrome and Firefox ship the list with releases; platforms that embed it in the OS update with the OS.

## Interim controls (before the list propagates)

- Dashboard and auth on a different apex (`app.acme.com`) than tenant subdomains (`*.acme.app`).
- Session cookies as `__Host-session=...; Secure; HttpOnly; Path=/; SameSite=Lax` with no `Domain` attribute: browsers reject a `__Host-` cookie that carries `Domain`, so a sibling tenant cannot overwrite it.
- Validate `Origin` or use CSRF tokens on state-changing requests; `__Host-` does not change `SameSite` semantics.

## Record in the output

`PSL decision: Submit` with suffix, owner, PR link, and the `_psl` TXT date; or `No PSL` with the reason (tenant-owned domains only, or no tenant-controlled content on subdomains).

## Sources

Accessed 2026-09-01.

- https://publicsuffix.org/learn/
- https://publicsuffix.org/submit/
- https://github.com/publicsuffix/list/wiki/Guidelines
- https://vercel.com/docs/platforms/multi-tenant-platforms/configuring-domains (Protecting tenant subdomains with the Public Suffix List)
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
