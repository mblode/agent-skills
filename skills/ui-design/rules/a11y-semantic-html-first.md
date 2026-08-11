---
title: Prefer Native Semantics Before ARIA
id: a11y-semantic-html-first
category: a11y
defaultTier: release-blocker
detect: static
---

## Prefer Native Semantics Before ARIA

Use semantic HTML controls first; only add ARIA when native elements cannot express intent. Rebuilding those semantics in ARIA reimplements keyboard behaviour, role, and state by hand, and any gap leaves assistive tech reporting the wrong thing.

## Detection

Search for click handlers attached to non-interactive elements; a hit is confirmed when that element is the only way to trigger the action.

```bash
rg -nUP '<(div|span|li|td)\b[^>]*\bonClick=' -g '*.tsx' -g '*.jsx' src/
```

A full-bleed overlay whose `onClick` only dismisses a modal matches but is legitimate: the action is also reachable from a real `<button>` inside, and Escape covers the keyboard path. Tell them apart by asking whether removing the handler would strand the user.

**Incorrect (clickable div):**

```tsx
<div onClick={submitForm}>Save</div>
```

**Correct (semantic button):**

```tsx
<button type="button" onClick={submitForm}>Save</button>
```
