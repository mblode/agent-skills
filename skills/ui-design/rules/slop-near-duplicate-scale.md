---
title: Near-duplicate of an existing scale step
id: slop-near-duplicate-scale
category: slop
defaultTier: backlog
detect: static
related: slop-token-drift
---

## Near-duplicate of an existing scale step

A scale works because its steps are far enough apart to read as deliberate. `text-[15px]` sitting between `text-sm` (14px) and `text-base` (16px) does not create a new level of hierarchy, it creates a third size that looks like a mistake next to the other two. The same goes for `p-[13px]` beside `p-3`, or `rounded-[7px]` beside `rounded-md`. Users see labels that are almost but not quite aligned, cards whose corners almost but not quite match, and read the surface as sloppy rather than as having more levels. It is the most literal form of generated-then-nudged UI: someone eyeballed a value instead of stepping the scale.

This rule is deliberately narrow. It fires only on an arbitrary pixel value that lands within 1px of a step the theme already defines.

## Not this rule

Using several steps of the same family on one surface is correct practice and must never be reported here:

- **Elevation ramps.** `shadow-sm` on a resting card, `shadow-md` on hover, `shadow-lg` on a popover. That is one system expressing three heights.
- **Nested radii.** An outer `rounded-lg` container with an inner `rounded-md` control. Concentric corners require different radii to look concentric.
- **Type ramps.** `text-sm` caption, `text-base` body, `text-lg` lead in one block.

The failure is a value that is *almost* a step, not the use of multiple steps.

## Detection

**Precondition:** a theme must exist (`@theme` block or `tailwind.config.*`). With no defined scale there is nothing to be a near-duplicate of: report **result unknown** and stop.

```bash
# Arbitrary px values in scale-bearing families, minus optical nudges of 2px or less
rg -noP '\b(text|p|px|py|pt|pb|pl|pr|m|mt|mb|ml|mr|mx|my|gap|gap-[xy]|space-[xy]|rounded(-[a-z]+)?|leading|w|h|size|inset|top|bottom|left|right)-\[-?\d+(\.\d+)?px\](?!:)' \
  -g '*.tsx' -g '*.jsx' -g '!*.stories.tsx' -g '!*.test.tsx' src/ \
| rg -vP '\[-?([01](\.\d+)?|2(\.0+)?)px\]'
```

Compare each hit against the theme's own values. Tailwind's defaults, if the theme has not overridden them:

| Family | Steps (px) |
|---|---|
| `text-*` | 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72 |
| spacing (`p`, `m`, `gap`) | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 |
| `rounded-*` | 2, 4, 6, 8, 12, 16, 24 |

Fire when `abs(value - nearest step) <= 1`. An exact match (`text-[16px]` where `text-base` exists) is the trivial case and gets the same finding with a one-token fix. A value 4px or more off a step is out of scope here: that is a size the theme does not cover, which belongs to `slop-token-drift`.

**Skip entirely:** `rem`, `%`, `vh`, `vw`, `em`, `ch`, and any value containing a function (`calc(`, `min(`, `max(`, `clamp(`, `round(`). A `rem` font size is the form `guidelines/general.md` explicitly asks for, and a percentage or viewport unit is relative to something the scale cannot know about.

## False positives

- **A near-scale value used consistently across many files** is an unregistered scale step, not a one-off nudge. A 13px UI text size used in twenty components is a decision. The fix is to register it in the theme and give it a name, not to bump every use to 14px. Recurrence across files is the tell: check with `rg -l` before reporting.
- **Values derived from an asset or an external constraint.** `w-[187px]` matching a supplied logo's intrinsic width, or a height matching a third-party embed, is not scale drift.
- **Optical corrections on icons and glyphs.** A 1px shift to make an icon look centred is craft, and the sibling rule `slop-token-drift` already excludes nudges of 2px or less for the same reason.
- **Files with no access to the theme**, such as email templates or embedded widgets that must ship inline styles.

## Fix

Step the scale instead of nudging it.

```tsx
// before
<p className="text-[15px] p-[13px] rounded-[7px]">

// after
<p className="text-sm p-3 rounded-md">
```

If 15px is genuinely required and recurs, make it a real step so the next component can reach it:

```css
@theme {
  --text-ui: 0.9375rem; /* 15px, the dense table row size */
}
```

## Why this needs a rule

A model picks a value that looks right in isolation and has no reason to check whether the theme already defines something 1px away, since the rendered result is indistinguishable in the moment and only reads as wrong beside its neighbours.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Design-system package or shared UI primitives | fix-this-sprint |
| Application UI (dashboard, settings, admin) | backlog |
| Marketing landing page | backlog |
| Prototype or spike branch | ignore |


## Suppression

```tsx
{/* ui-audit-ignore:slop-near-duplicate-scale, height matches the embedded player's fixed frame */}
```
