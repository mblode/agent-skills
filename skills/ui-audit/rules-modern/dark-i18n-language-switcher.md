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

A switcher that labels options with flag emoji, or with names in the *current* UI language, fails the users it exists for. Flags are countries, not languages: 🇺🇸 isn't English (spoken in dozens of countries), 🇧🇷 vs 🇵🇹 splits one language, and Arabic, Spanish, or French map to no single flag. A user whose language isn't active can't read "German / French / Spanish" in English: the one list they need is written in a language they don't speak. Fix: list each locale **endonymously** (in its own language: "Deutsch", "日本語", "العربية") and tag each option with the correct `lang` so screen readers pronounce it.

## What goes wrong

A footer renders `🇩🇪 German`, `🇫🇷 French`, `🇸🇦 Arabic`. A Brazilian seeking Portuguese sees only 🇵🇹 and assumes it's unavailable. A screen-reader user hits `<option>` "Deutsch" with no `lang="de"`, so the English voice mangles it. The selection also never reaches `<html lang>`, so the whole page is announced with the wrong pronunciation engine.

## Detection

**Surfaces:** locale switchers in headers, footers, settings, onboarding.

**Static signals:**
1. Grep for flag emoji near locale options (`🇺🇸`, `🇩🇪`, `🇫🇷`, …) in switcher components.
2. Find the switcher (`<select>` or menu mapping a `locales` array); check whether labels come from a hardcoded English map (`{ de: 'German' }`) vs endonyms (`{ de: 'Deutsch' }`).
3. Check each option/link for a `lang` matching its locale.
4. Confirm `<html lang>` updates on locale change (root layout / `generateMetadata`).

**Concrete commands:**
```bash
# Flag emoji in switcher components
rg -n '\p{Regional_Indicator}{2}' --type=ts

# Locale option lists: inspect for English labels and missing lang
rg -n 'locales?\.map|languageNames|localeName' --type=ts -A 3
```

**False-positive guards:**
- Skip genuine country selection (shipping country, phone country code), not language.
- Skip single-locale projects with no switcher.
- Skip `// ui-audit-ignore:dark-i18n-language-switcher` near the match.

## Fix

Label each locale in its own language, set `lang` on each option, drop flags, mark the current selection with `aria-current`.

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

Docs:
- MDN `lang`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang
- MDN `hreflang`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#hreflang
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

## Defer-to (when this is another tool's job)

- **axe** flags some missing-`lang` issues but not flag misuse or endonym labeling (review-time judgment calls).
- **Translation QA** confirms each endonym is spelled and scripted correctly.

## Suppression

```tsx
{/* ui-audit-ignore:dark-i18n-language-switcher, country selector, not language */}
<option value="us">🇺🇸 United States</option>
```
