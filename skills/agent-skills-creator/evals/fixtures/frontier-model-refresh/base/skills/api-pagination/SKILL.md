---
name: api-pagination
description: Adds or fixes pagination on a Thistle Commons list endpoint. Use when asked to "paginate this endpoint", "add a cursor", or "the list is truncated".
---

# API Pagination

## Contract

- List endpoints under `src/api/v2/` use cursor pagination: `?after=<cursor>&limit=<n>`, response `{ data, nextCursor }`.
- The cursor is the base64url of `<sortValue>:<id>`. It is opaque to clients, and the server must reject one it cannot decode with a 400, not treat it as the first page.
- `limit` defaults to 50 and is capped at 200. A larger value is clamped, not rejected, because one portal sends 500.
- Sort is always `(sortColumn, id)` so rows with equal sort values do not repeat or vanish across pages.
- `nextCursor` is `null` on the last page. Never omit the field.

## Steps

1. Find the query in `src/repos/`. Add the `(sortColumn, id) > (?, ?)` predicate and `LIMIT n + 1`.
2. Return the first `n` rows and build `nextCursor` from row `n` if row `n + 1` exists.
3. Use `encodeCursor` and `decodeCursor` from `src/api/cursor.ts`. Do not write a new encoder.
4. Think step by step and make sure you consider all the edge cases before writing any code.

## Gotchas

- The `v1` endpoints use `?page=` and stay that way. Do not convert one; the legacy portal cannot follow cursors.
- Write clean, well-structured code and follow best practices.
