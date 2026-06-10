---
title: Layout uses physical (left/right) instead of logical (start/end) properties
slug: dark-i18n-rtl-untested
category: dark-i18n
defaultTier: backlog
surfaces: form, sign-in, checkout, list, dashboard, modal, marketing
react-apis: n/a (CSS logical properties)
related: dark-i18n-string-overflow, dark-i18n-untested
---

## Layout uses physical (left/right) instead of logical (start/end) properties

Arabic, Hebrew, Persian, and Urdu read right-to-left. A layout written with physical properties (`margin-left`, `padding-right`, `text-align: left`, Tailwind `ml-2`, `pr-4`, `text-left`) does not flip when the document direction is `rtl`. Icons that should sit at the inline-start of a label end up on the wrong side; chevrons that point "forward" point backward; padding meant to clear an icon clears the wrong edge. CSS logical properties (`margin-inline-start`, `padding-inline-end`, `text-align: start`) and Tailwind v3+'s `ms-` / `me-` / `ps-` / `pe-` / `start-` / `end-` variants flip automatically with `dir="rtl"`. The bug is silent until someone tests with a Hebrew locale.

## What goes wrong

A list row renders an icon followed by text using `<Icon className="mr-2" />`. Switching the document to `dir="rtl"` keeps the icon on the left of the text instead of moving to the inline-start (right side in RTL). A back arrow `<ChevronLeft />` still points left even though "back" in Arabic is to the right. A modal close button positioned with `right-4 top-4` stays in the top-right corner instead of moving to the top-left (the inline-end corner in RTL).

## Detection

**Surfaces:** any layout, especially navigation, list rows with icons, form-field icon adornments, modal headers, breadcrumbs.

**Static signals:**
1. Grep for physical Tailwind classes that have logical equivalents:
   - Margins: `\bml-`, `\bmr-` → `ms-`, `me-`
   - Padding: `\bpl-`, `\bpr-` → `ps-`, `pe-`
   - Position: `\bleft-`, `\bright-` → `start-`, `end-`
   - Text align: `text-left`, `text-right` → `text-start`, `text-end`
   - Float / clear: `float-left`, `float-right` → `float-start`, `float-end`
   - Borders: `border-l`, `border-r` → `border-s`, `border-e`
2. Grep CSS files for `margin-left`, `padding-right`, `text-align: left|right`, `left: 0`, `right: 0` and confirm there's no logical-property equivalent.
3. Confirm whether any `dir="rtl"` test exists (Storybook story, Playwright fixture, manual layout doc).
4. Flag if (1) physical properties are used **and** (2) no RTL coverage exists.

**Concrete commands:**
```bash
# Tailwind physical → logical migrations
rg -n 'className="[^"]*\b(ml-|mr-|pl-|pr-|left-|right-|text-(left|right)|float-(left|right)|border-(l|r))\b' --type=tsx

# Physical CSS properties
rg -n '(margin|padding)-(left|right):|text-align:\s*(left|right)' --type=css

# RTL test coverage
fd -e stories.tsx | xargs rg -l 'dir="rtl"|direction:\s*rtl' || echo "NO RTL STORIES"
```

**False-positive guards:**
- Skip directional icons that should not flip (e.g. external-link icon, Latin-only branding marks). Wrap with `dir="ltr"` if needed.
- Skip when the project explicitly scopes itself to LTR-only locales; verify by reading i18n config.
- Skip files with `// ux-audit-ignore:dark-i18n-rtl-untested` near the match.

## Fix

Two-step: replace physical properties with logical, and add a `dir="rtl"` Storybook story (or Playwright fixture) so future regressions get caught.

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
- MDN CSS logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- Tailwind logical-property utilities (v3.3+): https://tailwindcss.com/blog/tailwindcss-v3-3#extended-color-palette-for-logical-properties
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

## Examples

**Anti-pattern (fails):**

```tsx
<header className="flex items-center pl-6 pr-4 text-left">
  <Logo className="mr-3" />
  <nav className="ml-auto">{links}</nav>
</header>
```

**Applied (passes):**

```tsx
<header className="flex items-center ps-6 pe-4 text-start">
  <Logo className="me-3" />
  <nav className="ms-auto">{links}</nav>
</header>
```

## Defer-to (when this is another tool's job)

- **Chromatic** with an `RTL` story captures the visual flip.
- **Playwright** with `dir="rtl"` page fixture verifies layout end-to-end.
- **stylelint-use-logical** lints CSS source for physical-property usage at write time: https://github.com/csstools/stylelint-use-logical

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-rtl-untested, directional brand icon, must not flip */}
<ExternalLinkIcon className="ml-1" />
```
