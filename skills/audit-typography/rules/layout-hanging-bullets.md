---
title: Choose Hanging vs Indented Bullets
impact: MEDIUM
tags: bullets, hanging, indented, lists, readability
---

## Choose Hanging vs Indented Bullets

Hanging bullets (flush with the text margin) look cleaner in print but can cause alignment issues on the web. Indented bullets (text indented from the margin) often scan better because the bullets stand out from the text edge.

Avoid hanging bullets on mobile where horizontal space is limited.

**Hanging bullets (bullets in the margin):**

```css
ul {
  list-style-position: outside;
  padding-left: 0;
  margin-left: 1em; /* bullets hang in the margin */
}
```

**Indented bullets (text indented, default web behavior):**

```css
ul {
  list-style-position: outside;
  padding-left: 1.5em; /* text indented from left edge */
}
```

Add vertical spacing between bullet items to improve scannability. Decide between hanging and indented based on your layout \u2014 indented is the safer default for web.
