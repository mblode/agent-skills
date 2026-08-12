---
title: Pull-to-refresh hijacks the app shell
id: mobile-overscroll
category: mobile
defaultTier: fix-this-sprint
detect: static
---

## Pull-to-refresh hijacks the app shell

On an app shell, the first scroll is the browser's pull-to-refresh. The page rubber-bands and can reload. `overscroll-behavior: none` on `html` stops it. Inner panes (modals, drawers) use `contain` so their scroll does not chain to the page.

Marketing, docs, and blogs keep pull-to-refresh. Skip those surfaces.

## Detection

Search for `overscroll-behavior` on `html` / `body` and on overflow panes. A hit is confirmed on an app shell (dashboard, authenticated layout, PWA) with no `none` on `html`, or on a modal/drawer scroller with no `contain`.

```bash
rg -n 'overscroll-behavior|overscroll-none|overscroll-contain' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

A document site with no `overscroll-behavior` is correct. Skip `// ui-audit-ignore:mobile-overscroll` near the match.

**Incorrect (browser owns the first pull):**

```css
html {
  height: 100%;
}
```

**Correct (app shell keeps the scroll):**

```css
html {
  overscroll-behavior: none;
}

.modal-body {
  overscroll-behavior: contain;
}
```
