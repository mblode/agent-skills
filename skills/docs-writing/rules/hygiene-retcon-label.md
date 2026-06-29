---
title: Mark planned docs with [PLANNED] markers
impact: MEDIUM
tags: planned, retcon, document-driven
---

## Mark planned docs with [PLANNED] markers

Document-driven development means docs sometimes precede code. Mark all planned or unimplemented content with `[PLANNED]` so readers don't mistake it for current behavior. Remove markers once the feature ships.

**Incorrect (planned feature documented as if it exists):**

```markdown
## Batch processing endpoint

Send up to 1000 items in a single request using the
`/api/batch` endpoint.
```

**Correct (clearly marked as planned with tracking link):**

```markdown
## [PLANNED] Batch processing endpoint

This endpoint will support batch operations for up to 1000
items per request. Implementation is tracked in
[#1234](https://github.com/example/repo/issues/1234).
```

Reference: [Write the Docs: Document-driven development](https://www.writethedocs.org/guide/)
