---
title: Optimistic update without rollback on server reject
id: async-optimistic-without-rollback
category: async
defaultTier: release-blocker
detect: static
related: states-no-error-state, microcopy-leaked-error-message
---

## Optimistic update without rollback on server reject

`useOptimistic` shows the post-action state immediately (liked post, cart item added, renamed file). Contract: on server reject (422, 500, network error) the UI must roll back to real server state, or it lies and a reload reveals the truth, costing trust. Second half of the contract: optimistic updates **must** run inside `startTransition` (or an action, which React wraps in one), or React warns and the optimistic value renders for one frame and reverts, so the feature looks like a flicker rather than an update.

## What goes wrong

Click "Like," UI flips to liked, server rejects (rate-limited), the handler swallows the error so the optimistic state never reverts. Reload: the like is gone and the user thinks the product is broken. Worse: calling the setter outside `startTransition` logs "An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with startTransition" and the optimistic value never sticks, so the UI flickers and the update looks broken in every environment except the one where someone reads the console.

## Detection

**Surfaces:** checkout (cart updates), list (inline edits, likes, reorder), form (instant rename), dashboard (toggle widgets), modal (in-modal saves).

**Static signals:**
1. `rg 'useOptimistic' --type=ts -l`: find all callers.
2. Confirm each optimistic dispatch sits inside `startTransition`, a `useTransition` action, `<form action>`, or an async server action.
3. Confirm the handler has `try { ... } catch` that re-throws or signals failure (React then auto-reverts), or an explicit revert call.
4. Confirm a user-facing error UI (toast, inline) appears on failure.

**Concrete commands:**
```bash
# All optimistic call sites
rg 'useOptimistic\b' --type=ts -l

# Optimistic without startTransition / action context
rg -l 'useOptimistic\b' --type=ts src/ app/ | while read f; do
  rg -A 10 'useOptimistic\b' "$f" | rg -q 'startTransition|useTransition|action=' \
    || echo "$f: optimistic update outside transition or action context"
done

# Optimistic without catch / rollback / onError
rg 'useOptimistic\b' --type=ts -l | while read f; do
  rg -q 'catch|onError|throw' "$f" || echo "$f: optimistic with no error path"
done
```

**False-positive guards:**
- Skip server actions invoked via `<form action={fn}>`: React auto-reverts when the action throws.
- Skip files annotated `// ui-audit-ignore:async-optimistic-without-rollback`.
- Skip Storybook fixtures.

## Fix

Apply optimistic updates inside `startTransition`; let the action throw on failure so React reverts; surface a toast or inline error.

```tsx
// before: silent lie on reject
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

// after: rollback on reject + transition + error UI
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
            toast.error('Could not like, try again');
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
- Next.js server functions (the action the optimistic update wraps): https://nextjs.org/docs/app/getting-started/mutating-data

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

## Defer-to (when this is another tool's job)

- TanStack Query: its own `onMutate`/`onError` rollback if the project uses it.
- Sentry: capturing the thrown errors.
- Vercel Agent: review-time spotting of missing `try`/`catch`.

## Suppression

```tsx
{/* ui-audit-ignore:async-optimistic-without-rollback, operation is idempotent and
    server return is authoritative on next render */}
```
