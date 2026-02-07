---
title: No status reports, meeting notes, or dated plans in docs
impact: MEDIUM
tags: temporal, status, evergreen
---

## No status reports, meeting notes, or dated plans in docs

Documentation must be evergreen. Status reports, test results, meeting notes, and plans with dates belong in issues, PRs, or project management tools -- not in docs that readers expect to be current.

**Incorrect (temporal content mixed into docs):**

```markdown
## Migration status

As of Q3 2025, the team is migrating to the new API. The
remaining endpoints will be ported by end of sprint 14.
```

**Correct (evergreen content with links to tracking):**

```markdown
## Migrate to v2

The v2 API replaces the v1 API. For migration steps, see
[Migrate to v2](migrate-v2.md). Track migration progress in
[issue #482](https://github.com/example/repo/issues/482).
```

Reference: [Google developer documentation — Timeless documentation](https://developers.google.com/style/timeless-documentation)
