---
title: Hardcoded English pluralization (item / items)
slug: dark-i18n-plural-rules
category: dark-i18n
defaultTier: backlog
surfaces: list, dashboard, cart, notifications, form
react-apis: n/a (Intl.PluralRules)
related: dark-i18n-locale-formatting, microcopy-vague-error
---

## Hardcoded English pluralization (item / items)

`count === 1 ? 'item' : 'items'` bakes English's two-form plural into the UI. Most languages differ: Russian and Polish have forms for 1, 2-4, and 5+; Arabic has six (zero, one, two, few, many, other); Japanese and Chinese have one. The ternary produces wrong grammar there, and the English literals never translate. `Intl.PluralRules` exposes CLDR plural categories: feed the category into a per-locale message map, or use your i18n library's ICU `{count, plural, ...}` syntax.

## Contents

- What goes wrong
- Detection
- Fix
- Default tier and overrides
- Examples
- Defer-to
- Suppression

## What goes wrong

A badge renders `${n} ${n === 1 ? 'message' : 'messages'}`. Fine in English. In Russian, "5 messages" should be "5 сообщений", but two slots can't express the few/many distinction, so the result is "5 сообщение" (singular grammar on a plural count), which reads as broken to a native speaker. Inline literals also make a Polish or Arabic translation impossible without code changes.

## Detection

**Surfaces:** counts in lists, carts, badges, notifications, search results, pagination ("3 results"), time ("2 minutes").

**Static signals:**
1. Grep two-form ternaries keyed on a count: `=== 1 ?` / `> 1 ?` / `!== 1 ?` returning two string literals.
2. Grep naive suffixing: a template appending `'s'` conditionally, e.g. `` `${n} item${n === 1 ? '' : 's'}` ``.
3. Confirm the project is multi-locale (locale routing or an i18n library). If single-locale English, lower confidence to `unknown`.
4. If an i18n library is present, check whether messages use ICU `plural` syntax; absence next to a count is the smell.

**Concrete commands:**
```bash
# Two-form count ternaries
rg -n '(===|!==|>)\s*1\s*\?' --type=ts | rg "'[A-Za-z]+'\s*:\s*'[A-Za-z]+'"

# Conditional 's' suffix
rg -n "item\$\{|\$\{[^}]+\}s\b|\? '' : 's'" --type=ts
```

**False-positive guards:**
- Skip non-grammatical conditionals (singular/plural icon choices, boolean toggles).
- Skip single-locale projects with no i18n config.
- Skip files with `// ui-audit-ignore:dark-i18n-plural-rules` near the match.

## Fix

Resolve the CLDR category with `Intl.PluralRules` and look up the message per category, or delegate to your i18n library's ICU plural format.

```tsx
// before: two English forms baked in
<span>{count} {count === 1 ? "item" : "items"}</span>

// after: CLDR category drives a per-locale message map
const pr = new Intl.PluralRules(locale);
const forms: Record<string, Record<Intl.LDMLPluralRule, string>> = {
  en: { one: "item", other: "items", zero: "items", two: "items", few: "items", many: "items" },
  ru: { one: "товар", few: "товара", many: "товаров", other: "товара", zero: "товаров", two: "товара" },
};
const word = forms[locale][pr.select(count)];
<span>{count} {word}</span>
```

```tsx
// preferred: let the i18n library do ICU plural selection
// messages: { "items": "{count, plural, one {# item} other {# items}}" }
<span>{t("items", { count })}</span>
```

Reference docs:
- `Intl.PluralRules`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
- CLDR plural rules: https://cldr.unicode.org/index/cldr-spec/plural-rules
- ICU MessageFormat plural: https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Cart / checkout | fix-this-sprint (item counts on a conversion path) |
| Notifications / inbox | fix-this-sprint |
| Dashboard / lists | backlog |
| Marketing landing | backlog |
| Internal admin | backlog (often English-only) |

## Examples

**Anti-pattern (fails):**

```tsx
export function ResultCount({ n }: { n: number }) {
  return <p>{n} result{n === 1 ? "" : "s"}</p>;
}
```

**Applied (passes):**

```tsx
export function ResultCount({ n }: { n: number }) {
  // messages: { "results": "{n, plural, one {# result} other {# results}}" }
  return <p>{t("results", { n })}</p>;
}
```

## Defer-to (when this is another tool's job)

- **i18n linters** (`eslint-plugin-formatjs`, `i18next` extractor) flag missing ICU plural syntax at write time.
- **Translation QA** (pseudo-localization, in-context editors) surfaces wrong grammar to native reviewers.

## Suppression

```tsx
{/* ui-audit-ignore:dark-i18n-plural-rules, English-only marketing copy */}
<span>{count === 1 ? "post" : "posts"}</span>
```
