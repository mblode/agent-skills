# AI Slop Patterns

Detection catalog for AI-generated code that passes lint and tests but reads as machine-written. Load when the user asks to deslop, clean up AI code, remove slop, or when reviewing AI-assisted changes.

Focus on distinctively AI-generated patterns, not general code quality (that belongs in `structural-quality-rubric.md`).

## Contents

- Over-commenting
- Unnecessary error handling
- Type bypasses
- Premature abstraction
- Verbose naming
- Structural bloat
- Defensive excess
- Template residue
- Test padding
- Applying fixes

## Over-commenting

Comments that restate what the code already says.

**Flag:**
- JSDoc on functions with self-documenting names and types
- `// Handle the error` above a `catch` block
- `// Return the result` above a `return` statement
- `// Initialize variables` above `const` declarations
- Block comments explaining a single obvious line
- `// Destructure the props` above destructuring assignments

**Fix:** Delete it. If removal would confuse a reader, the code needs a better name, not a comment.

## Unnecessary error handling

Wrapping infallible operations in try-catch or guarding impossible states.

**Flag:**
- try-catch around pure computations (string manipulation, array mapping, object destructuring)
- Null checks on values the type system guarantees are non-null
- `|| []` on a value already typed as an array
- `?? undefined` (a no-op: `undefined` is already the default)
- `|| ''` on a `string` (not `string | undefined`) type
- Catch blocks that just rethrow without modification
- Error boundaries wrapping components that cannot throw

**Fix:** Remove the guard only after proving the value is internal or already validated. Keep validation at system boundaries (user input, external APIs, network responses, generated files, persisted data).

## Type bypasses

Casting or suppressing types instead of fixing the underlying issue.

**Flag:**
- `as any`: always a smell; fix the type or narrow with a type guard
- `as unknown as T`: double-cast to force an incompatible type
- `@ts-ignore` / `@ts-expect-error` without an explanation comment
- Unnecessary type assertions on values that already match the target type
- `!` (non-null assertion) when the value could genuinely be null
- Generics defaulting to `any` (`useState<any>()`)

**Fix:** Fix the type at its source: fix a wrong upstream type upstream, or override a wrong third-party type with a targeted `.d.ts`.

## Premature abstraction

Abstractions created before a shared invariant, owner, lifecycle, or failure mode justifies them.

**Flag:**
- Helper functions called from exactly one site that name no domain concept, boundary, or repeated invariant
- Wrapper classes with a single method that delegates to the wrapped object
- Config objects consumed by one function
- Factory functions that always return the same variant
- Custom hooks that thinly wrap a single `useState` or `useEffect`
- `utils/` files with one export
- Constants extracted for a value used once

**Fix:** Inline the abstraction unless it protects shared knowledge: an invariant, protocol, lifecycle, owner, or business rule. Do not extract coincidental shape.

## Verbose naming

Names repeating info already in the type system or context.

**Flag:**
- `userArray`, `nameString`, `isLoadingBoolean` (type is in the name)
- `handleOnClickButton` (redundant event + element in handler name)
- `fetchDataFromAPIAndTransformResponse` (implementation in the name)
- `getUserByIdFromDatabase` (storage detail in the name)
- `IUserInterface`, `UserType` (type-system prefix/suffix on types)
- `setIsLoadingToTrue` (value in the setter name)

**Fix:** Use the simplest name that is unambiguous in context: `users`, `name`, `loading`, `handleClick`, `fetchUser`, `getUser`.

## Structural bloat

Files, exports, and patterns that add surface area without value.

**Flag:**
- Barrel files (`index.ts`) that re-export everything from a directory
- Empty utility files with boilerplate but no logic
- Files with only type re-exports (`export type { Foo } from './foo'`)
- Dead code behind `if (false)` or `// @deprecated` with no removal date
- Old/new dual paths, legacy aliases, or re-exports kept "for compatibility" when nothing depends on the old path
- Duplicate type definitions when a shared type exists
- Separate files for a single small constant or type

**Fix:** Delete the file or inline it. Co-locate small types and constants with their consumer.

## Defensive excess

Guarding against states the language or framework prevents.

**Flag:**
- `?.` optional chaining on values that cannot be null (non-optional props, required function parameters, `const` assignments from non-nullable sources)
- `Array.isArray()` check on a value typed as `T[]`
- `typeof x === 'function'` on a value typed as a function
- `if (x !== null && x !== undefined)` when the type is not nullable
- `try { JSON.parse(knownValidJSON) }` on a value that is always valid JSON
- Fallback UI for error states that cannot occur in the component's data flow

**Fix:** Remove the guard only after proving the value is internal or already validated. If unsure, fix the type or boundary validation instead of adding local defensive noise.

## Template residue

Placeholder content left behind from AI generation.

**Flag:**
- `// TODO: implement` or `// TODO: Add error handling` with no implementation
- `// Add your logic here`
- Generic error messages: `"An error occurred"`, `"Something went wrong"`, `"Failed to process request"`
- Debugging console.log statements: `console.log('here')`, `console.log(data)`
- Commented-out code blocks with no explanation
- Empty function bodies or stub returns (`return null`, `return undefined`, `return {}`)

**Fix:** Implement the functionality or delete the placeholder. Replace generic error messages with specific, actionable ones.

## Test padding

Tests generated because coverage looks like rigor. The tell: the test cannot fail for a reason anyone would act on.

**Flag:**
- Render-only tests: presence assertions with no interaction or branch
- Mock-echo assertions: asserting a mock was called, or returned the value it was mocked to return
- Change-detector snapshots that fail on any edit rather than on wrong behavior
- Framework re-tests: proving React renders, the router routes, or the ORM saves
- Happy-path triplication: the same branch asserted through near-identical cases
- Diff-mirror tests: the assertion repeats a literal copied from the diff (a config row, flag default, route entry, label, or copy string); a second ledger to maintain, not behavior coverage
- Export-for-testability: a helper extracted or exported solely so a test can name it, proving nothing about the original behavior
- Fake integration tests: hand-rolled in-memory emulators of behavior that lives in the real system (schema, validators, indexes, permissions), unable to catch the bug class they claim to cover

**Fix:** Delete the test. A bug fix keeps exactly one: a repro that fails on the pre-fix code, anchored at the seam that failed (route, API, browser flow, integration point). A config-adjacent test stays only if it proves a rule across a class of cases; if its name contains one item id and its assertion repeats the value just changed, it goes.

## Applying fixes

When reviewing for slop:

1. Read the diff with slop detection in mind; don't flag pre-existing patterns outside the diff
2. Group findings by category, not by file
3. Prioritize behavioral preservation: deslop changes should never alter runtime behavior
4. Apply the codebase's existing conventions, not an ideal standard
5. Use git blame only to separate pre-existing code from diff scope; judge slop from code patterns, not author or timing
