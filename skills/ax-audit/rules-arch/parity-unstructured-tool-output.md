---
title: Tool returns prose instead of a structured, honest result
slug: parity-unstructured-tool-output
category: parity
defaultTier: fix-this-sprint
surfaces: agent-tool-execution
agent-native-principle: The tool surface is a protocol, legible and honest about its state
detection: code-auditable
related: comm-no-completion-signal, parity-no-tool-parity, trust-no-uncertainty-markers
---

## Tool returns prose instead of a structured, honest result

A tool handler returns a human sentence and swallows its failures into that same sentence. The agent reading it has to parse English to work out whether the call succeeded, and there is nothing to parse when the handler answers `"Something went wrong"` with a 200. Every capability above this tool is now guessing, and the guess is silent.

When the product's primary caller is another agent, the return value is the interface. Prose is a rendering; a result object is a contract.

## What goes wrong

`send_invoice` fails validation upstream. The handler catches, logs, and returns `"Could not send the invoice, please try again."` with HTTP 200. The orchestrator sees a successful tool result, marks the step done, and moves to `mark_invoice_paid`. The user is told the invoice went out. It did not, and no error ever surfaced, because the only signal that it failed was a sentence nobody typed a parser for.

The same failure in the other direction: a handler returns a rendered HTML table of search results. The agent can quote it back but cannot filter, count, or select a row, so the next tool call is invented from a string.

## Detection

**Surfaces:** agent-tool-execution

**Static signals:**
1. List the tool handler files: `rg -l 'tool|handler|execute' --type=ts src/`, then narrow to files registering tools.
2. For each handler, read the return statements on the error path. Flag a bare string or template literal.
3. Flag `catch` blocks that return a value at all rather than rethrowing or returning a typed failure.
4. Flag responses that carry an error message with a 2xx status.
5. Compare the success return against a declared output type. No type or schema on the tool definition is itself the finding.

**Concrete commands:**
```bash
# error-path prose: a catch that returns a string literal or template literal
rg -n -U 'catch\s*\([^)]*\)\s*\{[^}]*return\s+[`"'\'']' --type=ts src/

# a 2xx carrying an error payload
rg -n 'status:\s*200' -A 3 --type=ts src/ | rg -i 'error|failed|could not'

# tool definitions with no output schema alongside the input schema
rg -n 'inputSchema|parameters:' --type=ts src/ -A 6 | rg -v 'outputSchema|returns'
```

**False-positive guards:**
- Skip handlers whose return type is a discriminated union (`{ ok: false, code, message }` counts as structured, message included).
- A prose `message` field alongside a machine-readable `code` passes. The finding is prose *instead of*, not prose *in addition to*.
- Skip files with `// ax-audit-ignore:parity-unstructured-tool-output` near the match.
- Skip test fixtures, mocks, and Storybook files.
- Skip tools whose whole job is text generation (a `draft_reply` returning a draft string is the payload, not a status).

## Fix

**Concrete change:** return a discriminated result and let the status line up with it.

```ts
// before: the caller cannot tell these two apart
export async function sendInvoice(id: string) {
  try {
    await billing.send(id);
    return "Invoice sent.";
  } catch (e) {
    logger.error(e);
    return "Something went wrong.";
  }
}

// after: one shape, both branches machine-readable
type ToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; retryable: boolean };

export async function sendInvoice(id: string): Promise<ToolResult<{ sentAt: string }>> {
  try {
    const { sentAt } = await billing.send(id);
    return { ok: true, data: { sentAt } };
  } catch (e) {
    logger.error(e);
    return {
      ok: false,
      code: e instanceof ValidationError ? "invoice_invalid" : "billing_unavailable",
      message: e.message,
      retryable: !(e instanceof ValidationError),
    };
  }
}
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | fix-this-sprint |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

A tool that reports failure as success is a correctness bug on the execution path, not an ergonomics one, which is why this is the rare parity rule that blocks only on the surface where the tool actually runs.

## Examples

**Anti-pattern (fails):**

```ts
server.tool("delete_record", async ({ id }) => {
  const res = await db.delete(id);
  return res.count > 0
    ? `Deleted record ${id}.`
    : `No record matched ${id}.`;
});
```

The agent cannot distinguish "deleted" from "nothing matched" without string matching, so a retry loop either never fires or never stops.

**Applied (passes):**

```ts
server.tool("delete_record", async ({ id }) => {
  const res = await db.delete(id);
  return res.count > 0
    ? { ok: true, data: { id, deleted: res.count } }
    : { ok: false, code: "not_found", message: `No record matched ${id}.`, retryable: false };
});
```

## Suppression

```ts
// ax-audit-ignore:parity-unstructured-tool-output, the draft is the payload, not a status
server.tool("draft_reply", async ({ threadId }) => generateDraft(threadId));
```
