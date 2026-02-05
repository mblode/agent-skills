# React Patterns

## Forms
- Prefer React Hook Form for non-trivial forms. If the repository uses another form library, follow that standard consistently.
- If using Zod v4, use the project-standard `createZodResolver` helper.
- Keep schemas in feature-local `types/` modules (commonly `types/index.ts`).
- Keep Zod for client-side validation; backend validation is separate.
- Use `form.watch`/`setValue`; do not duplicate state.
- Keep submit enabled until request starts; then disable with spinner and keep the label.
- Enter submits; in `<textarea>`, use Cmd/Ctrl+Enter.
- Never block paste or typing; validate after input; allow incomplete submit to surface errors.
- Errors inline next to fields; focus the first error on submit.
- Labels wired to inputs; set `autocomplete`, meaningful `name`, correct `type` + `inputmode`.
- Disable spellcheck only for emails/codes/usernames; avoid reserved names that trigger password managers.
- Trim trailing whitespace from text expansion; inputs with `value` must have `onChange`.
- Inputs must not lose focus or value after hydration.

## RHF dependencies
- Do not add `form` to deps. Methods are stable.
- Only depend on `form.formState.*` when needed.

## State ownership
- Form state: form library. Server state: query cache (React Query/Connect Query). UI state: `useState`. Global: use project standard only when necessary.
- Red flags: syncing state with `useEffect`, storing server data in `useState`.

## Components vs hooks
- Components: render only, minimal UI state, call hooks.
- Hooks: API calls, business logic, side effects, and mapping.

## Hook layout
- `hooks/use-*-data.ts`: fetching.
- `hooks/use-*-logic.ts`: business logic.
- `hooks/use-*-state.ts`: complex UI state.

## API client
- When ConnectRPC exists in the project, use `@connectrpc/connect-query`; otherwise use the project's standard client/query integration.
- Use query hooks for reads and mutation hooks for writes.
- Invalidate or update the exact affected key(s) only.
- Handle transport/client errors with user-facing messages.
- No direct DB/server imports in client.

## Interaction basics
- Full keyboard support per WAI-ARIA APG; visible focus rings (`:focus-visible`/`:focus-within`).
- Hit targets >= 24px (>= 44px on mobile); hover styles gated by `@media (hover: hover)`.
- Use `<a>`/`<Link>` for navigation; URL reflects state; Back/Forward restores scroll.
- Deep-link all stateful UI; if it uses `useState`, consider URL sync via `nuqs` or similar.
- Respect safe areas and avoid unwanted scrollbars; use `min-w-0` for truncation.

## Performance
- Memoize only when profiling shows benefit.
- Virtualize long lists.
- Use stable keys; avoid index keys.
- Keep `useEffect` deps correct; clean up.
- Add cancellation for in-flight async work (for example `AbortController` with `fetch`) when race conditions are possible.
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`); batch DOM reads/writes.
- Prefer uncontrolled inputs; controlled inputs must be cheap per keystroke.

## Next.js
- Use `next/link` for internal nav.
- Default to Server Components; add "use client" only when required.
- Prefer server `page.tsx` wrappers that render client children.
- Add `loading.tsx`/`error.tsx` for key routes.
- Detect language via `Accept-Language` / `navigator.languages`, not IP geolocation.

## Final check
- No duplicate state, no manual form state in RHF projects, no logic in components, no full `form` object in deps.
