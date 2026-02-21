# Difficulty Calibration

## Contents

- [Easy — Recognition and definition](#easy--recognition-and-definition)
- [Medium — Application and analysis](#medium--application-and-analysis)
- [Hard — Synthesis and evaluation](#hard--synthesis-and-evaluation)
- [Quantity and difficulty interaction](#quantity-and-difficulty-interaction)
- [Question stem bank](#question-stem-bank)

## Easy — Recognition and definition

**Cognitive task:** Identify, define, recall a single fact.

**Question patterns:**
- "What is X?"
- "Define X."
- "What does X stand for?"
- "Which [category] does X belong to?"

**Answer depth:** 1-2 sentences. Single concept with bold key phrase.

**Cloze pattern:** Single deletion of a key term or number.

**Priority bias:** Mostly `priority::high` (foundational facts).

**Example Basic card:**

```
Q: What is a race condition?
A: A race condition occurs when two threads <b>access shared data simultaneously</b> and the outcome depends on execution order.
```

**Example Cloze card:**

```
SSH runs on port {{c1::22}}
```

## Medium — Application and analysis

**Cognitive task:** Compare, contrast, explain why, apply to a situation.

**Question patterns:**
- "Why does X matter for Y?"
- "How does X differ from Y?"
- "When would you use X instead of Y?"
- "What happens when X occurs?"
- "What are the implications of X?"

**Answer depth:** 2-3 sentences. May include a comparison or cause-effect chain. Bold the key contrast or conclusion.

**Cloze pattern:** Multiple deletions within one formula or benchmark set.

**Priority bias:** Mix of `priority::high` and `priority::medium`.

**Example Basic card:**

```
Q: Why does indexing matter for database query performance?
A: Without an index, the database must perform a <b>full table scan</b>, checking every row. An index lets it jump directly to matching rows, reducing lookup time from O(n) to <b>O(log n)</b>.
```

**Example Cloze card:**

```
BMI = {{c1::weight (kg)}} / {{c2::height (m)}}²
```

## Hard — Synthesis and evaluation

**Cognitive task:** Evaluate trade-offs, apply a framework to a novel scenario, synthesise multiple concepts.

**Question patterns:**
- "Given [scenario], how would you apply [framework]?"
- "What are the implications of X for Y?"
- "How would you evaluate Z using [method]?"
- "What trade-offs exist between X and Y in [context]?"
- "If [condition changes], what happens to [outcome]?"

**Answer depth:** 2-3 sentences. Requires integrating two or more concepts. Bold the synthesised insight.

**Cloze pattern:** Multi-deletion across a complex statement or multi-step process.

**Priority bias:** Mostly `priority::medium` (nuance and edge cases).

**Example Basic card:**

```
Q: If a system uses optimistic locking but has high write contention, what trade-off should you consider?
A: Optimistic locking avoids lock overhead but causes <b>frequent retry loops</b> under contention, making <b>pessimistic locking more efficient</b> when writes conflict often.
```

**Note:** Hard cards still follow the 8-second rule. They require deeper thinking to formulate the answer, but the answer itself remains concise.

## Quantity and difficulty interaction

| | Fewer (15-25) | Standard (30-50) | More (60-100+) |
|---|---|---|---|
| **Easy** | Core definitions only, `priority::high` | Definitions + key terms across all topics | Comprehensive vocabulary coverage |
| **Medium** | Most important comparisons and applications | Balanced mix across topics | Full analytical coverage with edge cases |
| **Hard** | Skip or 1-2 synthesis cards max | 5-10 synthesis cards | Extensive scenario-based cards |

Guidelines:
- **Fewer + Easy** — Pure essentials. 15-20 definition cards, all `priority::high`.
- **Standard + Medium** — The default. Balanced mix of types, covers all major topics.
- **More + Hard** — Comprehensive deck. Deep coverage including edge cases, trade-offs, and worked scenarios.
- Card count includes both directions of reversed pairs (a bidirectional term counts as 2 cards).

## Question stem bank

Quick reference for varying question phrasing per difficulty. Avoid repetitive stems.

### Easy stems

- What is...? / What does... mean?
- Define...
- Which [category] does... belong to?
- What does [acronym] stand for?
- Name the [concept] that [description].

### Medium stems

- Why does... matter?
- How does... differ from...?
- When would you use... instead of...?
- What happens when...?
- What is the relationship between... and...?
- Compare... and... in terms of [dimension].

### Hard stems

- Given [scenario], how would you...?
- What trade-offs exist between... and...?
- If [condition], what changes about [outcome]?
- How would you evaluate... using [framework]?
- What are the second-order effects of...?
- Under what conditions would... fail?
