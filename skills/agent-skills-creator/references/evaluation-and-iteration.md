# Evaluation and Iteration

Build evals before docs: they reveal real gaps, not imagined ones.

## Contents

- Build Evaluations First
- Test Across Models
- Iterate with Two Claudes
- Observe How Claude Navigates
- Re-Evaluating After a Rewrite
- Measuring Adoption

## Build Evaluations First

Write 3+ scenarios before expanding SKILL.md, else content chases imaginary problems.

Process:
1. Run the task **without** the skill; note failures
2. Convert each failure to a scenario
3. Measure baseline (no skill) vs. treatment (with skill) on each
4. Iterate until treatment beats baseline

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

No runner exists: use as a rubric, run manually or via a thin harness.

## Test Across Models

Skills augment the model: Opus guidance may underspecify Haiku; Haiku guidance may clutter Opus.

- **Haiku:** enough guidance and explicit steps?
- **Sonnet:** clear and efficient?
- **Opus:** avoids over-explaining?

Test every model it may run under; the Claude Code default model is the floor.

## Iterate with Two Claudes

**Claude A** authors and refines; **Claude B** runs tasks in a fresh session with the skill loaded.

1. Give B a real task
2. Watch where B struggles, skips a rule, or surprises you
3. Report the specific observation to A ("B forgot to filter test accounts")
4. A suggests targeted edits: stronger language, reordering, new section
5. Apply and retest

Improve from observed behavior, not assumptions or memory of what Claude "should" need.

## Observe How Claude Navigates

Watch real sessions for:

- **Unexpected exploration:** files read in an unplanned order; structure may be wrong
- **Missed connections:** a reference isn't followed; make links more prominent
- **Overreliance on one section:** same file read every time; move it into SKILL.md
- **Ignored content:** a never-accessed reference; delete it or signal it better in SKILL.md

`name` and `description` drive triggering. If the skill isn't invoked when expected, fix the description's triggers before body content.

## Re-Evaluating After a Rewrite

After improving a skill (see `improving-existing-skills.md`), rerun evals before shipping. Better audit dimensions but worse evals is a regression: dimensions measure form, evals measure behavior.

## Measuring Adoption

See "Measuring Skills" in `authoring-tips.md` for hook-based invocation logging across an org; find undertriggering skills and promotion candidates for a shared library.
