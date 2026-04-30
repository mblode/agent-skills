---
title: Loading state causes layout shift on data arrival
slug: states-layout-shift
category: states
defaultTier: fix-this-sprint
surfaces: list, dashboard, marketing, loading-state, search
react-apis: next/image, next/font, min-height, Skeleton
related: states-no-skeleton
---

## Loading state causes layout shift on data arrival

The skeleton or spinner takes 0×0 (or some other height); the loaded content takes 200×400. When data arrives, every element below it jumps. This is the default Cumulative Layout Shift bug and it shows up everywhere: skeletons without `min-height`, images without `width`/`height`, fonts without `font-display: swap` and `size-adjust`. Fix is mechanical and one-time per surface.

## What goes wrong

A user starts reading a paragraph above a list. The list's loading state is `<Spinner />` — no fixed height. Data arrives, list expands to 600 px tall, paragraph the user was reading shoves off screen. The user re-finds their place. CLS score regresses on Lighthouse. On marketing pages, the same pattern happens with hero images that lack `width`/`height` attributes.

## Detection

**Surfaces:** every loading state, every image, every web font.

**Static signals:**
1. **Skeletons without fixed height.** Find skeleton components and verify they declare a height (`h-N`, `min-h-N`, `style={{ minHeight }}`, fixed pixel count of rows).
2. **Images without dimensions.** Find `<img>` and `<Image>` (next/image) — fail if neither `width`+`height` nor `fill` with a sized parent is present.
3. **Fonts without swap + size-adjust.** Find font loading config (`next/font/google`, `next/font/local`, `@font-face` blocks) — verify `display: "swap"` and (ideally) `adjustFontFallback`.
4. **Conditional content above other content.** A `{!data && <Skeleton h={4} />}` followed by a real-content `<List />` of variable height is a CLS bug if heights differ.

**Concrete commands:**
```bash
# Skeletons missing min-height
rg -l 'Skeleton' --type=tsx src/ | while read f; do
  rg -B 1 -A 3 '<Skeleton' "$f" | rg -L 'h-|height|min-h' \
    && echo "$f: skeleton without explicit height"
done

# <img> without width/height
rg '<img\s' --type=tsx --type=jsx src/ | rg -v 'width=.*height=|height=.*width='

# next/image without width/height/fill
rg '<Image\s' --type=tsx src/ | rg -v 'width=|fill'

# Fonts not using swap
rg 'next/font' --type=ts --type=tsx app/ src/ | rg -v 'display: ["\']swap'

# @font-face without font-display
rg '@font-face' --type=css | rg -L 'font-display'
```

**False-positive guards:**
- Skip files with `// ux-audit-ignore:states-layout-shift`.
- Below-the-fold content with `content-visibility: auto` is acceptable to CLS-shift inside its own subtree.
- Skip components that declare `min-height` via CSS class (Tailwind `min-h-*`); inspect class strings before flagging.
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

For dynamic-height content (a chat bubble, a comment), the skeleton should reserve a reasonable minimum and the real content should `min-height` match — not exact match, but close enough to not jolt.

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

A field that shifts under the user's cursor mid-click can cause mis-clicks on destructive actions — that's why checkout escalates.

## Examples

**Anti-pattern (fails):**

```tsx
{isLoading && <Spinner />}                          {/* 0px height */}
{!isLoading && <Cards data={data} />}                 {/* 600px when loaded */}

<img src="/banner.png" alt="" />                      {/* no width/height */}
```

**Applied (passes):**

```tsx
{isLoading && <CardsSkeleton />}                     {/* same height as loaded */}
{!isLoading && <Cards data={data} />}

<Image src="/banner.png" alt="" width={1200} height={400} />
```

## Defer-to (when this is another tool's job)

- Lighthouse / web-vitals report the CLS metric. This rule prevents the bug at write time; Lighthouse confirms it at runtime — link out, don't restate the metric.
- Vercel Speed Insights for field measurement.

## Suppression

```tsx
{/* ux-audit-ignore:states-layout-shift — content-visibility:auto, expected to expand */}
<details>
```
