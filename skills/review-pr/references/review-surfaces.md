# Review Modes

This skill complements native review tools by narrowing scope and enforcing repository-specific rules.
Default to local self-review mode.

## Preferred order

1. Review the local staged or unstaged diff and return the report in chat.
2. If the working tree is clean, review the current branch diff against base and return the report in chat.
3. Only switch to a PR handoff summary when the user asks to review an existing PR and local-first output is not enough.

## Keep the value-add narrow

Use this skill when the review needs:
- high-confidence bug filtering
- repository instruction-file compliance
- concise, committable feedback before handoff
- a final local check before commit, push, PR, or `/done`

Do not use this skill for:
- inbound PR comments or thread resolution
- default inline review-comment generation
- broad style commentary
- architecture brainstorming
- low-confidence “might be an issue” feedback
