---
title: Optimistic update without rollback on server reject
slug: async-optimistic-without-rollback
category: async
defaultTier: release-blocker
surfaces: checkout, list, form, dashboard, modal
react-apis: useOptimistic, useTransition, startTransition, server actions
related: async-double-submit, states-no-error-state, microcopy-leaked-error-message
---

## Optimistic update without rollback on server reject

`useOptimistic` lets you show the post-action state immediately — a liked post, a cart item added, a renamed file. The contract is: when the server rejects (422, 500, network error), the UI rolls back to the actual server state. Without rollback the UI lies. Reload reveals truth and users lose trust. The other half of the contract: `useOptimistic` updates **must** be applied inside `startTransition` (or via a transitioning action), or React will throw.

## What goes wrong

User clicks "Like." UI flips to liked instantly. Server rejects (rate-limited). The optimistic state never reverts because the action handler swallowed the error. Reload — like is gone. User concludes the product is broken or that the like silently disappeared.

Worse: `useOptimistic` is called outside `startTransition`. React 19 throws "An optimistic state update occurred outside a transition or action." The whole feature blows up at runtime.

## Detection

**Surfaces:** checkout (cart updates), list (inline edits, likes, reorder), form (instant rename), dashboard (toggle widgets), modal (in-modal saves).

**Static signals:**
1. `rg 'useOptimistic' --type=tsx -l` — find all callers.
2. For each file, confirm the optimistic dispatch sits inside a `startTransition`, `useTransition` action, `<form action>`, or async server action.
3. Confirm the action handler has a `try { ... } catch` that re-throws or signals failure (so React reverts the optimistic state automatically), OR an explicit revert call.
4. Confirm a user-facing error UI exists when the action fails (toast, inline error).

**Concrete commands:**
```bash
# All optimistic call sites
rg 'useOptimistic\b' --type=tsx -l

# Optimistic without startTransition / action context
rg -A 10 'useOptimistic\b' --type=tsx | rg -L 'startTransition|useTransition|action='

# Optimistic without catch / rollback / onError
rg 'useOptimistic\b' --type=tsx -l | while read f; do
  rg -L 'catch|onError|throw' "$f" && echo "$f: optimistic with no error path"
done
```

**False-positive guards:**
- Skip if the action is a server action invoked via `<form action={fn}>` — React reverts automatically when the action throws.
- Skip files annotated `// ux-audit-ignore:async-optimistic-without-rollback`.
- Skip Storybook fixtures.

## Fix

Apply optimistic updates inside `startTransition`. Let the action throw on failure so React reverts. Surface a toast or inline error.

```tsx
// before — silent lie on reject
'use client';
function Likes({ post }: { post: Post }) {
  const [optimistic, setOptimistic] = useOptimistic(post.likes);
  return (
    <button
      onClick={async () => {
        setOptimistic(optimistic + 1); // ❌ outside transition
        await likePost(post.id);        // ❌ failure silently kept optimistic
      }}
    >
      Like ({optimistic})
    </button>
  );
}

// after — rollback on reject + transition + error UI
'use client';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

function Likes({ post }: { post: Post }) {
  const [optimistic, addOptimistic] = useOptimistic(
    post.likes,
    (current, delta: number) => current + delta,
  );
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          addOptimistic(1);
          try {
            await likePost(post.id);
          } catch (err) {
            // throwing reverts the optimistic state automatically
            toast.error('Could not like — try again');
            throw err;
          }
        })
      }
    >
      Like ({optimistic})
    </button>
  );
}
```

Docs:
- React useOptimistic: https://react.dev/reference/react/useOptimistic
- React useTransition: https://react.dev/reference/react/useTransition
- Next.js server actions + optimistic: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#optimistic-updates

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Checkout (cart total) | release-blocker (financial truth) |
| Form (rename, edit) | release-blocker |
| List (likes, reorder) | release-blocker |
| Dashboard toggle | fix-this-sprint |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**
```tsx
const [items, setItems] = useOptimistic(server);
function add(item) {
  setItems([...items, item]); // outside transition + no rollback
  fetch('/api/cart', { method: 'POST', body: JSON.stringify(item) });
}
```

**Applied (passes):**
```tsx
const [items, addItem] = useOptimistic(server, (cur, x) => [...cur, x]);
const [, startTransition] = useTransition();

const add = (item) =>
  startTransition(async () => {
    addItem(item);
    const res = await fetch('/api/cart', { method: 'POST', body: JSON.stringify(item) });
    if (!res.ok) throw new Error('Cart rejected');
  });
```

## Defer-to (when this is another tool's job)

- TanStack Query has its own `onMutate`/`onError` rollback pattern — link to its docs if the project uses it.
- Sentry for capturing the thrown errors.
- Vercel Agent for review-time spotting of missing `try`/`catch`.

## Suppression

```tsx
{/* ux-audit-ignore:async-optimistic-without-rollback — operation is idempotent and
    server return is authoritative on next render */}
```
