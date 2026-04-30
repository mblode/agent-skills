---
title: Fitts's Law
impact: HIGH
tier: programmatic
prefix: interaction
tags: hit-targets, buttons, touch, accessibility, motor
related: interaction-doherty-threshold, perception-proximity, decision-hicks-law
---

## Fitts's Law

Time to acquire a pointer target scales with the distance to it and inversely with its size — small, far targets are slow and error-prone. Practical floor: 44×44 px on touch surfaces (Apple HIG, WCAG 2.5.5 Target Size AAA) or 48 dp on Material. Dense desktop UI tolerates 24×24 px minimum. Source: Fitts (1954); WCAG 2.1 SC 2.5.5.

Screen edges and corners behave as effectively infinite targets — the cursor cannot overshoot the viewport boundary. Anchor frequently-used actions to edges; never put a critical action behind a 24 px icon on touch.

## Check

**Surfaces:** primary-nav, modal, form

**Procedure:**
1. Find interactive elements: `<button>`, `<a>`, `role="button"`, icon buttons, checkboxes, links in dense rows.
2. Parse Tailwind sizing classes: `h-N w-N` (where N corresponds to px in default Tailwind: `h-11` = 44 px, `h-10` = 40 px, `h-8` = 32 px, `h-6` = 24 px). Also include `p-N` padding to compute the **effective hit target**, not just the visual glyph.
3. Determine surface type — touch (mobile-first, `<md:` viewports, mobile UA targets) requires ≥44 px; dense desktop UI tolerates ≥24 px.
4. Flag any interactive element below the threshold for its surface.

**Concrete commands:**
```bash
# Find sub-44px elements (h-1 through h-10)
rg -n 'h-(1|2|3|4|5|6|7|8|9|10) ' src/
# Find icon buttons by aria-label without explicit sizing
rg -n '<button[^>]*aria-label' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | All interactive elements ≥44 px on touch AND ≥24 px on dense desktop | — |
| warn | Touch target between 32–43 px (e.g. `h-8` to `h-10`) | MEDIUM |
| fail | Touch target <32 px OR desktop target <24 px | HIGH |

## Fix

**If fail:** Increase to `h-11 w-11` (44 px) for touch; keep the visual glyph small (`h-4 w-4` ≈ 16 px) by using padding for the hit area. Anchor to edges or corners when possible.

**If warn:** Bump to `h-11 w-11` for touch surfaces, or add invisible padding (`p-2`) to extend the hit target without resizing the glyph.

## Examples

**Anti-pattern (fails):**

```tsx
<div className="fixed top-2 right-2">
  <button onClick={onClose} className="h-5 w-5 text-xs">
    x
  </button>
</div>
```

**Applied (passes):**

```tsx
<button
  onClick={onClose}
  aria-label="Close"
  className="fixed top-0 right-0 inline-flex h-11 w-11 items-center justify-center
             rounded-full text-zinc-500 hover:bg-zinc-100 focus-visible:ring-2"
>
  <XIcon className="h-4 w-4" aria-hidden />
</button>
```

The visual icon stays 16 px; the 44×44 hit area extends through padding. Anchoring to the corner makes the button effectively unmissable on desktop.

Reference: https://lawsofux.com/fittss-law/
