---
name: implement-frontend
version: 0.1.0
description: Standards for implementing and reviewing React/TypeScript/Next.js features in codebases that use React Hook Form, Zod, React Query or Connect Query, and proto-generated API types. Use when building frontend forms, hooks/components, state flows, and type-safe UI mappings in this stack.
---

# Implement Frontend

Apply this skill when the repository already follows this stack:

- React + TypeScript + Next.js
- React Hook Form + Zod
- React Query or Connect Query
- Proto-generated API types (when present)

If local conventions differ, preserve existing project standards and apply only the transferable principles.

## Core workflow
1. Set ownership boundaries before editing.
   - Keep render-only concerns in components.
   - Keep fetching, mapping, and business rules in hooks.
   - Keep server state in query cache, form state in RHF, and UI-only state in `useState`.
2. Implement with strict typing and explicit mappings.
   - Avoid type escapes such as `any`, `as any`, and ignore directives.
   - Map API models to UI models in mappers instead of casting.
3. Verify reliability and UX before finishing.
   - Cover loading, error, and empty states.
   - Add cancellation and cleanup for async work when race conditions are possible.
   - Preserve keyboard accessibility and focus behavior.

## Non-negotiable checks
- Remove duplicate state and `useEffect` sync loops.
- Keep API calls and business logic out of render components.
- Invalidate or update only affected query keys.
- Use rollback-safe optimistic updates only.
- Remove `console.*`, `debugger`, dead code, and unused imports.

## Stack guardrails
- If the repo uses RHF + Zod, use `createZodResolver`; avoid `zodResolver(schema as any)`.
- If using RHF, avoid putting the entire `form` object in dependency arrays.
- Keep proto-to-UI transforms in a dedicated mapper file (for example `utils/proto-mappers.ts`) when proto contracts are used.

## References
- Use `react-patterns.md` for forms, hooks, state ownership, query usage, and accessibility.
- Use `typescript-patterns.md` for type hygiene, proto typing, and code organization.
