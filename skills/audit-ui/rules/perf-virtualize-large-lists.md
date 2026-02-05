---
title: Virtualize Long Lists
impact: HIGH
impactDescription: improves scroll performance and memory usage
tags: performance, lists, virtualization
---

## Virtualize Long Lists

Large lists (roughly >50 visible items) should use virtualization/windowing.

**Incorrect (renders entire dataset):**

```tsx
<ul>
  {items.map(item => <Row key={item.id} item={item} />)}
</ul>
```

**Correct (windowed rendering):**

```tsx
<VirtualizedList
  itemCount={items.length}
  itemSize={48}
  renderItem={(index) => <Row item={items[index]} />}
/>
```
