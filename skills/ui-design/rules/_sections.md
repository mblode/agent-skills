# Sections

The canonical index for `ui-design/rules/`. One heading per category; the id in parentheses is the filename prefix that groups the rules in it (`<prefix>-<slug>.md`) and the value of each rule's `category` key. Category impact is the default; per-rule tiers live in each rule file's `defaultTier`.

Pure design-decision scoring (choice architecture, information hierarchy, mental-model fit, visual polish) is out of the audit's lane; route it to `product-design`, and to the build-side guidance in this skill for visual direction.

---

## One folder, detect key

These rules came from earlier sets: source-reasoned behavior rules and rendered-quality rules. That distinction is now recorded per rule in the `detect` key, not in a folder name:

- `detect: static` reads the source. Grep, AST, file presence.
- `detect: rendered` needs the built output. Screenshot, computed style, a real viewport.
- `detect: rubric` is scored 1-5 against the anchor table in the rule's own file, because the defect does not reduce to a boolean.

Do not reintroduce a second rules folder. A rule that needs the browser says so in `detect`; splitting the corpus by lineage again is what produced three drifting indexes and three templates.

---

## 1. Forms and Validation (forms)

**Impact:** CRITICAL
**Default tier:** release-blocker for submit and data-loss bugs, fix-this-sprint elsewhere
**Rules:** 8
**Description:** Forms are conversion paths, and form-handling bugs are the most common ship-blockers. Labels, autocomplete, paste and IME support, error association, and mobile input sizing decide whether users can complete a form at all. React 19's `useActionState`, `useFormStatus`, and `useOptimistic` address the behavior half only if used correctly: form clears on validation error, double-submit, `useFormStatus` misuse with its always-false bug.

## 2. States (states)

**Impact:** CRITICAL
**Default tier:** release-blocker on critical paths, fix-this-sprint elsewhere
**Rules:** 3
**Description:** Missing or broken states is the single highest-impact production UX bug. Every data-fetching component needs empty, error, and a loading placeholder that does not shift layout. The most common bug is happy path only. This category owns those states wherever they appear; the layout rules cover the container, not the state.

## 3. Async (async)

**Impact:** CRITICAL
**Default tier:** mostly release-blocker
**Rules:** 4
**Description:** Async work introduces race conditions, optimistic updates with no rollback, and missing Suspense or error boundaries. Silent until they are not.

## 4. Focus and Keyboard (focus)

**Impact:** CRITICAL
**Default tier:** release-blocker for traps and restoration, fix-this-sprint for dynamic content
**Rules:** 3
**Description:** Focus management is invisible to mouse users and breaks the experience entirely for keyboard and screen reader users. axe checks landmarks but not where focus went after an action.

## 5. Accessibility and Semantics (a11y)

**Impact:** CRITICAL
**Default tier:** mostly release-blocker
**Rules:** 8
**Description:** Semantic structure, accessible names, non-color state cues, media alternatives, and document language. Failures exclude assistive-tech users entirely, so run this category first. Contrast ratios are not checked here: axe-core computes them, so run it rather than eyeballing hex values.

## 6. Keyboard and Interaction (interaction)

**Impact:** CRITICAL
**Default tier:** release-blocker for focus and operability, fix-this-sprint for sizing
**Rules:** 3
**Description:** Every interactive element must be keyboard-operable with visible focus and adequate hit targets. A mouse-only control is broken for keyboard, switch, and many touch users.

## 7. Navigation and Feedback (nav)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 2
**Description:** Real links for navigation and live-region announcements. Users need to know where they are and what the system is doing.

## 8. Microcopy (microcopy)

**Impact:** HIGH
**Default tier:** fix-this-sprint, release-blocker for leaked errors
**Rules:** 2
**Description:** Vague errors and leaked exception text with PII or stack traces. Wording of a string that is not an error is `copywriting`.

## 9. Mobile and Touch (mobile)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 2
**Description:** Patterns that work on desktop but fail on touch: hover-only affordances, missing viewport meta, `100vh` on mobile, no safe-area insets. Hover gating and press feedback are `ui-animation`. Lighthouse catches some tap-target failures; these rules add the affordance and viewport patterns.

## 10. Dark Mode and i18n (dark-i18n)

**Impact:** MEDIUM
**Default tier:** mostly backlog
**Rules:** 2
**Description:** Hardcoded light tokens and physical left/right properties that fail in dark theme or RTL. Contrast ratios stay with axe.

## 11. Typography and Readability (type)

**Impact:** HIGH
**Default tier:** mostly fix-this-sprint
**Rules:** 1
**Description:** Surface-level readable floor for body type. Pairing, brand, measure, leading, and display type belong to the typography-audit skill.

## 12. Layout and Resilience (layout)

**Impact:** HIGH
**Default tier:** fix-this-sprint
**Rules:** 1
**Description:** Layouts must survive long content, sparse or dense data, and edge states without overflow or collapse. Empty, loading, and error states themselves are owned by the `states` category, not by these rules; report the container failure here and the missing state there.

## 13. Performance and Visual Stability (perf)

**Impact:** HIGH
**Default tier:** fix-this-sprint, release-blocker for image-dimension CLS
**Rules:** 3
**Description:** Prevent layout shift from images, lazy-load offscreen work, and virtualize long lists. Lighthouse measures CWV; these rules catch the static cause.

## 14. Generated-UI Slop (slop)

**Impact:** MEDIUM
**Default tier:** backlog
**Rules:** 6
**Description:** The house style of machine-generated interfaces: default-everything spacing, stock gradient hero, emoji as iconography, filler copy shipped as real copy, and the other tells that make a screen read as unfinished rather than broken. Nothing here blocks a task, which is why it defaults to backlog, but it is what a reviewer means by "this looks AI-made."

---

## Cross-category interactions

These pairings often co-fire. Emit both findings with the same `surface` to make the link explicit, except where a bullet below names a single owner: three findings and three near-identical fixes for one defect read as padding, not thoroughness.

- **States + Layout**: `states` owns the missing empty, loading, or error state. `layout` owns the container that overflows or collapses once that state renders. One defect, one owner, per the `states` category description above.

---

Total: 48 rules across 14 categories.
