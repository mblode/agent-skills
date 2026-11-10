# Rate limit password reset requests

## Outcome

Problem: `POST /api/auth/reset-request` has no rate limit. On 2026-03-04 one address received 340 reset emails in an hour from a script.

Intended behaviour:

- At most 5 requests per IP address in any 15 minutes.
- At most 3 requests per email address in any 60 minutes.
- Over either limit the endpoint returns 429 with a `Retry-After` header and sends no email.
- Under the limit the response stays exactly as it is now: 202 with the same body whether or not the account exists.

## Approach

Use the existing `rateLimit({ key, limit, windowSec })` helper in `rateLimit.ts`. It is already backed by the shared Redis client, so limits hold across all API instances. It resolves to `{ allowed, retryAfterSec }`.

In `resetRequest.ts`, call it twice before the account lookup:

1. key `reset:ip:<ip>`, limit 5, windowSec 900
2. key `reset:email:<sha256 of the lower-cased address>`, limit 3, windowSec 3600

If either call is not allowed, return 429 with `Retry-After` set to the larger `retryAfterSec`. No other file changes.

## Decisions

- Limits of 5 and 3: set by Dario (security lead), 2026-03-05, from the support data that no real user made more than 2 requests in an hour over the last 90 days. Flip: raise them if support sees real users blocked.
- Hash the address in the key so Redis holds no raw email.

## Boundaries

Login and signup limits are separate tickets. No CAPTCHA in this change.

## Verification

Integration tests in `resetRequest.test.ts`, run against the test Redis:

- 5 requests from one IP return 202; the 6th returns 429 with `Retry-After` between 1 and 900.
- 3 requests for one address from different IPs return 202; the 4th returns 429.
- A blocked request sends no email (mailer spy called 0 times).
- A request for an unknown address under the limit still returns 202 with the usual body.

Done means merged with these tests passing in CI. Checking production is a follow-up once it deploys.

## Recovery

Revert the commit. Keys expire on their own within an hour, so nothing needs cleaning up.
