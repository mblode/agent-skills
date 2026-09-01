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

Store scenarios in `evals/evals.json` inside the skill folder. This is the format the `skill-creator` plugin and agentskills.io tooling read, so a hand-written file is runnable later without conversion:

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

Write `prompt` the way a user types it, with real paths and context; vary formality across cases and include one boundary case. Add `assertions` after the first run, not before: you do not know what "good" looks like until you have seen an output. Keep them objective (countable, checkable); style and feel are for human review. Drop any assertion that passes in both configurations, it measures nothing.

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
- A rule whose absence regresses a scenario has earned permanent tenure; note the scenario next to it so nobody re-litigates it later
- Opinions are not ablatable this way: a house style has no failing scenario, it is the preference the skill exists to encode

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
