---
title: Loading state causes layout shift on data arrival
id: states-layout-shift
category: states
defaultTier: fix-this-sprint
detect: rendered
---

## Loading state causes layout shift on data arrival

The skeleton or spinner takes 0x0 (or some height); loaded content takes 200x400; when data arrives every element below it jumps. This is the default Cumulative Layout Shift bug, everywhere: skeletons without `min-height`, images without `width`/`height`, fonts without `font-display: swap` and `size-adjust`. Fix is mechanical, one-time per surface.

## What goes wrong

A user reads a paragraph above a list whose loading state is `<Spinner />` (no fixed height). Data arrives, the list expands to 600px, the paragraph shoves off screen, and the user re-finds their place; CLS regresses on Lighthouse. Same pattern on marketing pages with hero images lacking `width`/`height`.

## Detection

**Surfaces:** every loading state, every image, every web font.

**Static signals (candidates only):**
1. **Skeletons without fixed height.** Verify a declared height (`h-N`, `min-h-N`, `style={{ minHeight }}`, fixed row count).
2. **Images without dimensions.** `<img>` and `<Image>` (next/image): fail if neither `width`+`height` nor `fill` with a sized parent.
3. **Fonts without swap + size-adjust.** In `next/font/google`, `next/font/local`, `@font-face`, verify `display: "swap"` and (ideally) `adjustFontFallback`.
4. **Conditional content above other content.** `{!data && <Skeleton h={4} />}` then a variable-height `<List />` is a CLS bug if heights differ.

**Rendered check (decisive):**

The greps find missing dimensions; the shift itself is a delta between two rendered boxes, so measure it. A skeleton that declares `h-14` still shifts if the loaded row sets 68px, and a skeleton with no declared height does not shift if its parent already reserves the space.

Load the surface with the network throttled so the loading state is observable. Record the bounding box of each skeleton, spinner, or placeholder, then record the same container once data has arrived, and compare heights. Attribute the movement with a `PerformanceObserver` on `layout-shift` entries over that window: each entry names the sources that moved and how far. Flag any container whose height changes on data arrival, and report the element, both heights, and the viewport.

**Concrete commands:**
```bash
# Skeletons missing min-height
rg -l 'Skeleton' --type=ts src/ | while read f; do
  rg -B 1 -A 3 '<Skeleton' "$f" | rg -q 'h-|height|min-h' \
    || echo "$f: skeleton without explicit height"
done

# <img> without width/height
rg '<img\s' --type=ts --type=js src/ | rg -v 'width=.*height=|height=.*width='

# next/image without width/height/fill
rg '<Image\s' --type=ts src/ | rg -v 'width=|fill'

# Fonts not using swap
rg 'next/font' --type=ts app/ src/ | rg -v 'display: ["\']swap'

# @font-face without font-display
rg -l '@font-face' --type=css | while read f; do
  rg -q 'font-display' "$f" || echo "$f: @font-face without font-display"
done
```

**False-positive guards:**
- Skip files with `// ui-audit-ignore:states-layout-shift`.
- Below-the-fold `content-visibility: auto` may CLS-shift inside its own subtree (acceptable).
- Skip components declaring `min-height` via CSS class (Tailwind `min-h-*`); inspect class strings first.
- Skip Storybook fixtures.

## Fix

Three patches:

```tsx
// 1. Skeletons get fixed dimensions matching loaded layout
function InvoiceRowSkeleton() {
  return <li className="h-14 rounded-md bg-muted animate-pulse" />;
  //                  ^ matches loaded row height
}

function InvoiceListSkeleton() {
  return (
    <ul className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => <InvoiceRowSkeleton key={i} />)}
    </ul>
  );
}

// 2. Images declare intrinsic dimensions
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Product hero"
  width={1280}
  height={720}
  priority
/>

// or fill mode with a sized parent
<div className="relative aspect-video">
  <Image src="/hero.jpg" alt="..." fill />
</div>

// 3. Fonts loaded with swap + size-adjust fallback
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",        // shows fallback immediately, swaps when ready
  adjustFontFallback: true, // Next.js auto-tunes fallback metrics to reduce CLS
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

For dynamic-height content (chat bubble, comment), reserve a reasonable minimum in the skeleton and `min-height`-match the real content: close enough not to jolt, not exact.

Docs:
- next/image: https://nextjs.org/docs/app/api-reference/components/image
- next/font: https://nextjs.org/docs/app/api-reference/components/font
- web.dev CLS: https://web.dev/articles/cls

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Marketing landing (LCP-critical) | release-blocker |
| Checkout (form fields shifting under user's cursor) | release-blocker |
| List / Feed / Inbox | fix-this-sprint |
| Dashboard widget | fix-this-sprint |
| Internal admin | backlog |

A field that shifts under the cursor mid-click causes mis-clicks on destructive actions, so checkout escalates.

## Defer-to (when this is another tool's job)

- Lighthouse / web-vitals report the CLS metric: this rule prevents the bug at write time, Lighthouse confirms it at runtime. Link out, don't restate.
- Vercel Speed Insights for field measurement.

## Suppression

```tsx
{/* ui-audit-ignore:states-layout-shift, content-visibility:auto, expected to expand */}
<details>
```
