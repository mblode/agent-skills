---
title: String overflow on long translations (German, Finnish, Russian)
slug: dark-i18n-string-overflow
category: dark-i18n
defaultTier: backlog
surfaces: form, sign-in, checkout, list, dashboard, modal
react-apis: n/a (CSS layout)
related: states-layout-shift, dark-i18n-rtl-untested
---

## String overflow on long translations (German, Finnish, Russian)

English-built UI breaks when localized: German runs ~30 % longer on average (40 % at the long end), Finnish compounds words, Russian and French expand 15-20 %. Common bugs: a hardcoded `width` clips the translation; a `truncate` cell collapses to an ellipsis at the first character because its parent flex/grid item lacks `min-width: 0`; tight grid columns in a checkout summary push the price column off-screen. Fix: layout that flexes with content (logical sizing, `min-width: 0` on flex/grid children, container queries, judicious `text-balance` / `text-wrap: pretty`).

## What goes wrong

A `w-24` button holding "Submit" (6 chars) survives "Absenden" (German, 8) and "Lähetä" (Finnish). But "Send reset link" (15 chars) becomes "Link zum Zurücksetzen senden" (28) and overflows the fixed-width button, clipping text. A `flex items-center gap-2` row with `<span className="truncate">{username}</span>` collapses to "..." because the parent lacks `min-w-0`.

## Detection

**Surfaces:** any UI containing user-visible text, especially buttons, table cells, list rows, navigation, form labels.

**Static signals:**
1. Hardcoded widths on text containers: `w-\d+`, `width: \d+px`, `max-w-\d+` paired with text.
2. `truncate` / `text-ellipsis`: walk up; if the parent is `flex` or `grid` and lacks `min-w-0`, flag it.
3. Tight `grid-cols-` in summary tables (e.g. `grid-cols-[1fr_80px_60px]`) where columns hold copy.
4. Confirm i18n (`next-intl`, `react-i18next`, `lingui`); if absent, flag as `unknown`.
5. Optional: simulate +30 % length and re-Read for overflow.

**Concrete commands:**
```bash
# Truncate without min-w-0 on parent
rg -n 'truncate|text-ellipsis' --type=ts -B 2 \
  | rg -B 2 'flex|grid' \
  | rg -v 'min-w-0|min-width:\s*0'

# Hardcoded button widths on text buttons
rg -n '<button[^>]*className="[^"]*\bw-\d{1,3}\b' --type=ts

# Tight pixel grid columns
rg -n 'grid-cols-\[[^\]]*\d+px' --type=ts
```

**False-positive guards:**
- Skip icon-only buttons with explicit `aria-label` and no text content.
- Skip if the project has a single-language scope (no `i18n` config, no locale routing).
- Skip files with `// ui-audit-ignore:dark-i18n-string-overflow` near the match.

## Fix

Three patterns: drop fixed widths on text controls; reset `min-width` on truncating flex/grid children; prefer container queries over fixed breakpoints for text-dense components.

```tsx
// before: fixed width clips German
<button className="w-32 h-10 rounded bg-primary text-primary-foreground">
  {t('password.reset.send')}
</button>

// after: width hugs content, max-width prevents runaway
<button className="px-4 h-10 max-w-full rounded bg-primary text-primary-foreground">
  {t('password.reset.send')}
</button>
```

```tsx
// before: truncate collapses to "..." in flex
<div className="flex items-center gap-2">
  <Avatar />
  <span className="truncate">{user.fullName}</span>
  <Badge>{user.role}</Badge>
</div>

// after: min-w-0 lets the truncating child shrink correctly
<div className="flex items-center gap-2 min-w-0">
  <Avatar />
  <span className="truncate min-w-0 flex-1">{user.fullName}</span>
  <Badge className="shrink-0">{user.role}</Badge>
</div>
```

In grid, the equivalent is the track, not the child: `grid-cols-[minmax(0,200px)_1fr]` instead of `grid-cols-[200px_1fr]`, so a long label shrinks its column rather than overflowing it.

```tsx
// before: fixed breakpoint, ignores parent context
<section className="md:grid md:grid-cols-2">

// after: container query, adapts to allotted space
<section className="@container">
  <div className="grid @md:grid-cols-2 gap-4">
```

For multi-line copy, modern CSS improves wrapping in long languages:

```css
h1 { text-wrap: balance; }
p  { text-wrap: pretty; overflow-wrap: anywhere; }
```

Reference docs:
- W3C i18n string-length guidance: https://www.w3.org/International/articles/article-text-size
- MDN `min-width`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/min-width
- Tailwind container queries: https://tailwindcss.com/docs/responsive-design#container-queries
- `text-wrap: pretty`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | fix-this-sprint (CTAs clip in German) |
| Checkout | fix-this-sprint (price + label rows) |
| Form | fix-this-sprint |
| Marketing landing | backlog |
| Internal admin | backlog (often English-only) |

## Defer-to (when this is another tool's job)

- **Chromatic** with a German locale story captures the overflow.
- **Playwright** screenshot diff at long-string fixtures.
- **Pseudo-localization** (e.g. `pseudoloc`) runtime-pads strings to surface overflow in dev.

## Suppression

```tsx
{/* ui-audit-ignore:dark-i18n-string-overflow, single-language internal admin */}
<button className="w-32">{t('action')}</button>
```
