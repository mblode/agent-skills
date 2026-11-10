# Weekly digest email

Status: approved by Priyanka (product) on 2026-02-18. Ready to break down.

## Problem

Members only learn what their team finished by opening the app. Managers asked for a weekly summary in their inbox.

## Outcomes

1. A member can turn the weekly digest on or off from Settings, and the choice is remembered. Default is off.
2. Members who turned it on get one email every Monday at 08:00 in their own time zone listing the tasks their team completed in the last 7 days.
3. A workspace admin can see how many digests were sent, opened and bounced each week on the Admin page.

Each outcome is useful on its own. Outcome 1 can ship before any email exists: the setting shows "Starts soon" until outcome 2 is live.

## Constraints

- Email goes through the existing `mailer` package. No new provider.
- Send jobs run on the existing `jobs` table and worker.
- Sender address: digest@example.com is a stand-in. Marketing has not chosen the real address.
- Launch date: not set.

## Work breakdown (draft from the kickoff call)

### Database

- Add `digest_enabled` boolean to `member_settings`.
- Add `digest_deliveries` table (member_id, week_start, sent_at, opened_at, bounced_at).

### Backend

- Settings API: read and write `digest_enabled`.
- Weekly job: select opted-in members, build the summary, send through `mailer`, write a `digest_deliveries` row.
- Mailer webhook: record opens and bounces.
- Admin stats API: weekly counts from `digest_deliveries`.

### Frontend

- Settings toggle.
- Admin page stats table.
- Email template.

## Notes

- Outcome 2 reads the setting from outcome 1.
- Outcome 3 reads rows that outcome 2 writes. Opens and bounces need the mailer webhook.
- A member with no completed team tasks in the week gets no email.
