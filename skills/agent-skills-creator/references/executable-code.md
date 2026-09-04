# Executable Code in Skills

For skills that include scripts, depend on packages, inject live context, or invoke MCP tools. Patterns that keep scripts reliable and cheap to execute.

## Contents

- Execute vs. Read as Reference
- Paths and Permissions
- Dynamic Context Injection
- Solve, Don't Punt
- No Voodoo Constants
- Plan-Validate-Execute
- Runtime Environment
- Package Dependencies
- MCP Tool References
- Visual Analysis

## Execute vs. Read as Reference

State execution intent in SKILL.md. Otherwise Claude reconstructs the script's logic instead of running it, wasting tokens and diverging from canonical behavior.

- **Execute:** "Run `scripts/analyze_form.py input.pdf > fields.json`"
- **Reference:** "See `scripts/analyze_form.py` for the field-extraction algorithm"

Execute deterministic work; read-as-reference only when Claude must adapt the algorithm to novel input.

## Paths and Permissions

The session shell's working directory moves whenever Claude runs `cd`, so a bare `scripts/x.sh` resolves against wherever the shell happens to be. Resolve `scripts/x.sh` against the installed SKILL.md directory. Claude Code can substitute `${CLAUDE_SKILL_DIR}`; other hosts need the actual resolved path. Run this repository's validator from its root with the explicit skill argument.

Pair the path with an `allowed-tools` rule when the script should run without a permission prompt. The variable is substituted in both places, so the rule matches the exact command the body issues:

```yaml
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
```

The grant lasts the invoking turn and clears on the next user message. Keep it narrow: a skill checked into a repo can grant itself broad access, and it applies even in an untrusted folder.

## Dynamic Context Injection

`` !`command` `` at the start of a line (or after whitespace) runs before Claude sees the skill and is replaced by the command's output, stdout and stderr merged. A ```` ```! ```` fenced block does the same for several lines. Use it for data the skill always needs on invocation: `git diff HEAD`, `gh pr view --comments`, a version check. Claude then starts with the facts inlined instead of spending a turn fetching them.

Failure rules that catch people:

- A non-zero exit aborts the whole invocation; Claude never sees the skill. Search commands get a pass on exit 1, nothing else does. Append `|| true` to any check that exits non-zero on findings.
- Injected commands never prompt. A permission check that would ask, or deny, aborts the invocation. Pre-approve with `allowed-tools`; a matching deny rule still wins.
- Each command runs under the Bash tool's 2-minute timeout, and large output arrives as a file path plus preview.
- It runs only in Claude Code on the local machine. Skills synced from claude.ai, Cowork, the Skills API, and claude.ai chat replace or skip it. A skill that must travel fetches the data in its body instead.

Substitution runs once; command output is not rescanned for more placeholders.

## Solve, Don't Punt

Handle recoverable errors in the script, not defer them to Claude. Punting wastes a turn and is non-deterministic.

A script that returns `open(path).read()` hands Claude a `FileNotFoundError` to interpret; one that catches it, creates the default, and says so keeps the turn deterministic. Return a sensible default, or fail with a specific actionable message. Never raise raw exceptions to Claude.

## No Voodoo Constants

Every magic number needs a comment explaining why. If the author can't justify it, neither can Claude, and an unexplained constant is one nobody dares change.

```python
# HTTP requests typically complete under 30s; extra margin for slow connections
REQUEST_TIMEOUT = 30
```

`TIMEOUT = 47` is the failure mode: a number chosen once for a reason now lost.

## Plan-Validate-Execute

For batch or destructive operations, split into three phases so errors surface before changes apply.

1. **Plan:** Claude writes an intermediate file describing the operation (e.g., `changes.json` listing every field and value)
2. **Validate:** a script checks the plan against the target (schema, conflicts, missing fields) and produces actionable errors
3. **Execute:** a second script applies the plan once validation passes

Use for multi-record edits, schema migrations, form filling, anywhere a dry run helps. Validation scripts name specific problems: "Field `signature_date` not in form. Available: customer_name, order_total, signed_date."

## Runtime Environment

Executable skills require filesystem and code-execution tools. Discover those capabilities from the host; an API or browser alone does not imply a shell.

- Only the frontmatter (`name`, `description`) is pre-loaded at session start
- SKILL.md is read when a trigger matches; reference files are read on demand
- Scripts can be **executed** via bash without their source entering the context window; only output counts, and that output is re-sent every later turn, so prefer quiet flags (`--reporter=dot`, `--quiet`, `tail`)
- Large reference files and datasets are free until accessed
- Name files descriptively (`form-validation-rules.md`, not `doc2.md`) so Claude can guess content from the path

Bundle comprehensive resources (docs, examples, datasets); they cost nothing until read.

## Package Dependencies

List required packages explicitly in SKILL.md and use `compatibility` for prerequisites that determine whether the workflow can run. Check available runtimes, network access, and installation policy in the active environment; a vendor name alone does not establish those capabilities.

Prefer the standard library; when third-party packages are required, name them and show the install command once in SKILL.md.

## MCP Tool References

Reference MCP tools by their fully qualified name: `ServerName:tool_name`. Unqualified names cause "tool not found" errors when multiple servers expose similarly named tools.

- `BigQuery:bigquery_schema`, not `bigquery_schema`
- `GitHub:create_issue`, not `create_issue`
- `Linear:list_issues`, not `list_issues`

Use the qualified form in instructions and examples. If a server name changes, update every reference at once.

## Visual Analysis

When the host supports image input, hand over the picture rather than a description of it. For layout-heavy formats this beats parsing the structured source, because position and grouping are the information.

- PDF forms → render pages to images, read field positions off the render
- Charts and diagrams → read the image, not the plotting source
- Web pages → screenshot and inspect the rendered layout

Provide a script that produces the image (`pdf_to_images.py`), then hand the output over directly. Keep the script focused on conversion.

Two failure modes follow from treating vision as something to route around:

- **Instructing a transcription step.** "Describe the chart, then reason about the description" throws away the thing that made the image worth producing, and the description becomes a lossy intermediate nobody can audit. Ask for the conclusion from the image.
- **Assuming image output.** Image input and generation are separate host capabilities. Several current frontier models take images in and return only text. A skill whose deliverable is a generated image routes to an image-generation tool and says which one, and states what it does when that tool is absent. A skill that only needs to *see* something has no such dependency.
