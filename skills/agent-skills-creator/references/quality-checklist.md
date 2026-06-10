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
8. Forward slashes in all file paths (no Windows-style backslashes)
9. Includes copyable progress checklist (if multi-step workflow)
10. Includes validation/feedback loop (if quality-critical)
11. No time-sensitive content
12. Every reference file is explicitly linked with loading guidance

## Content Quality (10 checks)

13. Gotchas/anti-patterns section present for skills with known failure modes; each gotcha names a concrete command/value and its consequence
14. Description optimized as model trigger with "Use when..." phrases (not a human summary)
15. No railroading: outcomes specified where flexibility is appropriate, prescriptive only for format/safety
16. Degrees of freedom match task fragility (low for destructive/fragile ops, high for open-ended tasks)
17. Common content patterns applied where relevant (template for fixed output, examples for format-sensitive output, conditional for decision points)
18. Setup/config pattern used if skill requires user-specific context across sessions
19. Only non-obvious guidance included (passes "would Claude do this anyway?" test)
20. Workflow terminates with a concrete verification step that produces evidence (green tests, clean build, screenshot, log output); "seems right" is never a valid exit criterion
21. Anti-rationalization table included for skills where steps are frequently skipped under time pressure (see `skill-patterns.md` for format)
22. IS/IS-NOT boundary opener present after the H1 when sibling skills exist or scope creep is likely

## Reference Files (6 checks)

23. All references are one level deep from SKILL.md (no chains)
24. No reference-to-reference chains
25. Files over 100 lines have a table of contents at the top
26. File names are kebab-case
27. Each reference adds focused value (not duplicating SKILL.md content)
28. Supporting files live in the pattern-correct location (root track files only for simple/hub; otherwise `references/` or a rules folder)

## Rules Folder (5 checks, rules-based skills only)

29. `_sections.md` present with numbered categories, impact levels, and prefix mapping
30. `_template.md` present with YAML frontmatter (title, impact, tags) and incorrect/correct examples
31. Each rule file named `<prefix>-<slug>.md` matching a section prefix
32. Each rule file has YAML frontmatter and follows the template structure
33. Rule counts reconcile everywhere they appear (description, priority table, prose) with `ls rules*/ | grep -v '^_' | wc -l`

## Repository Integration (3 checks)

34. README.md updated: bullet under the matching category heading (`- **[<name>](./skills/<name>/SKILL.md)**: <one-liner>`) and skill count bumped
35. Folder name matches `name` field in frontmatter exactly
36. Smoke-test passes via the install command documented in the repo AGENTS.md (`npx skills add`), and files appear in the target directory

## Evaluation and Testing (2 checks)

37. At least 3 evaluation scenarios documented covering representative tasks
38. Skill tested with all target models (Haiku, Sonnet, Opus as applicable)

## Executable Code and MCP (7 checks, only when applicable)

39. `${CLAUDE_PLUGIN_DATA}` used for persistent data (not hardcoded absolute paths)
40. Hook definitions follow PreToolUse/PostToolUse schema if skill includes hooks
41. Script files have clear invocation instructions in SKILL.md (execute vs. read as reference)
42. Scripts handle recoverable errors explicitly (no punting raw exceptions to Claude)
43. Script constants justified with comments (no voodoo numbers)
44. MCP tool references use fully qualified `ServerName:tool_name` format
45. Required packages listed in SKILL.md and available in target runtime

## Automatic Fail

- Missing `name` or `description` in frontmatter
- SKILL.md over 500 lines without splitting into reference files
- Reference files present but not linked from SKILL.md
- Reference-to-reference chains (more than one level deep)
- Hardcoded absolute paths where `${CLAUDE_PLUGIN_DATA}` should be used for persistent storage
- README.md, CHANGELOG.md, or other auxiliary docs inside the skill folder
- Install instructions using `cp -R` into `~/.claude/skills/`, which bypasses the `~/.agents/skills` symlink chain
