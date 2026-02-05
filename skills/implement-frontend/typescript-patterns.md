# TypeScript Patterns

## Hygiene
- Avoid `any`, `as any`, `// @ts-ignore`, and `// @ts-expect-error`. If an exception is unavoidable, isolate it and document why.
- Add explicit types where not obvious (props, events, generics).
- Prefer `interface` for extendable object shapes; use `type` for unions, mapped types, and utility-type composition.
- Prefer one public component per file and keep component style consistent with repository norms.
- Return types: allow inference or use `React.ReactElement` (server components: `Promise<React.ReactElement>`).

## Proto types
- Import proto-generated types directly when protobuf is the API contract; do not duplicate API response types.
- Extend proto only for UI needs and keep UI types feature-scoped.
- Use mappers for transformations; avoid `as` casting.
- Normalise timestamps to `Date` in mappers.

## Organisation
- Prefer feature-local `types/` modules for schemas and inferred types.
- Use `types/common.ts` (or project equivalent) for shared enums/interfaces.
- Use `types/<domain>.ts` for feature UI types when that split exists.
- Keep proto -> UI mapping in dedicated mapper modules (for example `utils/proto-mappers.ts`).

## Imports
- Order: React/Next, third-party, internal, relative, styles.
- Use absolute aliases when available.
- Import from `./types`, not `./types/index`.
- Keep proto imports in hooks/mappers where possible; avoid coupling presentational components to transport models.

## Patterns
- Use proper event types (`React.MouseEvent`, `React.ChangeEvent`).
- Always type `useState` when null/undefined is possible.
- Use `createZodResolver` instead of `zodResolver(schema as any)`.
