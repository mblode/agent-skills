---
title: Arbitrary values drifting off the theme
id: slop-token-drift
category: slop
defaultTier: backlog
detect: static
related: slop-near-duplicate-scale
---

## Arbitrary values drifting off the theme

A theme exists so that sizes, colours, and radii repeat across a product and the eye reads them as one system. When a file reaches for five or six one-off bracket values, the surface stops agreeing with the rest of the app: headings land at sizes no other heading uses, a card corner is 3px rounder than every neighbouring card, a blue appears that is close to the brand blue but not it. Users do not name this, they just find the product harder to scan and slightly untrustworthy, the way a page of mixed fonts feels off before you work out why. It is also the single clearest fingerprint of a generated component pasted in next to hand-built ones.

Density is the signal, not any one value. One arbitrary value with a reason is craft. Six in a 90-line file is a component built without ever opening the theme.

## Detection

**Precondition:** a theme must exist. If neither an `@theme` block nor a `tailwind.config.*` is present, there is no scale to drift from: report **result unknown** and stop.

```bash
# 0. Precondition
rg -l '@theme' --glob '*.css' . ; ls tailwind.config.* 2>/dev/null
```

Count **distinct** arbitrary values per file (a token repeated ten times is one decision, not ten):

```bash
rg -l 'className' -g '*.tsx' -g '*.jsx' \
   -g '!*.stories.tsx' -g '!*.test.tsx' -g '!*.spec.tsx' \
   -g '!**/node_modules/**' -g '!**/vendor/**' -g '!**/.next/**' src/ \
| while read -r f; do
    n=$(rg -oP '\b[a-z][a-z0-9-]*-\[[^\]]+\](?!:)' "$f" \
        | rg -v 'ch\]|max\(|min\(|clamp\(|calc\(|round\(|var\(|--' \
        | rg -vP '\[-?([01](\.\d+)?|2(\.0+)?)px\]' \
        | sort -u | wc -l)
    [ "$n" -ge 3 ] && echo "$n  $f"
  done | sort -rn
```

Arbitrary colour literals count toward the same total:

```bash
rg -nP '\b(bg|text|border|ring|fill|stroke|shadow|from|via|to)-\[#[0-9a-fA-F]{3,8}\]' -g '*.tsx' src/
```

**Thresholds:** 5 or more distinct arbitrary values in one file fails. 3 to 4 warns. Report every offending value with `file:line` so the count is auditable.

## False positives

The `(?!:)` in the pattern above is load-bearing: `data-[state=open]:`, `aria-[current=page]:`, `group-data-[open]:`, `has-[input:focus]:`, and `max-[600px]:` are variant selectors, not arbitrary values, and must never be counted.

All of these are legitimate and are excluded by the filters above. Do not report them:

- **`ch` measures.** `max-w-[65ch]`, `max-w-[35ch]` and friends are mandated by `guidelines/heading-groups.md` and `guidelines/prose-content.md`. A theme cannot express a measure in characters.
- **Anything containing `max(`, `min(`, `clamp(`, `calc(`, or `round(`.** `size-[max(100%,3rem)]` is the touch-target expander mandated by `guidelines/buttons.md`; `rounded-[calc(var(--radius)-var(--padding))]` is the nested-radius formula. A function is reasoning, not a magic number.
- **Anything containing `var(` or `--`.** `bg-[var(--brand)]` and `grid-rows-[--spacing(6)_1fr]` reference the theme, which is the opposite of drifting from it.
- **Optical nudges of 2px or less.** `mt-[1px]`, `top-[-2px]`, `translate-y-[0.5px]`. Optical alignment is a real craft move that no spacing scale should absorb.
- **Story, test, and vendored files.** Fixtures exist to pin odd values.

One more judgement call the script cannot make: a single arbitrary value repeated across many files is an unregistered scale step, not drift. The fix there is to add it to the theme, not to snap it to a neighbour.

## Fix

Promote repeated values into the theme, and snap one-offs to the nearest existing step.

```tsx
// before: six decisions, none traceable
<div className="rounded-[10px] bg-[#f7f7f8] p-[18px] text-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] gap-[14px]">

// after: same look, all traceable
<div className="rounded-xl bg-gray-50 p-5 text-sm shadow-sm gap-3.5">
```

If a value genuinely has no home in the theme and recurs, register it:

```css
@theme {
  --radius-card: 10px;
  --color-surface-subtle: #f7f7f8;
}
```

## Why this needs a rule

A model writing one component sees only that component, where every arbitrary value looks locally reasonable; the drift only exists relative to a theme file it was never asked to open.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Design-system package or shared UI primitives | fix-this-sprint |
| Marketing landing page | backlog |
| Internal admin tools | backlog |
| Prototype or spike branch | ignore |

Never a release blocker: nothing here breaks a task, it erodes coherence over time.

## Suppression

```tsx
{/* ui-audit-ignore:slop-token-drift, values pinned to a third-party embed's own scale */}
```
