---
title: Status bar colour does not match the header
id: mobile-theme-color
category: mobile
defaultTier: backlog
detect: static
related: mobile-viewport-scaling
---

## Status bar colour does not match the header

The browser chrome and the PWA status bar read `theme-color`. One value, or none, leaves a white bar on a dark header (or the reverse). Set it per scheme to the header background, not a brand accent, unless the header *is* that accent.

## Detection

Search for `theme-color` / `themeColor`. A hit is confirmed when it is missing, or when a single value covers both schemes on a product that has dark mode.

```bash
rg -n 'theme-color|themeColor' -g '*.tsx' -g '*.jsx' -g '*.html' src/ app/
```

**Incorrect (one colour, or none):**

```html
<meta name="theme-color" content="#4f46e5" />
```

**Correct (matches the header, per scheme):**

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
```
