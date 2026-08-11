---
title: Prefer Flex/Grid Over JS Measurement
id: layout-flex-grid-first
category: layout
defaultTier: fix-this-sprint
detect: static
---

## Prefer Flex/Grid Over JS Measurement

Use CSS layout systems before runtime measurement logic. Measurement code reruns on every resize, font swap, and content change, and it is wrong in the frame before it runs.

## Detection

Find a DOM measurement feeding a state setter shortly after, which is the shape that turns layout into a render loop.

```bash
rg -nUP '(?s)(getBoundingClientRect\(\)|\.offsetWidth|\.clientWidth)[\s\S]{0,200}?\bset[A-Z]\w*\(' -g '*.tsx' -g '*.jsx' src/
```

Measurement is correct and unavoidable for popover positioning (floating-ui), virtualized lists, canvas sizing, and scroll-progress indicators. The distinction is what the measured number decides: a column count, width, or breakpoint that CSS could express is a finding, a pixel offset for an overlay is not.

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
