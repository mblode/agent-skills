---
title: Maximum 4 sentences per paragraph for web
impact: HIGH
tags: paragraphs, readability, scanning
---

## Maximum 4 sentences per paragraph for web

Long paragraphs create walls of text that readers skip. Keep paragraphs to 2-4 sentences on web. One-sentence paragraphs are fine for emphasis.

**Incorrect (wall of text discourages reading):**

```markdown
The authentication system uses JWT tokens to verify user identity.
Tokens expire after 24 hours by default. You can configure the
expiry time in the dashboard. When a token expires, the client
must request a new one. The refresh token endpoint handles this
automatically. You can also revoke tokens manually from the admin
panel. All token operations are logged for security auditing.
```

**Correct (short paragraphs invite scanning):**

```markdown
The authentication system uses JWT tokens to verify user identity.
Tokens expire after 24 hours by default. You can configure the
expiry time in the dashboard.

When a token expires, the client must request a new one. The
refresh token endpoint handles this automatically.

You can revoke tokens manually from the admin panel. All token
operations are logged for security auditing.
```

Reference: [Nielsen Norman Group — How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
