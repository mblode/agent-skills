---
title: Mark Up Data Tables With Real Table Semantics
id: a11y-data-table-semantics
category: a11y
defaultTier: release-blocker
detect: static
---

## Mark Up Data Tables With Real Table Semantics

Tabular data needs a real `<table>` with `<caption>`, header cells, and `scope`. Divs styled as a grid carry no row/column relationships, so screen readers read cells as a flat list. (Layout-only grids use CSS, not `<table>`.)

## Detection

Find files that render a table and never declare header semantics; a hit is confirmed when the first row holds column labels but no `<caption>` or `<th scope>` exists.

```bash
rg -lP '<table\b|role="(table|grid)"' -g '*.tsx' -g '*.jsx' src/ \
| xargs -r rg --files-without-match -P '<caption\b|scope="(col|row)"'
```

A call site that renders a shared `<DataTable>` matches while the `th` and `scope` live in the library component, so read the imported component before reporting. Div grids styled as tables do not match at all (`grid-cols-*` is layout markup too often to grep), so scan grid containers whose first row is a set of column labels by eye.

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
