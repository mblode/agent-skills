---
name: api-and-interface-design
description: Contract-first API and interface design covering REST conventions, TypeScript patterns, error semantics, boundary validation, and Hyrum's Law. Use when designing API endpoints, defining module contracts, creating component prop interfaces, reviewing API changes, or asking "design an API for", "what should this endpoint look like", "how should I structure this interface."
---

# API and Interface Design

Stable, well-documented interfaces that resist misuse. Covers REST APIs, module boundaries, component props, and TypeScript contracts.

## Core Principles

### Hyrum's Law

Every observable behavior of your API will be depended on by somebody, regardless of your documented contract. Implications:

- Be intentional about what you expose — implementation details leak into de facto contracts
- Plan for deprecation during initial design
- Contract tests alone cannot guarantee safety

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
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

Status code conventions: 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 422 validation failure, 500 server error (never expose internals).

### Validate at boundaries only

Validate external input at system edges. Trust internal code with established type contracts.

Validation belongs at: API route handlers, form submissions, external service response parsing, environment variable loading.

Validation does NOT belong between internal functions with established type contracts.

```typescript
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid task data', details: result.error.flatten() },
    });
  }
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### Prefer addition over modification

Extend interfaces by adding optional fields. Never modify or remove existing fields without a migration path.

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
GET /api/tasks?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc

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

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "Document the API later." | Types are the documentation. Define them first. |
| "Skip pagination for now." | You'll need it once data exceeds ~100 items. Adding it later is a breaking change. |
| "Internal APIs don't need contracts." | Contracts prevent coupling and enable parallel work. Internal APIs become external faster than you think. |
| "Nobody uses undocumented behavior." | Hyrum's Law. Observable behavior becomes a commitment whether you document it or not. |

## Red Flags

- Endpoints returning inconsistent response shapes
- Varying error formats across endpoints
- Validation scattered through internal code instead of at boundaries
- Breaking changes to existing fields without versioning
- List endpoints without pagination
- Verbs in REST URLs (`/api/createTask`)
- Third-party API responses used without validation
- String IDs passed between unrelated domains without branded types

## Verification

- [ ] Every endpoint has typed input/output schemas
- [ ] Error responses use a consistent format
- [ ] Validation occurs at system boundaries only
- [ ] List endpoints support pagination
- [ ] New fields are additive and optional
- [ ] Naming follows conventions above
- [ ] Third-party responses are validated before use
