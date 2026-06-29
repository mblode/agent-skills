# API and Interface Design

Contract-first patterns for REST APIs, module boundaries, and TypeScript interfaces. Load when designing endpoints, defining module contracts, or reviewing API surface changes.

## Contents

- Core principles
- REST patterns
- TypeScript patterns
- Red flags

## Core Principles

### Hyrum's Law

Every observable behavior will be depended on by someone, regardless of the documented contract. Be intentional about what you expose; implementation details leak into de facto contracts.

### Contract first

Define the interface before any handler: a typed `TaskAPI` (`createTask`/`listTasks`/`getTask`/`updateTask`/`deleteTask`) returning `Promise<Task>` / `Promise<PaginatedResult<Task>>`.

### Consistent error semantics

One error shape across all endpoints: `{ error: { code: string; message: string; details?: unknown } }`. Status codes: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 validation failure, 500 server error (never expose internals).

### Validate at boundaries only

Validate at API route handlers, form submissions, external service response parsing, and environment variable loading. Do NOT validate between internal functions with established type contracts.

### Prefer addition over modification

Extend interfaces with optional fields. Never modify or remove existing fields without a migration path.

### Predictable naming

| Pattern | Convention | Example |
|---------|-----------|---------|
| REST endpoints | Plural nouns, no verbs | `GET /api/tasks` |
| Query params | camelCase | `?sortBy=createdAt` |
| Response fields | camelCase | `{ createdAt }` |
| Boolean fields | is/has/can prefix | `isComplete` |
| Enum values | UPPER_SNAKE | `"IN_PROGRESS"` |

## REST Patterns

Verb-to-route mapping: `GET /api/tasks` list (paginated), `POST /api/tasks` create, `GET`/`PATCH`/`DELETE /api/tasks/:id` read/partial-update/delete, `GET /api/tasks/:id/comments` sub-resource list. Every list endpoint returns `{ data: [...], pagination: { page, pageSize, totalItems, totalPages } }`.

## TypeScript Patterns

- **Discriminated unions for variants**: model status as a union keyed on a `type` literal (`pending` | `in_progress` | `completed` | `cancelled`), each member carrying only its own fields.
- **Input/output separation**: keep `CreateTaskInput` (client-supplied) distinct from the full `Task` (adds server-owned `id`, `createdAt`, `updatedAt`, `createdBy`).
- **Branded types for IDs**: `type TaskId = string & { readonly __brand: 'TaskId' }` so a `UserId` cannot be passed where a `TaskId` is expected.

## Red Flags

- Inconsistent response shapes across endpoints
- Varying error formats across endpoints
- Validation scattered through internal code instead of at boundaries
- Breaking changes to existing fields without versioning
- List endpoints without pagination
- Verbs in REST URLs (`/api/createTask`)
- Third-party API responses used without validation
