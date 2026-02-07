---
title: Avoid jargon or define it on first use
impact: CRITICAL
tags: voice, jargon, acronyms, accessibility
---

## Avoid jargon or define it on first use

If a technical term is necessary, spell it out and define it the first time it appears. After the first definition, use the short form freely. Don't stack multiple undefined terms in a single sentence -- each unknown term compounds the reader's confusion.

**Incorrect (undefined acronyms and stacked jargon):**

```markdown
Enable the RBAC module to configure ACLs for your tenants. The
IdP handles SSO federation, so make sure the SAML assertions
include the correct NameID format.
```

**Correct (terms defined on first use):**

```markdown
Enable the role-based access control (RBAC) module to configure
access control lists (ACLs) — rules that define which users can
access which resources — for your tenants.

The identity provider (IdP) handles single sign-on (SSO) federation.
Make sure the SAML assertions include the correct NameID format.
See the [SAML reference](saml-reference.md) for supported formats.
```

Reference: [Google developer documentation style guide — Jargon](https://developers.google.com/style/jargon)
