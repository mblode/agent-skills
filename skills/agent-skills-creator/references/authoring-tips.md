# Authoring Tips

High-signal skill-content guidance; complements the format rules in `format-specification.md`.

## Contents

- Don't State the Obvious
- Open with Boundaries (IS/IS-NOT)
- Build a Gotchas Section
- Use the File System for Progressive Disclosure
- Comprehensive Reference Folders
- Degrees of Freedom
- Provide a Default, Not a Menu
- Common Content Patterns
- The Description Field Is For the Model
- Think Through the Setup
- Memory and Storing Data
- Store Scripts and Generate Code
- On-Demand Hooks
- Composing Skills
- Measuring Skills

## Don't State the Obvious

Claude knows coding and the codebase. Write only what pushes it off its defaults.

- Omit anything Claude would do correctly unsupervised
- General coding advice ("use descriptive variable names") is noise
- Standard conventions (2-space indentation, semicolons) are known
- Target where your org deviates from defaults or Claude consistently errs

**Test:** for each line, ask "Would removing this cause a mistake?" If not, cut it.

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
- `assets/`: template files to copy and adapt (e.g., the markdown report template for a report-producing skill)
- `examples/`: usage examples and snippets
- `rules/`: categorized rule files for audit/lint skills

Simplest form: split function signatures, API docs, or examples into separate files and say when to load them.

## Comprehensive Reference Folders

For broad domains (a design system, a full CLI surface, a style guide), many small focused files beat a few monoliths. Full treatment, the `index.md` map, and the 40-file design-system example are in the comprehensive-reference variant in `skill-patterns.md`.

## Degrees of Freedom

Match specificity to task fragility. Over-constraining open work makes the skill brittle; under-constraining fragile work loses determinism. Narrow bridge with cliffs: hand over exact steps. Open field: point a direction.

**High freedom** (multiple valid approaches; context picks the path): prose.

```markdown
Review the code for bugs, readability, and adherence to project conventions.
```

**Medium freedom** (preferred pattern, variation acceptable): pseudocode or parameterized scripts.

```python
def generate_report(data, format="markdown", include_charts=True):
    ...
```

**Low freedom** (fragile, consistency-critical, or destructive): specific commands, few parameters.

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
- Finding 2
```

### Examples pattern

When quality depends on style (commit messages, copy, changelog entries), give 2-3 input/output pairs. Examples convey tone and detail more efficiently than description.

```
Input: Added user authentication with JWT tokens
Output:
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

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

Some skills need user-specific context first. Use a config pattern instead of re-asking every session.

- Store setup in a `config.json` in the skill directory
- Pattern: Step 1 checks for config → gathers via AskUserQuestion (structured, multiple-choice) if missing → later steps use it

```json
{
  "slack_channel": "#team-standups",
  "ticket_project": "BACKEND",
  "author": "Jane Smith"
}
```

## Memory and Storing Data

Persisting files across sessions enables skills that learn and improve over time.

- Store at `${CLAUDE_PLUGIN_DATA}`: stable across upgrades (the skill directory itself may be wiped on upgrade)
- Formats: append-only text logs, JSON, SQLite
- Examples: a standup skill keeps `standups.log` to know what changed since yesterday; an audit skill stores `previous-findings.json` to track regressions

## Store Scripts and Generate Code

Scripts let Claude spend turns on composition, not reconstructing boilerplate.

- Ship executable scripts (`.sh`, `.py`, `.ts`) as helper functions to compose, not regenerate each time
- Pattern: `scripts/` holds utilities; Claude generates wrappers on the fly
- Example: a data skill ships `fetch_events()`, `fetch_users()`, `run_query()` that Claude composes for analysis

For error handling, constants, plan-validate-execute, runtime, package deps, and MCP tool references, see `executable-code.md` (linked from SKILL.md).

## On-Demand Hooks

Hooks can activate only when the skill is called, lasting the session. Use for opinionated safety or observation that should not always run.

- PreToolUse: validate or block tool calls (e.g., block `rm -rf` in a prod skill)
- PostToolUse: observe and log tool results
- Define hooks in SKILL.md for Claude to register

**Examples:**
- `/careful`: blocks destructive commands via PreToolUse matcher on Bash
- `/freeze`: blocks Edit/Write outside a specific directory during debugging
- `/observe`: logs all Bash commands to an audit trail

## Composing Skills

Composition is name-based; no built-in dependency management. Reference another skill by name and the model invokes it if installed. Document it in a "Related skills" section ("After this workflow, run `skill-name`") and keep each skill on one concern, not duplicating another's.

## Measuring Skills

Log invocations with a PreToolUse hook, then compare actual usage against expected trigger rates. Undertriggering usually means the description needs better trigger phrases.
