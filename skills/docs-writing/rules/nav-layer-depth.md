---
title: Layer content depth with links for different skill levels
impact: MEDIUM-HIGH
tags: audience, progressive-disclosure, depth
---

## Layer content depth with links for different skill levels

Provide a summary for quick readers and link to deeper explanations for those who need them. Experienced readers skip the links; beginners click through. This keeps pages focused without leaving anyone behind.

**Incorrect (either too shallow or too deep):**

```markdown
## Authentication

Use API keys.
```

```markdown
## Authentication

API keys are cryptographic strings that identify the calling
application. They use HMAC-SHA256 to sign requests. The key
derivation function applies PBKDF2 with 100,000 iterations...
```

**Correct (summary with link to deeper content):**

```markdown
## Authentication

Requests are authenticated with API keys passed in the
`Authorization` header. For details on key rotation and
scoping, see [API key management](api-keys.md).
```

Reference: [Nielsen Norman Group — Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
