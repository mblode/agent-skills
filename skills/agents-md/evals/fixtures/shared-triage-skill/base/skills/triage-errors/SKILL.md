---
name: triage-errors
description: Triages the top production error for Copper Kettle and fixes its cause. Use when asked to "triage errors", "what is breaking in prod", or "fix the top error".
---

# Triage Errors

Find the error hurting the most customers right now, trace it to source, and fix the cause.

## Steps

1. Fetch the top unresolved error from the last 24 hours. Call `mcp__posthog__list_errors` with `status: "active"`, `orderBy: "occurrences"`, `dateFrom: "-24h"`, and take the first result.
2. Call `mcp__posthog__error_details` with that issue id to get the stack trace.
3. Find the first frame under `src/`. Open that file and the `captureError()` call site that reported it, and read the `area` tag to see which team owns it.
4. Reproduce locally with `npm run dev` if the error has a request path.
5. Fix the cause, not the capture call. Do not wrap the failing line in a try/catch that swallows the error.
6. Reply with the error title, occurrence count, owning area, and the fix or the reason it needs a person.

## Gotchas

- `ChunkLoadError` after a deploy is customers on a stale tab, not a bug. Report it and move to the next error.
- Errors tagged `area: billing` are never fixed without a person from billing reading the diff, because a wrong retry double-charges.
