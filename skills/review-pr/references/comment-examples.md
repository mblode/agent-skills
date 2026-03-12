# Output Examples

## End-of-session self-review

```markdown
## Local review

### Must fix before push
- [major] `src/profile/page.tsx:42` Missing null guard before dereferencing `profile`
  Why: `profile` can be `null` on the first render, so `profile.id` throws before the loading state can complete.
  Fix: Guard `profile` before dereferencing, or move the access into the branch that handles loaded data.

### Should fix soon
- [minor] `src/components/profile-card.tsx:18` API mapping bypasses repository mapper rule
  Why: The changed code casts the API payload directly in the component, but the scoped instruction file requires explicit mapping in a dedicated mapper.
  Fix: Move the payload transformation into the existing mapper module and pass the mapped UI model to the component.

### Ready for handoff
- Not ready until the must-fix items are addressed.
```

## Ready for handoff

```markdown
## Local review

### Must fix before push
- None.

### Should fix soon
- None.

### Ready for handoff
- No blocking issues found. Checked for high-confidence bugs, missing validation/tests, and instruction-file compliance on the current local changes.
```

## PR handoff summary

```markdown
## PR handoff summary

- [major] `src/profile/page.tsx:42` Missing null guard before dereferencing `profile`
  Why: `profile` can be `null` on the first render, so `profile.id` throws before the loading state can complete.
  Fix: Guard `profile` before dereferencing, or move the access into the branch that handles loaded data.
```
