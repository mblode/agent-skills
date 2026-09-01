---
title: Label docs written ahead of the code as planned
impact: MEDIUM
tags: planned, document-driven, unshipped
---

## Label docs written ahead of the code as planned

Document-driven development writes the page before the feature exists. Published as-is, it reads as current behavior: a reader calls the endpoint, gets a 404, and files a bug against docs that were never wrong, only early. Mark unshipped content `[PLANNED]` in the heading, write it in the future tense, link the tracking issue, and remove the marker in the PR that ships the feature. This differs from `hygiene-experimental-label`, which covers features that exist but may change.

**Incorrect (unshipped endpoint documented as current behavior):**

```markdown
## Batch processing endpoint

Send up to 1000 items in a single request using the
`/api/batch` endpoint. Batches are processed in the order received.
```

**Correct (marked, future tense, tracked):**

```markdown
## [PLANNED] Batch processing endpoint

This endpoint will accept up to 1000 items per request.
Implementation is tracked in
[#1234](https://github.com/example/repo/issues/1234).
```

Reference: [Google developer documentation style guide: Timeless documentation](https://developers.google.com/style/timeless-documentation)
