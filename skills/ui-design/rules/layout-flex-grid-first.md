---
title: Prefer Flex/Grid Over JS Measurement
id: layout-flex-grid-first
category: layout
defaultTier: fix-this-sprint
detect: static
---

## Prefer Flex/Grid Over JS Measurement

Use CSS layout systems before runtime measurement logic. Measurement code reruns on every resize, font swap, and content change, and it is wrong in the frame before it runs.

**Incorrect (measurement-driven layout):**

```tsx
const width = ref.current?.getBoundingClientRect().width ?? 0
setColumns(Math.floor(width / 280))
```

**Correct (declarative layout):**

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
```
