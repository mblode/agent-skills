---
title: Pair Grotesques with Transitional Serifs
impact: MEDIUM
tags: grotesque, neo-grotesque, transitional, slab, pairing
---

## Pair Grotesques with Transitional Serifs

Grotesques/gothics (Franklin Gothic, News Gothic, Trade Gothic) pair naturally with transitional serifs (Baskerville, Times, Georgia). Neo-grotesques (Helvetica, Univers, Akzidenz-Grotesk) pair well with slab serifs (Rockwell, Clarendon, Sentinel). Avoid pairing a rational neo-grotesque with a calligraphic old-style serif; their skeletons conflict.

**Incorrect (neo-grotesque + old-style serif, conflicting construction):**

```css
h1 { font-family: 'Helvetica Neue', sans-serif; } /* rational, static */
body { font-family: 'Garamond', serif; }          /* calligraphic, diagonal stress */
```

**Correct (grotesque + transitional, or neo-grotesque + slab):**

```css
/* Grotesque + transitional */
h1 { font-family: 'Franklin Gothic', sans-serif; }
body { font-family: 'Baskerville', serif; }

/* Neo-grotesque + slab */
h1 { font-family: 'Helvetica Neue', sans-serif; }
body { font-family: 'Sentinel', serif; }
```

Note: "grotesque," "grotesk," and "gothic" name the same sans-serif genre. Neo-grotesques are weaker for body text than humanist sans-serifs; slabs can carry body text when the goal is a sturdy, approachable feel.
