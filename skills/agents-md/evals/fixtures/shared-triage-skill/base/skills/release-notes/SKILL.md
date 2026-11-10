---
name: release-notes
description: Drafts customer-facing release notes for Copper Kettle from merged pull requests. Use when asked to "write the release notes", "draft the changelog", or "what shipped this week".
---

# Release Notes

Turn the commits since the last tag into notes a subscriber would read.

## Steps

1. Run `npm run changelog` to print the merged pull request titles since the last tag.
2. Drop anything a customer cannot see: refactors, dependency bumps, internal tooling.
3. Group what is left under New, Improved, and Fixed.
4. Write each line from the customer's side ("You can now pause a subscription for up to three months"), not the code's side.
5. Add the notes as a new dated section at the top of `content/changelog.mdx`.

## Gotchas

- Price changes are announced by email first. If a pull request touches `src/lib/pricing.ts`, leave it out and say so in the reply.
