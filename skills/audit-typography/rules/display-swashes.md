---
title: Use Swashes and Alternates Sparingly
impact: LOW-MEDIUM
tags: swashes, stylistic-alternates, logos, display
---

## Use Swashes and Alternates Sparingly

Swash characters and stylistic alternates add flair to logos and display text but become distracting in body copy. Use them on specific letters for memorability. Look for swashes in italic variants or separate font files.

**Incorrect (swashes enabled globally):**

```css
body {
  font-feature-settings: "swsh", "salt"; /* swashes in body text */
}
```

**Correct (swashes only on display elements):**

```css
body {
  font-feature-settings: "kern", "liga", "calt";
}

.logo {
  font-feature-settings: "kern", "liga", "swsh";
}

/* Enable swash on a specific letter */
.logo .initial {
  font-feature-settings: "swsh" 1;
}
```

Use `font-feature-settings: "ss01"` through `"ss20"` to access numbered stylistic sets, which provide curated alternate glyph collections.
