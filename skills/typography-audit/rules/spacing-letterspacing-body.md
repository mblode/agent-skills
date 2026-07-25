---
title: Never Letterspace Body Text
impact: HIGH
tags: letter-spacing, tracking, body-text, readability
---

## Never Letterspace Body Text

Adding letter-spacing to body text destroys the carefully designed spacing built into the font's metrics. Professional typefaces are spaced for optimal readability at text sizes. The only exceptions are very small captions, where slight positive tracking aids legibility, and display-size lowercase.

If small text is hard to read, the fix is a larger font size, not tracking. Tracking does not buy back legibility lost to size, and anything below 12px fails readers with low vision and is unreadable at arm's length on a high-density phone. Keep 12px as the floor, and reserve it for non-essential text (a photo credit, a legal footnote), never for content a reader has to act on.

**Incorrect (letterspacing applied to body):**

```css
body {
  letter-spacing: 0.05em; /* disrupts natural rhythm */
}

p {
  letter-spacing: 1px; /* even worse */
}
```

**Correct (no letterspacing on body):**

```css
body {
  letter-spacing: normal;
}

/* Only small non-essential text may benefit from slight tracking */
.photo-credit {
  font-size: 12px;
  letter-spacing: 0.02em;
}
```

Remember: kerning adjusts space between specific letter pairs; letterspacing (tracking) adjusts uniform space between all letters. They are different tools.
