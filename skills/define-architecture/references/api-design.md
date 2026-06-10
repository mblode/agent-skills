# API and Interface Design

Contract-first patterns for REST APIs, module boundaries, and TypeScript interfaces. Load when designing endpoints, defining module contracts, or reviewing API surface changes.

## Contents

- Core principles
- REST patterns
- TypeScript patterns
- Red flags

## Core Principles

### Hyrum's Law

Every observable behavior of your API will be depended on by somebody, regardless of your documented contract. Be intentional about what you expose: implementation details leak into de facto contracts.

### Contract first

Define the interface before the implementation:

```typescript
interface TaskAPI {
  createTask(input: CreateTaskInput): Promise<Task>;
  listTasks(params: ListTasksParams): Promise<PaginatedResult<Task>>;
  getTask(id: TaskId): Promise<Task>;
  updateTask(id: TaskId, input: UpdateTaskInput): Promise<Task>;
  deleteTask(id: TaskId): Promise<void>;
}
```

### Consistent error semantics

One error shape across all endpoints:

```typescript
interface APIError {
  error: { code: string; message: string; details?: unknown };
}
```

Status codes: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 validation failure, 500 server error (never expose internals).

### Validate at boundaries only

Validate at: API route handlers, form submissions, external service response parsing, environment variable loading.

Do NOT validate between internal functions with established type contracts.

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

```
GET    /api/tasks              → List (paginated)
POST   /api/tasks              → Create
GET    /api/tasks/:id          → Read
PATCH  /api/tasks/:id          → Partial update
DELETE /api/tasks/:id          → Delete
GET    /api/tasks/:id/comments → Sub-resource list
```

Pagination on every list endpoint:

```typescript
{
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 142, "totalPages": 8 }
}
```

## TypeScript Patterns

### Discriminated unions for variants

```typescript
type TaskStatus =
  | { type: 'pending' }
  | { type: 'in_progress'; assignee: string; startedAt: Date }
  | { type: 'completed'; completedAt: Date; completedBy: string }
  | { type: 'cancelled'; reason: string; cancelledAt: Date };
```

### Input/output separation

```typescript
interface CreateTaskInput {
  title: string;
  description?: string;
}

interface Task {
  id: TaskId;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserId;
}
```

### Branded types for IDs

```typescript
type TaskId = string & { readonly __brand: 'TaskId' };
type UserId = string & { readonly __brand: 'UserId' };
```

## Red Flags

- Endpoints returning inconsistent response shapes
- Varying error formats across endpoints
- Validation scattered through internal code instead of at boundaries
- Breaking changes to existing fields without versioning
- List endpoints without pagination
- Verbs in REST URLs (`/api/createTask`)
- Third-party API responses used without validation
