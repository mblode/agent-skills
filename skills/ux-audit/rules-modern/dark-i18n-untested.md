---
title: Component lacks dark-mode coverage and hardcodes light tokens
slug: dark-i18n-untested
category: dark-i18n
defaultTier: backlog
surfaces: dashboard, list, modal, sign-in, checkout, marketing
react-apis: n/a (CSS variables / Tailwind tokens)
related: dark-i18n-color-only-state, states-layout-shift
---

## Component lacks dark-mode coverage and hardcodes light tokens

Hardcoded colors (`bg-white`, `text-black`, `#fff`, `text-gray-900`) ship a component that breaks in dark mode: white surfaces glow on a dark background, fixed grays lose contrast, borders disappear. Modern apps lean on CSS-variable tokens (`bg-background`, `text-foreground`) so the same JSX works in both themes. The companion bug is the absence of a Storybook dark-mode story or Chromatic dark snapshot, so the regression ships unnoticed.

## What goes wrong

A new card component uses `bg-white border-gray-200 text-gray-900`. The product flips to dark mode and the card is now a white rectangle on a near-black canvas. There's no visual regression coverage because the component's only Storybook story renders in the default (light) theme.

## Detection

**Surfaces:** any UI surface, especially marketing components migrated into a dark-mode-aware product.

**Static signals:**
1. Grep for hardcoded color classes: `bg-white`, `bg-black`, `text-black`, `text-white`, `bg-gray-\d+`, `text-gray-\d+`, `border-gray-\d+`.
2. Grep for hardcoded hex/rgb in inline styles or CSS modules.
3. Confirm whether the component has a corresponding `*.stories.tsx` with a dark-themed story (or a Chromatic param `parameters: { backgrounds: { default: 'dark' } }`).
4. Confirm `dark:` variants exist on the offending classes.

**Concrete commands:**
```bash
# Hardcoded Tailwind tokens (likely missing dark variants)
rg -n 'className="[^"]*\b(bg-white|bg-black|text-black|text-white|bg-gray-\d{2,3}|text-gray-\d{2,3}|border-gray-\d{2,3})\b[^"]*"' --type=tsx \
  | rg -v 'dark:'

# Hardcoded hex
rg -n '#(fff|000|FFF|000000|FFFFFF)\b' --type=tsx --type=css

# Storybook dark coverage
fd -e stories.tsx | xargs rg -l 'dark|theme: ["\']dark'
```

**False-positive guards:**
- Skip if the component is in a marketing-only directory (`app/(marketing)`) where the brand explicitly forbids dark mode; verify by reading `tailwind.config.*` or design-tokens file.
- Skip illustrations, brand SVGs, and logos where fixed color is intentional.
- Skip files with `// ux-audit-ignore:dark-i18n-untested` near the match.

## Fix

Replace hardcoded tokens with semantic CSS variable tokens, and add a dark Storybook story.

```tsx
// before: light-only
<div className="bg-white border border-gray-200 text-gray-900 p-4 rounded-lg">
  <h3 className="text-gray-700">Title</h3>
  <p className="text-gray-500">Body</p>
</div>

// after: semantic tokens (shadcn / Blode UI convention)
<div className="bg-card border border-border text-card-foreground p-4 rounded-lg">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted-foreground">Body</p>
</div>
```

When a one-off color is genuinely needed, use `dark:` variants:

```tsx
<div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
```

Add a dark Storybook story:

```tsx
// Card.stories.tsx
export const Default: Story = { args: { /* … */ } };
export const Dark: Story = {
  ...Default,
  parameters: { backgrounds: { default: 'dark' }, themes: { themeOverride: 'dark' } },
};
```

For modern theming, prefer CSS color-mix to derive variants without a second token:

```css
.surface-subtle {
  background-color: color-mix(in oklch, var(--background) 92%, var(--foreground));
}
```

Reference docs:
- shadcn theming via CSS variables: https://ui.shadcn.com/docs/theming
- Tailwind dark mode strategies: https://tailwindcss.com/docs/dark-mode
- MDN `color-mix()`: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | fix-this-sprint (high-traffic surface) |
| Checkout | fix-this-sprint |
| Dashboard | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
export function Alert({ children }) {
  return (
    <div className="bg-white border border-gray-200 text-gray-900 shadow">
      {children}
    </div>
  );
}
```

**Applied (passes):**

```tsx
export function Alert({ children }) {
  return (
    <div className="bg-card border border-border text-card-foreground shadow-sm">
      {children}
    </div>
  );
}
```

## Defer-to (when this is another tool's job)

- **Chromatic** captures the actual dark-mode regression: https://www.chromatic.com/docs/themes/
- **Storybook a11y addon** flags low-contrast pairs after the dark switch.
- **axe-core** flags contrast violations at runtime.

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-untested, brand mark, fixed color by design */}
<svg fill="#FF6F00" />
```
