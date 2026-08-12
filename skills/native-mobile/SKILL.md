---
name: native-mobile
description: >-
  Applies CSS and HTML chrome so a web app feels native on phones: hover
  gated to fine pointers, tap highlight, dynamic viewport height, 16px
  inputs, pointer-down feedback, overscroll, safe-area insets, selection
  on controls, carousel touch-action, and theme-color. Use when asked to
  "make this feel native on mobile", "mobile polish", "stuck hover after
  tap", "stop iOS zoom on inputs", "fix tap delay", or "PWA feel" without
  building a native app. For responsive layout use ui-design; for gesture
  physics use ui-animation.
---

# Native Mobile

- **IS:** the chrome below, applied to an existing web UI.
- **IS NOT:** responsive layout (use `ui-design`); gesture physics (use `ui-animation`); native apps.

Apply each row that matches. Skip a row with a reason (document site vs app shell, a library that already sets `touch-action`).

| Problem | Fix |
|---|---|
| Hover stuck after tap | Put hover styles in `@media (hover: hover) and (pointer: fine)` |
| Gray or blue flash on tap | `-webkit-tap-highlight-color: transparent` on controls, with an `:active` press to replace it |
| Layout has the wrong height | `100dvh` on the app shell; `100svh` on a hero that must not jump when the URL bar hides. Never `100vh` |
| Page zooms into an input | `font-size: 16px` on `input`, `select`, `textarea`. Never `maximum-scale=1` |
| Tap feels laggy | Press styles on `:active` or `pointerdown`; `touch-action: manipulation` on tappable controls |
| Pull-to-refresh hijacks scroll | `overscroll-behavior: none` on `html` for app shells only. `contain` on inner panes |
| Content stops at the notch | `viewport-fit=cover` and `padding: env(safe-area-inset-*)`. Ship both or neither |
| Long-press selects button text | `user-select: none` on buttons and controls, never on `body` |
| Carousel scrolls the page | `touch-action: pan-x` on a CSS `overflow-x` scroller. Leave JS libraries (Embla, Swiper) alone |
| Status bar colour is wrong | `<meta name="theme-color">` per light and dark, matching the header |
| Right in Chrome, wrong on a phone | Device mode is not proof. Hover, URL-bar height, tap highlight, iOS zoom, overscroll, safe-area, and `theme-color` all lie there |

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
```

## Gotchas

- `maximum-scale=1` stops input zoom and pinch-zoom, which fails WCAG 1.4.4. The fix is 16px on inputs.
- `-webkit-tap-highlight-color: transparent` with no press state makes taps feel dead.
- `user-select: none` on `body` blocks copying prices, errors, and codes.
- `viewport-fit=cover` without `env(safe-area-inset-*)` draws under the notch.

## Related skills

- `ui-design`: breakpoints, collapsing nav, hover-only *actions*. This skill is the chrome pass.
- `ui-animation`: springs, swipe physics, drag.
