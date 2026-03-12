---
title: Space Navigation Items with CSS Padding
impact: HIGH
tags: navigation, padding, spacing, selected-state
---

## Space Navigation Items with CSS Padding

Use CSS padding (not spaces or margin hacks) to space navigation items. Limit the number of navigation items for clarity. Indicate the current page by styling the selected item as active/inactive \u2014 do not gray out navigable items.

**Incorrect (spaces for nav padding, grayed navigable items):**

```html
<nav>
  <a href="/">Home</a>&nbsp;&nbsp;&nbsp;
  <a href="/about">About</a>&nbsp;&nbsp;&nbsp;
  <a href="/blog" style="color: gray">Blog</a>  <!-- grayed but navigable -->
</nav>
```

**Correct (CSS padding, clear selected state):**

```css
nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
}

nav a[aria-current="page"] {
  color: var(--text-primary);
  font-weight: 600;
}

nav a:hover {
  color: var(--text-primary);
}
```

Never gray out items that are still navigable. Keep the selected item readable and visually prominent.
