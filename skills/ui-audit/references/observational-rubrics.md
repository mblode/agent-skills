# Observational Rubrics

Layer 4 rules with `kind: rubric` score 1-5. Aggregates all 10 rubrics so two agents scoring the same surface agree. Each anchor describes a concrete UI, not "good/bad."

Scoring: pick the closest anchor, emit `score` + the verbatim anchor text in the finding's `anchor` field. Pass ≥4, warn 3, fail ≤2.

## Table of contents

1. [`cognitive-cognitive-bias`](#cognitive-cognitive-bias)
2. [`cognitive-working-memory`](#cognitive-working-memory)
3. [`decision-occams-razor`](#decision-occams-razor)
4. [`decision-paradox-of-the-active-user`](#decision-paradox-of-the-active-user)
5. [`decision-pareto-principle`](#decision-pareto-principle)
6. [`perception-pragnanz`](#perception-pragnanz)
7. [`perception-selective-attention`](#perception-selective-attention)
8. [`memory-mental-model`](#memory-mental-model)
9. [`interaction-flow`](#interaction-flow)
10. [`interaction-aesthetic-usability`](#interaction-aesthetic-usability)

---

## cognitive-cognitive-bias

Defaults, framing, and dark-pattern exposure in high-stakes flows (cancel, delete, downgrade, opt-out).

| Score | Anchor |
|---|---|
| 5 | Defaults match what a friend would recommend; destructive flows use neutral language ("Cancel subscription") and equal weight on confirm/dismiss; honest comparison anchors. |
| 4 | Defaults mostly neutral; one minor framing issue (e.g. pre-checked opt-out, but obvious). |
| 3 | Mixed: some defaults helpful, others nudge toward the business outcome; "Are you sure?" copy uses mild loss-aversion. |
| 2 | Multiple dark patterns: pre-checked upsells, asymmetric cancel buttons, "lose your streak forever" language. |
| 1 | Confirmshaming, hidden cancel paths, anchoring to fake-high prices, urgency timers without basis. |

## cognitive-working-memory

Whether multi-step flows preserve context (entered values, prior choices, summary) so users needn't hold it in mind.

| Score | Anchor |
|---|---|
| 5 | Every step shows a persistent summary of prior choices; earlier values stay visible or echoed in step labels; back preserves values. |
| 4 | Summary present but light: step indicator shows names, prior values on hover or in a sidebar. |
| 3 | Position only ("Step 3 of 5"), no content recap; back works but loses some state. |
| 2 | No summary; back resets fields; user re-enters values to fix an earlier step. |
| 1 | No progress, no summary, no back; any error restarts from step 1. |

## decision-occams-razor

Whether elements not serving the goal are removed: decorative chrome, duplicate controls, redundant labels, unused fields.

| Score | Anchor |
|---|---|
| 5 | Every element earns its place: primary task foregrounded, no decorative widgets, no controls duplicated across regions. |
| 4 | Mostly clean; one or two decorative elements (illustration, empty-state graphic) that don't compete. |
| 3 | Several non-essential elements compete: marketing banner inside an authed app, social-share on private content. |
| 2 | Critical action buried under chrome: primary CTA below decorative scrolls, or duplicated in 3 places with conflicting styling. |
| 1 | More decorative elements than functional; finding the task requires hunting. |

## decision-paradox-of-the-active-user

Whether contextual help lives on the critical path, since users skip docs and tutorials.

| Score | Anchor |
|---|---|
| 5 | Every non-obvious field has inline help (placeholder, label, or tooltip on focus); errors explain *why* and link the fix; new features introduce themselves inline at first encounter. |
| 4 | Most fields have inline help; one or two punt to external docs unnecessarily. |
| 3 | Inline help sparse: on some fields, absent on others; docs exist but in a separate /docs route. |
| 2 | Tooltips only on hover; mobile sees no help; complex actions assume prior knowledge. |
| 1 | All help in external docs; UI assumes the user read the manual. |

## decision-pareto-principle

Whether the top-20% of features (by usage or value) get ≥80% of UI real estate and the least friction.

| Score | Anchor |
|---|---|
| 5 | Most-used features are largest, closest to entry, fewest clicks; rare features in well-named submenus; analytics-driven foregrounding visible. |
| 4 | Top features foregrounded; one or two secondary features get more attention than usage warrants. |
| 3 | Equal weighting: every feature gets a top-level nav entry regardless of frequency. |
| 2 | Inversion: rare features (settings, account) more prominent than primary ones. |
| 1 | Optimized to showcase capability, not to get users to their goal. |

## perception-pragnanz

Whether composition resolves to one simple interpretation. Ambiguous layouts force users to decode the design instead of using it.

| Score | Anchor |
|---|---|
| 5 | Clear figure-ground; each section has one dominant shape; no competing alignments or rotations; unambiguous eye flow. |
| 4 | Mostly clear; one element competes mildly (e.g. a tilted card in a gridded layout). |
| 3 | Multiple visual centers of gravity; user must decide where to look first. |
| 2 | Layered, rotated, overlapping shapes without hierarchy; eye bounces. |
| 1 | Composition is a puzzle; ≥3 seconds to find the primary action. |

## perception-selective-attention

Whether the primary action survives ad-blindness: users skip anything that *looks like* a banner, ad, or low-priority notification.

| Score | Anchor |
|---|---|
| 5 | Primary CTA avoids banner shapes and ad-styling tropes; integrates with content flow; found without scanning. |
| 4 | Primary CTA clear; one secondary call uses a banner shape that might be skipped. |
| 3 | Primary action sits in a notification-like banner some users dismiss reflexively. |
| 2 | Primary action looks like a third-party ad (rectangular, bright, top of page). |
| 1 | Critical action sits where users have learned to filter out (right rail, top banner, "promotional" color). |

## memory-mental-model

Whether labels, icons, and interaction patterns match expectations from prior systems.

| Score | Anchor |
|---|---|
| 5 | Labels match the user's domain vocabulary; icons follow Lucide/Material/SF Symbols semantics; interactions (drag, swipe, undo) follow platform norms. |
| 4 | Mostly conventional; one or two custom icons or labels needing a tooltip to discover. |
| 3 | Mix of conventional and custom: ⊕ for "add" but ⌬ for "configure"; some labels are jargon. |
| 2 | Frequent invented vocabulary or icons; users learn through trial and error. |
| 1 | Heavy custom vocabulary, no on-ramp; interactions break platform conventions (drag-to-delete, swipe-to-confirm). |

## interaction-flow

Whether the UI protects focused work from interruption (modals, toasts, banners, auto-saves, layout shift while typing).

| Score | Anchor |
|---|---|
| 5 | Active work never interrupted; prompts surface only at natural breakpoints (after save, on idle, on exit); feedback is ambient. |
| 4 | One minor interruption: a save toast briefly covers the cursor. |
| 3 | Modals or toasts fire during typing or scrolling; user reflex-dismisses them. |
| 2 | Multiple unsolicited interruptions per session: feature announcements, NPS prompts, paywalls mid-action. |
| 1 | UI interrupts work for marketing/growth; users build dismissal habits and miss real alerts. |

## interaction-aesthetic-usability

Visual polish: type system, spacing rhythm, colour palette, shadow/elevation, motion. Polish buys patience for friction it doesn't eliminate.

| Score | Anchor |
|---|---|
| 5 | Distinct type system (≥3 weights, ≥4 sizes); consistent spacing (4/8/12/16/24); two-tier elevation; brand colour used sparingly for emphasis; purposeful, subtle motion. |
| 4 | Solid system, one rough edge (e.g. one heading off-grid). |
| 3 | Type and spacing present but inconsistent in 2-3 spots; neutral palette, flat shadows; generic motion. |
| 2 | Defaults: system font one size, no spacing tokens, harsh box-shadow, no/jarring motion. |
| 1 | Looks like a wireframe; clearly unfinished; users assume the product is unreliable. |

---

## Common scoring confusions

- **Polish vs usability.** A flow can score 5 on `interaction-aesthetic-usability` and still fail Hick's/Fitts's. Score polish independently.
- **Conventions vs novelty.** Under `memory-mental-model`, penalize unexplained novelty, not deliberate, well-explained novel patterns.
- **Density vs clutter.** A dense dashboard can still score 5 on `decision-occams-razor` if every element is task-relevant. Penalize only decorative elements.
- **Persuasion vs bias.** `cognitive-cognitive-bias` penalizes only bias-exploitation. Persuasive copy that makes the truth more legible is fine.
