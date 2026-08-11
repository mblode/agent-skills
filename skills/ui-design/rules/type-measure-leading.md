---
title: Keep Line Length and Leading in Range
id: type-measure-leading
category: type
defaultTier: fix-this-sprint
detect: rendered
---

## Keep Line Length and Leading in Range

Target roughly 45-75 characters per line with line-height around 1.45-1.6. Outside that range readers lose their place at the line return and reread.

This applies to **running body text**: paragraphs, prose containers, article and documentation body. It owns that number. Display headings and marketing heading groups have their own, deliberately tighter measures, set by `guidelines/heading-groups.md` (20ch at `text-7xl` up to 56ch at `text-base`); a 24ch headline is correct there and is not a violation of this rule. Leading is judged with the measure, not against a fixed band: a wide measure needs more, a narrow one needs less, so only flag leading when the pairing actually costs legibility.

## Detection

This rule needs a rendered measurement, not a grep. Characters per line follow from the resolved container width and the font's actual glyph advances, and neither is in the source: `max-width: 65ch` is not proof either, because `ch` is the advance of the zero glyph and a proportional face at 65ch commonly sets 70 to 80 characters.

Load the page at the target viewports (390px, 768px, 1440px). For each running-text block, measure one rendered line (`Range.getClientRects()` on the paragraph gives a rect per line) and divide its character count by the line count, then read `line-height` from `getComputedStyle`. Flag blocks outside roughly 45 to 75 characters, and judge the leading against the measure you observed rather than a fixed band. Skip display headings and heading groups, which have their own measures.

**Incorrect (long measure, cramped leading):**

```css
.article {
  max-width: none;
  line-height: 1.2;
}
```

**Correct (controlled measure):**

```css
.article {
  max-width: 65ch;
  line-height: 1.5;
}
```
