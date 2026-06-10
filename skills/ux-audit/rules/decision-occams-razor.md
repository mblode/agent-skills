---
title: Occam's Razor
impact: MEDIUM
kind: rubric
prefix: decision
tags: simplicity, reduction, parsimony, minimal-ui
related: decision-teslers-law, cognitive-cognitive-load, interaction-aesthetic-usability
---

## Occam's Razor

Among solutions that perform equally well, prefer the one with the fewest moving parts. In UI, "moving parts" means elements, states, copy, options, dependencies, and exceptions. The cheapest complexity to remove is the complexity you never add. This is a rubric-based rule: score how well the surface keeps the primary task foregrounded against the closest anchor.

Density is not clutter. A dashboard with high density can still score 5 if every element is task-relevant. Only penalize when elements are decorative, duplicated, or compete with the primary task.

## Rubric

**Surfaces:** form, modal, dashboard, marketing-hero, empty-state

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Every visible element earns its place: primary task is foregrounded, no decorative widgets, no controls duplicated across regions. |
| 4 | Mostly clean; one or two decorative elements (illustration, "fun" empty-state graphic) that don't compete with task. |
| 3 | Several non-essential elements compete for attention: marketing banner inside an authenticated app, social-share buttons on private content. |
| 2 | Critical action is buried under chrome: primary CTA below decorative scrolls, or duplicated in 3 places with conflicting styling. |
| 1 | UI has more decorative elements than functional ones; task discovery requires hunting. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Remove decorative widgets (gradients, blobs, illustrations, "fun" graphics) that do not serve the primary task.
- Consolidate duplicated controls (pick one save button, one nav, one CTA per region) and delete the rest.
- Remove cross-promotional banners, social-share buttons, and marketing content from authenticated UI.
- Cut form fields whose values are never read by any downstream system.
- Move edge-case conditional UI (used by <1% of users) into a settings panel or behind a "More" disclosure.

## Examples

**Anti-pattern (fails):**

```html
<form>
  <input name="firstName" placeholder="First name" required />
  <input name="lastName" placeholder="Last name" required />
  <input name="email" type="email" required />
  <input name="phone" type="tel" />
  <input name="company" placeholder="Company (optional)" />
  <input name="role" placeholder="Job title (optional)" />
  <select name="teamSize"><!-- 1, 2-5, 6-10, ... --></select>
  <select name="hearAbout"><!-- 12 options --></select>
  <input name="password" type="password" required />
  <button>Create account</button>
</form>
```

**Applied (passes):**

```html
<form>
  <input name="email" type="email" autoComplete="email" required />
  <input name="password" type="password" autoComplete="new-password" required />
  <button>Create account</button>
</form>
```

Profile and team metadata move into a post-signup setup step, gated only when the user actually needs that capability.

Reference: https://lawsofux.com/occams-razor/
