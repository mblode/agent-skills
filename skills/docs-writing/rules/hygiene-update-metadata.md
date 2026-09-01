---
title: Show freshness from the build, not a hand-typed date
impact: MEDIUM
tags: metadata, dates, freshness, versions
---

## Show freshness from the build, not a hand-typed date

Readers judge whether to trust a page by how current it looks. The signal that stays true is one the build produces: a last-modified date from version control, or the product version the docs are generated for. A hand-typed `Last updated: 2024-03-01` that nobody maintains says "abandoned" about a page that changed last week, which is worse than no date. Where the site cannot derive the date, prefer a version marker (`applies_to: v3.2+`) that only changes when the behavior does.

**Incorrect (manual date already stale, nothing about version):**

```markdown
*Last updated: March 2024*

## Configure authentication

Set the `AUTH_PROVIDER` environment variable to your identity
provider's URL.
```

**Correct (version pinned by the author, date owned by the build):**

```markdown
---
applies_to: v3.2+
---
<!-- Site renders "Last modified" from the file's git commit date -->

## Configure authentication

Set the `AUTH_PROVIDER` environment variable to your identity
provider's URL.
```

Reference: [Google developer documentation style guide: Timeless documentation](https://developers.google.com/style/timeless-documentation)
