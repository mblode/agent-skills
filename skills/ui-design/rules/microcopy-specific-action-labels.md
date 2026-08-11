---
title: Use Specific Action Labels
id: microcopy-specific-action-labels
category: microcopy
defaultTier: backlog
detect: static
---

## Use Specific Action Labels

Action text should state outcome, not generic intent. A generic label makes users hesitate before committing, or commit to the wrong thing.

## Detection

Find buttons whose entire label is a generic verb, with no object naming what the click does.

```bash
rg -nUP '(?s)<[Bb]utton\b[^>]*>\s*(Continue|Submit|OK|Confirm|Yes|Done|Go)\s*<' -g '*.tsx' -g '*.jsx' src/
```

Localized labels come from a key (`{t('checkout.continue')}`) and never match, so run the same word list over the locale files. A "Continue" inside a wizard whose step heading already names the outcome is a weaker finding than a bare "Submit" on a destructive dialog; read the surrounding heading before reporting.

**Incorrect (vague):**

```tsx
<button>Continue</button>
```

**Correct (specific):**

```tsx
<button>Save API key</button>
```
