# Authoring Tips

Practical guidance for writing high-signal skill content. These complement the format rules in `format-specification.md`.

## Contents

- Don't State the Obvious
- Build a Gotchas Section
- Use the File System for Progressive Disclosure
- Degrees of Freedom
- Common Content Patterns
- The Description Field Is For the Model
- Think Through the Setup
- Memory and Storing Data
- Store Scripts and Generate Code
- On-Demand Hooks
- Composing Skills
- Measuring Skills

## Don't State the Obvious

Claude knows a lot about coding and your codebase. Focus on information that pushes Claude out of its normal way of thinking.

- If Claude would do it correctly without the instruction, omit it
- General coding advice ("use descriptive variable names") adds noise
- Standard framework conventions (2-space indentation, semicolons) are already known
- Focus on where your org deviates from defaults or where Claude consistently gets it wrong

**Test:** For each line in SKILL.md, ask "Would removing this cause Claude to make a mistake?" If not, cut it.

## Build a Gotchas Section

The highest-signal content in any skill. Build from common failure points Claude runs into when using the skill.

- Place near the end of SKILL.md as a quick-reference section (call it "Gotchas" or "Anti-patterns")
- Ground every gotcha in a real observed failure, not hypothetical concerns
- Update the section over time as new failure modes appear
- Format as short, scannable bullets — not paragraphs

**Good:** "Don't use the brand domain for tenant subdomains — reputation damage from one tenant affects all"
**Bad:** "Be careful with domain naming" (too vague, no reason given)

## Use the File System for Progressive Disclosure

A skill is a folder, not just a markdown file. Think of the entire file system as context engineering. Tell Claude what files are in your skill, and it will read them at appropriate times.

- `references/` — deep-dive documentation loaded on demand
- `scripts/` — executable utilities Claude can compose
- `assets/` — template files for output Claude should copy and adapt (e.g., if your skill produces a markdown report, include the template in `assets/`)
- `examples/` — usage examples and code snippets Claude can reference
- `rules/` — categorized rule files for audit/lint skills

The simplest form of progressive disclosure is pointing to other markdown files. Split detailed function signatures, API docs, or usage examples into separate files and tell Claude when to load them.

## Degrees of Freedom

Match specificity to how fragile the task is. Over-constraining open-ended tasks makes the skill brittle; under-constraining fragile tasks loses determinism.

Analogy: Claude is a robot crossing a landscape. On a narrow bridge with cliffs on either side, hand it exact steps. In an open field, point in a direction and let it choose the path.

**High freedom** — multiple valid approaches; context determines best path. Use prose instructions:

```markdown
Review the code for bugs, readability, and adherence to project conventions.
```

**Medium freedom** — a preferred pattern exists but variation is acceptable. Use pseudocode or parameterized scripts:

```python
def generate_report(data, format="markdown", include_charts=True):
    ...
```

**Low freedom** — fragile, consistency-critical, or destructive. Use specific commands with few parameters:

```bash
python scripts/migrate.py --verify --backup
```

When to be prescriptive: format contracts, safety constraints, naming conventions, API schemas, migrations. When to be flexible: implementation approach, code structure, tool selection.

**Railroading anti-pattern:** "Use exactly this signature: `async function fetchUser(id: string): Promise<User>`"
**Flexible alternative:** "Fetch functions return typed promises and accept string IDs"

## Common Content Patterns

Three patterns recur across skills. Name them explicitly when reaching for one.

### Template pattern

Provide a fixed or flexible output format so Claude produces consistent results. Use **strict** phrasing when the format is a contract ("ALWAYS use this exact template"), **flexible** phrasing when it's a starting point ("Here is a sensible default; adjust sections as needed").

```markdown
# [Title]

## Executive summary
[One paragraph]

## Key findings
- Finding 1
- Finding 2
```

### Examples pattern

When output quality depends on style (commit messages, copy, changelog entries), provide 2-3 input/output pairs. Examples convey tone and level of detail more efficiently than description.

```
Input: Added user authentication with JWT tokens
Output:
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

### Conditional workflow pattern

Route Claude through decision points instead of listing every path upfront.

```markdown
Determine modification type:
- Creating new content? → Follow "Creation workflow" below
- Editing existing content? → Follow "Editing workflow" below
```

Push large branches into separate reference files so the main SKILL.md stays scannable.

## The Description Field Is For the Model

When Claude Code starts a session, it scans every skill's description to decide relevance. The description is a trigger description, not a human summary.

- Optimize for the words users will say when they need the skill
- Include action verbs and domain nouns the model uses for routing
- Add quoted user phrases: `"how do I..."`, `"build a..."`, `"fix my..."`
- Structure: `[Does what] for/using [domain]. [Covers what]. Use when [specific trigger phrases].`

**Weak:** "Provides architecture guidance for multi-tenant platforms"
**Strong:** "Provides architecture guidance for multi-tenant platforms on Cloudflare or Vercel. Use when defining domain strategy, tenant identification, isolation, routing, or asking 'how do I support multiple tenants' or 'build a white-label platform'."

## Think Through the Setup

Some skills need user-specific context before they can work. Use a config pattern rather than asking the same questions every session.

- Store setup information in a `config.json` file in the skill directory
- If config is not set up, the skill's first step should gather context from the user
- Use AskUserQuestion for structured, multiple-choice questions
- Pattern: Step 1 checks for config → gathers if missing → remaining steps use it

```json
{
  "slack_channel": "#team-standups",
  "ticket_project": "BACKEND",
  "author": "Jane Smith"
}
```

## Memory and Storing Data

Skills can persist data across sessions by storing files. This enables skills that learn and improve over time.

- Use `${CLAUDE_PLUGIN_DATA}` as the storage path — it is stable across skill upgrades (data in the skill directory itself may be deleted on upgrade)
- Formats: append-only text logs, JSON files, SQLite databases
- Example: a standup skill keeps a `standups.log` so it knows what changed since yesterday
- Example: an audit skill stores `previous-findings.json` to track regressions

## Store Scripts and Generate Code

One of the most powerful tools you can give Claude is code. Scripts and libraries let Claude spend its turns on composition rather than reconstructing boilerplate.

- Include executable scripts (`.sh`, `.py`, `.ts`) alongside SKILL.md
- Give Claude helper functions to compose rather than regenerate each time
- Pattern: `scripts/` folder holds utilities, Claude generates wrapper scripts on the fly
- Example: data skill includes `fetch_events()`, `fetch_users()`, `run_query()` — Claude composes these for complex analysis

For error handling, constants, plan-validate-execute, runtime environment, package dependencies, and MCP tool references, see `executable-code.md` (linked from SKILL.md).

## On-Demand Hooks

Skills can include hook definitions that activate only when the skill is called and last for the session duration. Use for opinionated safety or observation hooks that should not run all the time.

- PreToolUse hooks: validate or block tool calls (e.g., block `rm -rf` in a prod skill)
- PostToolUse hooks: observe and log tool results
- Define hooks in the SKILL.md instructions for Claude to register

**Example use cases:**
- `/careful` — blocks destructive commands via PreToolUse matcher on Bash
- `/freeze` — blocks Edit/Write outside a specific directory during debugging
- `/observe` — logs all Bash commands to an audit trail

## Composing Skills

Skills can depend on each other. Reference other skills by name in your SKILL.md and the model will invoke them if they are installed.

- Dependency management is not built into skills yet — composition is name-based
- Use a "Skill handoffs" or "Related skills" section to document which skills yours connects to
- Pattern: "After completing this workflow, run `skill-name` for the next step"
- Keep each skill focused on one concern; compose rather than duplicate

## Measuring Skills

To understand adoption and quality, track when and how often skills are invoked.

- Use a PreToolUse hook to log skill invocations across your org
- Compare actual usage against expected trigger rates to find undertriggering skills
- Undertriggering often means the description field needs better trigger phrases
- Popular skills are candidates for promotion to your marketplace or shared repo
