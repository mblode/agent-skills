# Sections

Defines all rule categories in audit priority order. The ID in parentheses is the filename prefix that groups rules (`<prefix>-<slug>.md`). Category impact is the default; individual rules may override it in their frontmatter.

---

## 1. Accessibility and Semantics (a11y)

**Impact:** CRITICAL
**Description:** Semantic structure, accessible names, contrast, media alternatives, and document language. Failures exclude assistive-tech users entirely, so run this category first on every audit.

## 2. Keyboard and Interaction (interaction)

**Impact:** CRITICAL
**Description:** Every interactive element must be keyboard-operable with visible focus and adequate hit targets. A mouse-only control is broken for keyboard, switch, and many touch users.

## 3. Forms and Validation (forms)

**Impact:** CRITICAL
**Description:** Forms are conversion paths. Labels, autocomplete, paste/IME support, error association, and mobile input sizing decide whether users can complete them at all.

## 4. Typography and Readability (type)

**Impact:** HIGH
**Description:** Surface-level readability: scale, measure, leading, link distinction. Deep typography (pairing, brand, display) belongs to the typography-audit skill, not this category.

## 5. Navigation and Feedback (nav)

**Impact:** HIGH
**Description:** Real links for navigation, live-region announcements, and stable loading-indicator timing. Users need to know where they are and what the system is doing.

## 6. Layout and Resilience (layout)

**Impact:** HIGH
**Description:** Layouts must survive long content, sparse/dense data, and edge states without overflow or collapse. Empty, loading, and error states are designed, not accidental.

## 7. Performance and Visual Stability (perf)

**Impact:** HIGH
**Description:** Prevent layout shift, lazy-load offscreen work, and keep rendering predictable under realistic content loads. Image-dimension failures are CLS regressions and rate CRITICAL.

## 8. Motion and Theme Behavior (motion)

**Impact:** HIGH
**Description:** Animate transform/opacity only and respect prefers-reduced-motion. Unreduced motion can cause vestibular distress; layout-property animation causes jank.

## 9. Content and Microcopy (copy)

**Impact:** MEDIUM
**Description:** Specific action labels and actionable error messages. Vague copy lowers completion rates and raises support load, so audit last, after structural issues are clear.
