---
title: Comments explain WHY, not WHAT
impact: HIGH
tags: comments, documentation, reasoning
---

## Comments explain WHY, not WHAT

The code already shows what happens. Comments should explain the reasoning, constraints, or non-obvious decisions behind the code.

**Incorrect (restates what the code does):**

```javascript
// Loop through items
for (const item of items) {
  // Set timeout to 30
  item.timeout = 30;
}
```

**Correct (explains the reasoning behind the choice):**

```javascript
// Retry up to 3 times because the payment gateway occasionally
// returns 503 during peak hours
for (let attempt = 0; attempt < 3; attempt++) {
  // 30s timeout matches the gateway's max response window
  item.timeout = 30;
}
```

Reference: [Google Engineering Practices — Code comments](https://google.github.io/eng-practices/)
