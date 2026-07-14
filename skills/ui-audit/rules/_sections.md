# Sections

Categories, ordering, impact, descriptions, and kind breakdown. The category ID (in parentheses) is the filename prefix used to group rules.

---

Pure design-decision scoring (choice architecture, information hierarchy, mental-model fit, visual polish) is out of ui-audit's lane; route it to `product-design` (and `ui-design` for visual direction). The Laws rules kept here catch built/rendered defects.

## 1. Cognitive Load (cognitive)

**Impact:** CRITICAL
**Kind breakdown:** 3 programmatic + 1 rubric (4 total)
**Description:** How much mental effort an interface demands. Excessive load is the top cause of abandonment, error, and "I don't get it" friction. Covers the working-memory limit and chunking.

## 2. Decision-Making (decision)

**Impact:** HIGH
**Kind breakdown:** 4 programmatic + 0 rubric (4 total)
**Description:** How users choose between options or commit to actions. Covers choice architecture, simplification, and the pull toward whatever users already use.

## 3. Perception (perception)

**Impact:** HIGH
**Kind breakdown:** 5 programmatic + 1 rubric (6 total)
**Description:** Gestalt grouping and attention laws governing how users parse a layout pre-attentively. What looks grouped is read as semantically grouped, for better or worse.

## 4. Memory & Expectation (memory)

**Impact:** MEDIUM-HIGH
**Kind breakdown:** 5 programmatic + 0 rubric (5 total)
**Description:** How users remember experiences (peak/end, position effects), how unfinished tasks linger (Zeigarnik), how nearing a goal accelerates effort, and how prior products shape expectations (Jakob's Law).

## 5. Interaction (interaction)

**Impact:** MEDIUM-HIGH
**Kind breakdown:** 2 programmatic + 0 rubric (2 total)
**Description:** Motor and temporal properties of interaction: target acquisition (Fitts's) and feedback latency (Doherty).

---

## Rule Index by Kind

### Programmatic (19 rules)
Mechanical pass/warn/fail checks via grep, regex, or AST. Returns numbers or booleans.

```
cognitive-cognitive-load            cognitive-millers-law              cognitive-chunking
decision-hicks-law                  decision-choice-overload
decision-teslers-law                decision-parkinsons-law
perception-proximity                perception-similarity              perception-common-region
perception-uniform-connectedness    perception-von-restorff
memory-serial-position              memory-zeigarnik                   memory-goal-gradient
memory-jakobs-law                   memory-peak-end-rule
interaction-fittss-law              interaction-doherty-threshold
```

### Observational (2 rules)
1-5 anchored rubric scoring; full anchors in `references/observational-rubrics.md`.

```
cognitive-working-memory            perception-pragnanz
```

---

## Cross-law interactions

These pairings often co-fire. Emit both findings with the same `surface` to make the link explicit.

- **Hick's + Miller's**: Both push toward fewer choices. A nav with 12+ items fails both.
- **Hick's + Chunking**: When count cannot drop, group. Chunking softens Hick's penalty.
- **Fitts's + Proximity**: Tap targets need both adequate size and adequate spacing.
- **Peak-End + Goal-Gradient**: A strong end matters more if the user accelerated into it.
- **Serial Position + Von Restorff**: Position effect predicts edge-recall; distinctiveness breaks the pattern.
- **Zeigarnik + Goal-Gradient**: Open loops + visible progress accelerate completion.
