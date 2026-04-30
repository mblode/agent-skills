---
title: Missing viewport meta, 100vh on mobile, no safe-area insets
slug: mobile-viewport-scaling
category: mobile
defaultTier: backlog
surfaces: dashboard, checkout, modal, list, sign-in
react-apis: n/a (HTML / CSS only)
related: mobile-subpar-target-size, states-layout-shift
---

## Missing viewport meta, 100vh on mobile, no safe-area insets

Three quiet bugs ship together on mobile: a missing `<meta name="viewport">` causes iOS Safari to render the page at 980 px and zoom out; `100vh` includes the address bar and is wrong by ~60 px on iOS; a fixed bottom bar covers the home-indicator notch and clips content. Each is a one-line fix and each is invisible in desktop testing. Modern CSS adds `100dvh` (dynamic viewport height) and `env(safe-area-inset-*)` exactly for this.

## What goes wrong

A Next.js app omits the viewport meta in `app/layout.tsx`. iOS Safari renders at desktop width and the user pinches to zoom. A modal uses `h-screen` (100vh) — on iOS the bottom 60 px gets covered by the URL bar, the primary CTA is unreachable. A bottom navigation bar uses `pb-4` — on iPhone X+ the home indicator overlaps the buttons.

## Detection

**Surfaces:** every full-screen surface, modals/sheets, fixed bottom bars, mobile dashboards, sign-in screens with bottom CTAs.

**Static signals:**
1. **Viewport meta:** check `app/layout.tsx` (Next.js App Router) or `_document.tsx` (Pages Router) for `<meta name="viewport" content="width=device-width, initial-scale=1">` or the equivalent `viewport` export.
2. **`100vh` on mobile-rendered surfaces:** grep for `h-screen`, `min-h-screen`, `100vh`, `vh` units. Each is a candidate for `100dvh` / `100svh`.
3. **Fixed bottom bars:** grep for `fixed bottom-0`, `position: fixed; bottom: 0` and confirm `padding-bottom: env(safe-area-inset-bottom)` or Tailwind `pb-[env(safe-area-inset-bottom)]` is present.
4. **viewport-fit:** if any `safe-area-inset-*` is used, the viewport meta must include `viewport-fit=cover` or it's a no-op.

**Concrete commands:**
```bash
# Viewport meta presence (Next.js App Router)
rg -n 'export const viewport|<meta name="viewport"' app/ src/

# 100vh usage
rg -n '\b(h-screen|min-h-screen|100vh|\bvh\b)' --type=tsx --type=css

# Fixed bottom bars
rg -n 'fixed (inset-x-0 )?bottom-0' --type=tsx

# Safe-area insets
rg -n 'safe-area-inset|env\(safe-area' --type=css --type=tsx
```

**False-positive guards:**
- Skip `100vh` if the surface is desktop-only (`hidden md:block` parent, or media-query gated).
- Skip fixed bottom bars inside a `<dialog>` (modal context manages safe area itself).
- Skip files with `// ux-audit-ignore:mobile-viewport-scaling` near the match.

## Fix

Three independent fixes; apply each where the static signal flagged.

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
// before — covered by iOS Safari URL bar
<div className="min-h-screen flex flex-col">

// after — dynamic viewport, full height in every state
<div className="min-h-[100dvh] flex flex-col">
```

`100dvh` shrinks/grows with the URL bar; use `100svh` (small viewport) when the layout must remain stable as the bar appears/disappears (avoids reflow on scroll). `100lvh` (large) is rarely correct.

**3. Safe-area inset on fixed bars:**

```tsx
// before — clipped by home indicator on iPhone X+
<nav className="fixed inset-x-0 bottom-0 h-14 px-4">

// after — respects safe area
<nav
  className="fixed inset-x-0 bottom-0 px-4
             pb-[env(safe-area-inset-bottom)]
             h-[calc(3.5rem+env(safe-area-inset-bottom))]"
>
```

Reference docs:
- Next.js viewport export: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- MDN dynamic viewport units: https://developer.mozilla.org/en-US/docs/Web/CSS/length#dynamic_viewport_size
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

## Examples

**Anti-pattern (fails):**

```tsx
// app/layout.tsx — no viewport export
export default function Layout({ children }) {
  return <html><body>{children}</body></html>;
}

// Sheet.tsx
<div className="fixed inset-0 h-screen flex flex-col">
  <button className="fixed bottom-4 inset-x-4">Continue</button>
</div>
```

**Applied (passes):**

```tsx
// app/layout.tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Sheet.tsx
<div className="fixed inset-0 min-h-[100dvh] flex flex-col">
  <button className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))]">
    Continue
  </button>
</div>
```

## Defer-to (when this is another tool's job)

- **Lighthouse** mobile audit catches missing viewport meta: https://developer.chrome.com/docs/lighthouse/pwa/viewport/
- **Playwright** device emulation reproduces the URL-bar issue on iOS profiles.
- **Chromatic** with mobile viewports catches the visual end of safe-area bugs.

## Suppression

```tsx
{/* ux-audit-ignore:mobile-viewport-scaling — desktop-only embedded admin */}
<div className="h-screen" />
```
