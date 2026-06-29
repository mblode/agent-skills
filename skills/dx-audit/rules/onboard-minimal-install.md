---
title: Keep the Install Footprint Minimal and Peer Deps Explicit
impact: HIGH
impactDescription: avoids bloating the user's node_modules and surprising version conflicts
tags: onboarding, install, dependencies, peer-deps
---

## Keep the Install Footprint Minimal and Peer Deps Explicit

Every runtime dependency you add is one the user installs, audits, and ships. Avoid pulling a heavy library for one helper, and move framework-version expectations (React, the runtime, a bundler) into `peerDependencies` so a mismatch is a clear install-time warning, not a cryptic runtime crash.

**Incorrect (heavy deps for trivial needs; React bundled as a hard dep):**

```jsonc
{
  "dependencies": {
    "lodash": "^4",   // for one debounce
    "moment": "^2",   // for one date format
    "react": "^18"    // forces a second React copy on the consumer
  }
}
```

**Correct (drop or inline the trivial helpers; React as a peer):**

```jsonc
{
  "dependencies": {},
  "peerDependencies": { "react": ">=18" },
  "peerDependenciesMeta": { "react": { "optional": false } }
}
```
