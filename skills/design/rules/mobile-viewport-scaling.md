---
title: Missing viewport meta, 100vh on mobile, no safe-area insets
id: mobile-viewport-scaling
category: mobile
defaultTier: backlog
detect: static
related: interaction-target-size, states-layout-shift
---

## Missing viewport meta, 100vh on mobile, no safe-area insets

Three quiet bugs ship together on mobile, each a one-line fix invisible in desktop testing: a missing `<meta name="viewport">` makes iOS Safari render at 980 px and zoom out; `100vh` includes the address bar (~60 px wrong on iOS); a fixed bottom bar covers the home-indicator notch and clips content. Modern CSS fixes these with `100dvh` (dynamic viewport height) and `env(safe-area-inset-*)`.

## What goes wrong

No viewport meta in `app/layout.tsx`: iOS Safari renders at desktop width and the user pinches to zoom. A modal uses `h-screen` (100vh): on iOS the URL bar covers the bottom 60 px and the primary CTA is unreachable. A bottom nav uses `pb-4`: on iPhone X+ the home indicator overlaps the buttons.

## Detection

**Surfaces:** every full-screen surface, modals/sheets, fixed bottom bars, mobile dashboards, sign-in screens with bottom CTAs.

**Static signals:**
1. **Viewport meta:** check `app/layout.tsx` (App Router) or `_document.tsx` (Pages Router) for `<meta name="viewport" content="width=device-width, initial-scale=1">` or the `viewport` export.
2. **`100vh` on mobile surfaces:** grep `h-screen`, `min-h-screen`, `100vh`, `vh` units. Each is a candidate for `100dvh` / `100svh`.
3. **Fixed bottom bars:** grep `fixed bottom-0`, `position: fixed; bottom: 0`; confirm `padding-bottom: env(safe-area-inset-bottom)` or Tailwind `pb-[env(safe-area-inset-bottom)]` is present.
4. **viewport-fit:** if any `safe-area-inset-*` is used, the viewport meta must include `viewport-fit=cover` or it's a no-op.

**Concrete commands:**
```bash
# Viewport meta presence (Next.js App Router)
rg -n 'export const viewport|<meta name="viewport"' app/ src/

# 100vh usage
rg -n '\b(h-screen|min-h-screen|100vh|\bvh\b)' --type=ts --type=css

# Fixed bottom bars
rg -n 'fixed (inset-x-0 )?bottom-0' --type=ts

# Safe-area insets
rg -n 'safe-area-inset|env\(safe-area' --type=css --type=ts
```

**False-positive guards:**
- Skip `100vh` on desktop-only surfaces (`hidden md:block` parent, or media-query gated).
- Skip fixed bottom bars inside a `<dialog>` (modal context manages safe area).
- Skip files with `// ui-audit-ignore:mobile-viewport-scaling` near the match.

## Fix

Three independent fixes; apply each where flagged.

**1. Viewport meta (Next.js App Router):**

```tsx
// app/layout.tsx
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // required for env(safe-area-inset-*)
};
```

**2. Replace `100vh` with `100dvh`:**

```tsx
// before: covered by iOS Safari URL bar
<div className="min-h-screen flex flex-col">

// after: dynamic viewport, full height in every state
<div className="min-h-[100dvh] flex flex-col">
```

`100dvh` shrinks/grows with the URL bar; use `100svh` (small viewport) when the layout must stay stable as the bar appears/disappears (avoids scroll reflow). `100lvh` (large) is rarely correct.

**3. Safe-area inset on fixed bars:**

```tsx
// before: clipped by home indicator on iPhone X+
<nav className="fixed inset-x-0 bottom-0 h-14 px-4">

// after: respects safe area
<nav
  className="fixed inset-x-0 bottom-0 px-4
             pb-[env(safe-area-inset-bottom)]
             h-[calc(3.5rem+env(safe-area-inset-bottom))]"
>
```

Reference docs:
- Next.js viewport export: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- MDN dynamic viewport units: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#dynamic_viewport_units
- WebKit safe-area: https://webkit.org/blog/7929/designing-websites-for-iphone-x/

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | fix-this-sprint (CTA hidden = no conversion) |
| Checkout | release-blocker (place-order button under URL bar) |
| Modal / Sheet | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Defer-to (when this is another tool's job)

- **Lighthouse** mobile audit catches missing viewport meta: https://developer.chrome.com/docs/lighthouse/best-practices/viewport
- **Playwright** device emulation reproduces the URL-bar issue on iOS profiles.
- **Chromatic** with mobile viewports catches the visual end of safe-area bugs.

## Suppression

```tsx
{/* ui-audit-ignore:mobile-viewport-scaling, desktop-only embedded admin */}
<div className="h-screen" />
```
