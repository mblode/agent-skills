# Quality Checklist

Run before shipping a new or updated skill. Score each applicable item.

Scoring: Yes = 1, No = 0, N/A = exclude from denominator. Target: all applicable items pass.

## Frontmatter (4 checks)

1. `name` field present, max 64 chars, lowercase letters/numbers/hyphens only
2. `name` does not contain "anthropic" or "claude", no consecutive hyphens
3. `description` field present, non-empty, max 1024 chars, no XML tags
4. `description` uses third-person voice with "Use when..." triggers and specific keywords

## SKILL.md Body (8 checks)

5. Under 500 lines
6. Only adds context Claude does not already have
7. Uses consistent terminology throughout (one term per concept)
8. Forward slashes in all file paths
9. Includes copyable progress checklist (if multi-step workflow)
10. Includes validation/feedback loop (if quality-critical)
11. No time-sensitive content
12. Every reference file is explicitly linked with loading guidance

## Content Quality (5 checks)

13. Gotchas/anti-patterns section present for skills with known failure modes
14. Description optimized as model trigger with "Use when..." phrases (not a human summary)
15. No railroading: outcomes specified where flexibility is appropriate, prescriptive only for format/safety
16. Setup/config pattern used if skill requires user-specific context across sessions
17. Only non-obvious guidance included (passes "would Claude do this anyway?" test)

## Reference Files (5 checks)

18. All references are one level deep from SKILL.md (no chains)
19. No reference-to-reference chains
20. Files over 100 lines have a table of contents at the top
21. File names are kebab-case
22. Each reference adds focused value (not duplicating SKILL.md content)

## Rules Folder (4 checks, rules-based skills only)

23. `_sections.md` present with numbered categories, impact levels, and prefix mapping
24. `_template.md` present with YAML frontmatter (title, impact, tags) and incorrect/correct examples
25. Each rule file named `<prefix>-<slug>.md` matching a section prefix
26. Each rule file has YAML frontmatter and follows the template structure

## Repository Integration (3 checks)

27. README.md updated with new skill row (backticked name, phase, one-line description)
28. Folder name matches `name` field in frontmatter exactly
29. Smoke-test passes: install and confirm files appear in target directory

## Advanced Features (3 checks, only when applicable)

30. `${CLAUDE_PLUGIN_DATA}` used for persistent data (not hardcoded absolute paths)
31. Hook definitions follow PreToolUse/PostToolUse schema if skill includes hooks
32. Script files have clear invocation instructions in SKILL.md

## Automatic Fail

- Missing `name` or `description` in frontmatter
- SKILL.md over 500 lines without splitting into reference files
- Reference files present but not linked from SKILL.md
- Reference-to-reference chains (more than one level deep)
- Hardcoded absolute paths where `${CLAUDE_PLUGIN_DATA}` should be used for persistent storage
- README.md, CHANGELOG.md, or other auxiliary docs inside the skill folder
