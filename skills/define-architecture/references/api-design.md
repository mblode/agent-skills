# API and Interface Design

Contract-first patterns for REST APIs, module boundaries, request context, and TypeScript interfaces. Load when designing endpoints, defining module contracts, wiring request context, or reviewing API surface changes.

## Contents

- Core principles
- Format contracts
- Request context
- Agent-facing surfaces

## Core Principles

### Hyrum's Law

Every observable behavior will be depended on by someone, regardless of the documented contract. Be intentional about what you expose; implementation details leak into de facto contracts.

### Contract first

Define the interface before any handler. The interface, not prose about it, is the contract:

```ts
interface TaskAPI {
  createTask(input: CreateTaskInput): Promise<Task>;
  listTasks(query: ListTasksQuery): Promise<PaginatedResult<Task>>;
  getTask(id: TaskId): Promise<Task>;
  updateTask(id: TaskId, patch: Partial<CreateTaskInput>): Promise<Task>;
  deleteTask(id: TaskId): Promise<void>;
}
```

`CreateTaskInput` is client-supplied and stays distinct from `Task`, which adds the server-owned `id`, `createdAt`, `updatedAt`, and `createdBy`.

### Branded IDs

Identifiers in the contract are branded, not bare strings: `type TaskId = string & { readonly __brand: 'TaskId' }`, so a `UserId` cannot be passed where a `TaskId` is expected.

### Consistent error semantics

One error shape across all endpoints: `{ error: { code: string; message: string; details?: unknown } }`. Status codes: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 validation failure, 500 server error (never expose internals).

### Validate at boundaries only

Validate at API route handlers, form submissions, external service response parsing, and environment variable loading. Do NOT validate between internal functions with established type contracts.

### Prefer addition over modification

Extend interfaces with optional fields. Never modify or remove existing fields without a migration path.

## Format Contracts

Standard REST naming needs no instruction; these two choices do, because both deviate from what a handler author would reach for.

- Enum values are `UPPER_SNAKE` (`"IN_PROGRESS"`), even though response fields stay camelCase.
- Every list endpoint returns `{ data: [...], pagination: { page, pageSize, totalItems, totalPages } }`. A list endpoint without this envelope is a breaking change waiting to happen.

## Request Context

Read ambient request state through an `AsyncLocalStorage` store, never as a threaded parameter:

```ts
import { AsyncLocalStorage } from "node:async_hooks";
type RequestContext = { tenantId: string; userId: string; traceId: string };
const store = new AsyncLocalStorage<RequestContext>();
export const getContext = () => store.getStore()!;
export const runWithContext = (ctx: RequestContext, fn: () => void) => store.run(ctx, fn);
```

Initialize it in every entrypoint: RPC, HTTP, jobs, and CLI. Forgetting jobs and CLI makes `getContext()` throw far from the cause.

## Agent-Facing Surfaces

A CLI, SDK, or MCP server that agents drive needs the contract to be discoverable and the output to be machine-parseable, not just human-readable.

- **Self-describing spec.** Expose a no-auth command that emits the interface as a progressive, token-budgeted JSON tree: a top-level overview (commands, global flags, output shape) drills into a subcommand summary, then a full per-command spec (arguments, options, output schema, examples). The agent orients from the contract itself instead of scraping `--help` or docs.
- **Scriptable output contract.** Make the same flags work on every command: `--json` for structured output, `--format text|json|csv`, `--dry-run` to preview a mutation without applying it, `--quiet` implies JSON. Auto-switch to JSON when stdout is not a TTY, and suppress interactive prompts when piped, so an agent gets structured output by default.
- **Forward the caller's credential.** When one surface calls another (an assistant calling your API, a gateway forwarding to a service), forward the requesting user's scoped credential, never a service credential. Reject a request on any transport that cannot enforce the credential's scope (for example, a scope-restricted key hitting a WebSocket path that cannot narrow it) rather than silently widening access.
