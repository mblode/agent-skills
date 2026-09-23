---
title: Style a Lead Paragraph
impact: LOW-MEDIUM
tags: lead, lede, introduction, editorial, first-paragraph
---

## Style a Lead Paragraph

A lead (lede) is an article's opening paragraph, styled larger, lighter, or in a different typeface to draw readers in. Keep it short (1-3 sentences); it bridges the headline and the body.

**Incorrect (no lead, body starts abruptly):**

```html
<h1>The Art of Typography</h1>
<p>Typography is the art and technique of arranging type...</p>
<!-- Same size as every other paragraph -->
```

**Correct (styled lead paragraph):**

```css
.article > p:first-of-type {
  font-size: 1.25em;
  line-height: 1.5;
  color: var(--text-secondary);
}
```

```html
<h1>The Art of Typography</h1>
<p>Good typography is invisible. The reader should never notice the type,
only the content it conveys.</p>
<p>Typography is the art and technique of arranging type...</p>
```

The lead may also differ in color; after it, transition into body text with initial small caps or a drop cap for polish.
