# TypeScript Patterns

## Hygiene
- Eliminate `any`, `as any`, `// @ts-ignore`, and `// @ts-expect-error`.
- Add explicit types where not obvious (props, events, generics).
- Prefer `type` over `interface`.
- One component per file; use arrow components.
- Return types: allow inference or use `React.ReactElement` (server components: `Promise<React.ReactElement>`).

## Proto types
- Import proto-generated types directly; do not duplicate API response types.
- Extend proto only for UI needs; keep UI types feature-scoped.
- Use mappers for transformations; avoid `as` casting.
- Normalize timestamps to `Date` in mappers.

## Organization
- `types/index.ts`: Zod schemas + inferred types.
- `types/common.ts`: shared enums/interfaces.
- `types/<domain>.ts`: feature UI types.
- `utils/proto-mappers.ts`: all proto -> UI mapping.

## Imports
- Order: React/Next, third-party, internal, relative, styles.
- Use absolute aliases when available.
- Import from `./types`, not `./types/index`.
- Components do not import proto types directly; hooks/mappers do.

## Patterns
- Use proper event types (`React.MouseEvent`, `React.ChangeEvent`).
- Always type `useState` when null/undefined is possible.
- Use `createZodResolver` instead of `zodResolver(schema as any)`.
