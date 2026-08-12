---
title: Gray tap flash on controls
id: mobile-tap-highlight
category: mobile
defaultTier: fix-this-sprint
detect: static
---

## Gray tap flash on controls

iOS paints a gray overlay on tap. Set `-webkit-tap-highlight-color: transparent` on controls. The press state that replaces it (`:active` / pointer-down, `touch-action: manipulation`) is `ui-animation`.

## Detection

Search for the highlight property. A hit is confirmed when buttons or links have none, or when it is cleared on `*` / `body` with no press style to replace it.

```bash
rg -n 'tap-highlight' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

Skip `// ui-audit-ignore:mobile-tap-highlight` near the match.

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
