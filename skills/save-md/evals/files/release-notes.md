# Tallis API 4.0 release notes

Released 2 November 2026. Upgrade guide: docs.tallis.example/upgrade/4.0

## Highlights

- Bulk payouts: send up to 5,000 payouts in one request with `POST /v4/payouts/batch`.
- Faster list endpoints: cursor pagination is now the default and median response time on `/v4/transactions` dropped from 310 ms to 120 ms.
- New `settlement.delayed` webhook event when a settlement misses its expected date.

## Breaking changes

- The `X-Tallis-Signature` webhook header is removed. Webhooks are signed only with `X-Tallis-Signature-V2` (HMAC-SHA256 over the timestamp and the raw body). Endpoints that still verify the old header will reject every webhook after you upgrade. Rotate to the V2 secret in Dashboard, Developers, Webhooks before upgrading.

## Deprecations

- `GET /v3/balance` keeps working until 30 June 2027. Use `GET /v4/balances`, which returns one entry per currency.
- The `page` and `per_page` query parameters still work on list endpoints but are no longer documented. Use `cursor` and `limit`.
- Node SDK 2.x gets security fixes only. SDK 3.x supports both API 3 and API 4.

## Fixes

- Refunds on partially captured payments now return the captured amount as the maximum, not the authorised amount.
- `payout.failed` events include the bank's return code.
- Idempotency keys are now scoped per API key, so two keys on one account no longer collide.
- Fixed an off-by-one in the `created[lte]` filter that excluded transactions in the final second of the range.
- The dashboard CSV export uses ISO 8601 timestamps in UTC.

## Known issues

- Batch payouts above 2,000 items can take up to 90 seconds to return a batch id. A fix is planned for 4.0.1.
- `settlement.delayed` is not yet sent for accounts settling in JPY.
