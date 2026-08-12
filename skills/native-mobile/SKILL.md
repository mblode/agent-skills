---
name: native-mobile
description: >-
  Applies CSS and HTML chrome so a web app feels native on phones: hover
  gated to fine pointers, tap highlight, dynamic viewport height, 16px
  inputs, pointer-down feedback, overscroll, safe-area insets, selection on
  controls, carousel touch-action, and theme-color. Use when asked to "make
  this feel native on mobile", "mobile polish", "stuck hover after tap",
  "gray flash on tap", "stop iOS zoom on inputs", "fix tap delay", "safe
  area insets", "theme-color status bar", "pull to refresh hijacks scroll",
  or "PWA feel" without building a native app. For responsive layout and
  breakpoints use ui-design; for gesture physics use ui-animation.
---

# Native Mobile

CSS and HTML chrome that makes a web app feel like a phone app. Layout, type, and visual direction stay elsewhere.

- **IS:** applying the ten chrome fixes (hover gating, tap highlight, viewport height, input zoom, tap delay, overscroll, safe-area, control selection, carousel axis, theme-color) to an existing web UI, then naming what still needs a real device.
- **IS NOT:** responsive layout, breakpoints, or collapsing nav (use `ui-design` Retrofit); hover-only *actions* with no touch fallback (use `ui-design` Audit, `mobile-hover-only-affordance`); gesture physics (use `ui-animation`); React Native, Flutter, or SwiftUI.

## Contents

- Workflow
- Inventory
- Apply
- Verify
- Gotchas
- Related skills

## Workflow

Copy this to track progress:

```text
Native-mobile progress:
- [ ] Step 1: Classify the surface (app shell vs document) and the head API (Next viewport export vs raw meta)
- [ ] Step 2: Inventory the ten failure signatures
- [ ] Step 3: Load references/recipes.md and apply each hit
- [ ] Step 4: Report what changed and what still needs a real device
```

**App shell** (dashboard, PWA, authenticated product): apply overscroll lock on `html`. **Document** (marketing, docs, blog): leave pull-to-refresh; still apply the other nine.

## Inventory

Grep before editing. A miss here is a miss in the diff.

```bash
rg -n ':hover|hover:' --glob '*.{css,tsx,jsx,vue}'
rg -n 'h-screen|min-h-screen|100vh|\bvh\b' --glob '*.{css,tsx,jsx}'
rg -n 'tap-highlight|touch-action|touch-manipulation|overscroll|safe-area|theme-color|user-select|select-none|viewport-fit'
rg -n '<input|<select|<textarea|text-(xs|sm)' --glob '*.{tsx,jsx,css}'
```

| Problem | Signature | Recipe |
|---|---|---|
| Hover stuck after tap | `:hover` / `hover:` not inside `(hover: hover) and (pointer: fine)` | Hover |
| Gray or blue flash on tap | no `-webkit-tap-highlight-color` on controls | Tap highlight |
| Layout has the wrong height | `h-screen`, `min-h-screen`, `100vh` | Viewport height |
| Page zooms into an input | input/select/textarea below 16px | Input zoom |
| Tap feels laggy | no `:active` / pointer-down press; no `touch-action: manipulation` | Tap delay |
| Pull-to-refresh hijacks scroll | app shell without `overscroll-behavior` | Overscroll |
| Content stops at the notch | `safe-area-inset` missing, or used without `viewport-fit=cover` | Safe area |
| Long-press selects button text | controls without `user-select: none` | Selection |
| Carousel scrolls the page | overflow-x scroller without `touch-action: pan-x` | Carousel |
| Status bar colour is wrong | no `theme-color`, or one value for both schemes | Theme color |

Cosmetic hover (scale, background) is this table. Actions that *appear* only on hover are `ui-design`'s `mobile-hover-only-affordance`: they need a visible touch fallback, not just a media query.

## Apply

Read [references/recipes.md](references/recipes.md) and apply every hit. Match the project's CSS dialect (plain CSS, Tailwind class, Next `viewport` export). Do not invent a second global stylesheet when the tokens already live in `globals.css` or `app/layout.tsx`.

Skip a row only with a reason in the report (document site vs app shell, library carousel that already sets `touch-action`, desktop-only surface).

## Verify

- Each applied recipe matches the snippet in `references/recipes.md` (same property, same media query, same 16px floor).
- `viewport-fit=cover` and `env(safe-area-inset-*)` shipped together, or neither did.
- Tap highlight was not removed without a press state to replace it.
- `user-select: none` is on controls, not `body`.
- List what Chrome device mode cannot prove: URL-bar `dvh`, iOS input zoom, tap highlight, overscroll, safe-area, `theme-color`, stuck hover after tap.

## Gotchas

- `maximum-scale=1` or `user-scalable=no` stops input zoom and also pinch-zoom, which fails WCAG 1.4.4. The fix is 16px on inputs.
- `-webkit-tap-highlight-color: transparent` on `*` with no `:active` or pointer-down press makes taps feel dead. Scope it to controls and pair it with a press state.
- `user-select: none` on `body` blocks copying prices, errors, and confirmation codes. Scope it to buttons and other controls.
- `overscroll-behavior: none` on a marketing or docs site removes pull-to-refresh people expect. App shells only.
- `viewport-fit=cover` without `env(safe-area-inset-*)` draws under the notch and home indicator.
- `100dvh` on a hero jumps when the URL bar hides. Use `100svh` when the first screen must not move.
- Tailwind `hover:` fires on tap unless the project already gates it (`hoverOnlyWhenSupported` or a custom variant). Check before adding a second gate.
- `touch-action: manipulation` on a map, canvas, or lightbox kills pinch-zoom. Put it on tappable controls, not `html`.
- `touch-action: pan-y` on a CSS `overflow-x` carousel is the wrong axis: the browser then owns vertical pan and the carousel loses native horizontal scroll. JS libraries (Embla, Swiper) want `pan-y`; leave them alone.
- Chrome device mode is not sign-off. Hover, URL-bar height, tap highlight, iOS zoom, overscroll, safe-area, and `theme-color` all lie there.

| Excuse | Rebuttal |
|---|---|
| "`maximum-scale=1` is the iOS zoom fix." | It takes pinch-zoom from everyone. 16px on inputs keeps WCAG 1.4.4. |
| "Device mode looks fine." | The bugs this skill exists for are the ones emulation does not show. |
| "I'll `select-none` the body and be done." | Then nobody can copy a value off the screen. Controls only. |

## Related skills

- `ui-design` Retrofit: breakpoints, collapsing nav, overflow, touch-target size. Its Audit `mobile-` rules catch missing viewport meta and hover-only actions; this skill is the chrome pass.
- `ui-animation`: springs, swipe physics, drag. `touch-action` here is browser gesture negotiation, not motion craft.
