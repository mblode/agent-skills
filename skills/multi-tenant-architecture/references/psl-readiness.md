# PSL submission readiness

Read before recommending a Public Suffix List (PSL) submission. A tenant platform that would benefit from isolation is not yet eligible: the [Guidelines](https://raw.githubusercontent.com/wiki/publicsuffix/list/Guidelines.md) decline projects that are smaller in scale, temporary, private-use, sandbox, test, lab, beta, or exploratory, and state that projects not serving more than thousands of users are quite likely to be declined. Every submission costs volunteer review time; recommend one only when the platform clearly qualifies.

## Decision

- **Submit:** every hard blocker below passes and the readiness gate passes.
- **Defer:** isolation is needed but the readiness gate fails. Ship the interim controls in [psl.md](psl.md) now and revisit when the gate passes. This is the expected answer for a platform that has not launched.
- **No PSL:** tenants use only their own custom domains, or no tenant-controlled content runs on sibling subdomains.

## Readiness gate (do not submit if any fails)

- The service is live in production and open to the public. Pre-launch, private beta, invite-only, early access, waitlist, private preview, pilot, and demo-only services fail.
- It currently serves thousands of distinct users or tenants who have a direct relationship with the operator. Below about 1,000 current users, do not submit. Count users who publish on the suffix, not visitors, page views, generated hostnames, total signups, or projected growth.
- The requested suffix itself carries that usage today. Users of the wider product, of a different domain, or of a domain being migrated to later do not count. A domain registered recently that claims an established user base must be an actual migration, explained in the PR.

## Hard blockers (do not submit if any fails)

| Blocker | How to check |
|---|---|
| Registration expires two years or less from the submission date | `curl -sL https://rdap.org/domain/<domain>` (the `expiration` event) or `whois <domain>`. Some TLDs publish no expiration date; the requestor then confirms it from the registrar. |
| Entry is for staging, preview, sandbox, test, lab, temporary, seasonal, or internal use | Each entry must serve permanent production tenants. A production suffix and a `staging.` or `preview.` suffix under it are separate entries; drop the non-production one. |
| No abuse contact for the suffix | One of: a working `abuse@<suffix>` mailbox (RFC 2142); an abuse email or form published on the site, usable without login; an abuse contact in RDAP; or a `Contact` in `https://<suffix>/.well-known/security.txt` (RFC 9116). |
| Personal contact address | The `// Submitted by` line uses a role address at the organization, such as `security@acme.com`. |
| Submitter is not the domain owner or an authorized representative | Third-party users of a service cannot submit for it. |
| Purpose is to work around third-party limits | Let's Encrypt rate limits, Cloudflare, Apple, Meta, Google Safe Browsing, and similar are not a reason to list. Address limits with that party directly. |
| Suffix is the organization's primary domain | List a dedicated tenant domain instead; listing the brand domain changes cookies on the company's own hosts and is slow to roll back. |
| Template not followed exactly | Use `.github/pull_request_template.md` unaltered: keep every heading, checkbox, and comment, delete the example third-party lines, state the two-year registration term and the commitment to keep more than one year, and check a box only when true. |
| Entry mislocated, unsorted, or malformed | Sort the PRIVATE block by organization name, never at the end of the file; within the block, by TLD then each label leftward. Use a wildcard only when tenants nest below their own label. Run `make test`. |

## Record

`PSL decision: Submit | Defer (failed gate, revisit condition) | No PSL (reason)`. For Defer, name the gate that failed and the interim controls in place.
