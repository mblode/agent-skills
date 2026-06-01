---
title: Mark Up Data Tables With Real Table Semantics
impact: CRITICAL
impactDescription: lets screen readers announce row and column relationships
tags: accessibility, tables, semantics
---

## Mark Up Data Tables With Real Table Semantics

Tabular data needs a real `<table>` with a `<caption>`, header cells, and `scope`. Divs styled as a grid carry no row/column relationships, so screen readers read cells as a flat list. (Layout-only grids should use CSS, not `<table>`.)

**Incorrect (div grid, no header semantics):**

```tsx
<div className="grid">
  <div>Name</div><div>Role</div>
  <div>Ada</div><div>Engineer</div>
</div>
```

**Correct (caption, header cells, scope):**

```tsx
<table>
  <caption>Team members</caption>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">Role</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ada</th><td>Engineer</td></tr>
  </tbody>
</table>
```
