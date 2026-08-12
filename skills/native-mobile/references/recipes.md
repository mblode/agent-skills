# Native-mobile recipes

Exact CSS and HTML for each inventory row. Read when applying a hit. Tailwind class names sit next to the CSS; Next.js uses the `viewport` export where the head tag would go.

## Contents

- Hover
- Tap highlight
- Viewport height
- Input zoom
- Tap delay
- Overscroll
- Safe area
- Selection
- Carousel
- Theme color

## Hover

Cosmetic `:hover` (scale, background, shadow) sticks after a tap on touch devices. Gate it to a real pointer.

```css
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    background: var(--hover-bg);
  }
}
```

`(hover: hover)` alone is not enough: some coarse pointers still match. `(pointer: fine)` is the second gate.

Tailwind `hover:` is not gated by default. If the project has no `hoverOnlyWhenSupported` (v3) or custom variant (v4), add one and use it for cosmetic hover:

```css
@custom-variant fine-hover {
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      @slot;
    }
  }
}
```

```html
<div class="fine-hover:bg-zinc-100">...</div>
```

Do not use this media query as the fix for actions that only appear on hover. Those need a visible touch control; that is `ui-design`'s `mobile-hover-only-affordance`.

## Tap highlight

iOS paints a gray (or blue) overlay on tap. Turn it off on controls, and only after a press state exists to replace it.

```css
button,
a,
[role="button"] {
  -webkit-tap-highlight-color: transparent;
}

button:active,
a:active,
[role="button"]:active {
  background: var(--press-bg);
}
```

Tailwind: `[-webkit-tap-highlight-color:transparent]` plus `active:bg-...` on the same control.

Do not set this on `*` or `body`. The highlight is the only tap feedback until a press style exists.

## Viewport height

`100vh` includes the iOS URL bar, so a "full height" shell is ~60px too tall and the bottom CTA sits under chrome.

```css
.app-shell {
  min-height: 100dvh; /* tracks the URL bar */
}

.hero {
  min-height: 100svh; /* stable; does not jump when the bar hides */
}
```

Tailwind: `min-h-dvh` on the app shell, `min-h-svh` on a hero. Never `min-h-screen` (`100vh`).

`100lvh` (large viewport) is rarely correct: it overflows while the URL bar is visible.

## Input zoom

iOS zooms the page when a focused field is under 16px. Keep form controls at 16px. Do not disable zoom.

```css
input,
select,
textarea {
  font-size: 16px;
}
```

Tailwind: `text-base` on the control at the mobile default. If desktop uses `text-sm`, write `text-base sm:text-sm`.

Never `maximum-scale=1`, `user-scalable=no`, or Next `maximumScale: 1`. Those fail WCAG 1.4.4.

## Tap delay

Two separate lags: the old 300ms double-tap-zoom wait, and paint that waits for `click`.

```css
button,
a,
[role="button"] {
  touch-action: manipulation; /* no double-tap zoom on this control */
}

button:active {
  transform: scale(0.98);
  transition-duration: 0s; /* press is instant; release may ease */
}
```

Tailwind: `touch-manipulation` plus an `active:` press with no delay.

iOS `:active` is unreliable unless the element (or `document`) has seen a touch listener. If `:active` never paints on iPhone, set a `data-pressed` attribute on `pointerdown` and clear it on `pointerup` / `pointercancel`.

Do not put `touch-action: manipulation` on `html` or on a map, canvas, or pinch-zoom lightbox.

## Overscroll

On an app shell, the browser's pull-to-refresh and rubber-band steal the first scroll and can reload the page.

```css
html {
  overscroll-behavior: none;
}

.modal-body,
.drawer-body {
  overscroll-behavior: contain; /* inner scroll does not chain to the page */
}
```

Tailwind: `overscroll-none` on `html`, `overscroll-contain` on the inner pane.

Apply `none` on `html` only for app shells. Marketing, docs, and blogs keep pull-to-refresh.

## Safe area

Notch and home indicator clip full-bleed chrome unless the viewport covers the screen *and* padding uses the inset.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Next.js App Router (`app/layout.tsx`):

```ts
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

```css
.bottom-bar {
  padding-bottom: max(1rem, env(safe-area-inset-bottom, 0px));
}

.top-bar {
  padding-top: max(1rem, env(safe-area-inset-top, 0px));
}
```

Tailwind: `pb-[max(1rem,env(safe-area-inset-bottom,0px))]` (same for `pt` / `pl` / `pr` with the matching inset).

`env(safe-area-inset-*)` is 0 without `viewport-fit=cover`. Ship both or neither.

Fixed bottom bars: add the inset to the bar's height, not only its padding, or the last action still sits under the home indicator:

```css
.bottom-nav {
  height: calc(3.5rem + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

## Selection

A long-press on a button summons the text-selection callout. Disable selection on controls, not on readable content.

```css
button,
[role="button"] {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
```

Tailwind: `select-none` on the control. Do not put `select-none` on `body` or on a paragraph, price, error, or confirmation code.

## Carousel

A horizontal scroller that also moves the page is an axis fight. The fix depends on who owns the scroll.

**CSS `overflow-x` / scroll-snap:** let the browser pan horizontally, and stop horizontal overscroll from triggering Back:

```css
.carousel {
  overflow-x: auto;
  touch-action: pan-x;
  overscroll-behavior-x: contain;
}
```

Tailwind: `overflow-x-auto touch-pan-x overscroll-x-contain`.

**JS-driven** (Embla, Swiper, Keen): those libraries set `touch-action: pan-y` so the page still scrolls vertically while they handle the horizontal drag. Do not override to `pan-x`; that steals their gesture.

`touch-action: pan-y` on a CSS overflow carousel is the wrong axis: the browser then owns vertical pan and native horizontal scroll dies.

## Theme color

The browser chrome (and the PWA status bar) uses `theme-color`. Match the app header, per scheme.

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#09090b" />
```

Next.js, on the same `viewport` export as Safe area:

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};
```

Use the header background, not a brand accent, unless the header *is* that accent. Pair with `color-scheme: light dark` on `html` so native form controls follow the page.

Standalone iOS PWAs also read `apple-mobile-web-app-status-bar-style`. Set `black-translucent` only when `viewport-fit=cover` and the top inset are already in place; otherwise the status bar overlays the header.
