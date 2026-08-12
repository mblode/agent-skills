---
title: Gray tap flash on controls
id: mobile-tap-highlight
category: mobile
defaultTier: fix-this-sprint
detect: static
---

## Gray tap flash on controls

A tap flashes gray (or blue) over the control. That highlight is the browser's, not the product's press state, so the tap feels like a web page. Clear `-webkit-tap-highlight-color` on controls. The press that replaces it is `ui-animation`.

## Detection

Search for the highlight property. A hit is confirmed when buttons or links have none, or when it is cleared on `*` / `body` with no press style to replace it.

```bash
rg -n 'tap-highlight' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

A global reset on `button, a, [role="button"]` matches and is the pass. A `*` or `body` reset without a press style is still a fail.

**Incorrect (default iOS overlay):**

```css
button {
  background: var(--btn-bg);
}
```

**Correct (overlay off on controls):**

```css
button,
a,
[role="button"] {
  -webkit-tap-highlight-color: transparent;
}
```
