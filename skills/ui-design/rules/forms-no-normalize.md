---
title: Form input not normalized server-side
slug: forms-no-normalize
category: forms
defaultTier: fix-this-sprint
surfaces: sign-in, sign-up, checkout, onboarding, form
react-apis: server actions, zod
related: forms-lost-data-on-error
---

## Form input not normalized server-side

Postel's Law: be liberal in what you accept, strict in what you send. Emails with trailing whitespace, mixed case, or pasted quotes should be silently fixed, not rejected with "Invalid email." Phones should land in E.164, URLs accept missing protocols, all server-side. Strict client validation pushes users into corner cases; normalize in the server action to fix it in one place.

## What goes wrong

A user pastes `  Alice@Example.COM ` from a CRM. The lowercase-only regex rejects it as "Invalid email"; the user fixes case but misses the trailing space, rejected again. Or sign-up stores `Alice@Example.com` and next-day sign-in fails: the lookup is case-sensitive and the stored value differs from what was typed.

## Detection

**Surfaces:** sign-in, sign-up, checkout (email, phone, ZIP, country), onboarding, search-with-email-share.

**Static signals:**
1. Find inputs needing normalization: `<input type="email">`, `<input type="tel">`, `<input type="url">`, `<input pattern=...>`.
2. Trace each to its server action. It must: email `.trim().toLowerCase()` before lookup/storage; phone parsed to E.164 (e.g. `libphonenumber-js`); URL protocol prepended when missing, validated with `new URL(...)`.
3. Fails if the action passes raw `formData.get("email")` straight into a DB query or auth lookup.
4. Check zod schemas: prefer `z.string().email().toLowerCase().trim()` over `z.string().regex(emailRegex)`.

**Concrete commands:**
```bash
# Email inputs
rg '<input[^>]*type=["\']email' --type=ts src/

# Server actions touching email
rg -A 10 '"use server"' --type=ts src/ | rg -B 3 'email|phone'

# Strict regex pattern attributes (often too aggressive)
rg '<input[^>]*pattern=' --type=ts src/

# Actions that don't normalize
rg -l 'formData\.get\("email"\)' --type=ts src/ | while read f; do
  rg -q 'toLowerCase|\.trim\(\)|z\.string\(\)\.email\(\)' "$f" \
    || echo "$f: email used without normalization"
done
```

**False-positive guards:**
- Skip `// ui-audit-ignore:forms-no-normalize`.
- Skip read-only display contexts (`<input readOnly>` echoing canonical data).
- Skip inputs that intentionally preserve case (display name, exact-match search).

## Fix

Normalize in the server action; keep client validation soft:

```tsx
// before: strict client regex, no server normalization
<input
  name="email"
  pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  required
/>

// action.ts
"use server";
export async function signUp(_p, fd: FormData) {
  const email = String(fd.get("email")); // raw: case-sensitive lookup later
  return db.users.create({ email });
}

// after: accept liberally, normalize on server
import { z } from "zod";

const SignUpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().transform((v) => parsePhoneNumber(v, "US")?.format("E.164") ?? v),
  website: z.string().trim().transform((v) =>
    v && !/^https?:\/\//.test(v) ? `https://${v}` : v
  ).pipe(z.string().url().optional()),
});

"use server";
export async function signUp(_p, fd: FormData) {
  const parsed = SignUpSchema.safeParse({
    email: fd.get("email"),
    phone: fd.get("phone"),
    website: fd.get("website"),
  });
  if (!parsed.success) {
    return { fields: Object.fromEntries(fd), error: parsed.error.flatten() };
  }
  return db.users.create(parsed.data);
}
```

Docs:
- React: https://react.dev/reference/rsc/server-functions
- Zod: https://zod.dev/api?id=strings
- MDN URL: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Sign-up | release-blocker (auth lookup must be case-insensitive) |
| Checkout (phone for delivery SMS) | fix-this-sprint |
| Newsletter signup | fix-this-sprint |
| Internal admin | backlog |

## Defer-to (when this is another tool's job)

- Schema layer: zod, valibot, or yup.
- Phone normalization: libphonenumber-js; don't roll your own.
- Address normalization: a service (Smarty, Google Address Validation).

## Suppression

```tsx
{/* ui-audit-ignore:forms-no-normalize, display name field, case is meaningful */}
<input name="displayName" />
```
