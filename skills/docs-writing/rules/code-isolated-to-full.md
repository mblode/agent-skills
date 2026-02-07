---
title: Layer examples from focused snippet to full context
impact: HIGH
tags: layering, progressive, context
---

## Layer examples from focused snippet to full context

Show the key function first, then where it fits in the file. Let readers build understanding incrementally instead of dumping the entire file upfront.

**Incorrect (full file where the relevant part is 3 lines):**

````markdown
```javascript
import express from "express";
import { db } from "./db.js";
import { validateAuth } from "./auth.js";
const app = express();
app.use(express.json());

app.post("/webhooks", validateAuth, async (req, res) => {
  await db.events.insert(req.body);
  res.sendStatus(200);
});
app.listen(3000);
```
````

**Correct (focused handler first, link to full context):**

````markdown
The webhook handler validates auth, stores the event, and returns 200:

```javascript
app.post("/webhooks", validateAuth, async (req, res) => {
  await db.events.insert(req.body);
  res.sendStatus(200);
});
```

See the [full server setup](examples/server.js) for middleware
and startup configuration.
````

Reference: [Divio Documentation System — Tutorials](https://docs.divio.com/documentation-system/tutorials/)
