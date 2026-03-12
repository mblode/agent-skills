---
title: Style a Lead Paragraph
impact: LOW-MEDIUM
tags: lead, lede, introduction, editorial, first-paragraph
---

## Style a Lead Paragraph

A lead (lede) paragraph \u2014 the opening paragraph of an article \u2014 can be styled larger, lighter, or in a different typeface to draw readers in. Keep the lead short (1\u20133 sentences). It acts as a bridge between the headline and the body.

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

The lead can use a larger size, lighter weight, or different color. Start articles with the lead, then transition to body text with initial small caps or a drop cap for extra polish.
