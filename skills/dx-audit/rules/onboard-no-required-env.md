---
title: No Required Environment Setup Before Hello-World
impact: HIGH
impactDescription: lets a user evaluate the tool without provisioning accounts first
tags: onboarding, environment, defaults
---

## No Required Environment Setup Before Hello-World

The basic path should not demand environment variables, API keys, or external services before it does anything. Gate those behind the features that need them, and when one is missing, say exactly which variable to set. A tool that throws "MISSING_API_KEY" on `import` cannot be evaluated.

**Incorrect (throws at import time if an env var is unset):**

```ts
const KEY = process.env.MYTOOL_API_KEY;
if (!KEY) throw new Error("MISSING_API_KEY"); // blocks even local hello-world
export const client = new Client(KEY);
```

**Correct (local features work; the key is required only where it is used):**

```ts
export class Client {
  constructor(private key = process.env.MYTOOL_API_KEY) {}
  async sync() {
    if (!this.key) {
      throw new Error("sync() needs an API key. Set MYTOOL_API_KEY or pass { key }.");
    }
  }
}
```
