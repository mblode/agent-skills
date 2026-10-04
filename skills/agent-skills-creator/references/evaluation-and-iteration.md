# Evaluation and Iteration

Build evals before docs: they reveal real gaps, not imagined ones. Two things fail independently and are measured separately: whether the skill triggers on the prompts it should (routing), and whether the output is right once it has (quality).

A skill is close to the ideal surface for this ([Anthropic, "Automating eval design and hillclimbing"](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)): a one-file edit that is cheap to try and to revert, and the two scores below attribute cleanly to the two things that can move, the description (routing) and the body (quality), instead of blurring into one undifferentiated "did it get better" number.

## Contents

- Build Evaluations First
- Scenario Sourcing and Headroom
- Workspace Hygiene
- Routing Evals
- Ablate Constraints
- Loop to a Rubric
- Test Across Models
- Diagnostics
- The Hillclimb Loop
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

Write each assertion as one requirement a reader can mark pass or fail from the output alone, never a 1-5 scale: a checkable boolean claim is the only thing a grader can score consistently. So an assertion with two clauses, or one the reader cannot label the same way twice, measures nothing; split or rewrite it. Graded pass rates mean something only after the grader agrees with your labels on a sample: Run them with the [agent-evals](https://github.com/mblode/agent-evals) CLI (the `agent-evals` skill owns its commands and verdicts): `judge <skill>` runs both arms and grades each assertion with a separate judge model; `judge score --compare` (Jev) measures grader agreement against human labels and labels each assertion added value, contract (passes in both, so keep it), regression, or unmet. `judge` runs the with-versus-without comparison blind and in randomised order (the judge never sees which transcript came from which arm, and which arm is shown first varies per case) so a positional or identity bias in the judge model cannot inflate one side. Name the arms `without_skill`, `with_skill`, `previous_skill`, or `ablate-<rule>`, and record the model and effort beside each run so the comparison can tell a skill win from a model difference.

Each run needs a clean context, or authoring residue masks gaps in the written instructions. A subagent per case gives that in Claude Code; otherwise use a separate session. Disable the skill for the baseline with `skillOverrides` (`"off"`) rather than deleting it.

`/plugin install skill-creator@claude-plugins-official` automates the loop: isolated runs, assertion grading with evidence, a with-versus-without benchmark, blind A/B between two versions, and description tuning. The `evals/` folder loads only when someone is changing the skill, never during a user task, and SKILL.md should say so where it lists the folder.

Pick the judge from a different model family than the one under test, and never the model whose output it is grading. A same-family judge shares the family's blind spots and tends to prefer its own family's phrasing and structure, which inflates the pass rate on exactly the failures you most need to catch.

## Scenario Sourcing and Headroom

Source cases in priority order, cheapest and most representative first:

1. Real transcripts or bug reports where the skill's job went wrong (after any retention or privacy review the repository requires).
2. 5-10 hand-written cases covering the moments of use in the description.
3. Cases synthesised from those two, anchored in a real repo or a real prompt shape rather than invented from scratch.

Do not build the set only from what today's model fails at. Capability is jagged: one model's failure fingerprint is not the job's difficulty profile, and a suite tuned to it stops measuring the skill the moment the underlying model changes. Include a case you already expect to pass; a suite that is all near-misses cannot tell a real fix from noise.

Check headroom before hillclimbing on it. If with-skill already scores 95% or higher across every scenario, quality is not the lever left: retarget the goal to cost or token count at parity, or add harder cases before spending a round on wording. A scenario every arm fails is the opposite problem, not a hard case: if there is no expert consensus on what the right output even is, fix or cut the scenario before trusting its score.

Low variance matters as much as the score itself. Run each new scenario two or three times before trusting a single result; a case that flips pass/fail across identical runs is ambiguous, has an inconsistent grader verdict, or carries leftover state between trials, and any of the three needs fixing before the case counts toward a decision.

## Workspace Hygiene

Name the eval workspace the way a real project would be named: a plausible product name and an ordinary directory layout, never `test-repo`, `eval-sandbox`, `skill-test-1`, or any name that tells the agent it is being graded. An agent that notices it is inside a test behaves differently from one doing real work: it hedges, over-explains, adds unrequested caveats, or performs a more careful version of the task than it would produce under normal pressure. That gap is pure measurement noise, and it runs in the direction that makes a skill look better than it is. Fixtures, seed data, and file paths inside the workspace follow the same rule.

## Routing Evals

Seeing a skill trigger says Claude found it, not that it does the job; never triggering says the description failed, whatever the body holds. Test routing on its own with two prompt sets:

- **Should-trigger:** 8-10 prompts a user would type when they need this skill, phrased differently each time and none quoting the description verbatim
- **Near-miss:** 8-10 prompts that look adjacent but belong to a named sibling skill, or to no skill

A near-miss that routes here is a boundary problem: sharpen both descriptions to their own moment of use and give each a "For X use `sibling`" edge (Module Lens rule 5 in `improving-existing-skills.md`). A should-trigger that misses is a vocabulary problem: add the words the prompt used, and take out a clause of equal weight so the description does not grow. Run both sets against the whole installed listing, not one skill in isolation: the failure the model actually sees is two descriptions claiming the same prompt, or a listing so long the host has trimmed the trigger clause off the end. `skill-creator`'s description-tuning mode generates both sets, measures the hit rate, and proposes edits; `agent-evals routing` does the same across a whole bundle from its JSONL corpus (case schema in its README). No runner reads the `routing` block of `evals/evals.json`; a prompt that must be scored goes into that corpus.

## Ablate Constraints

Evals tell you what to add. Ablation tells you what to remove, and it is the only honest way to run the constraint cut in `improving-existing-skills.md`.

For a rule you suspect is carrying no weight: delete it, rerun the scenarios, and keep it only if one regresses. Large system prompts have been cut by most of their length this way with no measurable eval loss, because most of the text guarded against failures the current model no longer makes.

- Ablate one rule at a time, or you learn nothing about which one mattered
- A rule kept without an ablation is a guess, and guesses accumulate into the bloat you are trying to cut
- A rule whose absence regresses a scenario has evidence for retention; link the scenario and revisit when the task, host, or model changes
- Opinions are not ablatable this way: a house style has no failing scenario, it is the preference the skill exists to encode
- Never paste failing-transcript content into the fix. Read the failure, name the general policy it is missing, and write that policy; a rule that quotes or paraphrases one bad output patches a case instead of a cause and regresses the next time the wording changes

An opinion still has a dead state, and ablation cannot see it. A constraint dies when the model stops needing it, which shows up as an ablation that does not regress. An opinion dies when the model stops *following* it, which shows up as nothing at all: removing it regresses no scenario, and the model would not have produced it unprompted either, so both of the tests in `improving-existing-skills.md` vote to keep a line that is changing nothing.

The test for an opinion is conformance, not regression: run the scenario with the skill and check whether the output actually took the position the opinion states. An opinion the model overrides, waters down, or silently ignores is dead weight exactly like a dead constraint, and the fix is usually placement or phrasing rather than deletion. Move ignored preferences closer to the decision they govern and retest; placement does not guarantee conformance.

## Loop to a Rubric

Assertions fit a discrete pass or fail. Some skills instead produce one artifact judged as a whole (a deck, a design, a PR description, a verification report), where a rubric scored 0-10 per criterion says more than a pass/fail list. For those, loop the skill against its own output until the judge returns 10 on every criterion, not just once:

1. Run the skill; have the judge (a different model family, per above) score every rubric criterion and name the single lowest-scoring one.
2. Make the smallest change that addresses that lowest criterion, and only that one.
3. Re-run and re-score.
4. Stop at 10/10 across every criterion, or when two consecutive iterations move no score, whichever comes first; record the second outcome as a plateau, not a pass.

Log each iteration's lowest-scoring criterion and the change made for it. A loop that jumps to "make it better" without naming the criterion it is targeting cannot tell whether the next score moved because of that change or by chance, and cannot tell a real plateau from a rubric nobody is reading closely enough to move.

## Test Across Models

Skills augment the model, so the same body lands differently on each one. Guidance written for a frontier model may underspecify a small fast model; guidance written for a small one clutters a frontier model and, on the newest frontier models, measurably lowers output quality. More than one vendor's migration guidance now says the same two things: prompts carried forward from prior models are too prescriptive, and boundaries written to stop an older model make the newer one stop early. That makes the constraint cut a correctness pass, not tidying, and it makes "does the workflow run to completion" a scenario to run on the newest model, not only the smallest.

Two axes decide the test matrix, and most skills only think about the first:

- **Capability tier.** A small fast model asks: enough guidance and explicit steps? A frontier model asks: does this over-explain, or re-teach something it already does? Test the floor and the ceiling of the tiers the skill may run under, not the one you author on.
- **Effort level.** Where the host exposes reasoning effort, include the settings used in deployment. The same body is read at the terse end (fewer, more consolidated tool calls, less preamble) and at the exhaustive end. A workflow that only completes because the model volunteered an unstated step is a workflow that breaks at low effort. Run scenarios at supported deployment settings and make required contracts explicit.

A skill that travels across vendors adds a third question: does anything in the body assume one harness's tools, paths, or permission model? That is a portability bug, and it surfaces on another vendor's agent long before it surfaces in an eval.

## Diagnostics

Run these with every baseline, not just the first one; a stale diagnostic hides regressions the same way a stale eval does.

- **Grader consistency.** Grade the same output twice (same case, same arm). A verdict flip means the grader is the noise source, not the skill; tighten the assertion or the judge prompt before trusting the score.
- **Infrastructure robustness.** A timeout, an API error, or a truncated response is an error, not a fail. Record and report it separately; folding it into the pass rate blames the skill for the harness.
- **Headroom.** Re-check on every run, not only at setup: a with-skill score that has crept to 95% or higher means quality is no longer the actionable lever, per Scenario Sourcing above.

## The Hillclimb Loop

Run it with the agent-evals CLI: `judge` (body) or `routing` (description) as the runner and `compare` as the gate. The `agent-evals` skill owns the flags, seeds, intervals and verdicts; this section owns what to change each round and when to stop. Apply the keep/revert rules by hand only without the CLI.

**Setup, once:**

1. State the goal in one sentence: raise the pass rate, or hold it and cut cost/tokens/latency. A goal like "improve the harness" cannot be scored, so it cannot be hillclimbed.
2. Split scenarios and routing prompts into train and test with a fixed random seed. Every round reads train; test is only for the keep/revert decision.
3. Measure noise before the first edit: repeat the baseline run a few times and note the spread. If the spread is bigger than the smallest improvement worth shipping, add repeats or cases before iterating; a single-run comparison inside that spread is not a finding.

**Each round:**

1. Read train-set failures only. Test failures stay unseen until the keep/revert check, or the split leaks and every edit looks like a win.
2. Make one targeted edit that fixes a root cause of a train failure, not a reword of the line that happened to be near it. One edit per round, or a regression cannot be attributed.
3. Run train and test.
4. Keep the edit only if both improve. Train up and test flat is overfitting the training cases; revert. Any regression on either split reverts too, no exceptions for "it should still be fine."
5. After 2-3 flat rounds, or sooner if no single plausible fix could beat the measured noise, stop editing and diagnose instead: bucket the remaining train failures by root cause, separate ambiguous cases and harness errors from real misses, and decide whether the fix is more reps, more cases, or a scenario that needs rewriting rather than another skill edit.

**Finish:** restore the test-best version, report the test score against the pre-loop baseline with a confidence interval (Wilson for a pass rate, bootstrap or a paired test for the delta), and say so plainly when the gain sits inside the noise floor: don't ship a change on a movement its own CI does not clear. With `agent-evals routing` as the runner, treat a description edit under the same keep/revert rule as a body edit.

## Iterate with Two Claudes

**Claude A** authors and refines; **Claude B** runs real tasks in a fresh session with the skill loaded. Hand A the specific observation ("B forgot to filter test accounts") with the failed assertions, the human feedback, and the transcript together, then apply and retest. The fix should generalize past the failing case, not patch it.

## Observe How Claude Navigates

Watch real sessions for:

- **Unexpected exploration:** files read in an unplanned order; structure may be wrong
- **Missed connections:** a reference isn't followed; make links more prominent
- **Overreliance on one section:** same file read every time; move it into SKILL.md
- **Ignored content:** a never-accessed reference; delete it or signal it better in SKILL.md
- **Wasted work in transcripts:** unrequested validation, intermediate files nobody uses; the instruction that caused it is a removal candidate
- **Repeated helper scripts:** every run writes the same parser or chart builder; bundle it in `scripts/`

## Re-Evaluating After a Rewrite

After improving a skill (see `improving-existing-skills.md`), rerun evals before shipping against both the pre-edit snapshot and no-skill. The previous version detects regressions; no-skill tests whether the skill still earns its place. Beating the previous version alone is not a keep verdict. Better audit dimensions but worse evals is a regression: dimensions measure form, evals measure behavior.

Maintain the skill like code: version its body, references, scripts, and evals together, identify each run's skill revision, and review the diff with its validation and behavioral evidence before release. Record unrun comparisons explicitly. A passing format check does not substitute for the behavioral comparison.

## Measuring Adoption

Log invocations with a PreToolUse hook and compare actual usage against the trigger rate you expected; undertriggering sends you to Routing Evals, and across an org the same log finds promotion candidates for a shared library. Adoption chooses what to investigate, not what to keep: invocations and installs measure use, and only the with-versus-without comparison establishes added value.
