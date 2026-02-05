---
title: Do Not Adjust Spacing on Monospaced or Script Fonts
impact: MEDIUM-HIGH
tags: monospace, script, kerning, tracking, connected
---

## Do Not Adjust Spacing on Monospaced or Script Fonts

Monospaced fonts require uniform character widths \u2014 adjusting letter-spacing breaks their alignment purpose. Connected script fonts rely on precise glyph connections \u2014 adding or removing space breaks the joins between letters.

Keep spacing and kerning at the font's built-in metrics for both types.

**Incorrect (letterspacing a monospaced or script font):**

```css
code {
  font-family: 'Fira Code', monospace;
  letter-spacing: 0.05em; /* breaks column alignment */
}

.script-heading {
  font-family: 'Great Vibes', cursive;
  letter-spacing: 0.1em; /* breaks letter connections */
}
```

**Correct (use default spacing):**

```css
code {
  font-family: 'Fira Code', monospace;
  letter-spacing: normal;
}

.script-heading {
  font-family: 'Great Vibes', cursive;
  letter-spacing: normal;
}
```

Do not apply optical kerning to these font types either. Use metrics kerning only.
