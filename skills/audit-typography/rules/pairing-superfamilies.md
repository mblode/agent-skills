---
title: Use Superfamilies for Easy Pairing
impact: MEDIUM
tags: superfamily, serif-sans, pairing, harmony
---

## Use Superfamilies for Easy Pairing

Superfamilies include serif and sans-serif variants designed to share the same underlying skeleton. They are guaranteed to pair harmoniously, removing guesswork.

**Popular superfamilies:**
- FF Tisa + FF Tisa Sans
- Calluna + Calluna Sans
- Freight Text + Freight Sans
- Adelle + Adelle Sans
- FF Meta + FF Meta Serif
- FF Scala + FF Scala Sans
- Fedra Serif + Fedra Sans
- Source Serif + Source Sans

**Incorrect (unrelated pair that clashes):**

```css
h1 { font-family: 'Bodoni', serif; }
body { font-family: 'Futura', sans-serif; }
/* High-contrast modern serif with geometric sans \u2014 risky */
```

**Correct (superfamily pair):**

```css
h1 { font-family: 'Source Serif Pro', serif; }
body { font-family: 'Source Sans Pro', sans-serif; }
/* Same design DNA, guaranteed harmony */
```

Most sans-serifs in superfamilies are humanist, since readable text serifs tend to be humanist designs requiring a humanist sans counterpart.
