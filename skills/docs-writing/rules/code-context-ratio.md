---
title: Match code-to-text ratio to document type
impact: HIGH
tags: ratio, tutorials, reference
---

## Match code-to-text ratio to document type

A tutorial explains before each block and names what the learner should notice after it, so it reads as mostly prose with short code steps. A reference page is the opposite: a signature, a parameter table, a request and a response, with prose only where a value needs qualifying. A tutorial that is one long code dump teaches nothing; a reference page wrapped in paragraphs hides the fact the reader came for.

**Incorrect (tutorial is one code block with no explanation):**

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

Next, create a route that handles incoming events by type. Notice
that the handler returns 200 before doing any work, so the sender
never retries a slow handler:

```javascript
app.post("/webhook", (req, res) => {
  if (req.body.type === "payment.completed") handlePayment(req.body);
  res.sendStatus(200);
});
```
````

Reference: [Diataxis: Tutorials](https://diataxis.fr/tutorials/), [Diataxis: Reference](https://diataxis.fr/reference/)
