---
title: Component lacks dark-mode coverage and hardcodes light tokens
id: dark-i18n-untested
category: dark-i18n
defaultTier: backlog
detect: static
related: states-layout-shift
---

## Component lacks dark-mode coverage and hardcodes light tokens

Hardcoded colors (`bg-white`, `text-black`, `#fff`, `text-gray-900`) break in dark mode: white surfaces glow on a dark background, fixed grays lose contrast, borders disappear. CSS-variable tokens (`bg-background`, `text-foreground`) make the same JSX work in both themes. The companion bug: no Storybook dark story or Chromatic dark snapshot, so the regression ships unnoticed.

## What goes wrong

A card uses `bg-white border-gray-200 text-gray-900`. In dark mode it's a white rectangle on a near-black canvas, and nothing catches it because the component's only Storybook story renders the default (light) theme.

## Detection

**Surfaces:** any UI surface, especially marketing components migrated into a dark-mode-aware product.

**Static signals:**
1. Grep for hardcoded color classes: `bg-white`, `bg-black`, `text-black`, `text-white`, `bg-gray-\d+`, `text-gray-\d+`, `border-gray-\d+`.
2. Grep for hardcoded hex/rgb in inline styles or CSS modules.
3. Confirm a `*.stories.tsx` with a dark-themed story (or Chromatic param `parameters: { backgrounds: { default: 'dark' } }`).
4. Confirm `dark:` variants exist on the offending classes.

**Concrete commands:**
```bash
# Hardcoded Tailwind tokens (likely missing dark variants)
rg -n 'className="[^"]*\b(bg-white|bg-black|text-black|text-white|bg-gray-\d{2,3}|text-gray-\d{2,3}|border-gray-\d{2,3})\b[^"]*"' --type=ts \
  | rg -v 'dark:'

# Hardcoded hex
rg -n '#(fff|000|FFF|000000|FFFFFF)\b' --type=ts --type=css

# Storybook dark coverage
find . -name '*.stories.tsx' -type f -exec rg -l 'dark|theme: ["\']dark' {} + 2>/dev/null
```

**False-positive guards:**
- Skip marketing-only directories (`app/(marketing)`) where the brand forbids dark mode; verify via the CSS entry file's `@theme` and `@custom-variant dark` lines, or a legacy `tailwind.config.*`.
- Skip illustrations, brand SVGs, and logos where fixed color is intentional.
- Skip `// ui-audit-ignore:dark-i18n-untested` near the match.

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

For a genuine one-off, use `dark:` variants:

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

Or derive variants with `color-mix` (no second token):

```css
.surface-subtle {
  background-color: color-mix(in oklch, var(--background) 92%, var(--foreground));
}
```

Docs:
- shadcn theming via CSS variables: https://ui.shadcn.com/docs/theming
- Tailwind dark mode strategies: https://tailwindcss.com/docs/dark-mode
- MDN `color-mix()`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix

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

## Defer-to (when this is another tool's job)

- **Chromatic** captures the actual dark-mode regression: https://www.chromatic.com/docs/themes/
- **Storybook a11y addon** flags low-contrast pairs after the dark switch.
- **axe-core** flags contrast violations at runtime.

## Suppression

```tsx
{/* ui-audit-ignore:dark-i18n-untested, brand mark, fixed color by design */}
<svg fill="#FF6F00" />
```
