---
title: Match code-to-text ratio to document type
impact: HIGH
tags: ratio, tutorials, reference
---

## Match code-to-text ratio to document type

Tutorials need more explanation (~40% code). API references are mostly code (~90% code). Don't drown tutorials in code or bury references in prose.

**Incorrect (tutorial is 90% code with no explanation):**

````markdown
```javascript
const app = express();
app.use(express.json());
app.post("/webhook", (req, res) => {
  if (req.body.type === "payment.completed") handlePayment(req.body);
  res.sendStatus(200);
});
```
````

**Correct (tutorial explains each step before showing code):**

````markdown
First, set up an Express server to receive POST requests:

```javascript
const app = express();
app.use(express.json());
```

Next, create a route that handles incoming events by type:

```javascript
app.post("/webhook", (req, res) => {
  if (req.body.type === "payment.completed") handlePayment(req.body);
  res.sendStatus(200);
});
```
````

Reference: [Divio Documentation System](https://docs.divio.com/documentation-system/)
