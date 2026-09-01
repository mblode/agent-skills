---
title: Make Every Export Resolve With Types Under the Module Systems You Claim
impact: HIGH
impactDescription: a package that installs but fails to import, or imports untyped, is abandoned before the first line of code runs
tags: onboarding, exports, types, esm, cjs, publint, attw
---

## Make Every Export Resolve With Types Under the Module Systems You Claim

`npm install` succeeding is not onboarding; the first `import` resolving with types is. Every `exports` entry needs a `types` condition first in its block (TypeScript stops at the first matching condition, so `types` after `import` is never reached), a declaration file whose format matches the JavaScript it describes (`.d.ts` beside ESM, `.d.cts` beside CJS), a root `"."` entry, a `bin` file that starts with a shebang, and an `engines.node` floor. Verify with `npx publint` and `npx @arethetypeswrong/cli --pack .` rather than by reading the map. ESM-only is a valid answer for most libraries; ship a `require` condition only when a real consumer needs it.

**Incorrect (types listed after import so it is never reached; require served an ESM file):**

```jsonc
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js",  // ESM under "type": "module" handed to require(): attw "masquerading as CJS"
      "types": "./dist/index.d.ts"   // after import and require: publint EXPORTS_TYPES_SHOULD_BE_FIRST
    }
  }
}
```

**Correct (types first per condition, declaration format matches, verified before publish):**

```jsonc
{
  "type": "module",
  "engines": { "node": ">=22" },
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  },
  "scripts": { "prepublishOnly": "publint && attw --pack ." }
}
```
