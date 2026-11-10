---
name: bug-report
description: Turns a Larch Tasks user complaint into a reproducible bug ticket. Use when asked to "file a bug", "write this up as a ticket", or "can you reproduce this".
---

# Bug Report

## Steps

1. Restate the complaint as expected behaviour and actual behaviour, one sentence each.
2. Reproduce it locally. Recurring-task bugs usually need the clock moved: set `LARCH_NOW` to an ISO timestamp before starting the server.
3. Reduce the steps to the fewest that still show it.
4. Write the ticket: title as the actual behaviour, numbered steps, expected, actual, and the commit you reproduced on.

## Gotchas

- "My task disappeared" is almost always a filter, not data loss. Check the saved view's filters before anything else.
- Do not attach a database dump to a ticket. Attach the task ids.
