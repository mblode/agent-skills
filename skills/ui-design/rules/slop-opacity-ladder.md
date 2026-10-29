---
title: A ladder of text opacities
id: slop-opacity-ladder
category: slop
defaultTier: backlog
detect: static
related: slop-near-duplicate-scale, slop-token-drift
---

## A ladder of text opacities

`text-white/40`, `/50`, `/55`, `/60`, `/70`, `/80` in one component: six text levels, each a few percent apart. Each step was picked by eye to make one line a little quieter than its neighbour, and together they tell the reader there are six levels of importance when there are two or three. Steps 5% apart are indistinguishable on most screens, the lowest ones fail contrast on a dark background, and the next person to add a line has no rule for which one to pick.

## Detection

Count distinct opacity steps on text colour per file. More than three is the finding.

```bash
rg -oP "\btext-[a-z]+(?:-[a-z]+)*(?:-\d{2,3})?/\d{1,3}\b" -g '*.tsx' -g '*.jsx' src/ \
  | awk -F: '{n=split($NF,a,"/"); print $1" "a[n]}' | sort -u \
  | awk '{c[$1]++} END{for(f in c) if(c[f]>3) print c[f], f}'
```

Then read the steps in context: confirmed when two adjacent steps style text of the same role.

## False positives

- **Data visualisation ramps** where each step encodes a value.
- **Disabled and placeholder states** that use one shared opacity each; they are states, not levels.

## Fix

Map every line to two or three named text levels from the theme (foreground, muted, subtle) and delete the in-between values.

```tsx
// before
<p className="text-white/80">Title</p>
<p className="text-white/60">Meta</p>
<p className="text-white/55">Path</p>
<p className="text-white/40">Time</p>

// after
<p className="text-foreground">Title</p>
<p className="text-muted-foreground">Meta, path, and time</p>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-opacity-ladder, steps encode heat-map values */}
```
