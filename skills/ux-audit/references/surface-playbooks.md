# Surface Playbooks

For each surface detected during the audit, run the rules below in order. If a rule is not applicable to the specific component (no input → skip Postel's; no progress UI → skip Goal-Gradient), emit `result: "n/a"` with a reason rather than skipping silently.

Every playbook includes both Tier-1 (programmatic) and Tier-3 (rubric) rules. Tier-1 rules are run first.

## Table of contents

- [Detecting surfaces](#detecting-surfaces) — element-semantics matchers
- [Primary Navigation](#primary-navigation) and [Secondary Navigation](#secondary-navigation)
- [Form (Multi-Field)](#form-multi-field)
- [Modal / Dialog](#modal--dialog)
- [List or Feed](#list-or-feed-5-items)
- [Error / Validation State](#error--validation-state)
- [Search Results](#search-results)
- [Dashboard](#dashboard)
- [Marketing Hero / Landing](#marketing-hero--landing)
- [Pricing / Plan Selection](#pricing--plan-selection)
- [Empty State](#empty-state)
- [Loading / Async](#loading--async)
- [Cross-surface laws](#cross-surface-laws) — rules that apply to most surfaces

## Detecting surfaces

Match on element semantics, not filenames:

| Surface | Detect by |
|---|---|
| `primary-nav` | `<nav>` at top level of `<header>`, OR `role="navigation"` not nested in another nav |
| `secondary-nav` | `<nav>` inside `<aside>`, footer, or breadcrumb component |
| `form` | `<form>` with ≥2 inputs |
| `modal` | `role="dialog"` or `role="alertdialog"`, OR component named `Modal | Dialog | Sheet | Drawer` |
| `list` | `<ul>` or `<ol>` with ≥5 children, OR component named `List | Feed | Table` |
| `error-state` | `role="alert"`, OR `aria-invalid` on an input, OR component named `*Error | *Validation` |
| `search-results` | container labelled `role="region"` with `aria-label` matching `/search|results/i` |
| `dashboard` | container with ≥4 distinct cards/widgets |
| `marketing-hero` | full-bleed section above the fold with a primary CTA on a marketing page |
| `pricing` | section containing ≥2 plan cards |
| `empty-state` | conditional render keyed on `items.length === 0`, OR text matching `/no .* yet|empty/i` |
| `loading` | conditional render keyed on `isLoading`, `isPending`, OR `<Skeleton>`/`<Spinner>` components |

---

## Primary Navigation

Run in order:

1. **`decision-hicks-law`** — count direct interactive children
2. **`cognitive-millers-law`** — verify chunking when count >7
3. **`memory-jakobs-law`** — check conventional positions (logo top-left, cart top-right, search top-center, hamburger ≤768 px)
4. **`memory-serial-position`** — verify primary action at edge (start or end)
5. **`interaction-fittss-law`** — verify hit target ≥44 px
6. **`perception-von-restorff`** — verify exactly one visual emphasis
7. **`perception-selective-attention`** *(rubric)* — verify primary action is not banner-blind

## Secondary Navigation

1. `decision-hicks-law`
2. `cognitive-chunking`
3. `memory-serial-position`
4. `interaction-fittss-law`

## Form (Multi-Field)

1. **`cognitive-chunking`** — verify fields are grouped via `<fieldset>` or visually-distinct sections
2. **`decision-teslers-law`** — verify fields requiring values the system can infer (timezone, currency, country) are pre-filled
3. **`decision-postels-law`** — verify input patterns are forgiving (case-insensitive emails, flexible phone, trim whitespace)
4. **`cognitive-cognitive-load`** — verify ≤7 simultaneous decisions visible
5. **`interaction-fittss-law`** — verify submit + cancel button hit targets

## Modal / Dialog

1. **`decision-hicks-law`** — verify ≤3 actions in the modal footer
2. **`interaction-fittss-law`** — verify close button is ≥44 px and at conventional position (top-right)
3. **`memory-zeigarnik`** — verify cancel does not destroy unsaved work without confirmation
4. **`interaction-flow`** *(rubric)* — verify modal is not interrupting an active task

## List or Feed (≥5 items)

1. **`memory-serial-position`** — verify critical actions at top or bottom
2. **`cognitive-chunking`** — verify chunking via section headers, dates, or categories when >10 items
3. **`perception-similarity`** — verify same-role items share visual properties
4. **`perception-common-region`** — verify each item has a clear boundary

## Error / Validation State

1. **`decision-postels-law`** — verify error message is specific and actionable, not "invalid"
2. **`memory-peak-end-rule`** — verify error path leads to recovery, not dead-end
3. **`interaction-doherty-threshold`** — verify error is shown within 400 ms of the user action that caused it

## Search Results

1. **`decision-hicks-law`** — verify ≤7 results-per-page or facet count
2. **`perception-von-restorff`** — verify the highlighted/sponsored result is visually distinguishable
3. **`memory-serial-position`** — verify most-relevant results at top

## Dashboard

1. **`cognitive-cognitive-load`** — verify ≤7 simultaneous focal areas above the fold
2. **`perception-proximity`** — verify intra-group spacing < inter-group spacing by ≥2×
3. **`perception-similarity`** — verify cards/widgets of the same type share visual properties
4. **`cognitive-millers-law`** — verify any single widget exposes ≤7 ungrouped data points

## Marketing Hero / Landing

1. **`interaction-aesthetic-usability`** *(rubric)* — score visual polish 1–5
2. **`perception-von-restorff`** — verify exactly one primary CTA stands out
3. **`cognitive-cognitive-load`** — verify ≤7 message blocks above the fold

## Pricing / Plan Selection

1. **`decision-hicks-law`** — verify plan count ≤5
2. **`decision-choice-overload`** — verify a recommended plan is flagged
3. **`perception-von-restorff`** — verify the recommended plan is visually distinct

## Empty State

1. **`memory-zeigarnik`** — verify a clear next-action is offered
2. **`memory-goal-gradient`** — verify the next-action's reward is visible (preview, "you're 1 step away from your first…")
3. **`interaction-aesthetic-usability`** *(rubric)* — empty states are high-leverage for polish

## Loading / Async

1. **`interaction-doherty-threshold`** — verify feedback within 100 ms (skeleton/spinner) and resolution within 1000 ms (or progress indicator)
2. **`memory-zeigarnik`** — verify the user can leave and return without losing the loading task

---

## Cross-surface laws

These laws apply to most surfaces and are not surface-specific. Run them when the playbook for the dominant surface completes:

- **`cognitive-cognitive-bias`** *(rubric)* — review default selections and framing language
- **`decision-occams-razor`** *(rubric)* — count unnecessary UI elements
- **`decision-paradox-of-the-active-user`** *(rubric)* — verify inline help is on the critical path, not buried in docs
- **`decision-pareto-principle`** *(rubric)* — verify top-20% features get ≥80% of the UI real estate
- **`memory-mental-model`** *(rubric)* — verify labels and icons match user-known systems
- **`perception-pragnanz`** *(rubric)* — verify visual composition is unambiguous
- **`cognitive-working-memory`** *(rubric)* — verify multi-step flows preserve user context
