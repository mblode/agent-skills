---
name: refund-rules
description: Explains and changes how Saltmarsh Booking computes refunds for cancelled stays. Use when asked to "change the refund window", "why was this guest refunded this amount", or "add a cancellation rule".
---

# Refund Rules

All refund amounts come from `packages/api/src/domain/refunds.ts`. The cases, in the order the function checks them:

1. Owner-initiated cancellation: full refund, no platform fee charged to the owner.
2. Guest cancels 48 hours or more before `checkIn` in the campsite's timezone: full refund.
3. Guest cancels inside 48 hours: booking total minus the first night.
4. Guest cancels after `checkIn`: no refund through this path. Support issues a goodwill refund by hand.

## Changing a rule

- Change the constant or the branch in `refunds.ts`, then the table in `packages/web/src/app/help/cancellations/page.tsx`, which states the rules to guests.
- A rule change applies to bookings created after it ships. Existing bookings keep the policy stored in `bookings.refund_policy`.
