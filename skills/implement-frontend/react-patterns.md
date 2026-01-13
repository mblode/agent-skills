# React Patterns

## Forms
- React Hook Form is required for all forms; no `useState` for form fields.
- Use Zod v4 + `createZodResolver` from `@/lib/utils/zod-resolver`.
- Define schemas in `types/index.ts`.
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
- Form state: RHF. Server state: React Query/Connect Query. UI state: `useState`. Global: MobX only when necessary.
- Red flags: syncing state with `useEffect`, storing server data in `useState`.

## Components vs hooks
- Components: render only, minimal UI state, call hooks.
- Hooks: API calls, business logic, side effects, and mapping.

## Hook layout
- `hooks/use-*-data.ts`: fetching.
- `hooks/use-*-logic.ts`: business logic.
- `hooks/use-*-state.ts`: complex UI state.

## API client
- Use ConnectRPC + `@connectrpc/connect-query`; no raw fetch on client.
- Use `useQuery` for reads, `useMutation` for writes.
- Invalidate with `createConnectQueryKey` and the exact key.
- Handle `ConnectError` with user-facing messages.
- No direct DB/server imports in client.

## Interaction basics
- Full keyboard support per WAI-ARIA APG; visible focus rings (`:focus-visible`/`:focus-within`).
- Hit targets >= 24px (>= 44px on mobile); hover styles gated by `@media (hover: hover)`.
- Use `<a>`/`<Link>` for navigation; URL reflects state; Back/Forward restores scroll.
- Respect safe areas and avoid unwanted scrollbars; use `min-w-0` for truncation.

## Performance
- Memoize only when profiling shows benefit.
- Virtualize long lists.
- Use stable keys; avoid index keys.
- Keep `useEffect` deps correct; clean up.

## Next.js
- Use `next/link` for internal nav.
- Default to Server Components; add "use client" only when required.
- Prefer server `page.tsx` wrappers that render client children.
- Add `loading.tsx`/`error.tsx` for key routes.

## Final check
- No duplicate state, no manual form state, no logic in components, no `form` in deps.
