---
title: Selective Attention
impact: HIGH
tier: rubric
prefix: perception
tags: attention, banner-blindness, change-blindness, perception
related: perception-von-restorff, cognitive-cognitive-load, memory-mental-model
---

## Selective Attention

Users focus on a narrow subset of stimuli — usually whatever serves their current goal — and filter out the rest. This filtering is automatic and largely unconscious. Anything not aligned with the user's goal, or anything that resembles content they've learned to ignore (ads, decorative banners, persistent toolbars), is unlikely to be seen at all. This is a rubric-based rule: score whether the primary action survives ad-blindness.

Two well-known consequences are *banner blindness* (users skip past anything that looks like an ad) and *change blindness* (significant changes go unnoticed without an attentional cue). Critical information must sit on the focus path, look unlike ads, and be paired with a cue when it changes.

## Rubric

**Surfaces:** marketing-hero, dashboard, error-state, primary-nav

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Primary CTA uses neither banner shapes nor ad-styling tropes; it integrates with the content flow; users find it without scanning. |
| 4 | Primary CTA is clear; one secondary call uses a tropic banner shape that might be skipped. |
| 3 | Primary action lives inside a notification-like banner that some users will dismiss reflexively. |
| 2 | Primary action looks like a third-party ad placement (rectangular, brightly coloured, top of page). |
| 1 | Critical action is in a position users have learned to filter out (right rail, top banner, "promotional" color). |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 | — |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Move the primary CTA out of any banner-shaped container (full-width yellow strip, top notification bar, dismissible card).
- Integrate the CTA with the content flow — place it inline with the user's gaze path, not in the right rail or footer strip.
- Avoid "promotional" colors (yellow/orange high-saturation strips, gradient banners) for critical actions; use neutral or status-appropriate styling.
- Pair significant value changes (cart total, balance, count) with a cue: focus shift, brief animation, or ARIA live announcement.
- Render form-validation errors next to the offending field, not only in a top banner.

## Examples

**Anti-pattern (fails):**

```html
<!-- Account suspended notice rendered as a yellow promotional banner above the fold.
     Returning users skip past it on autopilot and never see it. -->
<div class="bg-yellow-100 border border-yellow-300 px-6 py-3 text-center">
  <strong>Heads up!</strong> Your account is suspended. Update billing to continue.
</div>

<main>...</main>
```

**Applied (passes):**

```html
<main>
  <div class="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
    <h2 class="font-semibold text-red-900">Account suspended</h2>
    <p class="mt-1 text-red-800">
      Update your billing details to restore access.
    </p>
    <a href="/billing" class="mt-3 inline-block rounded bg-red-600 px-4 py-2 text-white">
      Update billing
    </a>
  </div>
</main>
```

Reference: https://lawsofux.com/selective-attention/
