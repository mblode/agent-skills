---
title: Use lowercase hyphenated filenames for all assets
impact: MEDIUM-HIGH
tags: filenames, naming, consistency
---

## Use lowercase hyphenated filenames for all assets

Lowercase filenames with hyphens avoid case-sensitivity bugs across operating systems. macOS and Windows are case-insensitive by default; Linux is case-sensitive. Mixed conventions cause broken links that only surface in deployment.

**Incorrect (mixed case, underscores, or spaces):**

```markdown
Getting_Started_Guide.md
SetupInstructions.md
API Reference.md
```

**Correct (lowercase with hyphens):**

```markdown
getting-started.md
setup-instructions.md
api-reference.md
```

Reference: [Google developer documentation style guide — Filenames](https://developers.google.com/style/filenames)
