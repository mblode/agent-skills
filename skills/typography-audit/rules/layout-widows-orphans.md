---
title: Manage Widows and Orphans with Non-Breaking Spaces
impact: MEDIUM
tags: widows, orphans, non-breaking-space, headlines, nowrap
---

## Manage Widows and Orphans with Non-Breaking Spaces

A single word dangling on the last line of a headline looks awkward. Insert a non-breaking space (`&nbsp;`) between the last two words of headlines and navigation items to keep them together. Use `white-space: nowrap` sparingly for short phrases.

On body paragraphs, accept imperfection \u2014 dynamic content and responsive design make full widow/orphan control impractical.

**Incorrect (headline with a dangling word):**

```html
<h1>Getting Started with Web
Typography</h1>
<!-- "Typography" sits alone on the second line -->
```

**Correct (non-breaking space prevents break):**

```html
<h1>Getting Started with Web&nbsp;Typography</h1>
```

Also use `&nbsp;` for:
- Navigation items: `About&nbsp;Us`
- Time expressions: `3:00&nbsp;PM`
- Brand names: `New&nbsp;York`
- Short phrases on homepage hero text

CSS `text-wrap` (supported in modern browsers) can also help. Use `balance` for headings and short UI copy — it distributes text evenly across all lines. Use `pretty` for body paragraphs — it avoids orphaned last words with a cheaper algorithm that only adjusts the final lines.

```css
h1, h2, h3 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```
