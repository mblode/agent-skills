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

## Reference Files (5 checks)

13. All references are one level deep from SKILL.md (no chains)
14. No reference-to-reference chains
15. Files over 100 lines have a table of contents at the top
16. File names are kebab-case
17. Each reference adds focused value (not duplicating SKILL.md content)

## Rules Folder (4 checks, rules-based skills only)

18. `_sections.md` present with numbered categories, impact levels, and prefix mapping
19. `_template.md` present with YAML frontmatter (title, impact, tags) and incorrect/correct examples
20. Each rule file named `<prefix>-<slug>.md` matching a section prefix
21. Each rule file has YAML frontmatter and follows the template structure

## Repository Integration (3 checks)

22. README.md updated with new skill row (backticked name, phase, one-line description)
23. Folder name matches `name` field in frontmatter exactly
24. Smoke-test passes: install and confirm files appear in target directory

## Automatic Fail

- Missing `name` or `description` in frontmatter
- SKILL.md over 500 lines without splitting into reference files
- Reference files present but not linked from SKILL.md
- Reference-to-reference chains (more than one level deep)
- README.md, CHANGELOG.md, or other auxiliary docs inside the skill folder
