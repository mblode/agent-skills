# README Quality Checklist

Run before finalizing a README. Score each applicable item: Yes = 1, No = 0, N/A = exclude from denominator. Target: all applicable items pass.

## Structure (6 checks)

1. Title is the project name (not "About", "Introduction", or "Overview")
2. One-liner directly below the title, no heading
3. Install shows the fastest path with a runnable command
4. Usage includes at least one runnable, copy-pasteable example
5. Sections follow the project-type template order
6. Table of contents if the README exceeds 100 lines

## Content (7 checks)

7. A new reader can install and run something within 60 seconds
8. Every code block runs copy-pasted, no modification
9. No placeholder text, TODO markers, Lorem ipsum, or `foo`/`bar`/`example` values
10. Description answers "what does this do" in one sentence
11. Install command includes package manager and exact package name
12. Usage examples use realistic values and produce visible results
13. Requirements lists minimum runtime version and system dependencies

## Writing (5 checks)

14. Active voice ("Install the package" not "The package can be installed")
15. No "This project is..." or "This is a..." openers
16. Consistent terminology (one term per concept, same casing)
17. No orphaned sections (every heading has content below it)
18. License section with license name and link to LICENSE file

## Freshness (4 checks)

19. Badge versions match the published version (or badges are absent)
20. Install command uses the correct published package name
21. Spot-check 2-3 links are not broken
22. No references to deprecated APIs, removed features, or old package names

## Project-Type Specific

### CLI tools
- `--help` output matches the documented options
- Examples show real commands with expected output

### Libraries
- API section covers all public exports
- Import paths match the package structure

### Web apps
- Getting Started instructions produce a running app
- Environment variables table lists all required variables

### Monorepos
- Packages/workspaces table lists every workspace
- Version badges (if present) are not stale; skip badges for private monorepos
- Multi-runtime setup documented (e.g., Python venv, Rust toolchain)

## Automatic Fail

Any of these means the README is not ready:

- No description (reader cannot tell what the project does)
- No install or getting-started instructions (reader cannot use it)
- Default boilerplate README (e.g., unchanged create-next-app template)
- Code examples that cannot run (syntax errors, missing imports, wrong API)
