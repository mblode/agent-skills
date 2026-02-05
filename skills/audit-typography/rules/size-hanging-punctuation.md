---
title: Use Hanging Punctuation Where Feasible
impact: HIGH
tags: hanging-punctuation, alignment, optical, blockquotes
---

## Use Hanging Punctuation Where Feasible

Hanging punctuation aligns the left edge of text optically by moving quotation marks and other punctuation into the margin. This creates a cleaner visual edge. On the web, support is limited \u2014 implement only for blockquotes and display text where it has the most impact.

**Incorrect (punctuation disrupts left alignment):**

```html
<blockquote>
  <p>"Good typography is invisible."</p>
</blockquote>
```

```css
blockquote {
  /* Quote mark pushes text inward */
}
```

**Correct (hanging punctuation on blockquotes):**

```css
/* CSS hanging-punctuation (Safari support) */
blockquote p {
  hanging-punctuation: first last;
}

/* Fallback: negative text-indent */
blockquote p {
  text-indent: -0.4em;
}
```

For web, limit hanging punctuation to the left edge of blockquotes and display headings. Full hanging punctuation across all body text is impractical to maintain on the web.
