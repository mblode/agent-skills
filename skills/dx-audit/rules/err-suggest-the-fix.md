---
title: Suggest the Fix or Link to It
impact: CRITICAL
impactDescription: closes the gap between seeing the error and resolving it
tags: errors, messages, remediation
---

## Suggest the Fix or Link to It

A good error says what to do next, not just that the call failed. Append the remedy: the command to run, the option to set, or a docs link. The reader is stuck; this message is your one chance to unstick them.

**Incorrect (states the failure, offers no path forward):**

```ts
throw new Error("No config file found");
```

**Correct (names the failure and the next action):**

```ts
throw new Error(
  `No config file found at "${path}". ` +
    `Run \`mytool init\` to create one, or pass --config <path>. ` +
    `See https://mytool.dev/config`,
);
```
