---
title: Keep Type Consistent Across Media
impact: LOW-MEDIUM
tags: cross-medium, web, print, app, consistency
---

## Keep Type Consistent Across Media

Use the same typefaces across web, print, and app, licensing each medium separately as needed. Consistency builds recognition: readers subconsciously tie your type choices to your brand.

**Incorrect (different faces per medium):**

```
Web:   font-family: 'Open Sans', sans-serif;
Print: Myriad Pro (from Adobe)
App:   San Francisco (system font)
```

**Correct (same family everywhere):**

```
Web:   font-family: 'Inter', sans-serif;
Print: Inter (desktop license)
App:   Inter (embedded font)
```

When a font is unavailable on a platform, use the closest metrically compatible alternative. Document the type system and its platform-specific variations.
