---
title: Virtualize Long Lists
id: perf-virtualize-large-lists
category: perf
defaultTier: fix-this-sprint
detect: static
---

## Virtualize Long Lists

Large lists (roughly >50 visible items) should use virtualization/windowing. Rendering the whole dataset stalls scrolling and grows memory with the list.

## Detection

Search for list containers mapping straight over a collection, in files that import no windowing library.

```bash
rg -lUP '<(?:ul|ol|tbody)\b[^>]*>\s*\{[^}]*\.map\(' -g '*.tsx' -g '*.jsx' src/ \
  | xargs -r rg --files-without-match -P 'react-window|@tanstack/react-virtual|react-virtuoso|virtua'
```

Most matches are short lists that are correct as they stand. Confirm the collection can exceed roughly 50 rows (an unpaginated fetch, no page size, no `.slice`) before reporting.

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
