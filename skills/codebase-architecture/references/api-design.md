# API and Interface Design

Interface-first patterns for REST APIs, module interfaces, request context, and errors. Load when designing endpoints, defining a module's interface, wiring request context, or reviewing API surface changes. "Interface" means the broad sense in `vocabulary.md`: types plus invariants, ordering, error modes, and configuration.

## Contents

- Core principles
- Format contracts
- Request context
- Errors as a contract
- Forwarded credentials

## Core Principles

### Hyrum's Law

Every observable behavior will be depended on by someone, regardless of the documented contract. Be intentional about what you expose; implementation details leak into de facto contracts.

### Interface first

Define the interface before any handler. Its types are the part a compiler can hold, so write them as code, not prose; the invariants, ordering, and error modes the types cannot express go beside them as doc comments and tests:

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

Identifiers in the contract are branded, not bare strings: `type TaskId = string & { readonly __brand: 'TaskId' }`, so a `UserId` cannot be passed where a `TaskId` is expected. Parse them once at the edge (the session lookup, contract inputs, the create path) and never cast.

The same trick carries authority. A privileged service takes an `AdminActor`, a subtype produced only by one assertion function, and does no check of its own, so a router that skips the check fails to compile. Test it at the type level, not just at runtime: `expectTypeOf(removeMember).parameter(1).toEqualTypeOf<AdminActor>()`. Otherwise a fix that adds a runtime role check inside the service passes every behavioural test while the type proof erodes.

### Consistent error semantics

One error shape across all endpoints: `{ error: { code: string; message: string; details?: unknown } }`. Status codes: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 validation failure, 500 server error (never expose internals).

### Validate at boundaries only

Validate at API route handlers, form submissions, external service response parsing, and environment variable loading. Between internal functions the type contract is the validation; re-checking there adds a second failure surface without adding a trust boundary.

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

## Errors as a Contract

Whoever debugs a failure works from the output alone, and a structured failure is the difference between one fix loop and five.

- Structured error classes carrying a machine-readable code. Callers and tests assert on class and code; message strings are not API and change without warning.
- Two audiences by construction: a caller-safe message plus a developer-only guidance field, with user-facing copy registered separately from internal error identity so internals never leak to users.
- Domain errors stay transport-agnostic. Middleware owns the mapping to HTTP or RPC status, so services never pick status codes ad hoc.
- Log the raw error object and let serializers extract type, stack, and cause. Never catch-log-rethrow: middleware already logs unhandled errors once, and the duplicate sends whoever is debugging after two failures that are one.
- The ambient request context above auto-enriches every log line with request and correlation IDs, so a failure is traceable from log output with no per-call-site work.

## Forwarded Credentials

When one surface calls another (an assistant calling your API, a gateway forwarding to a service), forward the requesting user's scoped credential, never a service credential. Reject a request on any transport that cannot enforce the credential's scope (for example, a scope-restricted key hitting a WebSocket path that cannot narrow it) rather than silently widening access.

The scriptable-output contract for a CLI or SDK that agents drive (`--json`, `--dry-run`, TTY detection, a self-describing spec) belongs to `dx-audit` and `scaffold-cli`.
