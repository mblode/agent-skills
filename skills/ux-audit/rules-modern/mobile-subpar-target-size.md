---
title: Touch targets below WCAG 2.5.5 / Material 48 dp threshold
slug: mobile-subpar-target-size
category: mobile
defaultTier: fix-this-sprint
surfaces: list, modal, toast, checkout, sign-in, dashboard
react-apis: n/a (CSS / Tailwind only)
related: rules/interaction-fittss-law.md, mobile-hover-only-affordance
---

## Touch targets below WCAG 2.5.5 / Material 48 dp threshold

Interactive elements rendered smaller than the platform minimum trigger missed taps, frustration, and a measurable drop in completion on touch devices. WCAG 2.5.5 (AAA) requires 44 px; Material guidelines call for 48 dp; WCAG 2.2 added 2.5.8 as a 24 px AA floor. Tailwind's `h-8`/`h-9`/`h-10` defaults — common in icon buttons, list rows, toast dismiss "x", and modal close affordances — sit below the 44 px line and ship without anyone noticing on desktop.

## What goes wrong

A 32 px icon button (`h-8 w-8`) renders fine on a trackpad but on a phone the user taps adjacent elements 10-20 % of the time. List rows with `h-10` row height (40 px) cause double-taps in inboxes and feeds. The bug is invisible in Storybook and in unit tests; it surfaces only as support tickets ("can't tap the close button").

## Detection

**Surfaces:** list, modal close buttons, toast dismiss, checkout step buttons, sign-in form submit, dashboard widget actions.

**Static signals:**
1. Grep all interactive elements (`<button>`, `<a>`, `role="button"`, `[onClick]`) in changed files.
2. Inspect their Tailwind size classes and convert to px:
   - `h-6` = 24 px, `h-7` = 28 px, `h-8` = 32 px, `h-9` = 36 px, `h-10` = 40 px (all fail 44 px)
   - `h-11` = 44 px (WCAG AAA pass)
   - `h-12` = 48 px (Material pass)
3. Flag any interactive element with height **and** width below `h-11` / `w-11` that doesn't have padding compensating to 44 px total tap area.
4. Count fails per file; report file:line for each.

**Concrete commands:**
```bash
# Find icon buttons / small interactive controls
rg -n 'className="[^"]*\b(h-[6-9]|h-10)\b[^"]*"' --type=tsx | rg -i '<button|role="button"|<a '

# Find inline-styled small targets
rg -n 'height:\s*(2[0-9]|3[0-9]|40)px' --type=tsx
```

**False-positive guards:**
- Skip if the element has padding that brings the total hit area to ≥ 44 px (e.g. `h-8 p-3` = 32 + 24 = 56 px).
- Skip non-interactive icons (decorative `<span>` with an SVG, no click handler).
- Skip files with `// ux-audit-ignore:mobile-subpar-target-size` near the match.
- Skip Storybook fixtures (`*.stories.tsx`).
- Skip `<input type="checkbox">` / `type="radio"` when wrapped in a `<label>` that itself meets 44 px.

## Fix

Bump to `h-11 w-11` (44 px AAA) or `h-12 w-12` (48 dp Material). Use logical sizing if the target needs to grow with content.

```tsx
// before — 32 px square, fails AAA on touch
<button
  type="button"
  aria-label="Dismiss"
  className="h-8 w-8 rounded-full bg-muted"
  onClick={onDismiss}
>
  <XIcon className="h-4 w-4" />
</button>

// after — 44 px AAA, icon stays visually centered at 16 px
<button
  type="button"
  aria-label="Dismiss"
  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted"
  onClick={onDismiss}
>
  <XIcon className="h-4 w-4" />
</button>
```

For dense list rows where 44 px height harms scannability, expand the hit area with padding instead of visual size:

```tsx
<button className="relative py-1 after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']">
  Dense action
</button>
```

Reference docs:
- WCAG 2.5.5 Target Size (Enhanced): https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- WCAG 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Material guidelines: https://m3.material.io/foundations/designing/structure#layout

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | release-blocker (primary submit must be 44 px) |
| Checkout | release-blocker (place-order CTA) |
| Modal close | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
<button className="h-9 w-9" aria-label="Edit">
  <PencilIcon className="h-4 w-4" />
</button>
```

**Applied (passes):**

```tsx
<button className="h-11 w-11 inline-flex items-center justify-center" aria-label="Edit">
  <PencilIcon className="h-4 w-4" />
</button>
```

## Defer-to (when this is another tool's job)

- **Lighthouse** — `tap-targets` audit measures runtime layout, including overlap; run after the static fix to confirm: https://developer.chrome.com/docs/lighthouse/seo/tap-targets/
- **axe-core** — covers WCAG 2.5.8 (24 px) but not 2.5.5 (44 px AAA).
- **Cross-reference** Layer 3 cognitive framing in `rules/interaction-fittss-law.md` (target distance × size law).

## Suppression

```tsx
{/* ux-audit-ignore:mobile-subpar-target-size — desktop-only admin tool */}
<button className="h-8 w-8" />
```
