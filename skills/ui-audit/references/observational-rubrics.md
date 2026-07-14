# Observational Rubrics

Layer 4 rules with `kind: rubric` score 1-5. Aggregates the 2 rubrics so two agents scoring the same surface agree. Each anchor describes a concrete UI, not "good/bad."

Scoring: pick the closest anchor, emit `score` + the verbatim anchor text in the finding's `anchor` field. Pass ≥4, warn 3, fail ≤2.

Pure design-decision scoring (choice architecture, information hierarchy, mental-model fit, dark-pattern framing, visual polish) is `product-design`'s job (and `ui-design`'s for visual direction), not ui-audit's. Only rubrics that read a built/rendered defect remain here.

## Table of contents

1. [`cognitive-working-memory`](#cognitive-working-memory)
2. [`perception-pragnanz`](#perception-pragnanz)

---

## cognitive-working-memory

Whether multi-step flows preserve context (entered values, prior choices, summary) so users needn't hold it in mind.

| Score | Anchor |
|---|---|
| 5 | Every step shows a persistent summary of prior choices; earlier values stay visible or echoed in step labels; back preserves values. |
| 4 | Summary present but light: step indicator shows names, prior values on hover or in a sidebar. |
| 3 | Position only ("Step 3 of 5"), no content recap; back works but loses some state. |
| 2 | No summary; back resets fields; user re-enters values to fix an earlier step. |
| 1 | No progress, no summary, no back; any error restarts from step 1. |

## perception-pragnanz

Whether composition resolves to one simple interpretation. Ambiguous layouts force users to decode the design instead of using it.

| Score | Anchor |
|---|---|
| 5 | Clear figure-ground; each section has one dominant shape; no competing alignments or rotations; unambiguous eye flow. |
| 4 | Mostly clear; one element competes mildly (e.g. a tilted card in a gridded layout). |
| 3 | Multiple visual centers of gravity; user must decide where to look first. |
| 2 | Layered, rotated, overlapping shapes without hierarchy; eye bounces. |
| 1 | Composition is a puzzle; ≥3 seconds to find the primary action. |
