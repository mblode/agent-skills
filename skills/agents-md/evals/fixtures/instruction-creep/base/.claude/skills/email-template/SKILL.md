---
name: email-template
description: Adds or edits a transactional email template for Saltmarsh Booking. Use when asked to "add an email", "change the booking confirmation email", or "edit the cancellation email".
---

# Email Template

1. Add the component under `packages/api/src/emails/templates/<name>.tsx` and export a plain-text version beside it.
2. Render dates in the campsite's timezone and name the zone.
3. Add the template to the map in `packages/api/src/emails/index.ts` so `enqueueEmail()` can find it.
4. Preview it with `pnpm --filter @saltmarsh/api exec email dev`.

## Gotchas

- An email that states a refund amount takes it from the refund record, never recomputes it.
