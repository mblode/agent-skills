---
title: Choose Hanging vs Indented Bullets
impact: MEDIUM
tags: bullets, hanging, indented, lists, readability
---

## Choose Hanging vs Indented Bullets

Keep wrapped list lines aligned with each other, never with the bullet. `list-style-position: inside` wraps continuation lines underneath the bullet, breaking the text edge. Choose hanging bullets (bullet in the margin) or indented bullets (text indented from the margin); indented is the safer web default, and avoid hanging bullets on mobile where horizontal space is limited.

**Incorrect (inside positioning, wrapped lines misalign):**

```css
ul {
  list-style-position: inside;
  /* Second line of a long item wraps under the bullet,
     destroying the left text edge */
}
```

**Correct (outside positioning, pick hanging or indented):**

```css
/* Indented bullets: text indented from left edge (safer default) */
ul {
  list-style-position: outside;
  padding-left: 1.5em;
}

/* Hanging bullets: bullets hang in the margin (print-like) */
ul.hanging {
  list-style-position: outside;
  padding-left: 0;
  margin-left: 1em;
}
```

Add vertical spacing between bullet items to improve scannability.
