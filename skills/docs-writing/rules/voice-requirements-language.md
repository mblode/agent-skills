---
title: Use must for requirements and should only for recommendations
impact: CRITICAL
tags: voice, requirements, must, should, precision
---

## Use must for requirements and should only for recommendations

Readers act on the modal verb. "Must" states a requirement: the task fails without it. "Should" states a recommendation the reader can weigh. The failure is using "should" for a requirement, which lets a reader skip the step and then debug the result. Don't add "please" to instructions: it implies the step is optional and adds nothing when it isn't.

The rule is not "ban should." Google's word list keeps "should" for expected or recommended practice. Flag it only where the sentence describes something that breaks when skipped.

**Incorrect (a requirement dressed as a suggestion, plus "please"):**

```markdown
You should set the API key before making requests. Please ensure
the configuration file has the correct permissions. You should back
up the database before upgrading; the upgrade is irreversible.
```

**Correct (requirements as must, a real recommendation as should):**

```markdown
You must set the API key before making requests. The configuration
file must have `600` permissions. Back up the database before
upgrading; the upgrade is irreversible. You should set the timeout
to at least 30 seconds on slow networks.
```

Reference: [Google developer documentation style guide: Word list (must, should, please)](https://developers.google.com/style/word-list), [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) for specifications
