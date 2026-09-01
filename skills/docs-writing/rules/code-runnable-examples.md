---
title: Every concept needs a copy-paste-ready example
impact: HIGH
tags: examples, runnable, copy-paste
---

## Every concept needs a copy-paste-ready example

Prose that describes a function's behavior makes the reader write the first call themselves, and that first call is where they get it wrong. Every concept, function, or endpoint gets a complete example: imports included, expected output in a comment, and a language tag on the fence so the site highlights it and agents can tell shell from JSON. Comments explain why (a constraint, a non-obvious choice), not what the code already shows.

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

Reference: [Google developer documentation style guide: Code samples](https://developers.google.com/style/code-samples)
