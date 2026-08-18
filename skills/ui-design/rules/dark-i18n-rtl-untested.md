---
title: Layout uses physical (left/right) instead of logical (start/end) properties
id: dark-i18n-rtl-untested
category: dark-i18n
defaultTier: backlog
detect: static
related: dark-i18n-untested
---

## Layout uses physical (left/right) instead of logical (start/end) properties

Arabic, Hebrew, Persian, and Urdu read right-to-left. A layout using physical properties (`margin-left`, `padding-right`, `text-align: left`, Tailwind `ml-2`, `pr-4`, `text-left`) does not flip when document direction is `rtl`: icons land on the wrong side, "forward" chevrons point backward, padding clears the wrong edge. CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) and Tailwind's `ms-` / `me-` / `ps-` / `pe-` / `start-` / `end-` variants flip automatically with `dir="rtl"`. The bug is silent until someone tests a Hebrew locale.

## What goes wrong

A list row renders `<Icon className="mr-2" />` before text. Under `dir="rtl"` the icon stays left of the text instead of moving to the inline-start (right in RTL). A back arrow `<ChevronLeft />` still points left though "back" in Arabic is to the right. A modal close button at `right-4 top-4` stays top-right instead of moving to top-left (the inline-end corner in RTL).

## Detection

**Surfaces:** any layout, especially navigation, list rows with icons, form-field icon adornments, modal headers, breadcrumbs.

**Static signals:**
1. Grep physical Tailwind classes with logical equivalents:
   - Margins: `\bml-`, `\bmr-` → `ms-`, `me-`
   - Padding: `\bpl-`, `\bpr-` → `ps-`, `pe-`
   - Position: `\bleft-`, `\bright-` → `start-`, `end-`
   - Text align: `text-left`, `text-right` → `text-start`, `text-end`
   - Float / clear: `float-left`, `float-right` → `float-start`, `float-end`
   - Borders: `border-l`, `border-r` → `border-s`, `border-e`
2. Grep CSS for `margin-left`, `padding-right`, `text-align: left|right`, `left: 0`, `right: 0` with no logical equivalent.
3. Check for any `dir="rtl"` test (Storybook story, Playwright fixture, layout doc).
4. Flag if physical properties are used **and** no RTL coverage exists.

**Concrete commands:**
```bash
# Tailwind physical → logical migrations
rg -n 'className="[^"]*\b(ml-|mr-|pl-|pr-|left-|right-|text-(left|right)|float-(left|right)|border-(l|r))\b' --type=ts

# Physical CSS properties
rg -n '(margin|padding)-(left|right):|text-align:\s*(left|right)' --type=css

# RTL test coverage
find . -name '*.stories.tsx' -type f -exec rg -l 'dir="rtl"|direction:\s*rtl' {} + 2>/dev/null || echo "NO RTL STORIES"
```

**False-positive guards:**
- Skip directional icons that must not flip (external-link, Latin-only brand marks); wrap with `dir="ltr"` if needed.
- Skip projects explicitly scoped to LTR-only locales (verify via i18n config).
- Skip files with `// ui-audit-ignore:dark-i18n-rtl-untested` near the match.

## Fix

Two-step: replace physical with logical properties, and add a `dir="rtl"` Storybook story (or Playwright fixture) to catch regressions.

```tsx
// before: physical, breaks in RTL
<div className="flex items-center pl-4 pr-2">
  <Icon className="mr-2" />
  <span className="text-left">{label}</span>
  <button className="ml-auto">
    <ChevronRightIcon />
  </button>
</div>

// after: logical, flips automatically
<div className="flex items-center ps-4 pe-2">
  <Icon className="me-2" />
  <span className="text-start">{label}</span>
  <button className="ms-auto">
    <ChevronRightIcon className="rtl:rotate-180" />
  </button>
</div>
```

### Which icons flip

Logical properties move an icon to the correct side; they do not decide whether the glyph itself should mirror. That is a per-icon judgement, and flipping everything is as wrong as flipping nothing.

| Flip under `dir="rtl"` | Leave alone |
| --- | --- |
| Back and forward arrows, navigation chevrons | Logos and brand marks |
| Text-block glyphs: alignment, lists, indent | Checkmarks |
| Send-style directional glyphs | Physical objects: clocks, cups, pencils |
| Speaker and volume waves, which emanate in reading direction | Media playback, where play and rewind follow tape-direction convention and stay LTR |

Judge composite icons part by part: a badge, slash, or count overlay can hold its corner while the base glyph mirrors. Apply the flip with `rtl:-scale-x-100` or `rtl:rotate-180` on the icon itself, not on its container.

For raw CSS, prefer the logical names:

```css
/* before */
.card { margin-left: 1rem; padding-right: 0.5rem; text-align: left; }

/* after */
.card {
  margin-inline-start: 1rem;
  padding-inline-end: 0.5rem;
  text-align: start;
}
```

Add an RTL story so the regression gets caught:

```tsx
// Component.stories.tsx
export const RTL: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div dir="rtl" lang="ar">
        <Story />
      </div>
    ),
  ],
};
```

For directional icons (chevrons, arrows), use Tailwind's `rtl:` variant or a `ChevronInline` component that flips by direction:

```tsx
<ChevronRightIcon className="rtl:rotate-180" />
// or
<ArrowForwardIcon /> // component reads dir from context
```

Reference docs:
- MDN CSS logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values
- Tailwind logical-property utilities (`ps-*`, `pe-*`, `ms-*`, `me-*`): https://tailwindcss.com/docs/padding
- W3C RTL guide: https://www.w3.org/International/articles/inline-bidi-markup/

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | fix-this-sprint (when targeting MENA / IL markets) |
| Checkout | fix-this-sprint (when targeting MENA / IL markets) |
| Marketing landing | backlog |
| Internal admin | backlog |
| Any locale-aware product | fix-this-sprint |

## Defer-to (when this is another tool's job)

- **Chromatic** with an `RTL` story captures the visual flip.
- **Playwright** with `dir="rtl"` page fixture verifies layout end-to-end.
- **stylelint-use-logical** lints CSS source for physical-property usage at write time: https://github.com/csstools/stylelint-use-logical

## Suppression

```tsx
{/* ui-audit-ignore:dark-i18n-rtl-untested, directional brand icon, must not flip */}
<ExternalLinkIcon className="ml-1" />
```
