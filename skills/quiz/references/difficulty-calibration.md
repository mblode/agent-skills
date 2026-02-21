# Difficulty Calibration

## Contents

- [Easy — Recall and navigation](#easy--recall-and-navigation)
- [Medium — Relationships and patterns](#medium--relationships-and-patterns)
- [Hard — Reasoning and design](#hard--reasoning-and-design)
- [Quantity and difficulty interaction](#quantity-and-difficulty-interaction)
- [Question stem bank](#question-stem-bank)

## Easy — Recall and navigation

**Cognitive task:** Identify, locate, recall a single fact about the codebase.

**Exploration depth:**
- List top-level directories and their purpose
- Read package.json, config files, or equivalent for project metadata
- Identify exported functions and classes from main modules
- Scan file names and folder structure

**Question patterns:**
- "In which file is X defined?"
- "What does the X module do?"
- "Which package does this project use for Y?"
- "What is the entry point of this application?"

**Answer evaluation:** Binary. Correct or incorrect. No partial credit.

**Priority bias:** Questions about entry points, config, and high-traffic files.

## Medium — Relationships and patterns

**Cognitive task:** Compare, trace, explain how modules interact.

**Exploration depth:**
- Trace data flow through 2-3 connected modules
- Read test files to understand expected behavior
- Map import graphs between key files
- Read function bodies for control flow and error handling

**Question patterns:**
- "How does X communicate with Y?"
- "What pattern is used in X for Y?"
- "When a user does X, what is the sequence of calls?"
- "What happens when X receives invalid input?"

**Answer evaluation:** Binary for multiple choice. Explanation validates understanding.

**Priority bias:** Balanced across modules. Favor cross-boundary interactions.

## Hard — Reasoning and design

**Cognitive task:** Evaluate tradeoffs, predict impact of changes, propose designs.

**Exploration depth:**
- Identify implicit contracts between modules
- Find error handling patterns and edge cases
- Analyze architectural decisions and their tradeoffs
- Look for code comments explaining "why" decisions
- Read cross-cutting concerns (auth, logging, error boundaries)

**Question patterns:**
- "If X were changed to Y, what would break?"
- "What is wrong with this modified code?"
- "How would you refactor X to achieve Y?"
- "Why does this codebase use X instead of Y?"

**Answer evaluation:** 0/0.5/1 scale. Full credit requires identifying the core issue and at least one concrete consequence or tradeoff.

**Priority bias:** Focus on architectural decisions and cross-module dependencies.

## Quantity and difficulty interaction

| | Fewer (5) | Standard (10) | More (15) |
|---|---|---|---|
| **Easy** | Core files and entry points only | Balanced coverage across modules | Comprehensive structure coverage |
| **Medium** | Most important cross-module interactions | Full relationship coverage across areas | Deep coverage including edge cases |
| **Hard** | 2-3 high-impact architectural questions | Balanced design and impact questions | Comprehensive reasoning including refactoring proposals |

Guidelines:
- **Fewer + Easy** — Quick orientation check. 5 location/purpose questions about core files.
- **Standard + Medium** — The default. 10 questions covering relationships across the codebase.
- **More + Hard** — Deep assessment. 15 questions testing architectural understanding and design reasoning.

## Question stem bank

Vary phrasing to avoid repetitive questions.

### Easy stems

- In which file is... defined?
- What does the... module do?
- Which package does this project use for...?
- What is the default value of... in the configuration?
- How many... does the... directory contain?

### Medium stems

- How does... communicate with...?
- What design pattern is used in... for...?
- When a user..., what is the sequence of function calls?
- What happens when... receives...?
- What specific behavior does the test... verify?

### Hard stems

- If... were changed to..., what would break?
- What is wrong with this code, and what would the symptom be?
- How would you refactor... to...? What are the tradeoffs?
- Why does this codebase use... instead of...?
- If you needed to add..., which files would you modify and why?
