# Sections

This file defines all categories, their ordering, impact levels, descriptions, and tier breakdown.
The category ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Cognitive Load (cognitive)

**Impact:** CRITICAL
**Tier breakdown:** 3 programmatic + 2 rubric (5 total)
**Description:** Principles that govern how much mental effort an interface demands. Excessive cognitive load is the most common cause of abandonment, error, and "I don't get it" friction. Includes the working-memory limit, chunking, and the systematic biases users carry into every screen.

## 2. Decision-Making (decision)

**Impact:** HIGH
**Tier breakdown:** 5 programmatic + 3 rubric (8 total)
**Description:** Principles that govern how users choose between options or commit to actions. Covers choice architecture, simplification, the conservation of inherent complexity, and the gravitational pull users have toward whatever they already use.

## 3. Perception (perception)

**Impact:** HIGH
**Tier breakdown:** 5 programmatic + 2 rubric (7 total)
**Description:** Gestalt grouping laws and attention principles that determine how users parse a layout pre-attentively. What is visually grouped is read as semantically grouped — for better or worse.

## 4. Memory & Expectation (memory)

**Impact:** MEDIUM-HIGH
**Tier breakdown:** 5 programmatic + 1 rubric (6 total)
**Description:** Principles about how users remember experiences (peak/end, position effects), how unfinished tasks linger (Zeigarnik), how proximity to a goal accelerates effort, and how prior products shape expectations for new ones (mental models, Jakob's Law).

## 5. Interaction (interaction)

**Impact:** MEDIUM-HIGH
**Tier breakdown:** 2 programmatic + 2 rubric (4 total)
**Description:** Motor, temporal, and aesthetic properties of interaction itself. Target acquisition (Fitts's), feedback latency (Doherty), engagement state (Flow), and the perception-of-quality bonus that visual polish confers (Aesthetic-Usability).

---

## Rule Index by Tier

### Programmatic (20 rules)
Mechanical pass/warn/fail checks via grep, regex, or AST inspection. Returns numbers or booleans.

```
cognitive-cognitive-load            cognitive-millers-law              cognitive-chunking
decision-hicks-law                  decision-choice-overload           decision-postels-law
decision-teslers-law                decision-parkinsons-law
perception-proximity                perception-similarity              perception-common-region
perception-uniform-connectedness    perception-von-restorff
memory-serial-position              memory-zeigarnik                   memory-goal-gradient
memory-jakobs-law                   memory-peak-end-rule
interaction-fittss-law              interaction-doherty-threshold
```

### Observational (10 rules)
1-5 anchored rubric scoring. See `references/observational-rubrics.md` for full anchors.

```
cognitive-cognitive-bias            cognitive-working-memory
decision-occams-razor               decision-paradox-of-the-active-user   decision-pareto-principle
perception-pragnanz                 perception-selective-attention
memory-mental-model
interaction-flow                    interaction-aesthetic-usability
```

---

## Cross-law interactions

When auditing, these pairings often co-fire. Emit both findings with the same `surface` to make the link explicit.

- **Hick's + Miller's** — Both push toward fewer choices. A nav with 12+ items fails both.
- **Hick's + Chunking** — When count cannot drop, group. Chunking softens Hick's penalty.
- **Doherty + Flow** — Sub-400 ms feedback isn't just speed; it preserves the Flow state.
- **Jakob's + Mental Model** — Jakob's is the special case (other websites). Pick the more specific one; don't double-count.
- **Fitts's + Proximity** — Tap targets need both adequate size and adequate spacing.
- **Peak-End + Goal-Gradient** — A strong end matters more if the user accelerated into it.
- **Aesthetic-Usability + Postel's** — Polish buys patience for input forgiveness.
- **Von Restorff + Selective Attention** — Reciprocal: distinctive items break attention filters.
- **Tesler's + Postel's** — Both relocate complexity. Tesler's says someone bears it; Postel's says the system should.
- **Serial Position + Von Restorff** — Position effect predicts edge-recall; distinctiveness breaks the pattern.
- **Zeigarnik + Goal-Gradient** — Open loops + visible progress accelerate completion.
