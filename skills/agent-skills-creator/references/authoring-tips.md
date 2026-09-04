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
- Standing Instructions, Not One-Time Steps
- Store Scripts and Generate Code
- On-Demand Hooks
- Composing Skills

## Don't State the Obvious

The agent brings general knowledge, but needs the project facts and procedures that affect this task. Ground new guidance in actual artifacts, corrections, or observed failures.

- Omit anything Claude would do correctly unsupervised
- General coding advice ("use descriptive variable names") is noise
- Standard conventions (2-space indentation, semicolons) are known
- Target where your org deviates from defaults or Claude consistently errs

**Test:** for each line, ask "Would removing this cause a mistake?" If not, cut it.

## Don't Instruct Behavior the Model Already Has

The sharpest case of the section above, and the one that costs most, because these instructions do not sit there inertly: they compound with behavior the model already performs and push it past useful.

Generic reminders such as "double-check your answer" do not define a task-specific check. Remove them in a static simplification pass; claim unchanged output quality only after a behavioral comparison. Preserve the exact observation or command that establishes the task's completion.

An external check is not this. "Run the test suite and quote the output" and "watch the check fail, then pass" produce evidence the model cannot generate by reasoning, so they stay.

Three related levers skew long by default and are worth setting deliberately:

- **Calibrate the length of artifacts the skill writes to disk.** Reports, plans, briefs, and docs run long, and a fixed output template invites filling every section instead of dropping the ones the task does not need. Say that length follows the work, not the template. This is a real opinion, unlike "write concisely", which the model already believes it is doing.
- **Write the quiet form of commands the skill tells Claude to run.** `npm test`, `git log`, and a full build dump hundreds of lines that get re-sent every remaining turn. Prefer `--reporter=dot`, `--quiet`, or `tail`.
- **Leave orchestration to the host.** Specify independent work and expected results where delegation adds value. Do not prescribe a fixed agent count, a model override, or repeated review rounds for every task.

**Test:** would the model do this unprompted? If yes, the instruction is at best inert and at worst additive. Same test as "Cut Constraints, Keep Opinions" below, pointed at the model's behavior rather than at its knowledge.

## Judgement Over Rules

Absolutes earn their place in a narrow set of cases: safety, data loss, format contracts, and rules Claude has been observed to break. Everywhere else, state the outcome and let surrounding context pick the path.

The reason is asymmetric cost. A rule that is wrong on one prompt in ten still gets followed on that prompt, and the model cannot tell that this is the case where you would have wanted it to pivot. Guidance that names the goal survives the exception; a prohibition does not.

**Rule:** "Default to writing no comments. Never write multi-line comment blocks."
**Outcome:** "Write code that reads like the surrounding code: match its comment density, naming, and idiom."

The second is shorter, has no exception list to maintain, and gets a densely commented file right without being told about it.

## Don't Fight the Harness or a Sibling

Before adding a directive, check whether the harness already does it, a sibling skill owns it, or the repo AGENTS.md states it. Overlapping instructions in one context ("leave documentation as appropriate" against "DO NOT add comments") make the model reconcile before it can act, and reconciliation is paid on every invocation.

Route instead of restate: name the sibling in the IS-NOT line, and resolve precedence in advance where a clash is likely. `tidy` states that repository conventions override its defaults when they conflict. The model is told who wins rather than left to arbitrate.

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
- Structure: `[Does what] for/using [domain]. [Covers what]. Use when [specific trigger phrases]. For [adjacent job] use [sibling].`
- Front-load. Hosts have different listing budgets and truncation policies. The 1024-character spec limit is a ceiling, not a target; a description that states its key use case in the first sentence survives trimming, one that saves the triggers for the end does not.
- Undertriggering is the common failure, so lean pushy: name the contexts where the skill applies even when the user did not ask for it by name. Use near-miss evaluations to tighten scope when it overtriggers; invocation-control fields are host-specific.

**Weak:** "Provides architecture guidance for multi-tenant platforms"
**Strong:** "Provides architecture guidance for multi-tenant platforms on Cloudflare or Vercel. Use when defining domain strategy, tenant identification, isolation, routing, or asking 'how do I support multiple tenants' or 'build a white-label platform'."

## Think Through the Setup

Some skills need user-specific context first. Store it in a `config.json` in the skill directory rather than re-asking every session: Step 1 checks for the config, gathers missing values via AskUserQuestion, and later steps consume it. A reinstall overwrites the folder, so this is for values cheap to re-ask, not for state the skill accumulates.

## Memory and Storing Data

Follow the host's memory policy and the user's authorization for persistent personal facts. Do not prescribe automatic memory writes or a universal memory owner.

Store durable task artifacts outside the installed skill directory, where updates may replace files. Use a project location or user-selected path. Host-specific storage substitutions require explicit support; portable skills should resolve a concrete path before writing.

## Standing Instructions, Not One-Time Steps

Put enduring constraints and routing before optional detail. Skill reloads, context retention, and compaction differ by host; do not encode a universal token budget or assume a reference remains available forever.

## Store Scripts and Generate Code

Scripts let Claude spend turns on composition, not reconstructing boilerplate. Ship executables (`.sh`, `.py`, `.ts`) as helper functions to compose, and let Claude generate the wrappers. A data skill shipping `fetch_events()`, `fetch_users()`, and `run_query()` turns each analysis into a few lines of glue. Resolve scripts relative to the installed skill directory. Use `${CLAUDE_SKILL_DIR}` only in a host that documents that substitution.

For paths and permissions, `!` context injection, error handling, constants, plan-validate-execute, runtime, and package dependencies, see the executable-code reference listed in SKILL.md.

## On-Demand Hooks

The `hooks` frontmatter field registers hooks when the skill is invoked and keeps them for the rest of the session (or until the first successful run, with `once: true`). Use it for opinionated safety or observation that should not always run.

- PreToolUse: validate or block tool calls (e.g. block `rm -rf` in a prod skill)
- PostToolUse: observe and log tool results

**Shapes this fits:** a `/careful` skill that blocks destructive commands via a PreToolUse matcher on Bash; a `/freeze` skill that blocks Edit and Write outside one directory during debugging; an `/observe` skill that logs every Bash command to an audit trail. The field is Claude Code-only; see the format reference before adding it to a skill that travels.

## Composing Skills

Composition is name-based; no built-in dependency management. Reference another skill by name and the model invokes it if installed. Document it in a "Related skills" section ("After this workflow, run `skill-name`") and keep each skill on one concern, not duplicating another's.

For a self-contained task the skill hands off every time, `context: fork` with an `agent:` runs the body itself as the subagent prompt with no conversation history; the body must then be a task, not conventions. For a job several skills share, an `agents/` prompt with a cheaper `model:` is the reusable form.
