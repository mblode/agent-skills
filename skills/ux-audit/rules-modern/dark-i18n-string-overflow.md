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

UI built around English strings breaks when localized: German runs about 30 % longer on average (and 40 % at the long end), Finnish compounds words, Russian and French expand by 15-20 %. Common bugs: hardcoded `width` on a text container clips the translated string; a `truncate` cell collapses to ellipsis at the first character because its parent flex/grid item lacks `min-width: 0`; tight grid columns in a checkout summary push the price column off-screen. The fix is layout that flexes with content: logical sizing, `min-width: 0` resets on flex/grid children, container queries, and judicious `text-balance` / `text-wrap: pretty`.

## What goes wrong

A button reads "Submit" (6 chars) in English and renders fine at `w-24`. In German it becomes "Absenden" (8 chars), still fine. In Finnish: "Lähetä", also fine. But the password-reset button "Send reset link" (15 chars) becomes "Link zum Zurücksetzen senden" (28 chars) and overflows the fixed-width button, clipping the text. A flex row with `flex items-center gap-2` containing `<span className="truncate">{username}</span>` collapses entirely to "..." because the parent didn't get `min-w-0`.

## Detection

**Surfaces:** any UI containing user-visible text, especially buttons, table cells, list rows, navigation, form labels.

**Static signals:**
1. Grep for hardcoded widths on text containers: `w-\d+`, `width: \d+px`, `max-w-\d+` paired with text content.
2. Grep for `truncate` / `text-ellipsis` and walk up to the parent: if the parent is `flex` or `grid` and lacks `min-w-0`, flag it.
3. Grep for tight `grid-cols-` definitions in summary tables (e.g. `grid-cols-[1fr_80px_60px]`) and confirm columns hold copy.
4. Confirm that the project uses i18n (`next-intl`, `react-i18next`, `lingui`): if not, lower confidence (still flag but as `unknown`).
5. Optional: simulate +30 % length and re-Read for visible overflow.

**Concrete commands:**
```bash
# Truncate without min-w-0 on parent
rg -n 'truncate|text-ellipsis' --type=tsx -B 2 \
  | rg -B 2 'flex|grid' \
  | rg -v 'min-w-0|min-width:\s*0'

# Hardcoded button widths on text buttons
rg -n '<button[^>]*className="[^"]*\bw-\d{1,3}\b' --type=tsx

# Tight pixel grid columns
rg -n 'grid-cols-\[[^\]]*\d+px' --type=tsx
```

**False-positive guards:**
- Skip icon-only buttons with explicit `aria-label` and no text content.
- Skip if the project has a single-language scope (no `i18n` config, no locale routing).
- Skip files with `// ux-audit-ignore:dark-i18n-string-overflow` near the match.

## Fix

Three patterns: drop fixed widths on text controls, reset `min-width` on flex/grid children that truncate, prefer container queries over fixed breakpoints for text-dense components.

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

```tsx
// before: fixed breakpoint, ignores parent context
<section className="md:grid md:grid-cols-2">

// after: container query, adapts to allotted space
<section className="@container">
  <div className="grid @md:grid-cols-2 gap-4">
```

For multi-line copy, modern CSS helpers improve word-wrapping in long languages:

```css
h1 { text-wrap: balance; }
p  { text-wrap: pretty; overflow-wrap: anywhere; }
```

Reference docs:
- W3C i18n string-length guidance: https://www.w3.org/International/articles/article-text-size
- MDN `min-width`: https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
- Tailwind container queries: https://tailwindcss.com/docs/responsive-design#container-queries
- `text-wrap: pretty`: https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap

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

## Examples

**Anti-pattern (fails):**

```tsx
<div className="grid grid-cols-[200px_1fr]">
  <span className="truncate">{label}</span>
  <span>{value}</span>
</div>
```

**Applied (passes):**

```tsx
<div className="grid grid-cols-[minmax(0,200px)_1fr] gap-3">
  <span className="truncate min-w-0">{label}</span>
  <span className="min-w-0">{value}</span>
</div>
```

## Defer-to (when this is another tool's job)

- **Chromatic** with a German locale story captures the visual overflow.
- **Playwright** screenshot diff at long-string fixtures.
- **Pseudo-localization** (e.g. `pseudoloc`) runtime-pads strings to surface overflow during dev.

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-string-overflow, single-language internal admin */}
<button className="w-32">{t('action')}</button>
```
