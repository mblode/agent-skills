---
title: Stacked decorative layers with no role
id: slop-decoration-no-role
category: slop
defaultTier: backlog
detect: static
related: slop-token-drift, slop-faux-product-chrome
---

## Stacked decorative layers with no role

A blurred blob top-left, a second blob bottom-right, a grid overlay, a noise layer, and a radial glow behind the heading: five absolutely positioned elements that contain nothing, mean nothing, and sit between the user and the content. Each was added to make the section feel less empty, and together they make text harder to read, wash out the contrast the copy needs, cost paint time on every scroll, and, on a low-end phone, drop the frame rate for the sake of atmosphere nobody asked for. Content that has to compete with its own background reads as content nobody was confident in.

Atmosphere is not the problem. Atmosphere with no source is.

## Detection

A **decorative layer** is an element that satisfies all four:

1. positioned `absolute` or `fixed`,
2. `pointer-events-none` or `aria-hidden`,
3. no children and no text,
4. carries a gradient, `blur`, `backdrop-blur`, `mix-blend`, or `opacity` utility.

```bash
rg -cUP '(?s)<(?:div|span)\b(?=[^>]*?(?:\babsolute\b|\bfixed\b))(?=[^>]*?(?:pointer-events-none|aria-hidden))(?=[^>]*?(?:gradient|bg-linear|bg-radial|\bblur|backdrop-blur|mix-blend|opacity-))(?![^>]*?(?:size-\[max\(100%|pointer-fine:hidden|bg-clip-text|\bmask-))[^>]*?/>' \
   -g '*.tsx' -g '*.jsx' -g '!*.stories.tsx' -g '!*.test.tsx' src/ \
| sort -t: -k2 -rn
```

Every condition is a lookahead **inside one element match**, not a stage in a pipeline. That is load-bearing: `prettier-plugin-tailwindcss` wraps long class strings across lines, and these layers have the longest class strings on the page. A chain of line-based filters silently returns zero on a wrapped element, because `absolute` and `blur` end up on different output lines. A threshold rule that undercounts is worse than no rule: it reports "2, warn" on a section with five layers.

**Thresholds:** 3 or more in one component fails. Exactly 2 warns. **One never fires.**

The threshold is doing the work here, and that is deliberate. A single hero gradient wash is normal, frequently good, and one of the cheapest ways to give a section a focal point. Reporting it would train readers to skim this whole category, which costs more than the occasional stray blob. Count first, report second, and always list every layer with `file:line` so the count can be checked.

## False positives

- **The touch-target expander is an empty absolute `aria-hidden` element by design.** `guidelines/buttons.md` mandates `<span class="absolute ... size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden" aria-hidden="true" />` on small and icon buttons. It carries no gradient so it should not match, but the `size-[max(100%` and `pointer-fine:hidden` exclusions above are there in case it picks up an `opacity` utility. Never count it.
- **Functional layers that happen to look decorative.** Modal and drawer scrims (`inset-0 bg-black/50`) are click-catchers and contrast floors. `bg-clip-text` gradients are the text itself. `mask-` fades mark scrollable overflow, which is real information about what is reachable. Pseudo-element focus rings and selection highlights are state, not atmosphere. None of these are decoration with no role.
- **A shared decorative component used in 3 or more places is a brand system, not a one-off.** Check with `rg -l 'from .*GlowBackground'` before reporting. A `<GridPattern />` that appears on every section of the site is the visual language of the product, and the count that matters is 1 (the component), not the number of call sites. Skip it.
- **Charts, illustrations, and canvas backgrounds** are content rendered as layers.
- **Blur used for a real effect,** such as a frosted sticky header sitting over scrolling content, has an obvious job.

## Fix

Keep the one layer that has a reason, delete the rest.

```tsx
// before: five layers, no source of light
<section className="relative">
  <div className="absolute -left-40 top-0 size-96 rounded-full bg-purple-500/30 blur-3xl pointer-events-none" />
  <div className="absolute -right-40 bottom-0 size-96 rounded-full bg-cyan-400/30 blur-3xl pointer-events-none" />
  <div className="absolute inset-0 bg-[url(/grid.svg)] opacity-20 pointer-events-none" />
  <div className="absolute inset-0 bg-linear-to-b from-white/0 to-white pointer-events-none" />
  <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-noise pointer-events-none" />
  <h1>...</h1>
</section>

// after: one wash, placed where the eye should land
<section className="relative">
  <div className="absolute inset-x-0 top-0 h-64 bg-linear-to-b from-stone-100 to-transparent pointer-events-none" aria-hidden="true" />
  <h1>...</h1>
</section>
```

If every layer feels necessary, the section usually needs stronger type and spacing rather than more atmosphere.

## Why this needs a rule

Each layer is added in a separate turn and looks defensible on its own, so nothing in the generating context ever counts the stack, which is the only view from which the problem is visible.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Any surface where a layer sits over body text at reduced contrast | fix-this-sprint |
| Marketing landing page | backlog |
| Application UI, internal admin | backlog |
| Prototype or spike branch | ignore |

Never a release blocker. If contrast under a layer actually fails, that is a colour-contrast finding and belongs to the accessibility rules, not here.

## Suppression

```tsx
{/* ui-audit-ignore:slop-decoration-no-role, the three layers are the campaign artwork signed off with brand */}
```
