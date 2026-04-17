# Executable Code in Skills

Guidance for skills that include scripts, depend on packages, or invoke MCP tools. Focus is on patterns that keep scripts reliable and cheap to execute.

## Contents

- Execute vs. Read as Reference
- Solve, Don't Punt
- No Voodoo Constants
- Plan-Validate-Execute
- Runtime Environment
- Package Dependencies
- MCP Tool References
- Visual Analysis

## Execute vs. Read as Reference

Make execution intent explicit in SKILL.md. Without it, Claude may read a script and reconstruct its logic instead of running it — wasting tokens and diverging from the canonical behavior.

- **Execute:** "Run `scripts/analyze_form.py input.pdf > fields.json`"
- **Reference:** "See `scripts/analyze_form.py` for the field-extraction algorithm"

Prefer execution for deterministic work. Reserve reference reads for cases where Claude must adapt the algorithm to a novel input.

## Solve, Don't Punt

Scripts should handle recoverable errors, not defer them to Claude. Punting wastes a turn and produces non-deterministic outcomes.

**Punt (bad):**

```python
def process_file(path):
    return open(path).read()
```

**Solve (good):**

```python
def process_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"{path} not found, creating default")
        with open(path, "w") as f:
            f.write("")
        return ""
```

A script that always returns a sensible default (or fails with a specific, actionable error message) is more useful than one that raises raw exceptions.

## No Voodoo Constants

Every magic number needs a comment explaining why. If the author cannot justify the value, Claude cannot either.

**Voodoo:**

```python
TIMEOUT = 47
MAX_RETRIES = 5
```

**Justified:**

```python
# HTTP requests typically complete under 30s; extra margin for slow connections
REQUEST_TIMEOUT = 30

# 3 retries covers most intermittent failures without excessive latency
MAX_RETRIES = 3
```

## Plan-Validate-Execute

For batch or destructive operations, split the work into three phases so errors surface before changes are applied.

1. **Plan** — Claude writes an intermediate file describing the operation (e.g., `changes.json` listing every field and value)
2. **Validate** — a script checks the plan against the target (schema, conflicts, missing fields) and produces actionable errors
3. **Execute** — a second script applies the plan once validation passes

Use this for multi-record edits, schema migrations, form filling, and similar operations where a dry run is valuable. Validation scripts should name specific problems: "Field `signature_date` not in form. Available: customer_name, order_total, signed_date."

## Runtime Environment

Skills run in a filesystem with bash and code execution. The execution model affects how to organize content.

- Only the frontmatter (`name`, `description`) is pre-loaded at session start
- SKILL.md is read when a trigger matches; reference files are read on demand
- Scripts can be **executed** via bash without their source entering the context window — only output counts
- Large reference files and datasets are free until accessed
- Use forward slashes in all paths; Windows-style paths break on Unix
- Name files descriptively (`form-validation-rules.md`, not `doc2.md`) so Claude can guess content from the path

Bundle comprehensive resources — docs, examples, datasets — because they cost nothing until read.

## Package Dependencies

List required packages explicitly in SKILL.md. Availability differs by environment:

- **Claude Code / claude.ai code execution:** can install from npm and PyPI at runtime
- **Claude API (direct):** no network access, no runtime installs — dependencies must be pre-installed

When writing scripts, prefer the standard library when possible. When third-party packages are required, name them and show the install command once in SKILL.md.

## MCP Tool References

Always reference MCP tools by their fully qualified name: `ServerName:tool_name`. Unqualified names cause "tool not found" errors when multiple servers expose similarly named tools.

- `BigQuery:bigquery_schema` — not `bigquery_schema`
- `GitHub:create_issue` — not `create_issue`
- `Linear:list_issues` — not `list_issues`

Use the qualified form in both instructions and examples. If a server name changes, update every reference at once.

## Visual Analysis

When inputs can be rendered as images, Claude can analyze them directly with vision. This is often more reliable than parsing structured text for layout-heavy formats.

- PDF forms → render pages to images, analyze field positions
- Charts and diagrams → describe contents from the image, not the source
- Web pages → screenshot and inspect layout

Provide a script that produces the image (`pdf_to_images.py`), then instruct Claude to read the output with vision. Keep the script focused on conversion; let Claude handle interpretation.
