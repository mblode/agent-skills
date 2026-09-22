---
title: Apply Antialiased Font Smoothing on macOS
impact: MEDIUM
tags: font-smoothing, antialiased, webkit, rendering, macOS
---

## Apply Antialiased Font Smoothing on macOS

macOS browsers default to subpixel antialiasing, rendering text heavier than intended. `-webkit-font-smoothing: antialiased` switches to grayscale antialiasing for thinner, crisper text, most visible on light-on-dark surfaces and small sizes.

Apply it once at the outermost layout element (`<body>` or root layout wrapper) so all text inherits it; per-component use renders inconsistently.

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

macOS-only: no effect on Windows or Linux, so it is safe to apply unconditionally.
