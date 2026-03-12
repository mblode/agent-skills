---
title: Make Body Text Distinctive
impact: LOW-MEDIUM
tags: brand, body-text, identity, distinctive, default
---

## Make Body Text Distinctive

Go beyond default system fonts and generic web fonts. Your body text should be distinctive enough that a reader could identify your brand from a paragraph alone. Experiment with less common typefaces, consider custom fonts, and pair font choices with deliberate size, weight, and color decisions.

**Incorrect (generic, indistinguishable body text):**

```css
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  /* Looks like every other website */
}
```

**Correct (considered, distinctive body text):**

```css
body {
  font-family: 'Söhne', sans-serif;
  font-size: 18px;
  color: #1a1a2e;
  line-height: 1.55;
  font-feature-settings: "kern", "liga", "calt";
}
```

Add at least one distinctive typographic move per project \u2014 a unique typeface choice, unusual weight, or specific OpenType feature that gives the typography personality.
