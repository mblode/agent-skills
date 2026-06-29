---
title: Every concept needs a copy-paste-ready example
impact: HIGH
tags: examples, runnable, copy-paste
---

## Every concept needs a copy-paste-ready example

Readers learn by doing. Every concept, function, or endpoint needs a complete, runnable example with imports and expected output in a comment. Comments should explain WHY (reasoning, constraints, non-obvious decisions), not WHAT the code already shows.

**Incorrect (describes behavior without showing it):**

```markdown
The `createUser` function accepts a name and email, validates
the input, and returns the new user object.
```

**Correct (complete example readers can copy and run):**

````markdown
```javascript
import { createUser } from "@acme/sdk";

const user = await createUser({
  name: "Ada Lovelace",
  email: "ada@example.com",
});
// => { id: "usr_abc123", name: "Ada Lovelace", email: "ada@example.com" }
```
````

Reference: [Google Technical Writing: Code samples](https://developers.google.com/tech-writing/two/code-samples)
