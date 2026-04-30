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

Postel's Law: be liberal in what you accept, strict in what you send. Email addresses with trailing whitespace, mixed casing, or surrounding quotes from a paste should be silently fixed — not rejected with "Invalid email." Phone numbers should land in E.164 server-side. URLs should accept missing protocols. Strict client-side validation pushes users into corner cases the team didn't anticipate; normalization in the server action puts the fix in one place.

## What goes wrong

A user types `  Alice@Example.COM ` (copy-pasted from a CRM). The form rejects it as "Invalid email" because the regex requires lowercase. The user fixes the case but misses the trailing space; rejected again. Or: a sign-up succeeds with `Alice@Example.com`, but next-day sign-in fails because the lookup is case-sensitive and the stored value differs from the typed one.

## Detection

**Surfaces:** sign-in, sign-up, checkout (email, phone, ZIP, country), onboarding, search-with-email-share.

**Static signals:**
1. Find inputs requiring normalization: `<input type="email">`, `<input type="tel">`, `<input type="url">`, `<input pattern=...>`.
2. Trace each to its server action. The action must:
   - For email: `.trim().toLowerCase()` before lookup/storage.
   - For phone: parse to E.164 (e.g. via `libphonenumber-js`).
   - For URL: prepend protocol when missing, validate with `new URL(...)`.
3. If the action passes the raw `formData.get("email")` straight into a DB query or auth lookup, it fails.
4. Check zod schemas: prefer `z.string().email().toLowerCase().trim()` over `z.string().regex(emailRegex)`.

**Concrete commands:**
```bash
# Email inputs
rg '<input[^>]*type=["\']email' --type=tsx src/

# Server actions touching email
rg -A 10 '"use server"' --type=ts src/ | rg -B 3 'email|phone'

# Strict regex pattern attributes (often too aggressive)
rg '<input[^>]*pattern=' --type=tsx src/

# Actions that don't normalize
rg -l 'formData\.get\("email"\)' --type=ts src/ | while read f; do
  rg -L 'toLowerCase|\.trim\(\)|z\.string\(\)\.email\(\)' "$f" \
    && echo "$f: email used without normalization"
done
```

**False-positive guards:**
- Skip files with `// ux-audit-ignore:forms-no-normalize`.
- Skip read-only display contexts (an `<input readOnly>` echoing canonical data).
- Skip inputs that intentionally preserve case (display name, exact-match search).

## Fix

Normalize in the server action; keep client validation soft:

```tsx
// before — strict client regex, no server normalization
<input
  name="email"
  pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  required
/>

// action.ts
"use server";
export async function signUp(_p, fd: FormData) {
  const email = String(fd.get("email")); // raw — case-sensitive lookup later
  return db.users.create({ email });
}

// after — accept liberally, normalize on server
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
- Zod: https://zod.dev/?id=strings
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

## Examples

**Anti-pattern (fails):**

```tsx
"use server";
export async function login(_p, fd: FormData) {
  const user = await db.users.findFirst({
    where: { email: fd.get("email") }, // case-sensitive — locks out users
  });
  if (!user) return { error: "Not found" };
}
```

**Applied (passes):**

```tsx
"use server";
export async function login(_p, fd: FormData) {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const user = await db.users.findFirst({ where: { email } });
}
```

## Defer-to (when this is another tool's job)

- Form validation libraries (zod, valibot, yup) for the schema layer.
- libphonenumber-js for phone normalization — don't roll your own.
- For address normalization, defer to a service (Smarty, Google Address Validation).

## Suppression

```tsx
{/* ux-audit-ignore:forms-no-normalize — display name field, case is meaningful */}
<input name="displayName" />
```
