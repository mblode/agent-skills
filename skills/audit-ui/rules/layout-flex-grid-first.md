---
title: Prefer Flex/Grid Over JS Measurement
impact: HIGH
impactDescription: simplifies layout and reduces runtime fragility
tags: layout, css, resilience
---

## Prefer Flex/Grid Over JS Measurement

Use CSS layout systems before runtime measurement logic.

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
