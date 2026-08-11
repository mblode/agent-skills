---
title: Fitts's Law
id: interaction-fittss-law
category: interaction
defaultTier: fix-this-sprint
detect: rendered
related: interaction-doherty-threshold, perception-proximity, decision-hicks-law
---

## Fitts's Law

Time to acquire a pointer target scales with distance and falls with size, so a control can be perfectly sized and still be slow or dangerous because of where it sits. Size is `interaction-target-size`'s half of the law; placement is this one's. Source: Fitts (1954).

Two consequences carry most of the weight. Screen edges and corners are effectively infinite targets, because the cursor cannot overshoot the viewport boundary, so anchoring a frequent action to one costs nothing and removes a whole axis of precision. And the same maths that makes a near target fast makes it easy to hit by accident: a destructive control placed beside a frequent one is not a sizing problem, and enlarging either one makes it worse.

## Detection

`interaction-target-size` owns every finding about how big a target is. This rule owns the other two terms in the law: **how far** the pointer must travel, and **whether the edge is doing any work**. Never report both for one control.

Distance is a relationship between elements, so it is not a property of any one line. Find the candidates statically, then decide at the rendered size.

```bash
rg -nUP '(?s)<(?:button|a)\b[^>]*?>(?:(?!</(?:button|a)>).)*?\b(Delete|Remove|Discard|Revoke|Cancel subscription)\b' \
   -g '*.tsx' -g '*.jsx' src/
```

That finds destructive actions; the finding is whether one sits within a thumb's slip of the action people take fifty times a day. Three shapes to judge on the rendered page:

- A destructive control adjacent to the primary control in the same cluster, with no separation, so the cost of a slip is unrecoverable.
- A frequent action stranded in the middle of a large viewport when an edge or corner would make it effectively infinite in one axis.
- A dense row where the whole cluster is reachable but the intended item is not distinguishable by position.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | Destructive actions are separated from frequent ones, and frequent actions sit at an edge, corner, or the pointer's resting position | none |
| warn | A frequent action is centre-stranded where an edge was available | MEDIUM |
| fail | A destructive action is immediately adjacent to a frequent one with no separation or undo | HIGH |

## Fix

**If fail:** Separate the destructive control from the frequent one, or make the action recoverable. Proximity plus irreversibility is the combination that hurts; breaking either one is enough.

**If warn:** Anchor the frequent action to an edge or corner, where the cursor cannot overshoot, rather than enlarging it.

## Examples

**Anti-pattern (fails):**

```tsx
<div className="fixed top-2 right-2">
  <button onClick={onClose} className="h-5 w-5 text-xs">
    x
  </button>
</div>
```

**Applied (passes):**

```tsx
<button
  onClick={onClose}
  aria-label="Close"
  className="fixed top-0 right-0 inline-flex h-11 w-11 items-center justify-center
             rounded-full text-zinc-500 hover:bg-zinc-100 focus-visible:ring-2"
>
  <XIcon className="h-4 w-4" aria-hidden />
</button>
```

`fixed top-0 right-0` is what this rule is about: pinned to a corner, the button is unmissable on desktop no matter how fast the cursor travels, because it cannot be overshot in either axis. The sizing shown is `interaction-target-size`'s concern, not a finding here.

Reference: https://lawsofux.com/fittss-law/
