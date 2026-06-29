---
title: Build Hierarchy with Multiple Axes
impact: MEDIUM-HIGH
tags: hierarchy, weight, italics, caps, color, contrast
---

## Build Hierarchy with Multiple Axes

Build hierarchy with weight, italics, caps, color, and size, but change one axis at a time. Stacking changes (bold + large + colored + caps) creates noise, not hierarchy.

**Incorrect (too many changes at once):**

```css
h2 {
  font-size: 32px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ff0000;
  /* five axes changed simultaneously */
}
```

**Correct (one or two axes per level):**

```css
/* Size + weight for primary heading */
h2 {
  font-size: 28px;
  font-weight: 700;
}

/* Size + caps for section label */
.section-label {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Style for inline emphasis */
.aside-note {
  font-style: italic;
  color: var(--text-secondary);
}
```

Build incrementally: start with size, then add weight, then caps or color for specific elements.
