---
title: Dates, numbers, and currency hardcoded to one locale
slug: dark-i18n-locale-formatting
category: dark-i18n
defaultTier: backlog
surfaces: dashboard, checkout, list, form, settings
react-apis: n/a (Intl APIs)
related: dark-i18n-plural-rules, dark-i18n-string-overflow
---

## Dates, numbers, and currency hardcoded to one locale

UI that hand-formats dates as `MM/DD/YYYY`, joins thousands with a literal `,`, or prefixes a `$` assumes one locale and reads as wrong-or-broken everywhere else. `06/01/2026` is June 1 to a US reader and 6 January to most of Europe; `1,000` is one thousand in en-US and one in de-DE (where it means 1.0). The platform ships correct, locale-aware formatting through the `Intl` APIs — `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`. The fix is to format through `Intl` with the active locale, and to use the *same* locale data on the server and client so SSR output matches hydration.

## What goes wrong

A dashboard renders `new Date(order.createdAt).toLocaleDateString()` with no locale argument, so it silently picks up the server's locale (often en-US) regardless of the user. A price is built as `` `$${(cents / 100).toFixed(2)}` `` — wrong symbol, wrong decimal separator, wrong symbol placement for every non-US currency and locale. A "2 days ago" label is computed with a hand-rolled `if (days === 1) 'yesterday'` ladder that never translates. Worse, server-rendered `toLocaleString()` (server locale) and client re-render (browser locale) disagree, producing a React hydration mismatch warning and a flash of changed text. The observable result: a German user sees `$1,000.5` where they expect `1.000,50 €`; a UK user reads `12/6/2026` as December 6.

## Detection

**Surfaces:** any UI rendering dates, times, numbers, currency, percentages, or relative time — dashboards, order summaries, tables, settings.

**Static signals:**
1. Grep for `toLocaleDateString(` / `toLocaleString(` / `toLocaleTimeString(` called with **no locale argument** — these inherit the runtime locale and differ between server and client.
2. Grep for hand-built currency: a `$`, `€`, or `£` literal adjacent to a template expression, or `.toFixed(2)` used to render money.
3. Grep for manual date assembly: `getMonth()`, `getDate()`, `getFullYear()` joined with `/` or `-`.
4. Grep for hand-rolled relative time (`'days ago'`, `'yesterday'`) instead of `Intl.RelativeTimeFormat`.
5. Confirm the project is multi-locale (locale routing, `next-intl`, `react-i18next`, `lingui`). If single-locale, lower confidence to `unknown`.

**Concrete commands:**
```bash
# Locale-less toLocale* calls (inherit runtime locale, risk hydration mismatch)
rg -n 'toLocale(Date|Time)?String\(\s*\)' --type=tsx

# Hand-built currency
rg -n '[$€£]\$\{|toFixed\(2\)' --type=tsx

# Manual date assembly
rg -n 'getMonth\(\)|getDate\(\)|getFullYear\(\)' --type=tsx
```

**False-positive guards:**
- Skip non-display numerics (IDs, array indices, pixel math, sort keys).
- Skip if the project is explicitly single-locale with no locale routing or i18n library.
- Skip files with `// ux-audit-ignore:dark-i18n-locale-formatting` near the match.

## Fix

Format through `Intl` with an explicit locale. Cache the formatter (constructing one per render is measurably slow on large lists). Pass the same resolved locale on the server and client so SSR and hydration agree.

```tsx
// before — server locale leaks in, currency hand-built, hydration mismatch risk
<td>{new Date(order.createdAt).toLocaleDateString()}</td>
<td>{`$${(order.cents / 100).toFixed(2)}`}</td>

// after — explicit locale + currency, consistent on server and client
const dateFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
const moneyFmt = new Intl.NumberFormat(locale, { style: "currency", currency: order.currency });

<td>{dateFmt.format(new Date(order.createdAt))}</td>
<td>{moneyFmt.format(order.cents / 100)}</td>
```

```tsx
// before — relative time never translates
<span>{daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`}</span>

// after — Intl.RelativeTimeFormat localizes "yesterday" / "vor 2 Tagen"
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
<span>{rtf.format(-daysAgo, "day")}</span>
```

Reference docs:
- `Intl.DateTimeFormat`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- `Intl.NumberFormat`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
- `Intl.RelativeTimeFormat`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
- React hydration mismatch: https://react.dev/link/hydration-mismatch

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout | fix-this-sprint (wrong currency erodes trust) |
| Billing / invoices | fix-this-sprint |
| Dashboard / analytics | backlog |
| Marketing landing | backlog |
| Internal admin | backlog (often single-locale) |

## Examples

**Anti-pattern (fails):**

```tsx
export function Price({ cents }: { cents: number }) {
  return <span>${(cents / 100).toFixed(2)}</span>;
}
```

**Applied (passes):**

```tsx
export function Price({ cents, currency, locale }: PriceProps) {
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
  return <span>{fmt.format(cents / 100)}</span>;
}
```

## Defer-to (when this is another tool's job)

- **ESLint** — `@typescript-eslint` cannot catch this; a custom rule or `eslint-plugin-i18n` lint pass can flag locale-less `toLocale*`.
- **Chromatic / Playwright** with a non-US locale fixture surfaces the visual difference.

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-locale-formatting — single-locale internal tool */}
<span>{date.toLocaleDateString()}</span>
```
