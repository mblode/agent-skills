---
name: frontend-standards
description: Production frontend standards for React/TypeScript/Next.js. Use when reviewing, refactoring, or writing frontend code, especially forms, state, hooks/components, and type safety.
---

# Frontend Standards

Use this as the baseline for all frontend code. Fix violations.

## Core rules
- Keep a single source of truth for any data or state.
- Enforce type safety: no `any`, no `as` casting, no ts-ignore.
- Use React Hook Form for every form. No manual form state.
- Use proto types as the contract; do not duplicate API types.
- Components render; hooks own data fetching and business logic.

## Critical anti-patterns
- Duplicate state or syncing state via `useEffect`.
- API calls or business logic inside components.
- `zodResolver(schema as any)` or other type escapes.
- Form object in dependency arrays (use only formState fields).

## References
- See `typescript-patterns.md` for TypeScript and proto guidance.
- See `react-patterns.md` for forms, hooks, and state.

## Quick checks
- Remove `console.*`, `debugger`, commented code, unused imports.
- Use `useId` for IDs; avoid hardcoded IDs.
- Zod v4 + `createZodResolver`.
- React Query/Connect Query owns server state; RHF owns form state; `useState` only for UI.

## Reliability & data fetching (required)
- Optimistic updates must snapshot previous cache state and rollback on error.
- Only optimistic-update for operations with a safe rollback; avoid for destructive actions unless server supports undo.
- Retries are only for idempotent requests. Use exponential backoff with full jitter and cap attempts/time.
- Always use `AbortController` for in-flight requests to prevent race conditions on unmount or rapid input.

## Cache & invalidation (required)
- React Query/Connect Query is the source of truth for server state; never copy server data into `useState`.
- Mutations must invalidate or update only the affected queries; do not refetch everything.
- `setQueryData` is allowed only for optimistic updates or small, scoped edits.

## Performance & UX (required)
- Lazy-load heavy UI (charts, editors, modals) with dynamic import and suspense fallback.
- Reserve image sizes to avoid layout shift; use `next/image` when applicable.
- Enforce bundle budgets in CI (document the budgets in the repo).

## Observability (required)
- Add error boundaries at route/layout level; report exceptions to Sentry (or project standard).
- Tag client errors with `userId`/`orgId` and `release` (commit/semantic version), scrub PII.

## Web interface guidelines (mandatory UX baseline)
- Full keyboard support; visible focus rings (`:focus-visible`/`:focus-within`); manage focus in dialogs/menus.
- Hit targets >= 24px (>= 44px on mobile); hover styles gated by `@media (hover: hover)`; `touch-action: manipulation`.
- Forms: labels wired to inputs; Enter submits; textarea uses Cmd/Ctrl+Enter; keep submit enabled until request starts, then disable with spinner.
- Never block paste/typing; inline errors; focus first error; inputs with `value` include `onChange`.
- Navigation uses `<a>`/`<Link>`; URL reflects state; Back/Forward restores scroll position.
- If showing a spinner/skeleton, add a short show-delay (150-300ms); confirm destructive actions or provide Undo.
- Follow `animation-guidelines` for motion rules.
- Respect safe areas; avoid unwanted scrollbars; handle long content with truncation (`min-w-0`).
- Theming: `color-scheme: dark` on `<html>` for dark themes; `<meta name="theme-color">` matches background.

## Required structure (per feature)
```
components/<feature>/
  *.tsx
  hooks/                 # feature hooks only
  types/                 # schemas + UI types
  utils/
    proto-mappers.ts     # proto -> UI transforms
  constants.ts
```

## Naming
- Files: kebab-case. Components: PascalCase. Functions: camelCase. Constants: UPPER_SNAKE_CASE.

Every file should be ready to ship.
