# Bulk invite: flow spec v2

Product: Tallyboard (team budgeting). Author: growth squad. For build next sprint.

## Entry point

Members page, top right: **Invite people** button. Opens the Invite dialog (modal, 560px).

## Invite dialog

1. A large text area: "Paste email addresses, one per line or comma separated." Up to 200 addresses.
2. Role selector under the text area. Two options, Member and Admin. Defaults to Member. Role can be changed later from the Members page.
3. Link under the role selector: **Add a personal note**. Clicking it opens a second dialog on top of the Invite dialog with a text area and Save / Cancel. Saving returns to the Invite dialog.
4. Footer buttons: **Cancel** and **Submit**.

## What Submit does

- Invites are emailed to every pasted address immediately.
- Each invite reserves a paid seat from the moment it is sent, whether or not the person accepts. Seats are $12 per month each and are added to the next bill. A workspace on the Team plan has 10 seats included.
- Reserved seats can be released by revoking a pending invite from the Members page.

The dialog does not show seat counts or cost. Billing detail lives on the Billing page.

## Validation and failure

- Addresses are validated on the server after Submit.
- If any address is malformed, or the request fails for any reason, the dialog closes and a toast reads "Something went wrong. Please try again."
- Reopening the dialog shows an empty text area.
- If everything succeeds, the dialog closes and a toast reads "Invites sent."

## Pending invites

Pending invites appear in the Members list with a Pending badge, the date sent, and Resend and Revoke actions. Revoke asks nothing and can be reversed by inviting the person again.

## Out of scope

SSO provisioning, CSV upload, invite links.
