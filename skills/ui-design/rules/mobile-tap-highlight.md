---
title: Gray tap flash and no press feedback
id: mobile-tap-highlight
category: mobile
defaultTier: fix-this-sprint
detect: static
---

## Gray tap flash and no press feedback

iOS paints a gray overlay on tap. With no `:active` or pointer-down press, the control also feels like it missed. Set `-webkit-tap-highlight-color: transparent` on controls and replace it with a press style. `touch-action: manipulation` on those same controls drops the double-tap-zoom delay.

## Detection

Search for the highlight property and for press styles on controls. A hit is confirmed when buttons or links have neither, or when the highlight is cleared on `*` / `body` with no press style to replace it.

```bash
rg -n 'tap-highlight|touch-action:\s*manipulation|touch-manipulation' -g '*.css' -g '*.tsx' -g '*.jsx' src/
rg -nP ':active|active:(bg-|scale-|opacity-)' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

A map, canvas, or pinch-zoom lightbox that sets `touch-action: manipulation` is a false positive: pinch-zoom dies. Skip `// ui-audit-ignore:mobile-tap-highlight` near the match.

**Incorrect (default iOS overlay, no press):**

```css
button {
  background: var(--btn-bg);
}
```

**Correct (no overlay, instant press):**

```css
button,
a,
[role="button"] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

button:active {
  background: var(--press-bg);
}
```
