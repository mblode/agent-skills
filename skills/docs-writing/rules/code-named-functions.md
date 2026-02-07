---
title: Break complex operations into named functions
impact: HIGH
tags: functions, readability, decomposition
---

## Break complex operations into named functions

Readers should skim function names and understand the flow. Extract named functions instead of inline logic so the top-level code reads like pseudocode.

**Incorrect (nested inline logic hides the flow):**

```javascript
app.post("/orders", async (req, res) => {
  if (!req.body.items || req.body.items.length === 0) {
    return res.status(400).json({ error: "No items" });
  }
  const total = req.body.items.reduce((sum, i) => sum + i.price, 0);
  const charge = await stripe.charges.create({ amount: total });
  await sendEmail(req.body.email, { orderId: charge.id });
  res.json({ orderId: charge.id });
});
```

**Correct (named functions make the flow scannable):**

```javascript
app.post("/orders", async (req, res) => {
  validateOrderItems(req.body.items);
  const total = calculateOrderTotal(req.body.items);
  const charge = await processPayment(total);
  await sendConfirmation(req.body.email, charge.id);
  res.json({ orderId: charge.id });
});
```

Reference: [Google Technical Writing — Code samples](https://developers.google.com/tech-writing/two/code-samples)
