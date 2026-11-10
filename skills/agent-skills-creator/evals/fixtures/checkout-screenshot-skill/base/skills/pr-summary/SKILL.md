---
name: pr-summary
description: Writes the pull request description for a Pebble Works change in the house format. Use when asked to "write the PR description", "summarise this branch", or "fill in the PR template".
---

# PR Summary

## Steps

1. Read the diff against `main` and the commit subjects.
2. Write three parts: what a customer or teammate will notice, how it was checked, and anything the reviewer should look at first.
3. If the change touches `apps/web/src/checkout/`, add the line "Checkout: visual baselines updated" or "Checkout: no visual change", whichever is true.

## Gotchas

- The description is read in a notification preview. Put the customer-visible change in the first sentence.
