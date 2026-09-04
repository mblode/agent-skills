# Evaluation and Iteration

Build evals before docs: they reveal real gaps, not imagined ones. Two things fail independently and are measured separately: whether the skill triggers on the prompts it should (routing), and whether the output is right once it has (quality).

## Contents

- Build Evaluations First
- Routing Evals
- Ablate Constraints
- Test Across Models
- Iterate with Two Claudes
- Observe How Claude Navigates
- Re-Evaluating After a Rewrite
- Measuring Adoption

## Build Evaluations First

Write 2-3 scenarios before expanding SKILL.md, else content chases imaginary problems. Expand the set after the first round shows where it is thin.

Process:
1. Run the task **without** the skill in a fresh session; note failures
2. Convert each failure to a scenario
3. Measure baseline (no skill) vs. treatment (with skill) on each
4. Iterate until treatment beats baseline by more than it costs in tokens and time

Store scenarios in `evals/evals.json` inside the skill folder. Use this repository scenario format, adapting it to the chosen runner when needed:

```json
{
  "skill_name": "pdf-processing",
  "evals": [
    {
      "id": 1,
      "prompt": "Extract all text from reports/q3.pdf and save it to output.txt",
      "expected_output": "output.txt containing the text of every page in reading order",
      "files": ["evals/files/q3.pdf"],
      "assertions": [
        "output.txt exists and is non-empty",
        "Text from the last page is present",
        "No page is skipped or duplicated"
      ]
    }
  ]
}
```

Write `prompt` the way a user types it, with real paths and context; vary formality across cases and include one boundary case. Add `assertions` after the first run, not before: you do not know what "good" looks like until you have seen an output. Keep them objective (countable, checkable); style and feel are for human review. Keep contract assertions even when both configurations pass. They guard against regressions; use differentiating assertions to measure added value.

Each run needs a clean context, or authoring residue masks gaps in the written instructions. A subagent per case gives that in Claude Code; otherwise use a separate session. Disable the skill for the baseline with `skillOverrides` (`"off"`) rather than deleting it.

`/plugin install skill-creator@claude-plugins-official` automates the loop: isolated runs, assertion grading with evidence, a with-versus-without benchmark, blind A/B between two versions, and description tuning. The `evals/` folder loads only when someone is changing the skill, never during a user task, and SKILL.md should say so where it lists the folder.

## Routing Evals

Seeing a skill trigger says Claude found it, not that it does the job; never triggering says the description failed, whatever the body holds. Test routing on its own with two prompt sets:

- **Should-trigger:** 8-10 prompts a user would type when they need this skill, phrased differently each time and none quoting the description verbatim
- **Near-miss:** 8-10 prompts that look adjacent but belong to a named sibling skill, or to no skill

A near-miss that routes here is a boundary problem: sharpen the IS-NOT line and the "For X use `sibling`" clause in both descriptions. A should-trigger that misses is a vocabulary problem: add the words the prompt used. `skill-creator`'s description-tuning mode generates both sets, measures the hit rate, and proposes edits; a hand-kept JSONL of `{"prompt", "expected"}` pairs does the same job across a whole bundle.

## Ablate Constraints

Evals tell you what to add. Ablation tells you what to remove, and it is the only honest way to run the constraint cut in `improving-existing-skills.md`.

For a rule you suspect is carrying no weight: delete it, rerun the scenarios, and keep it only if one regresses. Large system prompts have been cut by most of their length this way with no measurable eval loss, because most of the text guarded against failures the current model no longer makes.

- Ablate one rule at a time, or you learn nothing about which one mattered
- A rule kept without an ablation is a guess, and guesses accumulate into the bloat you are trying to cut
- A rule whose absence regresses a scenario has evidence for retention; link the scenario and revisit when the task, host, or model changes
- Opinions are not ablatable this way: a house style has no failing scenario, it is the preference the skill exists to encode

An opinion still has a dead state, and ablation cannot see it. A constraint dies when the model stops needing it, which shows up as an ablation that does not regress. An opinion dies when the model stops *following* it, which shows up as nothing at all: removing it regresses no scenario, and the model would not have produced it unprompted either, so both of the tests in `improving-existing-skills.md` vote to keep a line that is changing nothing.

The test for an opinion is conformance, not regression: run the scenario with the skill and check whether the output actually took the position the opinion states. An opinion the model overrides, waters down, or silently ignores is dead weight exactly like a dead constraint, and the fix is usually placement or phrasing rather than deletion. Move ignored preferences closer to the decision they govern and retest; placement does not guarantee conformance.

## Test Across Models

Skills augment the model, so the same body lands differently on each one. Guidance written for a frontier model may underspecify a small fast model; guidance written for a small one clutters a frontier model and, on the newest frontier models, measurably lowers output quality. Anthropic's own migration guidance says prompts carried forward from prior models are often too prescriptive; that makes the constraint cut a correctness pass, not tidying.

Two axes decide the test matrix, and most skills only think about the first:

- **Capability tier.** A small fast model asks: enough guidance and explicit steps? A frontier model asks: does this over-explain, or re-teach something it already does? Test the floor and the ceiling of the tiers the skill may run under, not the one you author on.
- **Effort level.** Where the host exposes reasoning effort, include the settings used in deployment. The same body is read at the terse end (fewer, more consolidated tool calls, less preamble) and at the exhaustive end. A workflow that only completes because the model volunteered an unstated step is a workflow that breaks at low effort. Run scenarios at supported deployment settings and make required contracts explicit.

A skill that travels across vendors adds a third question: does anything in the body assume one harness's tools, paths, or permission model? That is a portability bug, and it surfaces on another vendor's agent long before it surfaces in an eval.

## Iterate with Two Claudes

**Claude A** authors and refines; **Claude B** runs tasks in a fresh session with the skill loaded.

1. Give B a real task
2. Watch where B struggles, skips a rule, or surprises you
3. Report the specific observation to A ("B forgot to filter test accounts")
4. A suggests targeted edits: stronger language, reordering, new section
5. Apply and retest

Improve from observed behavior, not assumptions or memory of what Claude "should" need. Give A the failed assertions, the human feedback, and the transcript together; the fix should generalize past the failing case, not patch it.

## Observe How Claude Navigates

Watch real sessions for:

- **Unexpected exploration:** files read in an unplanned order; structure may be wrong
- **Missed connections:** a reference isn't followed; make links more prominent
- **Overreliance on one section:** same file read every time; move it into SKILL.md
- **Ignored content:** a never-accessed reference; delete it or signal it better in SKILL.md
- **Wasted work in transcripts:** unrequested validation, intermediate files nobody uses; the instruction that caused it is a removal candidate
- **Repeated helper scripts:** every run writes the same parser or chart builder; bundle it in `scripts/`

`name` and `description` drive triggering. If the skill isn't invoked when expected, fix the description's triggers before body content.

## Re-Evaluating After a Rewrite

After improving a skill (see `improving-existing-skills.md`), rerun evals before shipping, with the pre-edit snapshot as the baseline instead of no-skill. Better audit dimensions but worse evals is a regression: dimensions measure form, evals measure behavior.

## Measuring Adoption

Log invocations with a PreToolUse hook and compare actual usage against the trigger rate you expected. Undertriggering is a description problem, not a body problem: fix the "Use when" phrases before touching content. Across an org the same log finds promotion candidates for a shared library.
