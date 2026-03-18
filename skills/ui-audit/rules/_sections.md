# Sections

This file defines all sections, ordering, impact levels, and descriptions for the UI audit rules.
The section ID in parentheses is the filename prefix used to group rules.

---

## 1. Typography and Readability (type)

**Impact:** HIGH  
**Description:** Readability failures reduce comprehension and trust. Resolve typography basics before visual polish.

## 2. Accessibility and Semantics (a11y)

**Impact:** CRITICAL  
**Description:** Semantic structure, labels, contrast, and navigation are non-negotiable for inclusive interfaces.

## 3. Keyboard and Interaction (interaction)

**Impact:** CRITICAL  
**Description:** Every interactive element must work for keyboard and assistive tech users, with visible focus and reliable hit targets.

## 4. Forms and Validation (forms)

**Impact:** CRITICAL  
**Description:** Forms are core conversion paths. Labels, validation flow, and mobile behavior must be robust.

## 5. Navigation and Feedback (nav)

**Impact:** HIGH  
**Description:** Users need consistent navigation semantics and clear status feedback for loading, success, and errors.

## 6. Layout and Resilience (layout)

**Impact:** HIGH  
**Description:** Interfaces must remain stable across viewport sizes, content length, and edge states.

## 7. Performance and Visual Stability (perf)

**Impact:** HIGH  
**Description:** Prevent layout shift, reduce input lag, and keep rendering predictable under realistic content loads.

## 8. Motion and Theme Behavior (motion)

**Impact:** HIGH  
**Description:** Motion should support comprehension, preserve responsiveness, and avoid visual jank.

## 9. Content and Microcopy (copy)

**Impact:** MEDIUM  
**Description:** Clear, actionable language improves completion rates and reduces support burden.
