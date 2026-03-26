---
title: Apply Antialiased Font Smoothing on macOS
impact: MEDIUM
tags: font-smoothing, antialiased, webkit, rendering, macOS
---

## Apply Antialiased Font Smoothing on macOS

On macOS, the browser defaults to subpixel antialiasing, which renders text slightly heavier and thicker than intended. Setting `-webkit-font-smoothing: antialiased` switches to grayscale antialiasing, producing thinner, crisper text — especially visible on light-on-dark surfaces and smaller text sizes.

Apply it once at the layout root so it cascades to all text elements. Adding it per-component causes inconsistent rendering across the interface.

**Incorrect (applied per-component or not at all):**

```css
.button {
  -webkit-font-smoothing: antialiased; /* inconsistent: only buttons get crisp text */
}
```

**Correct (applied at root):**

```css
body {
  -webkit-font-smoothing: antialiased;
}
```

**Tailwind:**

```html
<body class="antialiased">
```

Apply to the outermost layout element — `<body>` or the root layout wrapper — so every text element in the app inherits it.

Note: this only affects macOS rendering. It has no effect on Windows or Linux, so it is safe to apply unconditionally.
