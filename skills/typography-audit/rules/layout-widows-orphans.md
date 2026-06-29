---
title: Manage Widows and Orphans with Non-Breaking Spaces
impact: MEDIUM
tags: widows, orphans, non-breaking-space, headlines, nowrap
---

## Manage Widows and Orphans with Non-Breaking Spaces

A single word dangling on a headline's last line looks awkward. Insert a non-breaking space (`&nbsp;`) between the last two words of headlines and nav items. Use `white-space: nowrap` sparingly for short phrases.

On body paragraphs, accept imperfection: dynamic content and responsive design make full widow/orphan control impractical.

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

CSS `text-wrap` also helps. Use `balance` for headings and short UI copy (distributes text evenly across lines). Use `pretty` for body paragraphs (avoids orphaned last words by adjusting only the final lines).

```css
h1, h2, h3 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```
