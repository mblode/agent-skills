---
title: Instrument Serif as the default display face
id: slop-trending-display-serif
category: slop
defaultTier: backlog
detect: static
related: slop-italic-accent-word, slop-mono-overuse
---

## Instrument Serif as the default display face

Instrument Serif headlines with tight negative tracking and one italic word ("Design that *feels* human") are the current house style of generated landing pages, the way purple gradients were before them. The face is not the problem; arriving at it without a decision is. Because so many generated pages share it, a visitor who has seen three of them reads the fourth as the same template, and the product's own tone (a bank, a dev tool, a children's app) is replaced by the trend's. Tightening the tracking further makes a condensed display cut collide at heading sizes.

## Detection

Find where the face is loaded, then the headings that use it with negative tracking.

```bash
rg -nP "Instrument_Serif\s*\(|Instrument\+Serif|font-family:\s*[\"']?Instrument Serif" -g '!node_modules' .
rg -nP "\btracking-(?:tight|tighter|\[-[\d.]+(?:em|px|rem)\])" -g '*.tsx' -g '*.jsx' src/
```

Confirmed when the font is loaded, the headings that use it carry negative tracking, and nothing in the brand or brief chose it.

## False positives

- **A brand that already uses Instrument Serif** in its logo, print, or existing site. Check `design-system.md` or the brand kit first.
- **One editorial accent** (a pull quote, a signature) is a choice; the tell is the face on every heading with the tracking pulled in.

## Fix

Pick the display face for the product's tone, using the project's type scale. If the serif stays, leave its tracking at the font's default: display cuts are already spaced for large sizes.

```tsx
// before
<h1 className={`${serif.className} text-7xl tracking-[-0.04em]`}>Design that <em>feels</em> human</h1>

// after
<h1 className="text-5xl font-semibold">Plan the week your team will actually ship</h1>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-trending-display-serif, Instrument Serif is the brand face */}
```
