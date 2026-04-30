# Observational Rubrics

Tier-3 rules score on a 1–5 scale. This file aggregates all 10 rubrics so two agents auditing the same surface produce the same score. Each anchor describes a concrete UI, not "good/bad."

When scoring: choose the closest anchor, then emit `score` + the verbatim anchor text in the finding's `anchor` field. Pass at ≥4. Warn at 3. Fail at ≤2.

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

Reviews defaults, framing, and dark-pattern exposure across high-stakes flows (cancel, delete, downgrade, opt-out).

| Score | Anchor |
|---|---|
| 5 | Defaults match what a friend would recommend; cancel/destructive flows use neutral language ("Cancel subscription") and equal visual weight on confirm/dismiss; comparison anchors are honest. |
| 4 | Defaults mostly neutral; one minor framing issue (e.g. opt-out checkbox pre-checked but obvious). |
| 3 | Mixed: some defaults helpful, others nudge toward business-preferred outcome; "Are you sure?" copy uses mild loss-aversion. |
| 2 | Multiple dark patterns: pre-checked upsells, asymmetric button styling on cancel flows, "you'll lose your streak forever" language. |
| 1 | Confirmshaming, hidden cancel paths, anchoring to fake-high prices, urgency timers without basis. |

## cognitive-working-memory

Reviews whether multi-step flows preserve user context (entered values, prior choices, summary) so users do not have to hold them in mind.

| Score | Anchor |
|---|---|
| 5 | Every step shows a persistent summary of prior choices; values entered earlier are visible or at minimum echoed in step labels; back-button preserves entered values. |
| 4 | Summary present but minor — e.g. step indicator shows step names, prior values visible on hover or in a sidebar. |
| 3 | Step indicator shows position only ("Step 3 of 5") with no content recap; back-button works but loses some state. |
| 2 | No persistent summary; back-button resets fields; user must re-enter values to correct an earlier step. |
| 1 | Multi-step flow with no progress, no summary, no back-button; user must restart from step 1 on any error. |

## decision-occams-razor

Reviews whether UI elements not serving the user's goal have been removed. Counts decorative chrome, duplicate controls, redundant labels, and unused fields.

| Score | Anchor |
|---|---|
| 5 | Every visible element earns its place: primary task is foregrounded, no decorative widgets, no controls duplicated across regions. |
| 4 | Mostly clean; one or two decorative elements (illustration, "fun" empty-state graphic) that don't compete with task. |
| 3 | Several non-essential elements compete for attention: marketing banner inside an authenticated app, social-share buttons on private content. |
| 2 | Critical action is buried under chrome: primary CTA below decorative scrolls, or duplicated in 3 places with conflicting styling. |
| 1 | UI has more decorative elements than functional ones; task discovery requires hunting. |

## decision-paradox-of-the-active-user

Reviews whether contextual help and guidance live on the critical path, since users skip docs and tutorials.

| Score | Anchor |
|---|---|
| 5 | Every non-obvious field has inline help (placeholder, descriptive label, or tooltip on focus); errors explain *why* and link to the fix; new features have inline introduction at first encounter. |
| 4 | Most fields have inline help; one or two reference users to external docs unnecessarily. |
| 3 | Inline help is sparse — present on some fields, absent on others; help docs exist but in a separate /docs route. |
| 2 | Tooltips exist but only on hover; mobile users see no help; complex actions assume prior knowledge. |
| 1 | All help is in external docs; UI assumes the user has read the manual. |

## decision-pareto-principle

Reviews whether the top-20% of features (by usage or strategic value) get ≥80% of the UI real estate and the lowest friction.

| Score | Anchor |
|---|---|
| 5 | Most-used features are largest, closest to entry, and require the fewest clicks; rarely-used features live in submenus with sensible names; analytics-driven foregrounding is visible. |
| 4 | Top features are foregrounded; one or two secondary features get more attention than usage warrants. |
| 3 | Equal weighting: every feature gets a top-level nav entry regardless of frequency. |
| 2 | Inversion: rarely-used features (settings, account) are more prominent than primary features. |
| 1 | UI optimized for showcasing capability, not for getting users to their goal. |

## perception-pragnanz

Reviews whether visual composition resolves to a single, simple interpretation. Ambiguous layouts force users to decode the design instead of using it.

| Score | Anchor |
|---|---|
| 5 | Clear figure-ground; each section has one dominant shape; no competing alignments or rotations; eye flow is unambiguous. |
| 4 | Mostly clear; one element competes mildly (e.g. a tilted card in an otherwise gridded layout). |
| 3 | Multiple visual centers of gravity; user has to decide where to look first. |
| 2 | Layered, rotated, overlapping shapes without hierarchy; eye bounces. |
| 1 | Composition is a puzzle; it takes ≥3 seconds to identify the primary action. |

## perception-selective-attention

Reviews whether the primary action survives ad-blindness and selective filtering — users skip anything that *looks like* a banner, ad, or low-priority notification.

| Score | Anchor |
|---|---|
| 5 | Primary CTA uses neither banner shapes nor ad-styling tropes; it integrates with the content flow; users find it without scanning. |
| 4 | Primary CTA is clear; one secondary call uses a tropic banner shape that might be skipped. |
| 3 | Primary action lives inside a notification-like banner that some users will dismiss reflexively. |
| 2 | Primary action looks like a third-party ad placement (rectangular, brightly coloured, top of page). |
| 1 | Critical action is in a position users have learned to filter out (right rail, top banner, "promotional" color). |

## memory-mental-model

Reviews whether labels, icons, and interaction patterns match the user's expectations from prior systems.

| Score | Anchor |
|---|---|
| 5 | All labels match domain vocabulary the user already uses; icons use Lucide/Material/SF Symbols semantics; interaction patterns (drag, swipe, undo) follow platform norms. |
| 4 | Mostly conventional; one or two custom icons or labels that need a tooltip to discover. |
| 3 | Mix of conventional and custom: e.g. uses ⊕ for "add" but ⌬ for "configure"; some labels are jargon. |
| 2 | Frequent invented vocabulary or icons; users learn through trial and error. |
| 1 | Heavy custom vocabulary with no on-ramp; interactions break platform conventions (drag-to-delete, swipe-to-confirm). |

## interaction-flow

Reviews whether the UI protects focused work from interruption (modals, toasts, banners, auto-saves, layout shifts during typing).

| Score | Anchor |
|---|---|
| 5 | Active work is never interrupted; prompts surface only at natural breakpoints (after save, on idle, on exit); feedback is ambient. |
| 4 | One minor interruption pattern — e.g. a save toast briefly covers the cursor location. |
| 3 | Modals or toasts fire during typing or scrolling; user reflex-dismisses them. |
| 2 | Multiple unsolicited interruptions per session: feature announcements, NPS prompts, paywalls mid-action. |
| 1 | UI actively interrupts work for marketing or growth goals; users develop dismissal habits and miss real alerts. |

## interaction-aesthetic-usability

Reviews visual polish: type system, spacing rhythm, colour palette, shadow/elevation, motion quality. Polish buys patience for friction it does not eliminate.

| Score | Anchor |
|---|---|
| 5 | Distinct type system (≥3 weights, ≥4 sizes); consistent spacing rhythm (one of 4/8/12/16/24); two-tier elevation; brand colour used sparingly for emphasis; motion is purposeful and subtle. |
| 4 | Solid system with one rough edge (e.g. type scale present but one heading is off-grid). |
| 3 | Type and spacing present but inconsistent in 2-3 places; colour palette neutral but flat shadows; motion present but generic. |
| 2 | Defaults: system fonts at one size, no spacing tokens, harsh box-shadow, no motion or jarring motion. |
| 1 | Looks like a wireframe; clearly unfinished; users assume the product is unreliable. |

---

## Common scoring confusions

- **Polish vs usability.** A flow can score 5 on `interaction-aesthetic-usability` and still fail Hick's, Fitts's, etc. Score polish independently.
- **Conventions vs novelty.** Don't penalize a deliberate, well-explained novel pattern under `memory-mental-model` — penalize unexplained novelty.
- **Density vs clutter.** A dashboard with high density can still score 5 on `decision-occams-razor` if every element is task-relevant. Only penalize when elements are decorative.
- **Persuasion vs bias.** `cognitive-cognitive-bias` penalizes only bias-exploitation. Persuasive copy that makes the truth more legible is not a bias issue.
