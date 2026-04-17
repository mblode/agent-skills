# Evaluation and Iteration

How to measure whether a skill works and improve it over time. Build evaluations before writing extensive documentation — they reveal actual gaps instead of imagined ones.

## Contents

- Build Evaluations First
- Test Across Models
- Iterate with Two Claudes
- Observe How Claude Navigates
- Measuring Adoption

## Build Evaluations First

Write 3+ representative scenarios before expanding SKILL.md. Without evals, skill content drifts toward anticipated problems that never materialize.

Process:
1. Run Claude on the target task **without** the skill. Note what it gets wrong or is missing
2. Convert each failure into an eval scenario
3. Measure baseline (no skill) vs. treatment (with skill) on the same scenarios
4. Iterate until the treatment consistently beats baseline

Eval scenario structure:

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF and save to output.txt",
  "files": ["fixtures/document.pdf"],
  "expected_behavior": [
    "Reads the PDF with an appropriate library or CLI tool",
    "Extracts text from every page",
    "Writes extracted text to output.txt in readable form"
  ]
}
```

There is no built-in runner for this format — treat it as a rubric. Execute scenarios manually or build a thin harness.

## Test Across Models

Skills augment the underlying model. What works for Opus may underspecify for Haiku; what's necessary for Haiku may clutter Opus.

- **Haiku:** does the skill provide enough guidance and explicit steps?
- **Sonnet:** is the content clear and efficient?
- **Opus:** does the skill avoid over-explaining?

Test on every model the skill is likely to run under. If a skill targets Claude Code specifically, the current default model is the minimum bar.

## Iterate with Two Claudes

Use one Claude instance (**Claude A**) to author and refine the skill. Use another (**Claude B**) in a fresh session with the skill loaded to perform real tasks.

1. Give Claude B a real task
2. Watch where Claude B struggles, skips a rule, or makes a surprising choice
3. Report the specific observation to Claude A ("B forgot to filter test accounts on a regional report")
4. Let Claude A suggest targeted edits — stronger language, reordering, a new section
5. Apply the edit and test again

This loop improves skills based on observed behavior, not assumptions. Avoid rewriting from memory of what Claude "should" need.

## Observe How Claude Navigates

Watch real sessions for:

- **Unexpected exploration paths** — Claude reads files in an order the author did not plan; structure may be wrong
- **Missed connections** — Claude fails to follow a reference; links need to be more prominent
- **Overreliance on one section** — if the same file is read every time, move its content into SKILL.md
- **Ignored content** — if a reference file is never accessed, either delete it or signal it better in SKILL.md

The `name` and `description` fields matter most for triggering. If the skill isn't invoked when expected, the description needs clearer trigger phrases before any body content matters.

## Measuring Adoption

See the "Measuring Skills" section of `authoring-tips.md` for hook-based logging of skill invocations across an org. Use that data to find undertriggering skills and candidates for promotion to a shared library.
