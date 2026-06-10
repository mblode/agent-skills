---
title: Language switcher uses flags or untranslated labels
slug: dark-i18n-language-switcher
category: dark-i18n
defaultTier: backlog
surfaces: settings, navigation, footer, onboarding
react-apis: n/a (HTML lang attribute)
related: dark-i18n-locale-formatting, dark-i18n-rtl-untested
---

## Language switcher uses flags or untranslated labels

A language switcher that labels options with flag emoji, or with names written in the *current* UI language, fails the users it exists for. Flags are countries, not languages: 🇺🇸 doesn't mean English (spoken across dozens of countries), 🇧🇷 vs 🇵🇹 splits one language, and Arabic, Spanish, or French map to no single flag. A user whose language isn't the active one can't read "German / French / Spanish" rendered in English: the one list they need to understand is the one written in a language they don't speak. The fix: list each locale **endonymously** (in its own language: "Deutsch", "日本語", "العربية") and tag each option with the correct `lang` attribute so screen readers pronounce it.

## What goes wrong

A footer switcher renders `🇩🇪 German`, `🇫🇷 French`, `🇸🇦 Arabic`. A Brazilian user looking for Portuguese sees only 🇵🇹 and assumes it's unavailable. A screen-reader user on the English UI hits the `<option>` "Deutsch" with no `lang="de"`, so the English voice reads it as "Doytsch"-gibberish. The selected language also isn't reflected on `<html lang>`, so the whole page is announced with the wrong pronunciation engine.

## Detection

**Surfaces:** locale switchers in headers, footers, settings, onboarding.

**Static signals:**
1. Grep for flag emoji near locale options (`🇺🇸`, `🇩🇪`, `🇫🇷`, …) in switcher components.
2. Find the switcher (a `<select>` or menu mapping over a `locales` array) and check whether option labels come from a hardcoded English map (`{ de: 'German' }`) vs endonyms (`{ de: 'Deutsch' }`).
3. Check each option/link for a `lang` attribute matching its locale.
4. Confirm `<html lang>` updates when the locale changes (look at the root layout / `generateMetadata`).

**Concrete commands:**
```bash
# Flag emoji in switcher components
rg -n '\p{Regional_Indicator}{2}' --type=tsx

# Locale option lists: inspect for English labels and missing lang
rg -n 'locales?\.map|languageNames|localeName' --type=tsx -A 3
```

**False-positive guards:**
- Skip flag use that is genuinely country selection (shipping country, phone country code), not language.
- Skip single-locale projects with no switcher.
- Skip files with `// ux-audit-ignore:dark-i18n-language-switcher` near the match.

## Fix

Label each locale in its own language and set `lang` on each option. Drop flags. Keep the current selection marked with `aria-current`.

```tsx
// before: flags + English labels, no lang
<select>
  <option value="en">🇺🇸 English</option>
  <option value="de">🇩🇪 German</option>
  <option value="ar">🇸🇦 Arabic</option>
</select>

// after: endonyms, lang per option, no flags
const LOCALES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

<ul>
  {LOCALES.map(({ code, label }) => (
    <li key={code}>
      <a href={`/${code}${path}`} lang={code} hrefLang={code}
         aria-current={code === active ? "true" : undefined}>
        {label}
      </a>
    </li>
  ))}
</ul>
```

Also ensure the active locale reaches `<html lang>` (e.g. `<html lang={locale}>` in the root layout) so the rest of the page is announced correctly.

Reference docs:
- MDN `lang`: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
- MDN `hreflang`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#hreflang
- W3C i18n articles index: https://www.w3.org/International/articlelist

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Onboarding / first-run locale pick | fix-this-sprint (blocks comprehension) |
| Global header / footer switcher | fix-this-sprint |
| Settings | backlog |
| Marketing landing | backlog |
| Internal admin | backlog (often single-locale) |

## Examples

**Anti-pattern (fails):**

```tsx
<button>🇫🇷 French</button>
```

**Applied (passes):**

```tsx
<button lang="fr" hrefLang="fr">Français</button>
```

## Defer-to (when this is another tool's job)

- **axe** flags some missing-`lang` issues but not flag misuse or endonym labeling; those are review-time judgment calls.
- **Translation QA** confirms each endonym is spelled and scripted correctly.

## Suppression

```tsx
{/* ux-audit-ignore:dark-i18n-language-switcher, country selector, not language */}
<option value="us">🇺🇸 United States</option>
```
