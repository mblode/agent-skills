---
title: Tesler's Law
impact: HIGH
kind: programmatic
prefix: decision
tags: complexity, conservation, defaults, system-burden
related: decision-postels-law, decision-occams-razor, cognitive-cognitive-load
---

## Tesler's Law

The Law of Conservation of Complexity (Larry Tesler, ~1985): every workflow has an irreducible core of complexity. It cannot be deleted, only moved. Either the system absorbs it, or the user does.

Default to the system carrying it. A week of engineering that removes a confusing step is almost always cheaper than a million users each spending an extra minute. Smart defaults, inferred values, autocomplete, and error recovery shift complexity from user to system. Beware the inverse failure: stripping options to look "simple" while pushing the now-hidden decisions onto the user via support tickets.

## Check

**Surfaces:** form

**Procedure:**
1. Find form fields (`<input>`, `<select>`, `<Field>`).
2. For each, check if the value is derivable from the system: timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), locale (`navigator.language`), country (geolocation or IP), current date, currency from locale.
3. Check if the field is pre-filled or auto-detected (`defaultValue=`, `value=`, populated from a hook on mount).

**Concrete commands:**
```bash
rg 'name="(timezone|tz|locale|language|country|currency|date)"' src/
rg 'defaultValue=|Intl\.DateTimeFormat|navigator\.language' src/forms/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | 0 fields ask for system-derivable values manually |: |
| warn | 1 such field is unfilled | MEDIUM |
| fail | ≥ 2 such fields are unfilled | HIGH |

## Fix

**If fail:** Pre-fill each derivable field at mount and keep it editable. Use `Intl.DateTimeFormat().resolvedOptions().timeZone` for timezone, `navigator.language` for locale, an IP-geolocation API for country, `inferCurrencyFromLocale` for currency.

**If warn:** Add a `defaultValue` to the single offending field; the user can override but does not have to type.

## Examples

**Anti-pattern (form makes the user do the system's work):**

```tsx
<form>
  <label>Timezone (IANA format, e.g. America/Los_Angeles)
    <input name="tz" required />
  </label>
  <label>Currency (ISO 4217 code)
    <input name="currency" required />
  </label>
  <label>Locale (BCP 47)
    <input name="locale" required />
  </label>
  <button>Continue</button>
</form>
```

**Applied (system infers; user confirms or overrides):**

```tsx
<form>
  <Field label="Timezone">
    <Select defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}>
      {timezones.map((tz) => <option key={tz}>{tz}</option>)}
    </Select>
  </Field>
  <Field label="Currency">
    <Select defaultValue={inferCurrencyFromLocale(navigator.language)}>
      {currencies.map((c) => <option key={c.code}>{c.code}: {c.name}</option>)}
    </Select>
  </Field>
  <Field label="Language">
    <Select defaultValue={navigator.language} options={supportedLocales} />
  </Field>
  <button>Continue</button>
</form>
```

The complexity (timezone math, locale parsing, currency resolution) didn't disappear; engineering absorbed it.

Reference: https://lawsofux.com/teslers-law/
