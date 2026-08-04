# Authoring Tips

What to put in a skill and how hard to say it. The mechanical rules live in `scripts/validate.sh`; this file is the judgement the script cannot make.

## Contents

- Don't State the Obvious
- Don't Instruct Behavior the Model Already Has
- Judgement Over Rules
- Don't Fight the Harness or a Sibling
- Cut Constraints, Keep Opinions
- Open with Boundaries (IS/IS-NOT)
- Build a Gotchas Section
- Use the File System for Progressive Disclosure
- Comprehensive Reference Folders
- Reference-as-Spec
- Degrees of Freedom
- Provide a Default, Not a Menu
- Design the Interface, Not the Examples
- Common Content Patterns
- The Description Field Is For the Model
- Think Through the Setup
- Memory and Storing Data
- Store Scripts and Generate Code
- On-Demand Hooks
- Composing Skills

## Don't State the Obvious

Claude knows coding and the codebase. Write only what pushes it off its defaults.

- Omit anything Claude would do correctly unsupervised
- General coding advice ("use descriptive variable names") is noise
- Standard conventions (2-space indentation, semicolons) are known
- Target where your org deviates from defaults or Claude consistently errs

**Test:** for each line, ask "Would removing this cause a mistake?" If not, cut it.

## Don't Instruct Behavior the Model Already Has

The sharpest case of the section above, and the one that costs most, because these instructions do not sit there inertly: they compound with behavior the model already performs and push it past useful.

Current models verify their own work, catch and fix their own mistakes, and delegate to subagents readily. So "add a final verification step", "double-check your answer before responding", "re-verify", and "use a subagent to check your work" buy nothing and spend real tokens producing over-verification. Delete them; output quality holds.

An external check is not this. "Run the test suite and quote the output" and "watch the check fail, then pass" produce evidence the model cannot generate by reasoning, so they stay.

Two related levers skew long by default and are worth setting deliberately:

- **Calibrate the length of artifacts the skill writes to disk.** Reports, plans, briefs, and docs run long, and a fixed output template invites filling every section instead of dropping the ones the task does not need. Say that length follows the work, not the template. This is a real opinion, unlike "write concisely", which the model already believes it is doing.
- **Cap delegation where the skill fans out.** Genuinely independent, sizeable tracks justify subagents; small tasks do not, and verification never does. A deterministic cap beats a judgement call, which is why `tidy` fixes the number at four launched in one message rather than leaving it open.

**Test:** would the model do this unprompted? If yes, the instruction is at best inert and at worst additive. Same test as "Cut Constraints, Keep Opinions" below, pointed at the model's behavior rather than at its knowledge.

## Judgement Over Rules

Absolutes earn their place in a narrow set of cases: safety, data loss, format contracts, and rules Claude has been observed to break. Everywhere else, state the outcome and let surrounding context pick the path.

The reason is asymmetric cost. A rule that is wrong on one prompt in ten still gets followed on that prompt, and the model cannot tell that this is the case where you would have wanted it to pivot. Guidance that names the goal survives the exception; a prohibition does not.

**Rule:** "Default to writing no comments. Never write multi-line comment blocks."
**Outcome:** "Write code that reads like the surrounding code: match its comment density, naming, and idiom."

The second is shorter, has no exception list to maintain, and gets a densely commented file right without being told about it.

## Don't Fight the Harness or a Sibling

Before adding a directive, check whether the harness already does it, a sibling skill owns it, or the repo AGENTS.md states it. Overlapping instructions in one context ("leave documentation as appropriate" against "DO NOT add comments") make the model reconcile before it can act, and reconciliation is paid on every invocation.

Route instead of restate: name the sibling in the IS-NOT line, and resolve precedence in advance where a clash is likely. `tidy` does this well, reading the project CLAUDE.md in Phase 1 and stating that its conventions override the skill's own defaults when they conflict. The model is told who wins rather than left to arbitrate.

## Cut Constraints, Keep Opinions

The counterweight to the two sections above, and the one most often misapplied. A skill's value *is* the opinion it encodes: your team's taste, your product's constraints, the thing Claude does not do by default. Deleting that leaves a skill that adds nothing.

The deletion target is guardrails duplicating the model's own judgement, not strong wording.

**Keep:** a specific banned-word list, a dark-first deck rule, a house punctuation style. Claude does not share these by default.
**Cut:** "write clear prose", "handle errors properly", "use good naming". Claude does this unprompted.

The test is "would Claude do this anyway", never "is this strongly worded".

## Open with Boundaries (IS/IS-NOT)

When sibling skills exist or scope creep is likely, open the body (right after the H1 intro) with a bold IS/IS-NOT pair to prevent wrong-skill routing and scope creep.

```markdown
- **IS:** producing a self-contained brief another agent can execute without clarification.
- **IS NOT:** doing the task itself, or planning work you will execute in this session.
```

Name the sibling to route to in the IS-NOT line ("use `agents-md`"). Skip it when a skill has no neighbors and unmistakable scope; it would just restate the description.

## Build a Gotchas Section

The highest-signal content in any skill. Build from real failure points Claude hits.

- Place near the end of SKILL.md ("Gotchas" or "Anti-patterns"), as short scannable bullets, not paragraphs
- Ground each in an observed failure, not a hypothetical
- Name the concrete command, value, or path and the consequence of getting it wrong; a warning without a consequence reads as optional
- Update over time as new failure modes appear

**Good:** "Don't use the brand domain for tenant subdomains; reputation damage from one tenant affects all"
**Bad:** "Be careful with domain naming" (too vague, no reason given)

## Use the File System for Progressive Disclosure

A skill is a folder, not one file: treat the file system as context engineering. List the files and Claude loads them when relevant.

- `references/`: deep-dive docs loaded on demand
- `scripts/`: executable utilities Claude composes
- `assets/`: template files to copy and adapt
- `examples/`: usage examples and snippets
- `rules/`: categorized rule files for audit/lint skills

SKILL.md is a map to that tree, not a repository of everything the domain knows. A reference nothing ever loads is dead weight, and a SKILL.md that inlines what a reference should hold is paid for on every invocation.

## Comprehensive Reference Folders

For broad domains (a design system, a full CLI surface, a style guide), many small focused files beat a few monoliths. Full treatment, the `index.md` map, and the 40-file design-system example are in the comprehensive-reference variant in `skill-patterns.md`.

## Reference-as-Spec

The highest-fidelity reference is code. An existing implementation, a test suite, or a vendored library in another language communicates a contract better than prose describing the same contract, because it cannot be vague and it cannot drift from itself.

When a skill needs Claude to match a contract, point at the code and interrogate only the deviations. `planning` does this with its reference-as-spec probe: it asks whether existing code, a library, or a site already does this the way the user wants, then treats those semantics as the spec. Prefer, in order: the code itself, a test suite that pins its behavior, then prose.

## Degrees of Freedom

Match specificity to task fragility. Over-constraining open work makes the skill brittle; under-constraining fragile work loses determinism. Narrow bridge with cliffs: hand over exact steps. Open field: point a direction.

- **High freedom** (multiple valid approaches, context picks the path): prose. "Review the code for bugs, readability, and adherence to project conventions."
- **Medium freedom** (preferred pattern, variation acceptable): pseudocode or a parameterized signature.
- **Low freedom** (fragile, consistency-critical, or destructive): the exact command.

```bash
python scripts/migrate.py --verify --backup
```

Prescriptive for: format contracts, safety constraints, naming conventions, API schemas, migrations. Flexible for: implementation approach, code structure, tool selection.

**Railroading:** "Use exactly this signature: `async function fetchUser(id: string): Promise<User>`"
**Flexible:** "Fetch functions return typed promises and accept string IDs"

## Provide a Default, Not a Menu

When several tools or libraries could work, pick one and show it; listing every option forces Claude to choose with no basis and bloats the skill. Add an escape hatch only for the known exception.

**Bad:** "You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image."
**Good:** "Use pdfplumber for text extraction. For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."

## Design the Interface, Not the Examples

For anything with a callable surface (a `scripts/` utility, `config.json`, rule filenames), spend the tokens on the interface rather than on usage examples. Expressive parameter names and enums communicate intent while leaving the exploration space open; a worked example narrows it to the case you happened to write.

One line of behavioral instruction attached to an interface outperforms a usage block. A status enum of `pending`, `in_progress`, `completed` plus "keep exactly one item in_progress" fully defines a todo tool with no example at all. In this skill, `validate.sh --all` needs no example because the flag says what it does.

## Common Content Patterns

Three patterns recur. Name them explicitly when reaching for one.

### Template pattern

A fixed or flexible output format for consistent results. **Strict** when the format is a contract ("ALWAYS use this exact template"); **flexible** when a starting point ("sensible default; adjust sections as needed").

```markdown
# [Title]

## Executive summary
[One paragraph]

## Key findings
- Finding 1
```

### Examples pattern

Examples narrow the exploration space, which is exactly what you want when output style *is* the deliverable: commit messages, copy, changelog entries. Give 2-3 input/output pairs there, because style is faster to show than to describe.

Do not reach for it to teach an interface or to cover input Claude must adapt to. Narrowing then works against you: the model pattern-matches your example instead of reading the situation. See "Design the Interface, Not the Examples".

### Conditional workflow pattern

Route through decision points instead of listing every path upfront.

```markdown
Determine modification type:
- Creating new content? → Follow "Creation workflow" below
- Editing existing content? → Follow "Editing workflow" below
```

Push large branches into separate reference files so SKILL.md stays scannable.

## The Description Field Is For the Model

At session start, Claude scans every description to decide relevance. It is a trigger description, not a human summary.

- Optimize for the words users say when they need the skill: action verbs and domain nouns the model routes on
- Add quoted user phrases: `"how do I..."`, `"build a..."`, `"fix my..."`
- Structure: `[Does what] for/using [domain]. [Covers what]. Use when [specific trigger phrases].`

**Weak:** "Provides architecture guidance for multi-tenant platforms"
**Strong:** "Provides architecture guidance for multi-tenant platforms on Cloudflare or Vercel. Use when defining domain strategy, tenant identification, isolation, routing, or asking 'how do I support multiple tenants' or 'build a white-label platform'."

## Think Through the Setup

Some skills need user-specific context first. Store it in a `config.json` in the skill directory rather than re-asking every session: Step 1 checks for the config, gathers missing values via AskUserQuestion, and later steps consume it.

## Memory and Storing Data

Auto-memory now owns facts about the user, their feedback, and ongoing project context, so a skill should not instruct anyone to hand-write memories into CLAUDE.md.

Reserve `${CLAUDE_PLUGIN_DATA}` for artifacts the skill itself writes and reads back: regression baselines, append-only run logs, a previous-findings file an audit compares against. Store there rather than in the skill directory, which may be wiped on upgrade. To measure adoption, log invocations with a PreToolUse hook and compare actual usage against expected trigger rates; undertriggering usually means the description needs better trigger phrases.

## Store Scripts and Generate Code

Scripts let Claude spend turns on composition, not reconstructing boilerplate. Ship executables (`.sh`, `.py`, `.ts`) as helper functions to compose, and let Claude generate the wrappers. A data skill shipping `fetch_events()`, `fetch_users()`, and `run_query()` turns each analysis into a few lines of glue.

For error handling, constants, plan-validate-execute, runtime, and package dependencies, see the executable-code reference listed in SKILL.md.

## On-Demand Hooks

Hooks can activate only when the skill is called, lasting the session. Use for opinionated safety or observation that should not always run.

- PreToolUse: validate or block tool calls (e.g. block `rm -rf` in a prod skill)
- PostToolUse: observe and log tool results

**Examples:** `/careful` blocks destructive commands via a PreToolUse matcher on Bash; `/freeze` blocks Edit and Write outside one directory during debugging; `/observe` logs every Bash command to an audit trail.

## Composing Skills

Composition is name-based; no built-in dependency management. Reference another skill by name and the model invokes it if installed. Document it in a "Related skills" section ("After this workflow, run `skill-name`") and keep each skill on one concern, not duplicating another's.
