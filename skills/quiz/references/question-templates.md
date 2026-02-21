# Question Templates

Templates and concrete examples for generating codebase quiz questions by difficulty level.

## Contents

- [Easy Question Types](#easy-question-types)
- [Medium Question Types](#medium-question-types)
- [Hard Question Types](#hard-question-types)
- [Question Quality Rules](#question-quality-rules)

## Easy Question Types

All easy questions use multiple choice with 4 options. Test recall and navigation.

### Type 1: Location recall

"In which file is `{{function_name}}` defined?"
Format: Multiple choice (4 file paths)

**Example:**
```
Question 2/10

In which file is `createUser` defined?

A) src/controllers/auth.ts
B) src/services/user.ts
C) src/models/user.ts
D) src/routes/api.ts
```

### Type 2: Purpose identification

"What does the `{{module_name}}` module do?"
Format: Multiple choice (4 descriptions)

### Type 3: Configuration knowledge

"What is the default value of `{{config_key}}` in the project configuration?"
Format: Multiple choice (4 values)

### Type 4: Dependency awareness

"Which package does this project use for {{purpose}}?"
Format: Multiple choice (4 package names)

### Type 5: Structure recognition

"How many {{items}} does the `{{directory}}` directory contain?"
Format: Multiple choice (4 numbers)

## Medium Question Types

All medium questions use multiple choice with 4 options plus an explanation after answering. Test understanding of relationships and patterns.

### Type 1: Interaction mapping

"How does `{{module_a}}` communicate with `{{module_b}}`?"
Format: Multiple choice (4 interaction descriptions) + explanation

**Example:**
```
Question 5/10

How does the OrderService communicate with the PaymentGateway
in src/services/?

A) Direct function calls through an imported instance
B) Event emitter pattern via the shared event bus
C) HTTP requests to an internal API endpoint
D) Message queue with async consumers

[Correct] B

Explanation: OrderService emits a `payment.requested` event at
src/services/order.ts:47 which PaymentGateway listens for at
src/services/payment.ts:12 via the shared EventBus from
src/lib/events.ts.
```

### Type 2: Pattern recognition

"What design pattern is used in `{{file_path}}` for {{purpose}}?"
Format: Multiple choice (4 pattern names) + explanation

### Type 3: Data flow tracing

"When a user {{action}}, what is the sequence of function calls?"
Format: Multiple choice (4 call sequences) + explanation

### Type 4: Error handling

"What happens when `{{function_name}}` receives {{invalid_input}}?"
Format: Multiple choice (4 behavior descriptions) + explanation

### Type 5: Test coverage

"What specific behavior does the test `{{test_name}}` verify?"
Format: Multiple choice (4 behavior descriptions) + explanation

## Hard Question Types

All hard questions use open-ended free-text format with explanation after answering. Test reasoning and design thinking.

### Type 1: Impact analysis

"If `{{function_or_module}}` were changed to {{modification}}, what would break?"
Format: Open-ended (user explains the impact)

**Example:**
```
Question 8/10

If UserRepository.findById() at src/repos/user.ts:34 were changed
to return null instead of throwing UserNotFoundError on missing
users, what would break?

Your answer: The auth middleware at src/middleware/auth.ts:45
destructures the result without a null check, so it would throw
a TypeError. The profile controller at src/controllers/profile.ts:23
also assumes a user object is always returned...

[Correct]

Explanation: Three callers rely on the thrown error:
1. Auth middleware (src/middleware/auth.ts:45) — destructures without guard
2. Profile controller (src/controllers/profile.ts:23) — chains .email access
3. Admin panel (src/admin/users.ts:67) — catch block handles UserNotFoundError specifically
```

### Type 2: Bug identification

Show a modified snippet of real code with a subtle bug introduced.
"What is wrong with this code, and what would the symptom be?"
Format: Open-ended (user identifies the bug and its effect)

### Type 3: Refactoring proposal

"How would you refactor `{{file_path}}` to {{goal}}? What are the tradeoffs?"
Format: Open-ended (user proposes approach and discusses tradeoffs)

### Type 4: Architecture reasoning

"Why does this codebase use {{pattern}} instead of {{alternative}} for {{concern}}?"
Format: Open-ended (user explains the reasoning)

### Type 5: Missing feature design

"If you needed to add {{feature}} to this codebase, which files would you modify and why?"
Format: Open-ended (user outlines the approach)

## Question Quality Rules

- Every question must reference a real file path, function, or pattern from the codebase
- Multiple-choice distractors must be plausible (real names from the project, not random strings)
- Hard open-ended questions must have a clear rubric for what constitutes a good answer
- Spread questions across different areas of the codebase
- Never ask about generated files, lock files, or node_modules
