# Public Suffix List (PSL)

Use this reference when deciding whether to submit a tenant domain to the PSL.

## What the PSL does

- Defines public suffixes where users can register names.
- Browsers use it to cap cookie scope (for example, no cookies on `.co.uk`).
- Shared cross-vendor list; registry rules vary and cannot be derived.

## Why it matters for multi-tenant platforms

- Listing blocks cookies on the tenant suffix, isolating sibling subdomains.
- Isolation only; it does not confer trust or reputation.

## Submission and validation (private domains)

- Private domains with untrusted subdomains can request PRIVATE inclusion.
- Submit a GitHub PR (owner/authorized rep); PRs are preferred and validated.
- Prefer DNS proof: `_psl.<suffix>` TXT with a PR link (RFC8553).
- Include a brief rationale (UGC/third-party subdomains); expect multi-week review.
- PSL is not a security or trust signal and must not bypass tracking protections.

## Sources

- https://publicsuffix.org/learn/index.html
- https://publicsuffix.org/submit/
- https://github.com/publicsuffix/list/wiki/guidelines
- https://wiki.mozilla.org/Public_Suffix_List
