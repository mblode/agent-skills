# Framework Signals

Where the things the rules audit live in the four stacks agentic code is usually written in. Rule greps carry the common spellings; this file carries the rest, plus the spec defaults the rules lean on. When a grep misses in code that plainly does the thing, look the concept up here before recording `unknown`. Identifiers are current for AI SDK 7, MCP 2025-11-25, and the Claude Agent SDK as of the sources listed at the end.

## Contents

- [Approval gate](#approval-gate)
- [Progress and completion](#progress-and-completion)
- [Tool results](#tool-results)
- [Escape hatch](#escape-hatch)
- [Handshake and clarification](#handshake-and-clarification)
- [Agent-rendered UI](#agent-rendered-ui)
- [Sources](#sources)

## Approval gate

| Stack | Where the gate lives | What the rules read off it |
|---|---|---|
| AI SDK 7 | `toolApproval` on `streamText` or `ToolLoopAgent`: per tool one of `'not-applicable'`, `'approved'`, `'denied'`, `'user-approval'`, or a function of `({ toolCall, tools, messages })`. `'user-approval'` emits a `tool-approval-request` part and pauses; the client answers with `useChat().addToolApprovalResponse({ id, approved, reason })`. `needsApproval` on `tool()` is the deprecated v6 spelling and still works | A catch-all returning `'approved'` is `control-no-approval-gate` Scenario A; `'user-approval'` on read-only tools is Scenario B. A renderer that branches on `part.state === 'approval-requested'` and prints the tool name without `part.input` is `control-thin-approval-payload`. `experimental_toolApprovalSecret` HMAC-binds an approval to its call id and input, so a replayed approval cannot authorize different arguments |
| MCP 2025-11-25 | The host. The spec says there SHOULD always be a human in the loop able to deny tool invocations, and clients SHOULD show tool inputs to the user before calling the server. Servers describe stakes through `annotations`: `readOnlyHint` (default false), `destructiveHint` (default true), `idempotentHint` (default false), `openWorldHint` (default true). Clients MUST treat annotations as untrusted unless the server is trusted | The defaults already fail closed; a host that relaxes them from an untrusted server's hints is `comm-no-approval-gate`. In Claude Code hosts a server can force a prompt with `_meta["anthropic/requiresUserInteraction"]` |
| Claude Agent SDK | Six steps in order: `PreToolUse` hooks, deny rules, ask rules, `permissionMode`, allow rules, then `canUseTool(toolName, input, { suggestions, signal })` returning `{ behavior: 'allow', updatedInput }` or `{ behavior: 'deny', message }`. Modes: `default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan`, `auto` | A bare `allowedTools` entry, `acceptEdits`, or `bypassPermissions` resolves a call before `canUseTool` runs, so a check that exists only in the callback is off the path for every pre-approved tool (`comm-no-approval-gate`); a `PreToolUse` hook runs before every other step and is on it. `dontAsk` plus an explicit allowlist is a standing boundary for `comm-unrequested-action-no-consent`; the notice half still has to exist |

## Progress and completion

| Stack | Step-level events | Terminal signal |
|---|---|---|
| AI SDK 7 | Server: `createUIMessageStream` with `writer.write({ type: 'data-<name>', ... })`, `createUIMessageStreamResponse`, `result.toUIMessageStream()`. Persistent parts reach the client in `message.parts`; parts written with `transient: true` reach it only through the `onData` callback. Client: `status` is `'submitted'`, `'streaming'`, `'ready'`, or `'error'`; `isLoading` no longer exists | `finishReason` on the result; the loop stops by `stopWhen` (`isStepCount(n)` in v7, `stepCountIs` before). A default `ToolLoopAgent` stops at 20 steps |
| Anthropic Messages API | Streaming events per content block | `stop_reason`: `end_turn`, `tool_use`, `max_tokens`, `stop_sequence`, `pause_turn`, `refusal`, `model_context_window_exceeded`. `pause_turn` means resend and continue, `max_tokens` means truncated; a loop that treats either as done fails `comm-no-completion-signal` |
| AG-UI | `RUN_STARTED`, `STEP_STARTED` and `STEP_FINISHED`, `TEXT_MESSAGE_START/CONTENT/END`, `TOOL_CALL_START/ARGS/END/RESULT`, `STATE_SNAPSHOT` and `STATE_DELTA` (JSON Patch) | `RUN_FINISHED` with an outcome, or `RUN_ERROR` |
| MCP | `notifications/progress` keyed by the request's `progressToken`; long calls can negotiate tasks through `execution.taskSupport` | The `tools/call` result |

## Tool results

| Stack | Success shape | Failure shape |
|---|---|---|
| MCP | `content[]` plus `structuredContent` conforming to the tool's `outputSchema`; servers MUST conform, clients SHOULD validate | `isError: true` on the result, with actionable text the model can retry on. The schema says: if not set, this is assumed to be false (the call was successful). Error prose in `content` with no `isError` is `parity-unstructured-tool-output` |
| AI SDK 7 | `tool({ inputSchema, outputSchema, execute })`; `toModelOutput` shapes what the model sees versus what the UI keeps | Throw, or a discriminated union in the output. UI part states: `output-available`, `output-error`, `output-denied` |
| Anthropic tool-writing guidance | Return meaningful, human-readable identifiers and offer a `response_format` of `concise` or `detailed` | Errors steer: say what to do next, not just what failed |

## Escape hatch

| Stack | Where it lives |
|---|---|
| AI SDK 7 | `useChat().stop()` aborts the client fetch only. The route passes `req.signal` as `abortSignal` to `streamText`, and each tool's `execute` reads `abortSignal` from its options, or the server finishes the loop after Stop. `resumeStream` reconnects only when the server kept the run |
| Claude Agent SDK | `query.interrupt()`; the `signal` handed to `canUseTool` is an `AbortSignal`. A `PreToolUse` hook returning `defer` persists the session so an approval can wait past process exit |
| AG-UI | `RUN_FINISHED` carrying an interrupt outcome |

## Handshake and clarification

| Stack | Primitive |
|---|---|
| Claude Agent SDK | `AskUserQuestion` (1 to 4 questions, 2 to 4 options each) routed through `canUseTool`; `plan` mode sends every write to the callback |
| MCP | `elicitation/create` in `form` mode (flat primitives, exposed to the client) or `url` mode (credentials and payments, never through the client). Answered `accept`, `decline`, or `cancel`; only `accept` means proceed, and treating `cancel` as `accept` fails `comm-no-intent-handshake` |
| AI SDK 7 | `addToolApprovalResponse({ id, approved: false, reason })` carries the user's correction back into the loop |

## Agent-rendered UI

| Stack | Shape |
|---|---|
| MCP Apps | Servers publish `ui://` resources with `mimeType: text/html+mcp` and link them from a tool's `_meta["ui/resourceUri"]`; hosts render them in a sandboxed iframe and talk over JSON-RPC on `postMessage`, with consent for UI-initiated tool calls. Rendered controls count as direct manipulation for `control-over-conversational` and as phase-specific UI for `context-no-adaptive-canvas` |
| AI SDK 7 | `data-<name>` parts rendered by a component chosen on `part.type`; a chat that renders only `text` parts has the tool and step states in hand and drops them |

## Sources

- AI SDK 7 tool calling and approvals: <https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling>, <https://ai-sdk.dev/docs/agents/tool-approvals>, <https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage>, <https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data>, <https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat>, <https://ai-sdk.dev/docs/migration-guides/migration-guide-7-0>
- MCP tools, elicitation, apps: <https://modelcontextprotocol.io/specification/2025-11-25/server/tools>, <https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation>, <https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/>
- Claude Agent SDK permissions and approvals: <https://code.claude.com/docs/en/agent-sdk/permissions>, <https://code.claude.com/docs/en/agent-sdk/user-input>
- Anthropic stop reasons: <https://platform.claude.com/docs/en/api/handling-stop-reasons>
- Anthropic tool and context guidance: <https://www.anthropic.com/engineering/writing-tools-for-agents>, <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>, <https://www.anthropic.com/engineering/building-effective-agents>
- AG-UI events: <https://docs.ag-ui.com/concepts/events>
