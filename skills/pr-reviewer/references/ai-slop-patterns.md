# AI Slop Patterns

Detection catalog for AI-generated code patterns that pass lint and tests but read as machine-written. Load when the user asks to deslop, clean up AI code, remove slop, or when reviewing AI-assisted code changes.

Focus on patterns that are distinctively AI-generated, not general code quality issues (those belong in `structural-quality-rubric.md`).

## Contents

- Over-commenting
- Unnecessary error handling
- Type bypasses
- Premature abstraction
- Verbose naming
- Structural bloat
- Defensive excess
- Template residue
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

**Fix:** Delete the comment. If removing it would confuse a reader, the code needs a better name, not a comment.

## Unnecessary error handling

Wrapping infallible operations in try-catch or guarding against impossible states.

**Flag:**
- try-catch around pure computations (string manipulation, array mapping, object destructuring)
- Null checks on values the type system guarantees are non-null
- `|| []` on a value already typed as an array
- `?? undefined` (a no-op: `undefined` is already the default)
- `|| ''` on a `string` (not `string | undefined`) type
- Catch blocks that just rethrow without modification
- Error boundaries wrapping components that cannot throw

**Fix:** Remove the guard. Trust the type system and framework guarantees. Only validate at system boundaries (user input, external APIs, network responses).

## Type bypasses

Casting or suppressing types instead of fixing the underlying type issue.

**Flag:**
- `as any`: always a smell; fix the type or narrow with a type guard
- `as unknown as T`: double-cast to force an incompatible type
- `@ts-ignore` / `@ts-expect-error` without an explanation comment
- Unnecessary type assertions on values that already match the target type
- `!` (non-null assertion) when the value could genuinely be null
- Generics defaulting to `any` (`useState<any>()`)

**Fix:** Fix the type at its source. If the upstream type is wrong, fix upstream. If a third-party type is wrong, use a targeted `.d.ts` override.

## Premature abstraction

Abstractions created before repetition justifies them.

**Flag:**
- Helper functions called from exactly one site
- Wrapper classes with a single method that delegates to the wrapped object
- Config objects consumed by one function
- Factory functions that always return the same variant
- Custom hooks that are thin wrappers around a single `useState` or `useEffect`
- `utils/` files with one export
- Constants extracted for a value used once

**Fix:** Inline the abstraction. Three similar lines is better than a premature helper. Extract only when the same logic appears 3+ times.

## Verbose naming

Names that repeat information already conveyed by the type system or context.

**Flag:**
- `userArray`, `nameString`, `isLoadingBoolean` (type is in the name)
- `handleOnClickButton` (redundant event + element in handler name)
- `fetchDataFromAPIAndTransformResponse` (implementation in the name)
- `getUserByIdFromDatabase` (storage detail in the name)
- `IUserInterface`, `UserType` (type-system prefix/suffix on types)
- `setIsLoadingToTrue` (value in the setter name)

**Fix:** Use the simplest name that is unambiguous in context. `users`, `name`, `loading`, `handleClick`, `fetchUser`, `getUser`.

## Structural bloat

Files, exports, and patterns that add surface area without value.

**Flag:**
- Barrel files (`index.ts`) that re-export everything from a directory
- Empty utility files with boilerplate but no logic
- Files with only type re-exports (`export type { Foo } from './foo'`)
- Dead code behind `if (false)` or `// @deprecated` with no removal date
- Duplicate type definitions when a shared type exists
- Separate files for a single small constant or type

**Fix:** Delete the file or inline the content. Co-locate small types and constants with their consumer.

## Defensive excess

Guarding against states that the language or framework prevents.

**Flag:**
- `?.` optional chaining on values that cannot be null (non-optional props, required function parameters, `const` assignments from non-nullable sources)
- `Array.isArray()` check on a value typed as `T[]`
- `typeof x === 'function'` on a value typed as a function
- `if (x !== null && x !== undefined)` when the type is not nullable
- `try { JSON.parse(knownValidJSON) }` on a value that is always valid JSON
- Fallback UI for error states that cannot occur in the component's data flow

**Fix:** Remove the guard. If the type system says it's safe, it's safe. If you're unsure, fix the type instead of adding a runtime check.

## Template residue

Placeholder content left behind from AI generation.

**Flag:**
- `// TODO: implement` or `// TODO: Add error handling` with no implementation
- `// Add your logic here`
- Generic error messages: `"An error occurred"`, `"Something went wrong"`, `"Failed to process request"`
- Console.log statements used for debugging: `console.log('here')`, `console.log(data)`
- Commented-out code blocks with no explanation
- Empty function bodies or stub returns (`return null`, `return undefined`, `return {}`)

**Fix:** Either implement the functionality or delete the placeholder. Replace generic error messages with specific, actionable messages.

## Applying fixes

When reviewing for slop:

1. Read the diff with slop detection in mind; don't flag pre-existing patterns outside the diff
2. Group findings by category, not by file
3. Prioritize behavioral preservation: deslop changes should never alter runtime behavior
4. Apply the codebase's existing conventions, not an ideal standard
5. When in doubt about whether something is slop or intentional, check git blame: if the same author wrote it recently in an AI-assisted session, it's likely slop
