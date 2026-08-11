---
title: Virtualize Long Lists
id: perf-virtualize-large-lists
category: perf
defaultTier: fix-this-sprint
detect: static
---

## Virtualize Long Lists

Large lists (roughly >50 visible items) should use virtualization/windowing. Rendering the whole dataset stalls scrolling and grows memory with the list.

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
