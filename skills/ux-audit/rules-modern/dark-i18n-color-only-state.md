---
title: State communicated by color alone (red error, green success, yellow warn)
slug: dark-i18n-color-only-state
category: dark-i18n
defaultTier: fix-this-sprint
surfaces: form, sign-in, checkout, toast, dashboard, list
react-apis: n/a (HTML semantics + CSS)
related: states-no-error-state, dark-i18n-untested, microcopy-vague-error
---

## State communicated by color alone (red error, green success, yellow warn)

Around 8 % of men and 0.5 % of women have a form of color-vision deficiency; many users also browse with high-contrast OS modes, dark modes, or low-saturation displays where red and green converge. WCAG 1.4.1 (Use of Color) requires that information conveyed by color also be conveyed by another visual means — text, icon, pattern, or position. The common failure: an input shows `aria-invalid="true"` with a red border, but no error icon, no helper-text association, and no `aria-describedby`. Sighted color-blind users can't tell something is wrong; screen-reader users can — but only because of the ARIA attribute, not the visual.

## What goes wrong

A form input renders `<input className="border-red-500" />` on validation failure. To a deuteranope the red border looks identical to the gray default border. The submit button stays enabled. The user can't tell why submission failed. The same pattern hides success ("now in green!") and warnings ("now in yellow!") on dashboards.

## Detection

**Surfaces:** form fields, toasts/banners, status badges, list-item state pills, dashboard KPIs.

**Static signals:**
1. Grep for input/element states styled only by color: `border-red-`, `bg-red-`, `text-red-`, `border-green-`, `text-green-`, `bg-yellow-`, `border-yellow-`.
2. For each match, confirm a paired non-color signal exists in the same JSX:
   - An icon (`<AlertCircle>`, `<CheckCircle>`, `<XCircle>`)
   - Helper text (and `aria-describedby` linking to it)
   - A textual prefix ("Error:", "Success:", "Warning:")
3. Specifically for inputs, confirm both `aria-invalid="true"` **and** `aria-describedby={errorId}` exist when the red border appears.

**Concrete commands:**
```bash
# Color-only state on inputs
rg -n 'aria-invalid' --type=tsx -A 5 | rg -B 1 'border-red|bg-red|text-red'

# Status badges with color but no icon
rg -n '(bg-(red|green|yellow|amber|emerald|rose)-\d{2,3})' --type=tsx -A 2 \
  | rg -v '<(Icon|Alert|Check|X|Warning|Info)'

# aria-describedby coverage
rg -n 'aria-invalid="?true' --type=tsx | rg -v 'aria-describedby'
```

**False-positive guards:**
- Skip purely decorative tags (a `bg-red-100` highlight on a non-status element).
- Skip if the icon is rendered conditionally elsewhere in the same component.
- Skip files with `// ux-audit-ignore:dark-i18n-color-only-state` near the match.

## Fix

Pair color with an icon **and** with text, and wire `aria-describedby` for screen readers.

```tsx
// before — color-only state
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    aria-invalid={!!error}
    className={cn(
      'border rounded px-3 py-2',
      error && 'border-red-500'
    )}
  />
</div>

// after — color + icon + text + aria-describedby
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
    className={cn(
      'border rounded px-3 py-2',
      error && 'border-destructive'
    )}
  />
  {error && (
    <p
      id="email-error"
      role="alert"
      className="mt-1 flex items-center gap-1 text-sm text-destructive"
    >
      <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
      <span>{error}</span>
    </p>
  )}
</div>
```

For status badges:

```tsx
// before — color-only
<span className="bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>

// after — color + icon + accessible label
<span className="inline-flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded">
  <CheckCircleIcon className="h-3 w-3" aria-hidden="true" />
  <span>Active</span>
</span>
```

Reference docs:
- WCAG 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- WAI-ARIA `aria-describedby`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
- Color-blindness simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | release-blocker (auth errors must be perceivable) |
| Checkout | release-blocker (payment validation must be perceivable) |
| Form | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
<input
  aria-invalid={hasError}
  className={cn('border', hasError && 'border-red-500')}
/>
```

**Applied (passes):**

```tsx
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? 'field-error' : undefined}
  className={cn('border', hasError && 'border-destructive')}
/>
{hasError && (
  <p id="field-error" role="alert" className="flex items-center gap-1 text-destructive">
    <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
    {errorMessage}
  </p>
)}
```

## Defer-to (when this is another tool's job)

- **axe-core** flags some color-only patterns under WCAG 1.4.1 — link, don't restate: https://dequeuniversity.com/rules/axe/4.10/color-contrast
- **Storybook a11y addon** runs axe per story.
- **eslint-plugin-jsx-a11y** catches missing labels but not color-only state.

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-color-only-state — purely cosmetic accent, not a state */}
<div className="bg-red-50" />
```
