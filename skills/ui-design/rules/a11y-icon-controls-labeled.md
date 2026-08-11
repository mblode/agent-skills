---
title: Label Icon-Only Controls
id: a11y-icon-controls-labeled
category: a11y
defaultTier: fix-this-sprint
detect: static
---

## Label Icon-Only Controls

Any control with no visible text requires an accessible name. Without one, assistive tech announces nothing usable and the control cannot be identified.

## Detection

Search for buttons whose only child is an icon component and that carry no `aria-label`, `aria-labelledby`, or `title`; a hit is confirmed when the button renders no text node at all.

```bash
rg -nUP '<button\b(?![^>]*(aria-label|aria-labelledby|title=))[^>]*>\s*<[A-Z][\w.]*[^>]*/>\s*</button>' -g '*.tsx' -g '*.jsx' src/
```

Some icon libraries build the accessible name from a prop on the icon itself (`<XIcon title="Close" />`), which matches here but passes. Open the icon component: if it renders a `<title>` or `sr-only` text, the button already has a name.

**Incorrect (no accessible name):**

```tsx
<button onClick={closeModal}>
  <XIcon />
</button>
```

**Correct (explicit label):**

```tsx
<button type="button" aria-label="Close dialog" onClick={closeModal}>
  <XIcon aria-hidden="true" />
</button>
```
