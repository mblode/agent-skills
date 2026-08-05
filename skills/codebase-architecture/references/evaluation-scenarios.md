# Codebase Architecture Evaluation Scenarios

Run these when changing the skill. This file never loads during a user task; it is a rubric for the author, not guidance for the agent.

Evaluate the observable workflow, not whether the answer repeats the skill's wording. Scenarios 1 to 3 test mode routing, which is the property this skill was restructured to get right, so a regression there matters more than anything else here.

## Contents

- 1. Greenfield structure (Design)
- 2. Change has become expensive (Deepen)
- 3. Agents copy the wrong pattern (Harden)
- 4. A check the repo already fails
- 5. Modes compose
- 6. Sibling boundary
- Ablation notes

## 1. Greenfield structure (Design)

**Prompt:** "We're starting a new API and an admin dashboard. How should I structure this?"

**Expected behavior:**

- Enters Design mode and says so; opens no Deepen or Harden reference.
- Asks about constraints (team size, scale, deploy targets, compliance) before proposing a repo shape.
- Each module contract it proposes names the lint rule, type check, or test that catches a violation.
- Produces the architecture brief template.
- Does not run `git log` for hot spots; that step belongs to Deepen and there is no history to read.

## 2. Change has become expensive (Deepen)

**Prompt:** "Adding one discount type touched nine files. Something is wrong with how this is organised."

**Expected behavior:**

- Enters Deepen mode and loads `deepening-existing.md`.
- Runs `git log` to find hot spots **before** listing opportunities, and weights those paths.
- Records each opportunity with file paths and a named pattern, never a vague smell.
- Ranks by leverage before designing any target interface.
- Proposes one vertical slice to migrate first.
- Does not emit the full architecture brief; the artifact is the ranked opportunity list.

## 3. Agents copy the wrong pattern (Harden)

**Prompt:** "Claude keeps extending our old Redux store instead of the new one. Fix the repo so it stops."

**Expected behavior:**

- Enters Harden mode and reaches `contagion-markers.md`.
- Proposes a greppable marker **in the frozen files themselves**, plus the doc entry naming the replacement, plus a lint `warn` on the deprecated import.
- Does not answer with a docs entry or an AGENTS.md line alone; an agent that arrived by grep never reads either.
- Does not open a dead-code or duplication tool, which addresses a different failure.
- Opens no Design reference.

## 4. A check the repo already fails

**Prompt:** "Add a file-size limit. About 400 files are over any cap we'd pick."

**Expected behavior:**

- Loads `enforcement-ladder.md` and names which rung it picked and why.
- **Never proposes a custom guard script with a committed baseline file.** This is the regression test for the doctrine the skill previously had wrong; any `*-ratchet.mjs` or `*.baseline.json` in the answer is a failure regardless of how good the rest is.
- Lands the rule green, by fixing or by scoping with the tool's own config, rather than shipping it red.
- Names the pass, break, revert observation as the completion criterion rather than declaring the config correct.

## 5. Modes compose

**Prompt:** "Design the module structure for our new billing service, and make sure it stays that way."

**Expected behavior:**

- Runs Design then Harden, and states that it is doing both.
- Carries each Design contract into Harden as a specific check, rather than restating the contracts.
- Does not satisfy "stays that way" with prose in AGENTS.md when a static tool can check it.

## 6. Sibling boundary

**Prompt:** "Review my diff and clean up the architecture while you're at it."

**Expected behavior:**

- Routes the diff review to `pr-reviewer` and diff-scoped fixes to `tidy`.
- Applies this skill only to what is outside the diff, or asks which is wanted.
- Does not launch a repo-wide deepening scan in response to a diff-shaped request.

## Ablation notes

Rules whose absence has been observed to regress a scenario, so they should not be cut in a future density pass:

- The `git log` hot-spot step in Deepen (scenario 2). Without it the opportunity list fills with modules nobody touches.
- The explicit "never hand-roll a baseline" wording in `enforcement-ladder.md` (scenario 4). The baseline design is intuitively appealing and is what the model reaches for unprompted, which is why the prohibition is stated as an absolute here rather than as an outcome.

Everything else in the bundle is unablated and should be treated as a guess until a scenario proves otherwise.
